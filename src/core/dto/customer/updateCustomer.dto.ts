export interface UpdateCustomerDTO {
    customer_id: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    apartment_no?: string;
}
