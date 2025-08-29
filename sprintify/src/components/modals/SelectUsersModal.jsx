import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import Portal from "../ui/Portal";
import { getUserByEmailOrId } from "../../api/getUserByEmailOrId";
import { addProjectMember } from "../../api/projectMembers";

export default function SelectUsersModal({
  onClose,
  onSelect,
  selected = [],
  disabledIds = [],
  members = [],
  projectId = null, // Add projectId prop
}) {  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(selected || []);
  const [loading, setLoading] = useState(false);
  const [foundUsers, setFoundUsers] = useState([]); // All users found through searches
  const [currentSearchResults, setCurrentSearchResults] = useState([]); // Current search results only
  const [hasSearched, setHasSearched] = useState(false);
  const [addingMembers, setAddingMembers] = useState(false); // Loading state for adding members
  const [error, setError] = useState(null); // Error state for better error handling
  const [successCount, setSuccessCount] = useState(0); // Track successful additions// Manual search function triggered by button click or Enter key
  
            console.log("Processing user:", selectedUsers);

  const handleSearch = async () => {
    if (search.trim().length < 2) {
      setCurrentSearchResults([]);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      // Check if search looks like an email (contains @)
      const isEmail = search.includes("@");

      if (isEmail) {
        const response = await getUserByEmailOrId(null, search);
        // Handle the response structure: { user: {...}, success: true }
        if (response.success && response.user) {
          const newUser = response.user;
          setCurrentSearchResults([newUser]);

          // Add to foundUsers if not already present
          setFoundUsers((prev) => {
            const exists = prev.some((user) => user.id === newUser.id);
            return exists ? prev : [...prev, newUser];
          });
        } else {
          setCurrentSearchResults([]);
        }
      } else {
        // If not an email, you might want to search by partial email or name
        // For now, we'll treat it as partial email search
        const response = await getUserByEmailOrId(null, search);
        if (response.success && response.user) {
          const newUser = response.user;
          setCurrentSearchResults([newUser]);

          // Add to foundUsers if not already present
          setFoundUsers((prev) => {
            const exists = prev.some((user) => user.id === newUser.id);
            return exists ? prev : [...prev, newUser];
          });
        } else {
          setCurrentSearchResults([]);
        }
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setCurrentSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Clear current search results if input is cleared
    if (value.trim() === "") {
      setCurrentSearchResults([]);
      setHasSearched(false);
    }
  }; // Get the users to display
  // Show all found users, plus highlight current search results
  const displayUsers = foundUsers.length > 0 ? foundUsers : users;

  const toggleSelect = (id) => {
    if (disabledIds.includes(id)) return;
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };  const handleDone = async () => {
    console.log("handleDone called", { selectedUsers, projectId });
    
    if (selectedUsers.length === 0) {
      console.log("No users selected, closing modal");
      onClose();
      return;
    }    // If projectId is provided, add members directly to the project
    if (projectId) {
      console.log("ProjectId provided, adding members:", projectId);
      setAddingMembers(true);
      setError(null);
      setSuccessCount(0);
      
      const failedUsers = [];
      let successfulCount = 0;
      
      try {
        // Add each selected user to the project sequentially
        for (const userId of selectedUsers) {
          console.log("Adding user to project:", userId);
          try {
            const result = await addProjectMember(projectId, {
              userId: userId,
              permission: 0, // Default to member permission
            });
            console.log("User added successfully:", result);
            successfulCount++;
            setSuccessCount(successfulCount);
          } catch (userError) {
            console.error(`Failed to add user ${userId}:`, userError);
            // Find user info for better error reporting
            const userInfo = foundUsers.find(u => u.id === userId) || { id: userId, fullName: 'Unknown User' };
            failedUsers.push({
              user: userInfo,
              error: userError.response?.data?.message || userError.message || 'Unknown error'
            });
          }
        }

        // Handle results
        if (failedUsers.length === 0) {
          // All users added successfully
          if (onSelect && typeof onSelect === "function") {
            onSelect(selectedUsers);
          }
          onClose();
        } else if (successfulCount > 0) {
          // Some users added successfully, some failed
          const errorMessage = `Successfully added ${successfulCount} member(s), but failed to add ${failedUsers.length} member(s):\n` +
            failedUsers.map(f => `• ${f.user.fullName || f.user.email}: ${f.error}`).join('\n');
          setError(errorMessage);
        } else {
          // All users failed to be added
          const errorMessage = `Failed to add all members:\n` +
            failedUsers.map(f => `• ${f.user.fullName || f.user.email}: ${f.error}`).join('\n');
          setError(errorMessage);
        }
        
      } catch (error) {
        console.error("Unexpected error during member addition:", error);
        setError(`An unexpected error occurred: ${error.message}`);
      } finally {
        setAddingMembers(false);
      }
    } else {
      console.log("No projectId, using callback approach");
      // If no projectId, just use the callback (backward compatibility)
      if (onSelect && typeof onSelect === "function") {
        onSelect(selectedUsers);
      }
      onClose();
    }
  };

  const renderAvatar = (user) => {
    if (user.image) {
      return (
        <img
          src={user.image}
          alt={user.fullName}
          className="h-8 w-8 rounded-full object-cover"
        />
      );
    }
    const initials = user.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
        {initials}
      </div>
    );
  };
  return (
    <Portal>
      <div className="fixed inset-0 z-[120000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Select Team Members
          </h2>{" "}
          <div className="relative mb-4">
            {" "}
            <input
              id="user-search"
              type="text"
              value={search}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              placeholder="Search by email..."
              className="w-full px-4 py-2 pr-12 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSearch}
              disabled={loading || search.trim().length < 2}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search size={16} />
            </button>
          </div>          {loading && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
          
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="text-red-600 dark:text-red-400 mt-0.5">
                  <X size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    Error Adding Members
                  </h4>
                  <div className="text-xs text-red-700 dark:text-red-300 whitespace-pre-line">
                    {error}
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Success Progress */}
          {addingMembers && successCount > 0 && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-sm text-green-800 dark:text-green-200">
                Successfully added {successCount} member(s)...
              </div>
            </div>
          )}{" "}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {!hasSearched ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                Enter an email address and click the search icon or press Enter
                to find users.
              </p>
            ) : currentSearchResults.length === 0 && search.trim() ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                No users found for "{search}". Try searching with a different
                email address.
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                Found users. Select users and search for more to add to your
                selection.
              </p>
            )}

            {displayUsers.length > 0 && (
              <div className="space-y-1">
                {displayUsers.map((user) => {
                  const isDisabled = disabledIds.includes(user.id);
                  const isSelected = selectedUsers.includes(user.id);
                  const isFromCurrentSearch = currentSearchResults.some(
                    (u) => u.id === user.id
                  );

                  return (
                    <div
                      key={user.id}
                      onClick={() => toggleSelect(user.id)}
                      className={`flex items-center justify-between px-4 py-2 rounded cursor-pointer transition ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : isSelected
                          ? "bg-primary/10 dark:bg-primary/20 border border-primary"
                          : isFromCurrentSearch
                          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {renderAvatar(user)}
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                            {user.fullName}
                            {isFromCurrentSearch && (
                              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                                (Recent search)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      {isSelected && !isDisabled && (
                        <span className="text-xs text-primary font-semibold">
                          Selected
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>{" "}
          <div className="pt-4 mt-4 border-t dark:border-gray-700 flex justify-end">
            <button
              onClick={handleDone}
              disabled={selectedUsers.length === 0 || addingMembers}
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {addingMembers && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {addingMembers ? "Adding..." : "Done"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
