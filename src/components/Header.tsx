"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import BankIdPopup from "@/components/BankIdPopup"; // BankID QR code popup
import useBankId from "@/core/hooks/useBankId"; // BankID hook
import { useUserContext } from "@/context/UserContext"; // User context

const Header: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, logoutUser } = useUserContext(); // Access UserContext
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Track if BankID popup is open
  const { qrData, isLoading, hasTimedOut, startAuthProcess, resetBankIdProcess } = useBankId(); // Access BankID hook
  const router = useRouter(); // Initialize the Next.js router

  // Handle login (start BankID process)
  const handleLogin = async () => {
    resetBankIdProcess(); // Reset BankID state before starting a new login
    setIsPopupOpen(true); // Open the BankID popup

    const success = await startAuthProcess(); // Start the authentication process
    if (success) {
      setIsPopupOpen(false); // Close the popup on success
      setIsLoggedIn(true); // Update logged-in state in context
      router.push("/userdashboard"); // Redirect to the user dashboard
    }
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser(); // Call the logout function from the context
    resetBankIdProcess(); // Reset the BankID process state
    router.push("/"); // Redirect to the homepage after logout
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-center items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center mr-auto">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/smooother_wordmark_black-b3urxjH5U9cAVB4r8ayAyiKVBnsJtu.svg"
            alt="Smooother Logo"
            width={150}
            height={52}
            priority
          />
          <span className="sr-only">Försäkringsbolaget</span>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-8">
            <li>
              <Link href="/" className="hover:text-gray-600 transition-colors">
                Hem
              </Link>
            </li>
            <li>
              <Link
                href="/produkter"
                className="hover:text-gray-600 transition-colors"
              >
                Produkter
              </Link>
            </li>
            <li>
              <Link
                href="/om-oss"
                className="hover:text-gray-600 transition-colors"
              >
                Om oss
              </Link>
            </li>
            <li>
              <Link
                href="/kontakt"
                className="hover:text-gray-600 transition-colors"
              >
                Kontakt
              </Link>
            </li>
            <li>
              <Link
                href="/hjalpcenter"
                className="hover:text-gray-600 transition-colors"
              >
                Hjälpcenter
              </Link>
            </li>
            {/* Login/Logout Button */}
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-600 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="hover:text-gray-600 transition-colors"
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? "Loading..." : "Login"}
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* BankID Popup */}
      {isPopupOpen && (
        <BankIdPopup
          qrData={qrData} // Pass QR data to the popup
          onClose={() => setIsPopupOpen(false)} // Close the popup
        />
      )}

      {/* Timeout Message */}
      {hasTimedOut && (
        <p className="text-red-500 text-center mt-4">
          The process timed out. Please try again.
        </p>
      )}
    </header>
  );
};

export default Header;
