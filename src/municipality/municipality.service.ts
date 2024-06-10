import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { PrismaService } from 'src/prisma.service';
import { Municipality, Prisma } from '@prisma/client';

@Injectable()
export class MunicipalityService {
  //instancia de prisma
  constructor(private prisma: PrismaService) {}

  /**
   * Metodo para registrar un nuevo municipio
   * @param createMunicipalityDto datos del municipio a registrar
   * @returns proyecto registrado
   */
  async create(data: Prisma.MunicipalityCreateInput): Promise<Municipality> {
    // Verificar si ya existe un municipio con el mismo nombre, ignorando acentos
    const existingMunicipality = await this.prisma.municipality.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive', // Ignora mayúsculas y minúsculas
        },
      },
    });

    if (existingMunicipality) {
      throw new NotFoundException('Ya existe un municipio con este nombre.');
    }

    // Verificar si ya existe un municipio con el mismo nombre, pero con acentos
    const existingMunicipalityWithAccent =
      await this.prisma.municipality.findFirst({
        where: {
          name: {
            equals: data.name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''), // Remover acentos
            mode: 'insensitive', // Ignora mayúsculas y minúsculas
          },
        },
      });

    if (existingMunicipalityWithAccent) {
      throw new NotFoundException(
        'Ya existe un municipio con este nombre (incluyendo acentos).',
      );
    }

    // Si no hay un municipio con el mismo nombre, proceder con la creación
    return this.prisma.municipality.create({
      data,
    });
  }

  /**
   * Metodo para ver todos los regisros de la base de datos
   * @returns Municipios[]
   */
  findAll(): Promise<Municipality[]> {
    return this.prisma.municipality.findMany();
  }

  /**
   * Metodo que verifica si existe el municipio
   * @param id busca el id
   * @returns
   */
  async exists(id: number): Promise<Municipality> {
    const municipality = await this.prisma.municipality.findUnique({
      where: {
        id,
      },
    });

    if (!municipality) {
      throw new NotFoundException('Municipio no encontrado');
    }
    return municipality;
  }

  /**
   * Metodo para ver la informacion completa de un municipio
   * @param id Busca por id
   * @returns municipio
   */
  async findOne(id: number): Promise<Municipality> {
    const municipality = await this.prisma.municipality.findUnique({
      where: {
        id,
      },
      include: {
        localities: true,
      },
    });

    if (!municipality) {
      throw new NotFoundException('Municipio no encontrado');
    }
    return municipality;
  }

  /**
   * Metodo para actualizar un municipio
   * @param id busca el id
   * @param updateMunicipalityDto actualiza con los datos proporcionados
   * @returns
   */
  async update(
    id: number,
    updateMunicipalityDto: UpdateMunicipalityDto,
  ): Promise<Municipality> {
    //validar que el estado exista
    await this.exists(id);
    return this.prisma.municipality.update({
      data: { ...updateMunicipalityDto } as any,
      where: {
        id,
      },
    });
  }

  /**
   * Metodo que elimina un municipio
   * @param id elimina por id
   * @returns
   */
  async remove(id: number) {
    //validar que el municipio existe
    await this.exists(id);
    return this.prisma.municipality.delete({
      where: {
        id,
      },
    });
  }
}
