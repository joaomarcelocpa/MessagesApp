/* eslint-disable */
import { IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRecadoDto {

   @IsString()
   @IsNotEmpty()
   @MinLength(2)
   @MaxLength(200)
   readonly texto: string;

   @IsPositive()
   deId: number;

   @IsPositive()
   paraId: number;
}
