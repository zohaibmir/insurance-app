/**
 * src/core/dto/sign.dto.ts
 */
export interface SignRequestDTO {
  endUserIp: string;
  userVisibleData: string;
}

export interface SignResponseDTO {
  orderRef: string;
  qrStartToken: string;
  autoStartToken: string;
  qrData?: string;
}
