import { Test, TestingModule } from '@nestjs/testing';
import { ExamensController } from './examens.controller';

describe('ExamensController', () => {
  let controller: ExamensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamensController],
    }).compile();

    controller = module.get<ExamensController>(ExamensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
