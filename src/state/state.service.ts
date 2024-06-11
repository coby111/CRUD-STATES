import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, State } from '@prisma/client';

@Injectable()
export class StateService {
  //instancia de prisma
  constructor(private prisma: PrismaService) {}

  /**
   * Metodo para registrar un nuevo projecto
   * @param createStateDto datos del proyecto a registrar
   * @returns proyecto registrado
   */
  async create(data: Prisma.StateCreateInput): Promise<State> {
    // Verificar si ya existe un estado con el mismo nombre, ignorando acentos
    const existingState = await this.prisma.state.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive', // Ignora mayúsculas y minúsculas
        },
      },
    });

    if (existingState) {
      throw new NotFoundException('Ya existe un estado con este nombre.');
    }

    // Verificar si ya existe un estado con el mismo nombre, pero con acentos
    const existingStateWithAccent = await this.prisma.state.findFirst({
      where: {
        name: {
          equals: data.name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''), // Remover acentos
          mode: 'insensitive', // Ignora mayúsculas y minúsculas
        },
      },
    });

    if (existingStateWithAccent) {
      throw new NotFoundException(
        'Ya existe un estado con este nombre (incluyendo acentos).',
      );
    }

    // Si no hay un estado con el mismo nombre, proceder con la creación
    return this.prisma.state.create({
      data,
    });
  }

  /**
   * Metodo que devuelve todos los registros de la base de datos
   * @returns Project[]
   */
  findAll(): Promise<State[]> {
    return this.prisma.state.findMany();
  }

  /**
   * Metodo que verefica si existe el estado
   * @param id busca el id
   * @returns
   */
  async exists(id: number): Promise<State> {
    const state = await this.prisma.state.findUnique({
      where: {
        id,
      },
    });

    if (!state) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    return state;
  }

  async findOne(id: number): Promise<State> {
    const state = await this.prisma.state.findUnique({
      where: {
        id,
      },
      include: {
        municipalities: true,
      },
    });

    if (!state) {
      throw new NotFoundException('Estado no encontrado');
    }
    return state;
  }

  /**
   * Metodo para actualizar un estado
   * @param id busca el id
   * @param updateStateDto actualiza con los datos proporcionados
   * @returns
   */
  async update(id: number, updateStateDto: UpdateStateDto): Promise<State> {
    //validar que el estado exista
    await this.exists(id);
    return this.prisma.state.update({
      data: { ...updateStateDto } as any,
      where: {
        id,
      },
    });
  }

  /**
   * Metodo que elimina un estado
   * @param id elimina por id
   * @returns
   */
  async remove(id: number) {
    //validar que el proyecto existe
    await this.exists(id);
    return this.prisma.state.delete({
      where: {
        id,
      },
    });
  }
}
