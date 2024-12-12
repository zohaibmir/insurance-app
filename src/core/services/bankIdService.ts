/**
 * src/core/services/bankIdService.ts
 */
import { axiosInstance } from "@/core/utils/axiosInstance";
import { generateQrData } from "@/core/utils/cryptoUtils";
import { generateQrCodeBase64 } from "@/core/utils/qrCodeUtils";

class BankIdService {
  private secretKeyStore: Map<string, string>;

  constructor() {
    this.secretKeyStore = new Map<string, string>(); // Store qrStartSecrets for tokens
  }

  /**
   * Generic API call to BankID endpoints
   * @param method - API endpoint method (e.g., "auth", "sign", "collect")
   * @param params - Payload for the API call
   * @returns Response data from the API
   */
  private async callApi<T>(method: string, params: object): Promise<T> {
    try {
      const response = await axiosInstance.post(`${process.env.BANKID_URL}/${method}`, params);
      return response.data;
    } catch (error) {
      console.error(`BankID API error in method ${method}:`, error);
      throw new Error("Failed to call BankID API");
    }
  }

  /**
   * Authenticate user - Starts the BankID authentication process
   * @param ip - The end user's IP address
   * @returns Authentication response containing QR data and tokens
   */
  async authenticate(ip: string) {
    const data = await this.callApi<{
      orderRef: string;
      qrStartToken: string;
      autoStartToken: string;
      qrStartSecret: string;
    }>("auth", { endUserIp: ip });

    if (!data.qrStartSecret) {
      throw new Error("qrStartSecret is missing from the BankID API response.");
    }

    // Store the qrStartSecret for future use
    this.secretKeyStore.set(data.qrStartToken, data.qrStartSecret);

    // Generate the QR payload
    const qrPayload = generateQrData(data.qrStartToken, data.qrStartSecret, new Date());

    // Convert the QR payload into a Base64-encoded QR code image
    const qrData = await generateQrCodeBase64(qrPayload);

    return {
      orderRef: data.orderRef,
      qrStartToken: data.qrStartToken,
      autoStartToken: data.autoStartToken,
      qrData,
    };
  }

  /**
   * Sign a document - Starts the BankID signing process
   * @param ip - The end user's IP address
   * @param userVisibleData - Data visible to the user while signing
   * @returns Signing response containing QR data and tokens
   */
  async sign(ip: string, userVisibleData: string) {
    const data = await this.callApi<{
      orderRef: string;
      qrStartToken: string;
      autoStartToken: string;
      qrStartSecret: string;
    }>("sign", { endUserIp: ip, userVisibleData });

    if (!data.qrStartSecret) {
      throw new Error("qrStartSecret is missing from the BankID API response.");
    }

    // Store the qrStartSecret for future use
    this.secretKeyStore.set(data.qrStartToken, data.qrStartSecret);

    // Generate the QR payload
    const qrPayload = generateQrData(data.qrStartToken, data.qrStartSecret, new Date());

    // Convert the QR payload into a Base64-encoded QR code image
    const qrData = await generateQrCodeBase64(qrPayload);

    return {
      orderRef: data.orderRef,
      qrStartToken: data.qrStartToken,
      autoStartToken: data.autoStartToken,
      qrData,
    };
  }

  /**
   * Refresh QR Data - Regenerates QR code for an ongoing session
   * @param qrStartToken - The token associated with the QR session
   * @param startDate - The session start date
   * @returns New QR code as a Base64-encoded image
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
   * @param orderRef - The reference ID of the ongoing order
   * @returns The status of the ongoing order
   */
  async collect(orderRef: string) {
    console.log(" I am here");
    const data = await this.callApi<{
      status: string;
      hintCode?: string;
      completionData?: {
        user: {
          personalNumber: string;
          name: string;
        };
      };
    }>("collect", { orderRef });

    return data;
  }
}

const bankIdService = new BankIdService();
export default bankIdService;
