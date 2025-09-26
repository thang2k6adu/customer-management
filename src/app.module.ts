import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ActivityLogsModule } from './modules/activity-logs/activity-logs.module';
import { NotesModule } from './modules/notes/notes.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }), // load .env
    PrismaModule,
    AuthModule,
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
    UsersModule,
    CustomersModule,
    TicketsModule,
    ConversationsModule,
    TasksModule,
    ActivityLogsModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [JwtModule],
})
export class AppModule {}
