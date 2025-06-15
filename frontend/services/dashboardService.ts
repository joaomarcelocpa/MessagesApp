// services/dashboardService.ts
import { DashboardStats } from './types';
import { recadosService } from './recadosService';
import { pessoasService } from './pessoasService';

export class DashboardService {
    /**
     * Busca todas as estatísticas do dashboard
     */
    async getStats(): Promise<DashboardStats> {
        try {
            const [recados, pessoas] = await Promise.all([
                recadosService.getAll(),
                pessoasService.getAll()
            ]);

            const hoje = new Date();
            const ontem = new Date(hoje);
            ontem.setDate(ontem.getDate() - 1);

            // Total de recados
            const totalRecados = recados.length;

            // Pessoas cadastradas
            const pessoasCadastradas = pessoas.length;

            // Recados de hoje
            const recadosHoje = recados.filter(recado => {
                const dataRecado = new Date(recado.data);
                return (
                    dataRecado.getDate() === hoje.getDate() &&
                    dataRecado.getMonth() === hoje.getMonth() &&
                    dataRecado.getFullYear() === hoje.getFullYear()
                );
            }).length;

            // Recados não lidos
            const recadosNaoLidos = recados.filter(recado => !recado.lido).length;

            return {
                totalRecados,
                pessoasCadastradas,
                recadosHoje,
                recadosNaoLidos
            };
        } catch (error) {
            console.error('Erro ao buscar estatísticas do dashboard:', error);
            throw error;
        }
    }

    /**
     * Busca estatísticas de crescimento (comparação com período anterior)
     */
    async getGrowthStats(): Promise<{
        recadosGrowth: number;
        pessoasGrowth: number;
    }> {
        try {
            const [recados, pessoas] = await Promise.all([
                recadosService.getAll(),
                pessoasService.getAll()
            ]);

            const hoje = new Date();
            const ontem = new Date(hoje);
            ontem.setDate(ontem.getDate() - 1);

            const semanaPassada = new Date(hoje);
            semanaPassada.setDate(semanaPassada.getDate() - 7);

            // Recados de ontem
            const recadosOntem = recados.filter(recado => {
                const dataRecado = new Date(recado.data);
                return (
                    dataRecado.getDate() === ontem.getDate() &&
                    dataRecado.getMonth() === ontem.getMonth() &&
                    dataRecado.getFullYear() === ontem.getFullYear()
                );
            }).length;

            // Pessoas cadastradas esta semana
            const pessoasEstaSemana = pessoas.filter(pessoa => {
                if (!pessoa.createdAt) return false;
                const dataCadastro = new Date(pessoa.createdAt);
                return dataCadastro >= semanaPassada;
            }).length;

            return {
                recadosGrowth: recadosOntem,
                pessoasGrowth: pessoasEstaSemana
            };
        } catch (error) {
            console.error('Erro ao buscar estatísticas de crescimento:', error);
            return {
                recadosGrowth: 0,
                pessoasGrowth: 0
            };
        }
    }

    /**
     * Busca recados recentes para exibir no dashboard
     */
    async getRecentMessages(limit: number = 5): Promise<any[]> {
        try {
            const recados = await recadosService.getAll();

            return recados
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                .slice(0, limit)
                .map(recado => ({
                    id: recado.id,
                    titulo: recado.texto.length > 50 ? recado.texto.substring(0, 50) + '...' : recado.texto,
                    de: recado.de.nome,
                    para: recado.para.nome,
                    data: recado.data,
                    lido: recado.lido
                }));
        } catch (error) {
            console.error('Erro ao buscar recados recentes:', error);
            return [];
        }
    }
}

export const dashboardService = new DashboardService();