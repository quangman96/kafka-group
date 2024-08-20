import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { Pool } from 'pg';
@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}
  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'test-client',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.consumer = kafka.consumer({ groupId: 'test-consumer-group' });

    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        console.log({
          value: message.value.toString(),
          topic,
          partition,
          offset: message.offset,
        });
        this.saveLog(message.value.toString(), process.env.PORT);
      },
    });
  }

  async saveLog(uuid: string, port: string): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        `INSERT INTO sub_test (uuid, port) VALUES ('${uuid}', ${Number(port)})`,
      );
      return res.rows;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
