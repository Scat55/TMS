import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShipmentDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  address: string;

  @IsNumber()
  @IsOptional()
  weight: number;
}
