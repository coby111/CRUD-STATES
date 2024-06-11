import { Controller, Get, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  /**
   * Metodo para obtener todos las direcciones
   * @returns Retorna una lista de direcciones encontradas
   */
  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  /**
   * Metodo que obtiene una direccion mediante su id
   * @param id Id de la direccion
   * @returns Retorna la direccion
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.findOne(id);
  }

  /**
   * Metodo para eliminar una direccion
   * @param id ID de la direccion
   * @returns Retorna la direccion eliminada
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.remove(id);
  }
}
