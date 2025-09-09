// import { Module } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { ClientsModule, Transport } from '@nestjs/microservices';

// @Module({
//   imports: [
//     ClientsModule.registerAsync([
//       {
//         name: "KAFKA_PRODUCER_SERVICE",
//         useFactory: (configService: ConfigService) => ({
//           transport: Transport.KAFKA,
//           options: {
//             client: {
//               clientId: configService.getOrThrow<string>("kafka.clientId"),
//               brokers: configService
//                 .getOrThrow<string[]>("kafka.brokers"),              
//             },
//             producer: {
//               allowAutoTopicCreation: true,
//               idempotent: true,
//               retry: {
//                 retries: 5,
//                 maxRetryTime: 30000,
//               },
//             },
//           },
//         }),
//         inject: [ConfigService],
//       },
//     ]),
//   ],
// })
// export class KafkaModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './kafka.service';

@Module({
    imports: [ConfigModule],
    providers: [KafkaService],
    exports: [KafkaService],
})
export class KafkaModule {}
