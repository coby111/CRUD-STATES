import { CreateAddressDto } from 'src/address/dto/create-address.dto';
export class UpdateCustomerDto {
  name?: string;
  firstName?: string;
  lastname?: string;
  rfc?: string;
  email?: string;
  phone?: string;
  status?: boolean;
  address?: CreateAddressDto;
}
