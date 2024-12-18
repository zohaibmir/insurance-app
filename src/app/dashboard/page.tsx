"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const checkAuth = async () => {
      const controller = new AbortController(); // For request timeout
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Set a 5-second timeout

      try {
        // Call the authentication status API
        const response = await fetch("/api/auth/status", { signal: controller.signal });

        clearTimeout(timeoutId); // Clear timeout after successful response

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to authenticate");
        }

        // Parse the JSON response
        const data = await response.json();

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          router.push("/"); // Redirect to home page if not authenticated
        }
      } catch (error) {
        const err = error as Error; // Explicitly cast to Error
        if (err.name === "AbortError") {
          console.error("Authentication request timed out");
        } else {
          console.error("Error checking authentication:", err.message);
        }

        router.push("/"); // Redirect to home page if an error occurs
      } finally {
        setIsLoading(false); // Stop loading after checking auth
      }
    };

    checkAuth();
  }, [router]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="loader" />
        <p className="text-gray-600 mt-4">Checking your authentication...</p>
      </div>
    );
  }

  // Render the Dashboard content if authenticated
  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard!</p>
      </div>
    );
  }

  // Safeguard for unexpected states
  return null;
};

export default DashboardPage;
