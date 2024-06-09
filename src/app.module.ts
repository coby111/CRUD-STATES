import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StateModule } from './state/state.module';
import { MunicipalityModule } from './municipality/municipality.module';
import { LocalityModule } from './locality/locality.module';
import { AddressModule } from './address/address.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    StateModule,
    MunicipalityModule,
    LocalityModule,
    AddressModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
