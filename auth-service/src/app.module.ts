import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserUseCaseModule } from './users/application/ports/input/user-use-case.module';

import { UserController } from './users/infrastructure/adapters/inbound/controllers/user.controller';
import { AuthController } from './users/infrastructure/adapters/inbound/controllers/verificacion.user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (uri) {
          console.log('¡Conectado exitosamente BDD');
        } else {
          console.error('MONGODB no está definida, no se puede conectar a BDD');
        }
        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
    UserUseCaseModule,
  ],
  controllers: [UserController, AuthController],
  providers: [],
})
export class AppModule {}
