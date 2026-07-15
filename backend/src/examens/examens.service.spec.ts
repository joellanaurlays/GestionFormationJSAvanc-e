import { Test, TestingModule } from '@nestjs/testing';
import { ExamensService } from './examens.service';

describe('ExamensService', () => {
  let service: ExamensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamensService],
    }).compile();

    service = module.get<ExamensService>(ExamensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
