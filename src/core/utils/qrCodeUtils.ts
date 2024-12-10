import QRCode from "qrcode";

/**
 * Generate a Base64-encoded QR code image
 * @param data - The string to encode into a QR code
 * @returns A Base64-encoded QR code image
 */
export async function generateQrCodeBase64(data: string): Promise<string> {
  try {
    const qrCode = await QRCode.toDataURL(data); // Generates a Base64 Data URL
    return qrCode; // Return the Base64 string
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}
