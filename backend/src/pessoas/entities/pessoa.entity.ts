/* eslint-disable */
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Recado } from '../../recados/entities/recado.entity';

@Entity()
export class Pessoa {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 100})
  nome: string;

  @Column({unique: true})
  @IsEmail()
  email: string;

  @Column({length: 255})
  passwordHash: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Uma pessoa pode enviar muitos recados (como "de")
  @OneToMany(() => Recado, recado => recado.de)
  recadosEnviados: Recado[];

  // Uma pessoa pode receber muitos recados (como "para")
  @OneToMany(() => Recado, recado => recado.para)
  recadosRecebidos: Recado[];
}
