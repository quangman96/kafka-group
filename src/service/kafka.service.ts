import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'test-client',
      brokers: ['localhost:9092'],
    });

    this.consumer = kafka.consumer({ groupId: 'test-consumer-group' });

    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        console.log({
          value: message.value.toString(),
          topic,
          partition,
          offset: message.offset,
        });

        // Xử lý logic tại đây
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
