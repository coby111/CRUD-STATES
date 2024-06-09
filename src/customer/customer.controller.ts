import { Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Body, Controller } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * Crear un cliente
   * @param createCustomerDto Datos del clinete
   * @returns Retorna el clinete creado
   */
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer({ ...createCustomerDto });
  }

  /**
   * Obtener todos los clientes
   * @returns Retorna todos los clientes registrados en la DB
   */
  @Get()
  findAll() {
    return this.customerService.findAllCustomers();
  }

  /**
   * Obtiena un cliente mediante su ID
   * @param id ID del cliente
   * @returns Retorna el cliente
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.findOneCustomer(id);
  }

  /**
   * Actualizar un cliente mediante ID
   * @param id ID del cliente
   * @param updateCustomerDto Datos del cliente
   * @returns Retorna el cliente registrado
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  /**
   * Eliminar un cliente
   * @param id ID del clinete
   * @returns Retorna el cliente eliminado
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.removeCustomer(id);
  }
}
