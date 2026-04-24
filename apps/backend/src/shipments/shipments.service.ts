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

  async getStats(userId: number) {
    const [total, pending, inTransit, delivered, cancelled] = await Promise.all(
      [
        this.prisma.shipment.count({ where: { userId } }),
        this.prisma.shipment.count({ where: { userId, status: 'PENDING' } }),
        this.prisma.shipment.count({ where: { userId, status: 'IN_TRANSIT' } }),
        this.prisma.shipment.count({ where: { userId, status: 'DELIVERED' } }),
        this.prisma.shipment.count({ where: { userId, status: 'CANCELLED' } }),
      ],
    );

    // Перевозки за последние 7 дней
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentShipments = await this.prisma.shipment.findMany({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Группируем по дням
    const chartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];

      return {
        date: date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
        }),
        count: recentShipments.filter(
          (s) => s.createdAt.toISOString().split('T')[0] === dateStr,
        ).length,
      };
    });

    return { total, pending, inTransit, delivered, cancelled, chartData };
  }
}
