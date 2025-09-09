import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(KafkaProducerService.name);
    private readonly defaultTopic: string;

    constructor(
        @Inject('KAFKA_CLIENT') private readonly client: ClientKafka,
        private readonly configService: ConfigService,
    ) {
        this.defaultTopic = this.configService.getOrThrow<string>('kafka.defaultTopic');
    }

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

    emitEvent<T extends object>(eventType: string, payload: T, topic = this.defaultTopic): void {
        this.client.emit(topic, JSON.stringify(payload));

        // await new Promise<void>((resolve, reject) => {
        //     try {
        //         this.client.emit(topic, message).subscribe({
        //             complete: () => resolve(),
        //             error: (err) => reject(err),
        //         });
        //     } catch (e) {
        //         reject(e);
        //     }
        // });

        this.logger.log(`Event ${eventType} sent to ${topic}`);
    }
}


