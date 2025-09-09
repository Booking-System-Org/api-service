import { registerAs } from '@nestjs/config';
import { KafkaConfig } from './types';

export default registerAs('kafka', (): KafkaConfig => ({
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: process.env.KAFKA_CLIENT_ID || 'api-service',
    defaultTopic: process.env.KAFKA_DEFAULT_TOPIC || 'booking-events',
}));
