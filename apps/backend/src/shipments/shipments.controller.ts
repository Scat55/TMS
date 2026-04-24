import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorato';

@Controller('shipments')
@UseGuards(JwtGuard)
export class ShipmentsController {
  constructor(private shipmentsService: ShipmentsService) {}

  @Get()
  findAll(
    @CurrentUser() user: { sub: number },
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.shipmentsService.findAll(user.sub, search, status);
  }

  @Get('stats')
  getStats(@CurrentUser() user: { sub: number }) {
    return this.shipmentsService.getStats(user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { sub: number },
  ) {
    return this.shipmentsService.findOne(id, user.sub);
  }

  @Post()
  create(@Body() dto: CreateShipmentDto, @CurrentUser() user: { sub: number }) {
    return this.shipmentsService.create(dto, user.sub);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShipmentStatusDto,
    @CurrentUser() user: { sub: number },
  ) {
    return this.shipmentsService.updateStatus(id, dto, user.sub);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { sub: number },
  ) {
    return this.shipmentsService.remove(id, user.sub);
  }
}
