import { Test, TestingModule } from '@nestjs/testing';
import { UserpermissionsController } from './userpermissions.controller';

describe('UserpermissionsController', () => {
  let controller: UserpermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserpermissionsController],
    }).compile();

    controller = module.get<UserpermissionsController>(UserpermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
