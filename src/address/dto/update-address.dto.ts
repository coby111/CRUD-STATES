import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
    customerId?: number;
    localityId?: number;
    street?: string;
    exteriorNumber?: string;
    interiorNumber?: string;
    postalCode?: string;
}
