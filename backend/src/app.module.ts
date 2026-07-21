import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') || '5432'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    FormationsModule,
    ExamensModule,
    InscriptionsModule,
    PresencesModule,
    QuestionsModule,
    ReponsesModule,
    ResultatsModule,
    AttestationsModule,
  ],
})
export class AppModule {}