import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import svcConfig from './config/svc.config';
import dbConfig from './config/db-config/db-config';
import kafkaConfig from './config/kafka.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BookingModule } from './modules/booking';
import { KafkaModule } from './infra/kafka';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
      load: [svcConfig, dbConfig, kafkaConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<{ database: TypeOrmModuleOptions }, true>) => {
        const dbConfig = configService.get('database');
        return dbConfig;
      },
    }),
    BookingModule,
    KafkaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
