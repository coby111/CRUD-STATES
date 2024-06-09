import { Test, TestingModule } from '@nestjs/testing';
import { LocalityController } from './locality.controller';

describe('LocalityController', () => {
  let controller: LocalityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalityController],
    }).compile();

    controller = module.get<LocalityController>(LocalityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
