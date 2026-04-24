import { ShipmentStatus } from '../../../generated/prisma/enums';
import { IsEnum } from 'class-validator';

export class UpdateShipmentStatusDto {
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;
}
