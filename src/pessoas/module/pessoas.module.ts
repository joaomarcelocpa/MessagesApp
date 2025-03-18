/* eslint-disable */
import { Module } from '@nestjs/common';
import { PessoasService } from '../service/pessoas.service';
import { PessoasController } from '../controller/pessoas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from '../entities/pessoa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pessoa])],
  controllers: [PessoasController],
  providers: [PessoasService],
  exports: [PessoasService],
})
export class PessoasModule {}
