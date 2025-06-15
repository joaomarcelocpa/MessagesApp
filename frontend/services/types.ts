// services/types.ts

// Interface para Pessoa
export interface Pessoa {
    id: number;
    nome: string;
    email: string;
    passwordHash?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Interface para criar uma nova pessoa
export interface CreatePessoaData {
    nome: string;
    email: string;
    password: string;
}

// Interface para atualizar uma pessoa
export interface UpdatePessoaData {
    nome?: string;
    email?: string;
    password?: string;
}

// Interface para Recado
export interface Recado {
    id: number;
    texto: string;
    de: {
        id: number;
        nome: string;
    };
    para: {
        id: number;
        nome: string;
    };
    lido: boolean;
    data: string;
    createdAt?: string;
    updatedAt?: string;
}

// Interface para criar um novo recado
export interface CreateRecadoData {
    texto: string;
    deId: number;
    paraId: number;
}

// Interface para atualizar um recado
export interface UpdateRecadoData {
    texto?: string;
    lido?: boolean;
}

// Interface para estatísticas do dashboard
export interface DashboardStats {
    totalRecados: number;
    pessoasCadastradas: number;
    recadosHoje: number;
    recadosNaoLidos: number;
}

// Interface para respostas de erro da API
export interface ApiErrorResponse {
    message: string | string[];
    error: string;
    statusCode: number;
}