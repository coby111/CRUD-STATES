import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from './state.controller';
import { StateService } from './state.service';
import { PrismaService } from '../prisma.service';

describe('StateController', () => {
  let controller: StateController;
  let service: StateService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [StateService, PrismaService],
    }).compile();

    controller = module.get<StateController>(StateController);
    service = module.get<StateService>(StateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Interaccion controlador - servicio', () => {

    it('Debe traer un estado por id', async () => {
      let result ={
        id: 1,
        name: 'estado de ejemplo',
        municipalities: [],
      }

    jest.spyOn(service, 'findOne').mockImplementation(async () => result);
    expect(await controller.findOne(1)).toBe(result)
    });
    
  });

});
