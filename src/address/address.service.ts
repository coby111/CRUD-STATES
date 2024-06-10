import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
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

  async findOne(id: number) {
    const address = await this.prisma.address.findUnique({
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

    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }

    return address;
  }

  async create(createAddressDto: CreateAddressDto) {
    return await this.prisma.address.create({
      data: {
        street: createAddressDto.street,
        exteriorNumber: createAddressDto.exteriorNumber,
        interiorNumber: createAddressDto.interiorNumber,
        postalCode: createAddressDto.postalCode,
        locality: {
          connect: {
            id: createAddressDto.localityId,
          },
        },
      } as any,
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

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }

    return await this.prisma.address.update({
      where: { id },
      data: {
        street: updateAddressDto.street,
        exteriorNumber: updateAddressDto.exteriorNumber,
        interiorNumber: updateAddressDto.interiorNumber,
        postalCode: updateAddressDto.postalCode,
        locality: {
          connect: {
            id: updateAddressDto.localityId,
          },
        },
      },
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

  async remove(id: number) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }

    return await this.prisma.address.delete({
      where: { id },
    });
  }
}
