// src/context/UserContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  logoutUser: () => void; // A helper function to handle logout
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Logout handler to reset the logged-in state and clear stored tokens
  const logoutUser = useCallback(() => {
    // Clear authentication tokens (localStorage, cookies, etc.)
    localStorage.removeItem("jwtToken");
    document.cookie = "jwtToken=; Max-Age=0; path=/;";
    setIsLoggedIn(false); // Reset the logged-in state
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
