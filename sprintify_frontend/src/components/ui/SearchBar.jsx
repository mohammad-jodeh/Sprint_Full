import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(currentSearch);

  useEffect(() => {
    setQuery(currentSearch); // sync if it changes externally
  }, [currentSearch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    const newParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams); // ✅ This triggers re-render properly
  };

  return (
    <div className="relative flex-1 flex justify-center px-4 max-w-2xl">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search projects..."
          className="w-full px-3 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Search projects"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar;
