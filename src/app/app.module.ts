/* eslint-disable */
import { Module } from '@nestjs/common';
import { RecadosModule } from 'src/recados/module/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from '../pessoas/module/pessoas.module';

@Module({
  imports: [RecadosModule, PessoasModule, TypeOrmModule.forRoot({
    type: 'postgres', host: 'localhost', port: 5432, username: 'postgres', database:'postgres', password: '12345', autoLoadEntities: true, synchronize: true,
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
