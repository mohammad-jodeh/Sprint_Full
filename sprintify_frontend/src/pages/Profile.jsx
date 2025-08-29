import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User2Icon,
  MailIcon,
  SaveIcon,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import BackgroundDecorations from "../components/ui/BackgroundDecorations";
import useAuthStore from "../store/authstore";
import { changePassword, updateProfile, requestPasswordReset } from "../api/users";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, token, getUserFromToken } = useAuthStore();

  // Debug: Log token info
  console.log("🔍 Current token:", token?.substring(0, 100) + "...");
  console.log("🔍 Decoded token:", getUserFromToken());
  console.log("🔍 User object:", user);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
      }));
      if (user.image) {
        setAvatar(user.image);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      // Optionally upload avatar to backend here
    }
  };  const handleSave = async () => {
    setSaving(true);
    try {
      // Update profile data
      const updatedUserData = {
        fullName: form.fullName,
        email: form.email,
      };

      // If avatar was changed, include it
      if (avatar && avatar !== user?.image) {
        updatedUserData.image = avatar;
      }

      // Call backend API to update profile
      await updateProfile(updatedUserData);

      // Update user data in auth store
      updateUser(updatedUserData);

      // Handle password change if provided
      if (form.oldPassword && form.newPassword) {
        await changePassword(form.oldPassword, form.newPassword);
        setForm((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
        }));
        toast.success("Profile and password updated successfully!");
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };  const handleResetPassword = async () => {
    try {
      await requestPasswordReset(form.email);
      toast.success(`Reset link sent to ${form.email}`);
    } catch (error) {
      toast.error(error.message || "Failed to send reset link");
    }
  };

  // Debug function to test fresh login
  const handleFreshLogin = async () => {
    try {
      const { login } = await import("../api/auth");
      const response = await login("120210615046@st.ahu.edu.jo", "test123");
      console.log("Fresh login response:", response);
      toast.success("Fresh token obtained!");
    } catch (error) {
      console.error("Fresh login failed:", error);
      toast.error("Fresh login failed: " + error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-gray-900">
      <BackgroundDecorations />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>{" "}
        {/* Header */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 bg-primary/10 flex items-center justify-center">
            {avatar ? (
              <img
                src={avatar}
                alt={user?.fullName || "User avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User2Icon size={24} className="text-primary" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Change avatar"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your name and avatar
            </p>
          </div>
        </div>
        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Full Name
            </label>
            <div className="relative">
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <User2Icon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={18}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={form.email}
                readOnly
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed"
              />
              <MailIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={18}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Change Password
            </label>
            <div className="space-y-3">
              <input
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                placeholder="Old password"
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New password"
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password Reset
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              We'll send a reset link to your email address.
            </p>
            <button
              onClick={handleResetPassword}
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <KeyRound size={16} />
              Send Reset Link
            </button>
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Debug (Development Only)
            </label>
            <button
              onClick={handleFreshLogin}
              className="flex items-center gap-2 text-sm text-green-600 hover:underline"
            >
              🔄 Get Fresh Token
            </button>
          </div>

          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition disabled:opacity-50"
            >
              <SaveIcon size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Debug: Check token content
console.log('Current token:', useAuthStore.getState().token?.substring(0, 100));
console.log('Decoded token:', useAuthStore.getState().getUserFromToken());
