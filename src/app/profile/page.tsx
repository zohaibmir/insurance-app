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

  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Check if the user is authenticated
        const authResponse = await fetch("/api/auth/status");
        const authData = await authResponse.json();

        if (authData.isAuthenticated) {
          setIsAuthenticated(true);

          // Fetch user data dynamically using the session-based user_id
          const response = await fetch("/api/customer/me"); // Call the `/me` endpoint
          const customer = await response.json();

          if (customer && customer.customer_id) {
            setUserData(customer);
            setEmail(customer.email || "");
            setPhone(customer.phone || "");
          }
        } else {
          // Redirect to home or login page if not authenticated
          router.push("/");
        }
      } catch (error) {
        console.error("Error during authentication or data fetch:", error);
        router.push("/"); // Redirect to home page if an error occurs
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
        router.push("/dashboard"); // Redirect to dashboard after update
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  // Render loading state if data is not yet available
  if (!isAuthenticated || !userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="bg-white shadow rounded p-6 w-96">
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            value={userData?.first_name || ""}
            readOnly
            className="border border-gray-300 rounded w-full p-2 bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            value={userData?.last_name || ""}
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
};

export default ProfilePage;
