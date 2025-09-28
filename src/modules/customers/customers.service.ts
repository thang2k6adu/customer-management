import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Customer, Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    return this.prisma.customer.create({
      data,
      include: { createdBy: true }, // trả luôn user tạo
    });
  }

  findAll(where?: Prisma.CustomerWhereInput): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      where,
      include: { createdBy: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
      include: { createdBy: true },
    });
  }

  update(id: number, data: Prisma.CustomerUpdateInput): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data,
      include: { createdBy: true },
    });
  }

  remove(id: number): Promise<Customer> {
    return this.prisma.customer.delete({
      where: { id },
      include: { createdBy: true },
    });
  }
}
