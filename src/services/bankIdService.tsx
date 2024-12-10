import { axiosInstance } from "@/utils/axiosInstance";
import { generateQrData } from "@/utils/cryptoUtils";
import { AuthResponseDTO } from "@/dto/bankId/auth.dto";
import { SignResponseDTO } from "@/dto/bankId/sign.dto";
import to from "await-to-js";

class BankIdService {
  private secretKeyStore = new Map<string, string>();

  /**
   * Generic API call to BankID endpoints
   */
  private async call(method: string, params: object) {
    const [error, result] = await to(
      axiosInstance.post(`${process.env.BANKID_URL}/${method}`, params)
    );

    if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data);
      }
      throw new Error("BankID API call failed");
    }

    return result?.data;
  }

  /**
   * Authenticate user
   */
  async authenticate(ip: string): Promise<AuthResponseDTO> {
    const data = await this.call("auth", { endUserIp: ip });

    console.log("Here is the data" + data);
    this.secretKeyStore.set(data.qrStartToken, data.qrStartSecret);

    return {
      orderRef: data.orderRef,
      qrStartToken: data.qrStartToken,
      autoStartToken: data.autoStartToken,
    };
  }

  /**
   * Sign a document
   */
  async sign(ip: string, userVisibleData: string): Promise<SignResponseDTO> {
    const data = await this.call("sign", {
      endUserIp: ip,
      userVisibleData,
    });

    this.secretKeyStore.set(data.qrStartToken, data.qrStartSecret);

    return {
      orderRef: data.orderRef,
      qrStartToken: data.qrStartToken,
      autoStartToken: data.autoStartToken,
    };
  }

  /**
   * Refresh QR Data
   */
  async refreshQr(qrStartToken: string, startDate: Date): Promise<string> {
    const qrStartSecret = this.secretKeyStore.get(qrStartToken);

    if (!qrStartSecret) {
      throw new Error("QR Start Secret not found");
    }

    return generateQrData(qrStartToken, qrStartSecret, startDate);
  }

  /**
   * Collect status of an order
   */
  async collect(orderRef: string) {
    return await this.call("collect", { orderRef });
  }
}

const bankIdService = new BankIdService();
export default bankIdService;
