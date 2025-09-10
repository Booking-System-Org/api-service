import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka.producer.service';
import { KafkaConfig } from 'src/config/types';

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_CLIENT',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    const kafka = configService.getOrThrow<KafkaConfig>('kafka');

                    return {
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId: kafka.clientId,
                                brokers: kafka.brokers,
                            },
                            producer: {
                                allowAutoTopicCreation: true,
                                idempotent: true,
                                retry: {
                                    retries: 3,
                                    maxRetryTime: 30000,
                                },
                            },
                        },
                    };
                },
            },
        ]),
    ],
    providers: [KafkaProducerService],
    exports: [KafkaProducerService],
})
export class KafkaModule {}
