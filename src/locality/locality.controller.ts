import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { LocalityService } from './locality.service';
import { CreateLocalityDto } from './dto/create-locality.dto';
import { UpdateLocalityDto } from './dto/update-locality.dto';
@Controller('locality')
export class LocalityController {
  constructor(private readonly localityService: LocalityService) {}

  /**
   * Crea una nueva localidad
   * @param createLocalityDto Datos de la localidad a crear
   * @returns Retorna la localidad creada
   */
  @Post()
  create(@Body() createLocalityDto: CreateLocalityDto) {
    return this.localityService.createLocality(createLocalityDto);
  }

  /**
   * Obtiene todas las localidades registradas
   * @returns Retorna las localidades registradas
   */
  @Get()
  finAll() {
    return this.localityService.findAllLocalities();
  }

  /**
   * Obtiene una localidad
   * @param id ID de la localidad
   * @returns Retorna la localidad
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.localityService.findOneLocality(id);
  }

  /**
   * Actualizar una localidad
   * @param id ID de la localiadad
   * @param updateLocalityDto Datos de la localiad para actualizar
   * @returns Retorna la localidad actualizada
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocalityDto: UpdateLocalityDto,
  ) {
    return this.localityService.updateLocality(id, updateLocalityDto);
  }

  /**
   * Eliminar una localiad
   * @param id ID de la localidad
   * @returns Retorna la localidad eliminada
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.localityService.removeLocality(id);
  }
}
