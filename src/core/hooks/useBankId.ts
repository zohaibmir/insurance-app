/**
 * src/core/hooks/useBankId.ts
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const refreshInterval = 1000; // QR Code refresh interval
const collectInterval = 1000; // Polling interval for collect
const timeoutDuration = 20000; // Timeout duration for the process

interface UseBankIdResult {
    qrData: string | null;
    isLoading: boolean;
    hasTimedOut: boolean;
    isAuthenticated: boolean;
    startAuthProcess: () => Promise<void>;
    startSignProcess: (userVisibleData: string) => Promise<void>;
}
/* eslint-disable @typescript-eslint/no-unused-vars */
const useBankId = (): UseBankIdResult => {
    const [qrData, setQrData] = useState<string | null>(null); // QR code
    const [orderRef, setOrderRef] = useState<string | null>(null); // Order reference
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [hasTimedOut, setHasTimedOut] = useState(false); // Timeout state
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status
    const router = useRouter(); // Next.js router for redirection

    /**
     * Start the `auth` process to authenticate the user.
     */
    const startAuthProcess = useCallback(async () => {
        try {
            setIsLoading(true);
            setHasTimedOut(false);

            const response = await fetch("/api/bankid?method=auth", {
                method: "GET",
            });
            const data = await response.json();

            if (data.success) {
                const { qrData, orderRef, qrStartToken } = data.data;

                setQrData(qrData); // Set QR data
                setOrderRef(orderRef); // Store order reference
                startPolling(orderRef, qrStartToken); // Start polling for `collect` and QR refresh
            } else {
                console.error("Error starting authentication:", data.error);
            }
        } catch (error) {
            console.error("An error occurred while starting authentication:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Start the `sign` process to sign a document.
     * @param userVisibleData - The data visible to the user while signing.
     * 
     */
    const startSignProcess = useCallback(async (userVisibleData: string) => {
        try {
            setIsLoading(true);
            setHasTimedOut(false);

            const response = await fetch("/api/bankid?method=sign", {
                method: "GET",
            });
            const data = await response.json();

            if (data.success) {
                const { qrData, orderRef, qrStartToken } = data.data;

                setQrData(qrData); // Set QR data
                setOrderRef(orderRef); // Store order reference
                startPolling(orderRef, qrStartToken); // Start polling for `collect` and QR refresh
            } else {
                console.error("Error starting signing process:", data.error);
            }
        } catch (error) {
            console.error("An error occurred while starting signing:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Call the Marknadsurval API after successful authentication.
     * @param personalNumber - The personal number retrieved from the BankID process.
     */
    const callMarknadsurvalApi = useCallback(async (personalNumber: string) => {
        try {
            const response = await fetch("/api/marknadsurval", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ personalNumber }), // Pass the personal number
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Marknadsurval API success:", data);
                return data; // Return the API response
            } else {
                console.error("Marknadsurval API error:", data.message);
                return null; // Return null for error cases
            }
        } catch (error) {
            console.error("Error calling Marknadsurval API:", error);
            return null; // Return null for exceptions
        }
    }, []);

    /**
     * Poll the `collect` API to check the status of the BankID process.
     * @param orderRef - The reference ID of the ongoing order.
     * @param qrStartToken - The token associated with the QR session.
     */
    const startPolling = useCallback((orderRef: string, qrStartToken: string) => {
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
                        setIsAuthenticated(true);
                        clearInterval(pollingInterval); // Stop polling
                        clearInterval(refreshIntervalId); // Stop QR refresh

                        // Extract personal number from completion data
                        const personalNumber = data.data.completionData?.user?.personalNumber;

                        if (personalNumber) {
                            // Call Marknadsurval API
                            await callMarknadsurvalApi(personalNumber);
                        }

                        // Redirect to profile page
                        router.push("/profile");
                    } else if (data.data.status === "failed") {
                        setHasTimedOut(true);
                        console.error("Authentication failed:", data.data.hintCode);

                        // Handle specific hintCode scenarios
                        switch (data.data.hintCode) {
                            case "startFailed":
                                console.error("The BankID app was not started. Please try again.");
                                break;
                            case "expiredTransaction":
                                console.error("The BankID session has expired. Please start again.");
                                break;
                            case "userCancel":
                                console.error("The user canceled the authentication.");
                                break;
                            case "cancelled":
                                console.error("The authentication was canceled.");
                                break;
                            default:
                                console.error("An unknown authentication error occurred.");
                                break;
                        }

                        clearInterval(pollingInterval); // Stop polling
                        clearInterval(refreshIntervalId); // Stop QR refresh
                    }
                } else if (data.data.status === "pending") {
                    console.log("Authentication pending...");
                } else {
                    throw new Error("Unexpected response from collect API.");
                }
            } catch (error) {
                console.error("Error during collect polling:", error);
            }
        };

        const pollingInterval = setInterval(poll, collectInterval);

        // QR refresh logic
        const refreshQr = async () => {
            try {
                const response = await fetch(
                    `/api/bankid?method=refresh-qr&params=${encodeURIComponent(
                        JSON.stringify({
                            qrStartToken,
                            startDate: new Date().toISOString(),
                        })
                    )}`,
                    { method: "GET" }
                );

                const qrResponse = await response.json();
                if (qrResponse.success) {
                    setQrData(qrResponse.qrData);
                } else {
                    console.error("Error refreshing QR code:", qrResponse.error);
                }
            } catch (error) {
                console.error("Error during QR code refresh:", error);
            }
        };

        const refreshIntervalId = setInterval(refreshQr, refreshInterval);

        // Stop polling and QR refresh after the timeout duration
        setTimeout(() => {
            clearInterval(pollingInterval);
            clearInterval(refreshIntervalId);
            setHasTimedOut(true);
        }, timeoutDuration);
    }, [callMarknadsurvalApi, router]);

    return {
        qrData,
        isLoading,
        hasTimedOut,
        isAuthenticated,
        startAuthProcess,
        startSignProcess,
    };
};

export default useBankId;
