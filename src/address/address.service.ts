import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Address } from '@prisma/client';
@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  /**
   * Ontiene una lista de direcciones
   * @returns Returna la lista de direcciones
   */
  async findAll(): Promise<Address[]> {
    return await this.prisma.address.findMany({
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
    });
  }

  /**
   * Comprueba si existe una direccion
   * @param id ID de la direccion a buscar
   * @returns Retorna el mensaje correspondiente
   */
  async byId(id: number): Promise<Address> {
    const address = await this.prisma.address.findUnique({
      where: {
        id,
      },
    });

    if (!address) {
      throw new NotFoundException(`Direccion con id ${id} no encontrado!`);
    }
    return address;
  }

  /**
   * Consulta una direccion mediante su id
   * @param id ID de la direccion
   * @returns Retorna la direccion
   */
  async findOne(id: number): Promise<Address> {
    await this.byId(id);
    return await this.prisma.address.findUnique({
      where: { id },
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
    });
  }
  /**
   * Elimina una direccion
   * @param id ID de la direccion
   * @returns Retorna la direccion eliminada
   */
  async remove(id: number): Promise<Address> {
    await this.byId(id);
    return await this.prisma.address.delete({
      where: { id },
    });
  }
}
