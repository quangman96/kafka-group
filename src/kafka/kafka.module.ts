import { Module, OnModuleInit } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from '../service/kafka.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'test-client',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'test-consumer-group',
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule implements OnModuleInit {
  onModuleInit() {
    console.log('Kafka Module has been initialized.');
  }
}