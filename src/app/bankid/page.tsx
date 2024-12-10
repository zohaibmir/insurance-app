"use client";

import React, { useState } from "react";
import BankIdPopup from "@/components/Modal";

const BankIdPage = () => {
  const [qrData, setQrData] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAuth = async () => {
    try {
      const response = await fetch("/api/bankid?method=auth");
      const data = await response.json();

      if (data.success) {
        setQrData(data.data.qrData); // Set the QR data from the response
        setIsPopupOpen(true); // Open the popup
      } else {
        console.error("Error starting authentication:", data.error);
      }
    } catch (error) {
      console.error("An error occurred while starting authentication:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">BankID Authentication</h1>
      <button
        onClick={handleAuth}
        className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition"
      >
        Start BankID Authentication
      </button>

      {/* Popup for displaying the QR code */}
      {isPopupOpen && (
        <BankIdPopup
          qrData={qrData}
          onClose={() => setIsPopupOpen(false)} // Close the popup
        />
      )}
    </div>
  );
};

export default BankIdPage;
