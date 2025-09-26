import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }), // load .env
    PrismaModule,
    AuthModule,
    UserModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        console.log('JWT_SECRET =', secret); // kiểm tra giá trị
        return {
          secret,
          signOptions: { expiresIn: config.get<string>('JWT_EXPIRES') || '1d' },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [JwtModule],
})
export class AppModule {}
