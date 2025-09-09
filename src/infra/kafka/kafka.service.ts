// // order-service/src/order/order.service.ts
// import {
//   Injectable,
//   Inject,
//   OnModuleInit,
//   OnModuleDestroy,
//   Logger,
// } from "@nestjs/common";
// import { ClientKafka } from "@nestjs/microservices";
// import { KafkaMessage } from "@nestjs/microservices/external/kafka.interface";

// @Injectable()
// export class KafkaService implements OnModuleInit, OnModuleDestroy {
//   private readonly logger: Logger;
//   constructor(
//     @Inject("KAFKA_PRODUCER_SERVICE") private readonly kafkaClient: ClientKafka,
//   ) {
//     this.logger = new Logger(KafkaService.name);
//   }

//   async onModuleInit() {
//     // Connect the client when the module initializes
//     try {
//       await this.kafkaClient.connect();
//       this.logger.log(
//         "Kafka Producer Client connected successfully",
//       );
//     } catch (error) {
//       this.logger.error(
//         "Failed to connect Kafka Producer Client",
//         error,
//       );
//     }
//   }

//   async onModuleDestroy() {
//     await this.kafkaClient.close();
//     this.logger.log("Kafka Producer Client disconnected");
//   }

//   async sendMessage(message: KafkaMessage, topic: string): Promise<void> {
//     try {
//         await this.kafkaClient.emit(
//             topic,
//             message.value,
//         );
//         this.logger.debug(`Message sent to topic ${topic}`);
//     } catch (error) {
//         this.logger.error(`Failed to send message to topic ${message.topic}:`, error);
//         throw error;
//     }
// }

//   // async createOrder(orderData: any) {
//   //   const topic = "order_created";
//   //   const eventPayload = {
//   //     orderId: `ORD-${Date.now()}`, // Simple unique ID
//   //     ...orderData,
//   //     timestamp: new Date().toISOString(),
//   //   };

//   //   try {
//   //     this.logger.log(
//   //       `Publishing event to topic [${topic}]`,
//   //       OrderService.name
//   //     );
//   //     this.kafkaClient.emit(topic, JSON.stringify(eventPayload));
//   //     return { success: true, publishedEvent: eventPayload };
//   //   } catch (error) {
//   //     this.logger.error(
//   //       `Failed to publish event to topic [${topic}]`,
//   //       error,
//   //       OrderService.name
//   //     );
//   //     return { success: false, error: error.message };
//   //   }
//   // }
// }

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
