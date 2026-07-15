import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FormationsModule } from './formations/formations.module';
import { ExamensModule } from './examens/examens.module';
import { InscriptionsModule } from './inscriptions/inscriptions.module';
import { PresencesModule } from './presences/presences.module';
import { QuestionsModule } from './questions/questions.module';
import { ReponsesModule } from './reponses/reponses.module';
import { ResultatsModule } from './resultats/resultats.module';
import { AttestationsModule } from './attestations/attestations.module';

@Module({
  imports: [AuthModule, UsersModule, FormationsModule, ExamensModule, InscriptionsModule, PresencesModule, QuestionsModule, ReponsesModule, ResultatsModule, AttestationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
