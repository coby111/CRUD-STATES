import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * Metodo que obtiene todos los clientes
   * @returns Retorna una lista de clientes encontrados
   */
  @Get()
  findAll() {
    return this.customerService.findAllCustomers();
  }

  /**
   * Metodo para obtener un cliente por su ID
   * @param id - ID del cliente
   * @returns Retorna el cliente endontrado
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.findOneCustomer(id);
  }

  /**
   * Metodod para crear un cliente
   * @param createCustomerDto Informacion con la que se creara el cliente
   * @return Retorna el cliente creado
   */
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  /**
   * Metodo para actualizar un cliente
   * @param id - ID del cliente
   * @param updateCustomerDto Datos con la que se actualizara el cliente
   * @returns Retorna el cliente actualzado
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  /**
   * Metodo para eliminar un cliente
   * @param id - ID del cliente
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.removeCustomer(id);
  }
}
