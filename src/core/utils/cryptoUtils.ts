/**
 * src/core/utils/cryptoUtils.ts
 */

import crypto from "crypto";

export function generateQrData(
  qrStartToken: string,
  qrStartSecret: string,
  orderTime: Date
): string {
  const qrTime = Math.floor((Date.now() - orderTime.getTime()) / 1000).toString();

  const hmac = crypto.createHmac("sha256", qrStartSecret);
  hmac.update(qrTime);

  const qrAuthCode = hmac.digest("hex");

  return `bankid.${qrStartToken}.${qrTime}.${qrAuthCode}`;
}
