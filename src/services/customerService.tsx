import customerRepository from "@/repositories/customerRepository";
import { CreateCustomerDTO } from "@/dto/customer/createCustomer.dto";
import { UpdateCustomerDTO } from "@/dto/customer/updateCustomer.dto";

class CustomerService {
  /**
   * Create a new customer
   */
  async createCustomer(data: CreateCustomerDTO) {
    // Add any additional business logic here
    return await customerRepository.create(data);
  }

  /**
   * Update an existing customer
   */
  async updateCustomer(customerId: number, data: Partial<UpdateCustomerDTO>) {
    // Add any additional business logic here
    return await customerRepository.update(customerId, data);
  }

  /**
   * Find a customer by ID
   */
  async findCustomerById(customerId: number) {
    return await customerRepository.findById(customerId);
  }

  /** 
   * Find a customer by Bank ID
   */
  async findCustomerByBankId(bankId: string) {
    return await customerRepository.findCustomerByBankId(bankId);
  }
}

// Export an instance of the service
const customerService = new CustomerService();
export default customerService;
