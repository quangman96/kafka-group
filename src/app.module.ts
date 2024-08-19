import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [DatabaseModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
