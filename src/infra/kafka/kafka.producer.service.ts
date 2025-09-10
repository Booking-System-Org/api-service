import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTopics } from './constants';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(KafkaProducerService.name);
    private readonly defaultTopic = KafkaTopics.default;

    constructor(
        @Inject('KAFKA_CLIENT') private readonly client: ClientKafka,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.client.connect();
        this.logger.log('Kafka client connected');
    }

    async onModuleDestroy(): Promise<void> {
        try {
            await this.client.close();
            this.logger.log('Kafka client disconnected');
        } catch (error) {
            this.logger.error('Error on Kafka client disconnect', error as Error);
        }
    }

    public emitEvent<T extends object>(payload: T, topic = this.defaultTopic): void {
        this.client.emit(topic, JSON.stringify(payload));
        this.logger.log(`Event sent to ${topic}`);
    }
}


