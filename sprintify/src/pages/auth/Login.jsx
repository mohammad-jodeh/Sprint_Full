import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import PasswordInput from "../../components/auth/PasswordInput";
import Button from "../../components/auth/Button";
import useAuthStore from "../../store/authstore";
import { login } from "../../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call the login API
      const response = await login(formData.email, formData.password);

      // Store the token and user data
      setAuth(response.token, response.user);

      // On successful login, redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        general:
          error.message || "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Or"
      subtitleLink="/register"
      subtitleLinkText="create a new account"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {errors.general && (
          <div
            className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{errors.general}</span>
          </div>
        )}

        <FormInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          label="Email address"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          required
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 bg-gray-700 border-gray-600  rounded text-primary focus:ring-primary focus:ring-offset-background"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm dark:text-gray-300 text-gray-700 "
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-primary hover:text-primary-hover"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <Button type="submit" isLoading={isLoading}>
            Sign in
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
