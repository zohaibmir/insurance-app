/**
 * src/core/repositories/customerRepository.ts
 */
import prisma from "@/lib/prisma";
import { CreateCustomerDTO } from "@/core/dto/customer/createCustomer.dto";
import { UpdateCustomerDTO } from "@/core/dto/customer/updateCustomer.dto";
import { Repository } from "@/core/interfaces/repository.interface";

class CustomerRepository implements Repository {
  async create(data: CreateCustomerDTO) {
    return prisma.customer.create({ data });
  }

  async update(customerId: number, data: Partial<UpdateCustomerDTO>) {
    return prisma.customer.update({ where: { customer_id: customerId }, data });
  }

  async findById(customerId: number) {
    return prisma.customer.findUnique({ where: { customer_id: customerId } });
  }

  async findByBankId(bankId: string) {
    return prisma.customer.findFirst({ where: { bank_id: bankId } });
  }
}

const customerRepository = new CustomerRepository();
export default customerRepository;
