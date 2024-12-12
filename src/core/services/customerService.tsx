/**
 * src/core/services/customerService.ts
 */
import CustomerRepository from "@/core/repositories/customerRepository";
import { CreateCustomerDTO } from "@/core/dto/customer/createCustomer.dto";
import { UpdateCustomerDTO } from "@/core/dto/customer/updateCustomer.dto";

class CustomerService {
  async createCustomer(data: CreateCustomerDTO) {
    return CustomerRepository.create(data);
  }

  async updateCustomer(customerId: number, data: Partial<UpdateCustomerDTO>) {
    return CustomerRepository.update(customerId, data);
  }

  async findCustomerById(customerId: number) {
    return CustomerRepository.findById(customerId);
  }

  async findCustomerByBankId(bankId: string) {
    return CustomerRepository.findByBankId(bankId);
  }
}

export default new CustomerService();
