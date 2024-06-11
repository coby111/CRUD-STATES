import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Address, Customer } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene una lista de todos los clientes.
   * @returns {Promise<Customer[]>} Una promesa que resuelve con una lista de clientes.
   */
  async findAllCustomers(): Promise<Customer[]> {
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

  /**
   * Busca un cliente por su ID
   * @param id ID del cliente
   * @returns Retorna la informacion del cliente
   */
  async findOneCustomerById(id: number): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado!`);
    }
    return customer;
  }

  /**
   * Busca la direccion de un cliente por su ID de cliente
   * @param customerId ID del clienrte
   * @returns Retorna la direccion encontrada
   */
  async findAddressByCustumerId(customerId: number): Promise<Address> {
    const address = await this.prisma.address.findFirst({
      where: {
        customerId,
      },
    });

    if (!address) {
      throw new NotFoundException(
        `Dirección del cliente con id ${customerId} no encontrada!`,
      );
    }
    return address;
  }

  /**
   * Obtiene un cliente con todos los detalles incluyendo la direccion.
   * @param id ID del cliente
   * @returns Retorna el ccliente encontrado
   */
  async findOneCustomer(id: number): Promise<Customer> {
    await this.findOneCustomerById(id);
    return await this.prisma.customer.findUnique({
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
  }

  /**
   * Crea un nuevo cliente
   * @param createCustomerDto - Datos para crear el cliente
   * @returns Retorna el cliente creado
   */
  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
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

  /**
   * Actualiza un cliente existente
   * @param id ID del cliente
   * @param updateCustomerDto - Datos para actualizar el cliente
   * @returns Retorna rl cliente actualizado
   */
  async updateCustomer(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    await this.findOneCustomerById(id);
    const {
      street,
      exteriorNumber,
      interiorNumber,
      postalCode,
      localityId,
      ...customerData
    } = updateCustomerDto;

    const existingAddress = await this.findAddressByCustumerId(id);

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

    return this.findOneCustomer(id);
  }

  /**
   * Eliminar un cliente por su ID
   * @param id ID del cliente
   * @returns Retorna el cliente eliminado
   */
  async removeCustomer(id: number): Promise<Customer> {
    await this.findOneCustomerById(id);

    await this.prisma.address.deleteMany({
      where: {
        customerId: id,
      },
    });

    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
