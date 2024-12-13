"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call the authentication status API
        const response = await fetch("/api/auth/status");
        const data = await response.json();

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          router.push("/"); // Redirect to home page if not authenticated
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/"); // Redirect to home page if an error occurs
      } finally {
        setIsLoading(false); // Stop loading after checking auth
      }
    };

    checkAuth();
  }, [router]);

  // Render loading state
  if (isLoading) {
    return <p>Loading...</p>;
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

  return null; // Safeguard for unexpected states
};

export default DashboardPage;
