
export { pessoasService, PessoasService } from './pessoasService';
export { recadosService, RecadosService } from './recadosService';
export { dashboardService, DashboardService } from './dashboardService';

// Exportações da configuração da API
export { apiClient, ApiError } from './api';

// Exportações dos tipos
export type {
    Pessoa,
    CreatePessoaData,
    UpdatePessoaData,
    Recado,
    CreateRecadoData,
    UpdateRecadoData,
    DashboardStats,
    ApiErrorResponse
} from './types';