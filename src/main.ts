import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const kafkaService =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'messaging-consumer-group',
        },
      },
    });

  const rabbitMqService =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@rabbitmq:5672'],
        queue: 'ecommerce_queue',
        queueOptions: {
          durable: false,
        },
      },
    });

  await kafkaService.listen();
  await rabbitMqService.listen();
  console.log('Microservice is listening 2');
}
bootstrap();
