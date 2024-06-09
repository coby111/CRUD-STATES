import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLocalityDto } from './dto/create-locality.dto';
import { UpdateLocalityDto } from './dto/update-locality.dto';
import { Locality } from '@prisma/client';
@Injectable()
export class LocalityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Metodo para registrar una nueva localidad.
   * @param createLocalityDto Datos del la lodalidad a registrar.
   * @returns Retorna la localidad registrada.
   */
  async createLocality(
    createLocalityDto: CreateLocalityDto,
  ): Promise<Locality> {
    const { name, municipalityId } = createLocalityDto;
    const normalizeName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    //Verificar si ya existe una localidad con el mismo nombre en el municipio
    const existingLocality = await this.prisma.locality.findFirst({
      where: {
        municipalityId,
        name: normalizeName,
      },
    });

    if (existingLocality) {
      throw new ConflictException(
        `La localidad: ${normalizeName}, ya existe en el municipio!`,
      );
    }

    return this.prisma.locality.create({
      data: {
        name: normalizeName,
        municipalityId,
      },
    });
  }

  /**
   * Metodo para consultar todas las localidades.
   * @returns Retorna todas las localidades registradas.
   */
  async findAllLocalities(): Promise<Locality[]> {
    return await this.prisma.locality.findMany();
  }

  /**
   * Metodo para consultar una localidad.
   * @param id ID de la localidad a consultar.
   * @returns Retorna la localidad consultada
   */
  async findOneLocality(id: number): Promise<Locality> {
    await this.byId(id);
    return await this.prisma.locality.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Metodo para consultar un proyecto antes de realizar una consulta
   * @param id ID del proyecto
   * @returns Retorna el proyecto
   */
  async byId(id: number): Promise<Locality> {
    const locality = await this.prisma.locality.findUnique({
      where: {
        id,
      },
    });

    if (!locality) {
      throw new NotFoundException(`Localidad con ID ${id} no encontrado!`);
    }
    return locality;
  }

  /**
   * Metoodo para actualizar una proyecto.
   * @param id ID del proyecto a actualizar.
   * @param updateLocality Datos del proyecto a actualizar.
   * @returns Retorna el proyecto actualizado.
   */
  async updateLocality(
    id: number,
    updateLocality: UpdateLocalityDto,
  ): Promise<Locality> {
    await this.byId(id);

    return this.prisma.locality.update({
      data: { ...updateLocality } as any,
      where: { id },
    });
  }

  /**
   * Metodo para eliminar una localidad.
   * @param id ID de la localidad a eliminar.
   * @returns Retorna la localidad eliminado.
   */
  async removeLocality(id: number): Promise<Locality> {
    await this.byId(id);
    return this.prisma.locality.delete({
      where: {
        id,
      },
    });
  }
}
