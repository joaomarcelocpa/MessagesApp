// services/recadosService.ts
import { apiClient } from './api';
import { Recado, CreateRecadoData, UpdateRecadoData } from './types';

export class RecadosService {
    private endpoint = '/recados';

    /**
     * Busca todos os recados
     */
    async getAll(): Promise<Recado[]> {
        try {
            return await apiClient.get<Recado[]>(this.endpoint);
        } catch (error) {
            console.error('Erro ao buscar recados:', error);
            throw error;
        }
    }

    /**
     * Busca um recado específico pelo ID
     */
    async getById(id: number): Promise<Recado> {
        try {
            return await apiClient.get<Recado>(`${this.endpoint}/${id}`);
        } catch (error) {
            console.error(`Erro ao buscar recado com ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Cria um novo recado
     */
    async create(data: CreateRecadoData): Promise<Recado> {
        try {
            return await apiClient.post<Recado>(this.endpoint, data);
        } catch (error) {
            console.error('Erro ao criar recado:', error);
            throw error;
        }
    }

    /**
     * Atualiza um recado existente
     */
    async update(id: number, data: UpdateRecadoData): Promise<Recado> {
        try {
            return await apiClient.patch<Recado>(`${this.endpoint}/${id}`, data);
        } catch (error) {
            console.error(`Erro ao atualizar recado com ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Remove um recado
     */
    async delete(id: number): Promise<void> {
        try {
            await apiClient.delete<void>(`${this.endpoint}/${id}`);
        } catch (error) {
            console.error(`Erro ao deletar recado com ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Marca um recado como lido
     */
    async markAsRead(id: number): Promise<Recado> {
        try {
            return await this.update(id, { lido: true });
        } catch (error) {
            console.error(`Erro ao marcar recado ${id} como lido:`, error);
            throw error;
        }
    }

    /**
     * Marca um recado como não lido
     */
    async markAsUnread(id: number): Promise<Recado> {
        try {
            return await this.update(id, { lido: false });
        } catch (error) {
            console.error(`Erro ao marcar recado ${id} como não lido:`, error);
            throw error;
        }
    }

    /**
     * Busca recados não lidos
     */
    async getUnreadMessages(): Promise<Recado[]> {
        try {
            const recados = await this.getAll();
            return recados.filter(recado => !recado.lido);
        } catch (error) {
            console.error('Erro ao buscar recados não lidos:', error);
            throw error;
        }
    }

    /**
     * Busca recados de hoje
     */
    async getTodayMessages(): Promise<Recado[]> {
        try {
            const recados = await this.getAll();
            const today = new Date().toISOString().split('T')[0];

            return recados.filter(recado => {
                const recadoDate = new Date(recado.data).toISOString().split('T')[0];
                return recadoDate === today;
            });
        } catch (error) {
            console.error('Erro ao buscar recados de hoje:', error);
            throw error;
        }
    }

    /**
     * Busca recados enviados por uma pessoa específica
     */
    async getMessagesSentBy(pessoaId: number): Promise<Recado[]> {
        try {
            const recados = await this.getAll();
            return recados.filter(recado => recado.de.id === pessoaId);
        } catch (error) {
            console.error(`Erro ao buscar recados enviados por pessoa ${pessoaId}:`, error);
            throw error;
        }
    }

    /**
     * Busca recados recebidos por uma pessoa específica
     */
    async getMessagesReceivedBy(pessoaId: number): Promise<Recado[]> {
        try {
            const recados = await this.getAll();
            return recados.filter(recado => recado.para.id === pessoaId);
        } catch (error) {
            console.error(`Erro ao buscar recados recebidos por pessoa ${pessoaId}:`, error);
            throw error;
        }
    }
}

export const recadosService = new RecadosService();