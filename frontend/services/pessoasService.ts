// services/pessoasService.ts
import { apiClient } from './api';
import { Pessoa, CreatePessoaData, UpdatePessoaData } from './types';

export class PessoasService {
    private endpoint = '/pessoas';

    /**
     * Busca todas as pessoas cadastradas
     */
    async getAll(): Promise<Pessoa[]> {
        try {
            return await apiClient.get<Pessoa[]>(this.endpoint);
        } catch (error) {
            console.error('Erro ao buscar pessoas:', error);
            throw error;
        }
    }

    /**
     * Busca uma pessoa específica pelo ID
     */
    async getById(id: number): Promise<Pessoa> {
        try {
            return await apiClient.get<Pessoa>(`${this.endpoint}/${id}`);
        } catch (error) {
            console.error(`Erro ao buscar pessoa com ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Cria uma nova pessoa
     */
    async create(data: CreatePessoaData): Promise<Pessoa> {
        try {
            return await apiClient.post<Pessoa>(this.endpoint, data);
        } catch (error) {
            console.error('Erro ao criar pessoa:', error);
            throw error;
        }
    }

    /**
     * Atualiza uma pessoa existente
     */
    async update(id: number, data: UpdatePessoaData): Promise<Pessoa> {
        try {
            return await apiClient.patch<Pessoa>(`${this.endpoint}/${id}`, data);
        } catch (error) {
            console.error(`Erro ao atualizar pessoa com ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Remove uma pessoa
     */
    async delete(id: number): Promise<void> {
        try {
            await apiClient.delete<void>(`${this.endpoint}/${id}`);
        } catch (error) {
            console.error(`Erro ao deletar pessoa com ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Busca pessoas para usar nos selects de recados
     * Retorna apenas dados necessários (id e nome)
     */
    async getPessoasForSelect(): Promise<Array<{ id: number; nome: string }>> {
        try {
            const pessoas = await this.getAll();
            return pessoas.map(pessoa => ({
                id: pessoa.id,
                nome: pessoa.nome
            }));
        } catch (error) {
            console.error('Erro ao buscar pessoas para select:', error);
            throw error;
        }
    }

    /**
     * Valida se um email já existe (para evitar duplicatas)
     */
    async checkEmailExists(email: string): Promise<boolean> {
        try {
            const pessoas = await this.getAll();
            return pessoas.some(pessoa => pessoa.email.toLowerCase() === email.toLowerCase());
        } catch (error) {
            console.error('Erro ao verificar email:', error);
            return false;
        }
    }
}

export const pessoasService = new PessoasService();