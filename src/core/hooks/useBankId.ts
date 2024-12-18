/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useCallback } from "react";
//import { useRouter } from "next/navigation";

const REFRESH_INTERVAL = 1000; // QR Code refresh interval (1 second)
const POLLING_INTERVAL = 2000; // Polling interval for collect (2 seconds)
const TIMEOUT_DURATION = 30000; // Timeout duration for the process (30 seconds)

interface UseBankIdResult {
  qrData: string | null;
  isLoading: boolean;
  hasTimedOut: boolean;
  isAuthenticated: boolean;
  startAuthProcess: () => Promise<boolean>;
  startSignProcess: (userVisibleData: string) => Promise<boolean>;
  resetBankIdProcess: () => void;
}

const useBankId = (): UseBankIdResult => {
  const [qrData, setQrData] = useState<string | null>(null); // QR code data
  const [orderRef, setOrderRef] = useState<string | null>(null); // Order reference
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [hasTimedOut, setHasTimedOut] = useState(false); // Timeout state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status
  //const router = useRouter(); // Next.js router for navigation (if needed)

  /**
   * Resets all BankID states.
   */
  const resetBankIdProcess = useCallback(() => {
    setQrData(null);
    setOrderRef(null);
    setIsLoading(false);
    setHasTimedOut(false);
    setIsAuthenticated(false);
  }, []);

  /**
   * Starts the authentication process.
   * Makes a request to initiate BankID authentication and fetches the QR code.
   */
  const startAuthProcess = useCallback(async (): Promise<boolean> => {
    try {
      resetBankIdProcess(); // Clear any previous state
      setIsLoading(true);

      const response = await fetch("/api/bankid?method=auth", {
        method: "GET",
      });
      const data = await response.json();

      if (data.success) {
        const { qrData, orderRef, qrStartToken } = data.data;

        setQrData(qrData); // Display the QR code
        setOrderRef(orderRef); // Save the order reference

        // Start polling and wait for it to complete
        const success = await startPolling(orderRef, qrStartToken);
        if (success) {
          setIsAuthenticated(true);
          return true; // Successfully authenticated
        } else {
          console.error("Authentication failed or timed out.");
          return false;
        }
      } else {
        console.error("Failed to start authentication:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error starting authentication:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [resetBankIdProcess]);

  /**
   * Starts the signing process with BankID.
   * @param userVisibleData - Data visible to the user during signing.
   */
  const startSignProcess = useCallback(async (userVisibleData: string): Promise<boolean> => {
    try {
      resetBankIdProcess(); // Clear any previous state
      setIsLoading(true);

      const response = await fetch("/api/bankid?method=sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userVisibleData }),
      });
      const data = await response.json();

      if (data.success) {
        const { qrData, orderRef, qrStartToken } = data.data;

        setQrData(qrData); // Display the QR code
        setOrderRef(orderRef); // Save the order reference

        // Start polling and wait for it to complete
        const success = await startPolling(orderRef, qrStartToken);
        if (success) {
          setIsAuthenticated(true);
          return true; // Successfully signed
        } else {
          console.error("Signing failed or timed out.");
          return false;
        }
      } else {
        console.error("Failed to start signing process:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error starting signing process:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [resetBankIdProcess]);

  /**
   * Polls the `collect` API to check the status of the BankID process.
   * Also refreshes the QR code periodically.
   * @param orderRef - The order reference for the current BankID session.
   * @param qrStartToken - The token used for refreshing the QR code.
   */
  const startPolling = useCallback(
    (orderRef: string, qrStartToken: string): Promise<boolean> => {
      return new Promise((resolve) => {
        let pollingInterval: NodeJS.Timeout | null = null;
        let qrRefreshInterval: NodeJS.Timeout | null = null;

        // Polling function for the `collect` endpoint
        const poll = async () => {
          try {
            const response = await fetch("/api/bankid?method=collect", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ orderRef }),
            });
            const data = await response.json();

            if (data.success) {
              if (data.data.status === "complete") {
                // Stop polling and QR refresh
                clearInterval(pollingInterval!);
                clearInterval(qrRefreshInterval!);

                // Optionally handle user data, such as personalNumber
                const personalNumber = data.data.completionData?.user?.personalNumber;
                if (personalNumber) {
                  await callMarknadsurvalApi(personalNumber); // Call additional API
                }

                resolve(true); // Authentication completed successfully
                return;
              } else if (data.data.status === "failed") {
                // Stop polling and QR refresh
                clearInterval(pollingInterval!);
                clearInterval(qrRefreshInterval!);

                setHasTimedOut(true);
                console.error("Authentication failed:", data.data.hintCode);
                resolve(false); // Authentication failed
                return;
              }
            }
          } catch (error) {
            console.error("Error during polling:", error);
          }
        };

        // QR refresh function
        const refreshQr = async () => {
          try {
            const response = await fetch(
              `/api/bankid?method=refresh-qr&params=${encodeURIComponent(
                JSON.stringify({ qrStartToken, startDate: new Date().toISOString() })
              )}`,
              { method: "GET" }
            );
            const qrResponse = await response.json();

            if (qrResponse.success) {
              setQrData(qrResponse.qrData); // Update QR code
            } else {
              console.error("Error refreshing QR code:", qrResponse.error);
            }
          } catch (error) {
            console.error("Error during QR refresh:", error);
          }
        };

        // Start polling and QR refreshing intervals
        pollingInterval = setInterval(poll, POLLING_INTERVAL);
        qrRefreshInterval = setInterval(refreshQr, REFRESH_INTERVAL);

        // Stop polling and QR refresh after the timeout duration
        setTimeout(() => {
          clearInterval(pollingInterval!);
          clearInterval(qrRefreshInterval!);
          setHasTimedOut(true);
          resolve(false); // Timeout occurred
        }, TIMEOUT_DURATION);
      });
    },
    []
  );

  /**
   * Calls an additional API after successful authentication.
   * @param personalNumber - The user's personal number retrieved from BankID.
   */
  const callMarknadsurvalApi = useCallback(async (personalNumber: string) => {
    try {
      const response = await fetch("/api/marknadsurval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ personalNumber }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log("Marknadsurval API success:", data);
        return data;
      } else {
        console.error("Marknadsurval API error:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error calling Marknadsurval API:", error);
      return null;
    }
  }, []);

  return {
    qrData,
    isLoading,
    hasTimedOut,
    isAuthenticated,
    startAuthProcess,
    startSignProcess,
    resetBankIdProcess,
  };
};

export default useBankId;
