/* eslint-disable */
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePessoaDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

}
