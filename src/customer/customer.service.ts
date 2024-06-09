import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from '@prisma/client';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Metodo para registrar un nuevo cliente
   * @param createCustomerDto Datos del cliente a registrar
   * @returns Retorna el cliente registrado
   */
  async createCustomer(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        address: {
          create: createCustomerDto.address,
        },
      } as any,
      include: {
        address: true,
      },
    });
  }

  /**
   * Metodo para consultar todos los clientes regiatrados
   * @returns Retorna todos los clientes registrados
   * incluido su dirección con datos de la localidad, municipio y estado
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
   * Meotada para consultar si un cliente esta registrado
   * @param id ID del cliente
   * @returns Retorna el cliente si es que esta registrado
   */
  async byId(id: number) {
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
   * Metodo para consultar un cliente
   * incluido su dirección con datos de la localidad, municipio y estado
   * @param id ID del cliente
   * @returns Retorna la informacion del cliente
   */
  async findOneCustomer(id: number): Promise<Customer> {
    await this.byId(id);

    return await this.prisma.customer.findUnique({
      where: {
        id,
      },
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
   * Metodo para actualizar un cliente
   * @param id ID del cliente
   * @param updateCustomerDto Datos del cliente para actualizar
   * @returns Retorna la informacion actualizada
   */
  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data: {
        ...updateCustomerDto,
        address: {
          update: updateCustomerDto.address,
        },
      } as any,
      include: {
        address: true,
      },
    });
  }

  /**
   * Metodo para eliminar un cliente
   * @param id ID del cliente a eliminar
   * @returns Retorna el cliente eliminado
   */
  async removeCustomer(id: number): Promise<Customer> {
    await this.byId(id);
    return this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}
