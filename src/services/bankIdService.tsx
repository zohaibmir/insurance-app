import { axiosInstance } from "@/utils/axiosInstance";
import { generateQrData } from "@/utils/cryptoUtils";
import { generateQrCodeBase64 } from "@/utils/qrCodeUtils";

class BankIdService {
  private secretKeyStore = new Map<string, string>();

  /**
   * Generic API call to BankID endpoints
   */
  private async call(method: string, params: object) {
    try {
      const response = await axiosInstance.post(`${process.env.BANKID_URL}/${method}`, params);
      return response.data;
    } catch (error) {
      console.error("BankID API error:", error);
      throw new Error("Failed to call BankID API");
    }
  }

  /**
   * Authenticate user - Starts the BankID authentication process
   */
  async authenticate(ip: string) {
    const data = await this.call("auth", { endUserIp: ip });

    if (!data.qrStartSecret) {
      throw new Error("qrStartSecret is missing from the BankID API response.");
    }

    // Store the qrStartSecret for future use
    this.secretKeyStore.set(data.qrStartToken, data.qrStartSecret);

    // Generate the QR data payload
    const qrPayload = generateQrData(data.qrStartToken, data.qrStartSecret, new Date());

    // Convert the QR payload into a Base64-encoded QR code image
    const qrData = await generateQrCodeBase64(qrPayload);

    return {
      orderRef: data.orderRef,
      qrStartToken: data.qrStartToken,
      autoStartToken: data.autoStartToken,
      qrData, // Return the Base64 QR code image
    };
  }

  /**
   * Sign a document - Starts the BankID signing process
   */
  async sign(ip: string, userVisibleData: string) {
    const data = await this.call("sign", { endUserIp: ip, userVisibleData });

    if (!data.qrStartSecret) {
      throw new Error("qrStartSecret is missing from the BankID API response.");
    }

    // Store the qrStartSecret for future use
    this.secretKeyStore.set(data.qrStartToken, data.qrStartSecret);

    // Generate the QR data payload
    const qrPayload = generateQrData(data.qrStartToken, data.qrStartSecret, new Date());

    // Convert the QR payload into a Base64-encoded QR code image
    const qrData = await generateQrCodeBase64(qrPayload);

    return {
      orderRef: data.orderRef,
      qrStartToken: data.qrStartToken,
      autoStartToken: data.autoStartToken,
      qrData, // Return the Base64 QR code image
    };
  }

  /**
   * Refresh QR Data
   */
  async refreshQr(qrStartToken: string, startDate: Date) {
    const qrStartSecret = this.secretKeyStore.get(qrStartToken);

    if (!qrStartSecret) {
      throw new Error("QR Start Secret not found for the given token.");
    }

    // Generate new QR data payload
    const qrPayload = generateQrData(qrStartToken, qrStartSecret, startDate);

    // Convert the QR payload into a Base64-encoded QR code image
    const qrData = await generateQrCodeBase64(qrPayload);

    return qrData;
  }

  /**
   * Collect status of an ongoing order
   */
  async collect(orderRef: string) {
    const data = await this.call("collect", { orderRef });
    return data;
  }
}

const bankIdService = new BankIdService();
export default bankIdService;
