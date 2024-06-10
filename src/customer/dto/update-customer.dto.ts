export class UpdateCustomerDto {
  name?: string;
  firstName?: string;
  lastName?: string;
  rfc?: string;
  street?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  postalCode?: string;
  localityId?: number;
  email?: string;
  phone?: number;
  status?: boolean;
  address: {
    street: string;
    exteriorNumber: string;
    interiorNumber: string;
    postalCode: string;
    localityId: number;
  };
}
