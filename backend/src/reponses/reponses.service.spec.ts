import { Test, TestingModule } from '@nestjs/testing';
import { ReponsesService } from './reponses.service';

describe('ReponsesService', () => {
  let service: ReponsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReponsesService],
    }).compile();

    service = module.get<ReponsesService>(ReponsesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
