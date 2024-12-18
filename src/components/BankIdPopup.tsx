/**
 * src/components/BankIdPopup.tsx
 */
import React from "react";
import Image from "next/image";

interface BankIdPopupProps {
  qrData: string | null;
  onClose: () => void;
}

const BankIdPopup: React.FC<BankIdPopupProps> = ({ qrData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        {qrData ? (
          <Image
              src={qrData}
              className="h-[127px] w-[127px]"
              alt="BankID QR Code"
              objectFit="contain" // Ensures the QR code is fully visible
              priority // Ensures it's loaded as soon as possible
              width={250} 
              height={250} 
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
