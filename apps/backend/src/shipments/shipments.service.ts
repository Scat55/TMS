import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number, search?: string, status?: string) {
    return this.prisma.shipment.findMany({
      where: {
        userId,
        ...(status && { status: status as any }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const shipment = await this.prisma.shipment.findFirst({
      where: { id, userId },
    });

    if (!shipment) throw new NotFoundException('Перевозка не найдена');

    return shipment;
  }

  async create(dto: CreateShipmentDto, userId: number) {
    return this.prisma.shipment.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async updateStatus(id: number, dto: UpdateShipmentStatusDto, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.shipment.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.shipment.delete({
      where: { id },
    });
  }
}
