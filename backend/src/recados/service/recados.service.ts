/* eslint-disable */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from '../entities/recado.entity';
import { CreateRecadoDto } from '../dto/create-recado.dto';
import { UpdateRecadoDto } from '../dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from '../../pessoas/service/pessoas.service';

@Injectable()
export class RecadosService {
  constructor(@InjectRepository(Recado) private readonly recadoRepository: Repository<Recado>, private readonly pessoasService: PessoasService,) {}

  async create(createRecadoDto: CreateRecadoDto) {
    const {deId, paraId} = createRecadoDto;

    const de = await this.pessoasService.findOne(deId);
    const para = await this.pessoasService.findOne(paraId);

    const novoRecado = {
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      data: new Date(),
    };

    const recado = await this.recadoRepository.create(novoRecado);
    await this.recadoRepository.save(recado);
    return {
      ...recado,
      de: {
        id: recado.de.id,
      },
      para: {
        id: recado.para.id,
      },
    };
  }


  async findAll() {
    const recados = await this.recadoRepository.find({
      relations: ['de', 'para'],
      order: { id: 'asc'},
      select: {
        de: {id: true, nome: true },
        para: {id: true, nome: true }
      },
    });
    return recados;
  }


  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({ where: {id,},});

    if (recado) {
      return recado;
    }
    this.throwNotFoundError();
  }



  async update(id: number, updateRecadoDto: UpdateRecadoDto) {

    const recado = await this.findOne(id);

    if (!recado) {this.throwNotFoundError();}

    recado!.texto = updateRecadoDto?.texto ?? recado!.texto;
    recado!.lido = updateRecadoDto?.lido ?? recado!.lido;
    await this.recadoRepository.save(recado!);
    return recado;
  }



  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({id});

    if (!recado) return this.throwNotFoundError();
    return this.recadoRepository.remove(recado);
  }




  private throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado');
  }
}
