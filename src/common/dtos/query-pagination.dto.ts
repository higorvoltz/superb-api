import { IsOptional, IsNumberString } from 'class-validator';

export class QueryPaginationDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  size?: string;
}
