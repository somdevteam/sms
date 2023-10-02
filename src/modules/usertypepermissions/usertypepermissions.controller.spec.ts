import { Test, TestingModule } from '@nestjs/testing';
import { UsertypepermissionsController } from './usertypepermissions.controller';

describe('UsertypepermissionsController', () => {
  let controller: UsertypepermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsertypepermissionsController],
    }).compile();

    controller = module.get<UsertypepermissionsController>(UsertypepermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
