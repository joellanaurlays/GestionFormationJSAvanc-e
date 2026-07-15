import { Test, TestingModule } from '@nestjs/testing';
import { ResultatsService } from './resultats.service';

describe('ResultatsService', () => {
  let service: ResultatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultatsService],
    }).compile();

    service = module.get<ResultatsService>(ResultatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
