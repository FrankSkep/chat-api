import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
      MongooseModule.forRoot('mongodb://localhost:27017/nest'),
      ChatModule,
  ],
})
export class AppModule {}
