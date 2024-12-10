import React from "react";

interface BankIdPopupProps {
  qrData: string | null; // Base64 QR code data
  onClose: () => void; // Function to close the popup
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
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BankIdPopup;
