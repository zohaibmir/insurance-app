export interface UserData {
    customer_id: number;
    bank_id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    apartment_no: string | null;
    created_at: Date;
    updated_at: Date;
  }