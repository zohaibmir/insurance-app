import prisma from "@/lib/prisma";
import { CreateCustomerDTO } from "@/dto/customer/createCustomer.dto";
import { UpdateCustomerDTO } from "@/dto/customer/updateCustomer.dto";

class CustomerRepository {
  /**
   * Create a new customer
   */
  async create(data: CreateCustomerDTO) {
    return await prisma.customer.create({
      data,
    });
  }

  /**
   * Update an existing customer
   */
  async update(customerId: number, data: Partial<UpdateCustomerDTO>) {
    return await prisma.customer.update({
      where: { customer_id: customerId },
      data,
    });
  }

  /**
   * Find a customer by ID
   */
  async findById(customerId: number) {
    return await prisma.customer.findUnique({
      where: { customer_id: customerId },
    });
  }

  async findCustomerByBankId(bankId: string) {
    return await prisma.customer.findFirst({
      where: { bank_id: bankId },
    });
  }
}

// Export an instance of the repository
const customerRepository = new CustomerRepository();
export default customerRepository;


