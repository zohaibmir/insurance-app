/**
 * src/core/dto/common.dto.ts
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  