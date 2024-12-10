"use client";

import React, { useState } from "react";
import BankIdPopup from "@/components/BankIdPopup";
import useBankId from "@/hooks/useBankId";

const BankIdPage = () => {
  const {
    qrData,
    isLoading,
    hasTimedOut,
    startAuthProcess,
    startSignProcess,
  } = useBankId();
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Track popup visibility

  const handleAuthenticate = async () => {
    setIsPopupOpen(true);
    await startAuthProcess();
  };

  const handleSign = async () => {
    setIsPopupOpen(true);
    const userVisibleData = "Sign this document";
    await startSignProcess(userVisibleData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">BankID Authentication</h1>
      <p className="mb-6 text-gray-600">
        Authenticate or sign a document using your BankID.
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleAuthenticate}
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition"
          disabled={isLoading}
        >
          {isLoading ? "Authenticating..." : "Start Authentication"}
        </button>
        <button
          onClick={handleSign}
          className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600 transition"
          disabled={isLoading}
        >
          {isLoading ? "Signing..." : "Sign Document"}
        </button>
      </div>

      {/* Popup for displaying the QR code */}
      {isPopupOpen && (
        <BankIdPopup
          qrData={qrData}
          onClose={() => setIsPopupOpen(false)} // Close the popup
        />
      )}

      {hasTimedOut && (
        <p className="text-red-500 mt-4">
          The process timed out. Please try again.
        </p>
      )}
    </div>
  );
};

export default BankIdPage;
