import { registerAs } from '@nestjs/config';
import { KafkaConfig } from './types';

export default registerAs('kafka', (): KafkaConfig => ({
    brokers: (process.env.KAFKA_BROKERS
        ? process.env.KAFKA_BROKERS.split(',').map((b) => b.trim()).filter(Boolean)
        : ['kafka:9092']
    ),
    clientId: process.env.KAFKA_CLIENT_ID || 'api-service',
}));
