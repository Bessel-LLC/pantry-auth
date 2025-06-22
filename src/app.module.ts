import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => {
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
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}