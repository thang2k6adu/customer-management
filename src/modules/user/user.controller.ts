import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  // Bảo vệ route bằng JWT Guard
  @UseGuards(JwtAuthGuard)
  @Get()
  getUser(@Req() req: any) {
    // req.user được gắn từ JwtStrategy.validate()
    return {
      id: req.user.userId,
      email: req.user.email,
    };
  }
}
