/**
 * src/core/dto/auth.dto.ts
 */
export interface AuthRequestDTO {
  endUserIp: string;
}

export interface AuthResponseDTO {
  orderRef: string;
  qrStartToken: string;
  autoStartToken: string;
  qrData?: string;
}
