/* eslint-disable */
import { Module } from '@nestjs/common';
import { RecadosController } from '../controller/recados.controller';
import { RecadosService } from '../service/recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from '../entities/recado.entity';
import { PessoasModule } from '../../pessoas/module/pessoas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recado]), PessoasModule],
  controllers: [RecadosController],
  providers: [RecadosService],
})
export class RecadosModule {}
