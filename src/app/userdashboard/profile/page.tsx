"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserData } from "@/core/interfaces/userData";

const ProfilePage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if the user is authenticated
  const [userData, setUserData] = useState<UserData | null>(null); // Store user data
  const [email, setEmail] = useState(""); // Editable email
  const [phone, setPhone] = useState(""); // Editable phone
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [errorMessage, setErrorMessage] = useState(""); // Track error messages
  const [successMessage, setSuccessMessage] = useState(""); // Track success messages

  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const controller = new AbortController(); // For request timeout
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Set a 5-second timeout

      try {
        // Check if the user is authenticated and get user/customer data
        const authResponse = await fetch("/api/auth/status", { signal: controller.signal });
        clearTimeout(timeoutId); // Clear timeout after successful response

        if (!authResponse.ok) {
          throw new Error("Failed to authenticate");
        }

        const authData = await authResponse.json();

        if (authData.isAuthenticated) {
          setIsAuthenticated(true);

          // Use `authData.customer` directly to set user data
          const customer = authData.customer;

          if (customer && customer.customer_id) {
            setUserData(customer);
            setEmail(customer.email || "");
            setPhone(customer.phone || "");
          } else {
            throw new Error("Invalid customer data");
          }
        } else {
          // Redirect to home or login page if not authenticated
          router.push("/");
        }
      } catch (error) {
        const err = error as Error; // Explicitly cast to Error
        if (err.name === "AbortError") {
          setErrorMessage("Request timed out. Please try again.");
        } else {
          setErrorMessage(err.message || "An error occurred.");
        }

        router.push("/"); // Redirect to home page if an error occurs
      } finally {
        setIsLoading(false); // Stop loading after checking auth
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  // Handle save action for updating email and phone
  const handleSave = async () => {
    try {
      const response = await fetch("/api/customer/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: userData?.customer_id, email, phone }),
      });

      const data = await response.json();
      if (data.success) {
        setUserData(data.updatedCustomer);
        console.log(data);
        setSuccessMessage("Profile updated successfully!"); // Set success message
        setErrorMessage(""); // Clear any previous error messages

        // Clear the success message after 5 seconds (optional)
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setErrorMessage(data.error || "Failed to update profile."); // Show error if update fails
        setSuccessMessage(""); // Clear success message if any
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
      setErrorMessage("An error occurred while saving your profile."); // Show error
      setSuccessMessage(""); // Clear success message if any
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="loader" />
        <p className="text-gray-600 mt-4">Loading your profile...</p>
      </div>
    );
  }

  // Render error state
  if (errorMessage && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500">{errorMessage}</p>
      </div>
    );
  }

  // Render the Profile page if authenticated
  if (isAuthenticated && userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <div className="bg-white shadow rounded p-6 w-96">
          {/* Display success message */}
          {successMessage && (
            <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded">
              {successMessage}
            </div>
          )}

          {/* Display error message */}
          {errorMessage && (
            <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
              {errorMessage}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              value={userData.first_name || ""}
              readOnly
              className="border border-gray-300 rounded w-full p-2 bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              value={userData.last_name || ""}
              readOnly
              className="border border-gray-300 rounded w-full p-2 bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Street</label>
            <input
              type="text"
              value={userData.address || ""}
              readOnly
              className="border border-gray-300 rounded w-full p-2 bg-gray-100"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  // Safeguard for unexpected states
  return null;
};

export default ProfilePage;
