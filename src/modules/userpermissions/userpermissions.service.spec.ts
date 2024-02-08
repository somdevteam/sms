import { Test, TestingModule } from '@nestjs/testing';
import { UserpermissionsService } from './userpermissions.service';

describe('UserpermissionsService', () => {
  let service: UserpermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserpermissionsService],
    }).compile();

    service = module.get<UserpermissionsService>(UserpermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
