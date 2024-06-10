import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.customer.findMany({
      include: {
        address: {
          include: {
            locality: {
              include: {
                municipality: {
                  include: {
                    state: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        address: {
          include: {
            locality: {
              include: {
                municipality: {
                  include: {
                    state: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto) {
    const customerData = {
      name: createCustomerDto.name,
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
      rfc: createCustomerDto.rfc,
      email: createCustomerDto.email,
      phone: createCustomerDto.phone,
      status: createCustomerDto.status,
      address: {
        create: {
          street: createCustomerDto.street,
          exteriorNumber: createCustomerDto.exteriorNumber,
          interiorNumber: createCustomerDto.interiorNumber,
          postalCode: createCustomerDto.postalCode,
          locality: {
            connect: {
              id: createCustomerDto.localityId,
            },
          },
        },
      },
    };

    return await this.prisma.customer.create({
      data: customerData as any,
      include: {
        address: {
          include: {
            locality: {
              include: {
                municipality: {
                  include: {
                    state: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const {
      street,
      exteriorNumber,
      interiorNumber,
      postalCode,
      localityId,
      ...customerData
    } = updateCustomerDto;

    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const existingAddress = await this.prisma.address.findFirst({
      where: { customerId: id },
    });

    if (!existingAddress) {
      throw new NotFoundException(
        `Address for customer with ID ${id} not found`,
      );
    }

    await this.prisma.customer.update({
      where: { id },
      data: {
        ...customerData,
        address: {
          update: {
            where: { id: existingAddress.id },
            data: {
              street,
              exteriorNumber,
              interiorNumber,
              postalCode,
              localityId,
            },
          },
        },
      },
      include: {
        address: true,
      },
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return await this.prisma.customer.delete({
      where: { id },
    });
  }
}
