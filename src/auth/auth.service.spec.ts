import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

// Mock bcrypt
jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let mockPrismaService: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };
  let mockJwtService: {
    signAsync: jest.Mock;
  };

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: Role.MEMBER,
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: Role.MEMBER,
    };

    it('should register a new user successfully', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { ...registerDto, password: 'hashedPassword' },
      });
      expect(result).toEqual({
        message: 'User registered successfully',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('Email already registered'),
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
    it('should throw raw error if prisma.create fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      mockPrismaService.user.create.mockRejectedValue(new Error('DB down'));

      await expect(service.register(registerDto)).rejects.toThrow('DB down');
    });

    it('should throw raw error if bcrypt.hash fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockBcrypt.hash.mockRejectedValue(new Error('bcrypt failed') as never);

      await expect(service.register(registerDto)).rejects.toThrow(
        'bcrypt failed',
      );
    });
  });

  describe('login', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should login successfully with valid credentials', async () => {
      // Arrange
      const mockToken = 'jwt-token';
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      // Act
      const result = await service.login(email, password);

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          avatar: mockUser.avatar,
        },
        access_token: mockToken,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(email, password)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await expect(service.login(email, password)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should handle user with avatar', async () => {
      const userWithAvatar = { ...mockUser, avatar: 'avatar-url.jpg' };
      const mockToken = 'jwt-token';
      mockPrismaService.user.findUnique.mockResolvedValue(userWithAvatar);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.login(email, password);

      expect(result.user.avatar).toBe('avatar-url.jpg');
    });

    it('should throw raw error if bcrypt.compare fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockRejectedValue(
        new Error('bcrypt compare error') as never,
      );

      await expect(service.login(email, password)).rejects.toThrow(
        'bcrypt compare error',
      );
    });

    it('should throw raw error if jwt.signAsync fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwtService.signAsync.mockRejectedValue(new Error('JWT failed'));

      await expect(service.login(email, password)).rejects.toThrow(
        'JWT failed',
      );
    });
  });

  describe('login', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should login successfully with valid credentials', async () => {
      // Arrange
      const mockToken = 'jwt-token';
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      // Act
      const result = await service.login(email, password);

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          avatar: mockUser.avatar,
        },
        access_token: mockToken,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(email, password)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.login(email, password)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should handle user with avatar', async () => {
      // Arrange
      const userWithAvatar = { ...mockUser, avatar: 'avatar-url.jpg' };
      const mockToken = 'jwt-token';
      mockPrismaService.user.findUnique.mockResolvedValue(userWithAvatar);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      // Act
      const result = await service.login(email, password);

      // Assert
      expect(result.user.avatar).toBe('avatar-url.jpg');
    });
  });
});
