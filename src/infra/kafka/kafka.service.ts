import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { KafkaConfig } from 'src/config/types';
import { KafkaMessage } from './types';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(KafkaService.name);
    private kafka: Kafka;
    private producer: Producer;
    private readonly kafkaConfig: KafkaConfig;

    constructor(private readonly configService: ConfigService) {
        this.kafkaConfig = this.configService.get<KafkaConfig>('kafka')!;
        this.logger.debug(`Kafka config: ${JSON.stringify(this.kafkaConfig)}`);
        this.kafka = new Kafka({
            clientId: this.kafkaConfig.clientId,
            brokers: this.kafkaConfig.brokers,
        });

        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        try {
            await this.producer.connect();
            this.logger.log('Kafka producer connected successfully');
        } catch (error) {
            this.logger.error('Failed to connect to Kafka:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        try {
            await this.producer.disconnect();
            this.logger.log('Kafka producer disconnected');
        } catch (error) {
            this.logger.error('Error disconnecting Kafka producer:', error);
        }
    }

    async sendMessage(message: KafkaMessage): Promise<void> {
      console.log('MESSAGE', message);
        try {
            await this.producer.send({
                topic: message.topic,
                messages: [
                    {
                        key: message.key,
                        value: message.value,
                        headers: message.headers,
                    },
                ],
            });
            this.logger.log(`Message sent to topic ${message.topic}`);
        } catch (error) {
            this.logger.error(`Failed to send message to topic ${message.topic}:`, error);
            throw error;
        }
    }
}
