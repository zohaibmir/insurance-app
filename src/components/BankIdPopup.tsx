/**
 * src/components/BankIdPopup.tsx
 */
import React from "react";

interface BankIdPopupProps {
  qrData: string | null;
  onClose: () => void;
}

const BankIdPopup: React.FC<BankIdPopupProps> = ({ qrData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Scan the QR Code</h2>
        {qrData ? (
          <img
            src={qrData}
            alt="BankID QR Code"
            className="w-64 h-64 mx-auto"
          />
        ) : (
          <p>Loading QR Code...</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BankIdPopup;
