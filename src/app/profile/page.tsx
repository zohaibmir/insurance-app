"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserData } from "@/core/interfaces/userData";

const ProfilePage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null); // Store user data
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [customer_id, setCustomer_id] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Fetch the user data using the session-stored user ID
    (async () => {
      const response = await fetch("/api/customer/1");
      const customer = await response.json();
      if (customer.customer_id) {
        setUserData(customer);
        setCustomer_id(customer.customer_id);
        setEmail(customer.email || "");
        setPhone(customer.phone || "");
      }
    })();
  }, []);

  const handleSave = async () => {
    // Save updated email and phone
    const response = await fetch("/api/customer/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id, email, phone }),
    });

    const data = await response.json();
    console.log(data);
    console.log(data);
    if (data.success) {
      router.push("/dashboard"); // Redirect to dashboard after update
    } else {
      console.error(data.error);
    }
  };

  console.log(userData);
  if (!userData) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="bg-white shadow rounded p-6 w-96">
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            value={userData.first_name}
            readOnly
            className="border border-gray-300 rounded w-full p-2 bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            value={userData.last_name}
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
            value={userData.address}
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
