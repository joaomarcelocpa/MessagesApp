/* eslint-disable */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePessoaDto } from '../dto/create-pessoa.dto';
import { UpdatePessoaDto } from '../dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from '../entities/pessoa.entity';

@Injectable()
export class PessoasService {

  constructor(@InjectRepository(Pessoa) private readonly pessoaRepository: Repository<Pessoa>) {}

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const dadosPessoa = {
        nome: createPessoaDto.nome,
        passwordHash: createPessoaDto.password,
        email: createPessoaDto.email,
      };

      const novaPessoa = this.pessoaRepository.create(dadosPessoa);
      await this.pessoaRepository.save(novaPessoa);
      return novaPessoa;
    }
    catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw error;
    }
  }


  async findAll() {
      const pessoas = await this.pessoaRepository.find();
      return pessoas;
    }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOne({ where: {id,},});
    if (pessoa) {
      return pessoa;
    }
    this.throwNotFoundError();
  }


  async update(id: number, updatePessoaDto: UpdatePessoaDto) {

    const dadosPessoa = {
      nome: updatePessoaDto?.nome,
      passwordHash: updatePessoaDto?.password,
    }

      const pessoa = await this.pessoaRepository.preload({id, ...dadosPessoa});
      if (!pessoa) return this.throwNotFoundError();
      return this.pessoaRepository.save(pessoa);
  }


  async remove(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({id});

    if(!pessoa) return this.throwNotFoundError();

    return this.pessoaRepository.remove(pessoa);
  }



  private throwNotFoundError() {
    throw new NotFoundException('Pessoa não encontrada');
  }
}
