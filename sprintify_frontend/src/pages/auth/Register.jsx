import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import PasswordInput from "../../components/auth/PasswordInput";
import Button from "../../components/auth/Button";
import { validatePassword, passwordsMatch } from "../../utils/passwordUtils";
import { register } from "../../api/auth";
import useAuthStore from "../../store/authstore";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordResult = validatePassword(formData.password);
      if (!passwordResult.isValid) {
        newErrors.password = "Password does not meet requirements";
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (
      formData.password &&
      !passwordsMatch(formData.password, formData.confirmPassword)
    ) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // Create registration data object - remove confirmPassword as it's not needed for API
      const registerData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      // Call the register API
      const response = await register(registerData);
      
      // If user prefers to be logged in immediately after registration
      if (response.token && response.user) {
        setAuth(response.token, response.user);
        navigate("/dashboard");
      } else {
        // Otherwise redirect to login page or email verification page
        navigate("/login");
      }
    } catch (error) {
      setErrors({
        general: error.message || "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Already have an account?"
      subtitleLink="/login"
      subtitleLinkText="Sign in instead"
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
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          label="Full name"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />

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
          autoComplete="new-password"
          required
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          showStrengthMeter={true}
          helperText="Password must be at least 8 characters with numbers, special characters, uppercase and lowercase letters."
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          required
          label="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <div>
          <Button type="submit" isLoading={isLoading}>
            Create account
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
