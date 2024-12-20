/**
 * src/core/dto/createCustomer.dto.ts
 */
export interface CreateCustomerDTO {
  bank_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  apartment_no?: string;
}
