"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Users, Plus, Eye } from "lucide-react"
import Link from "next/link"
import { dashboardService } from "@/services"
import type { DashboardStats } from "@/services"

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRecados: 0,
    pessoasCadastradas: 0,
    recadosHoje: 0,
    recadosNaoLidos: 0
  })
  const [growth, setGrowth] = useState({ recadosGrowth: 0, pessoasGrowth: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [dashboardStats, growthStats] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getGrowthStats()
        ])

        setStats(dashboardStats)
        setGrowth(growthStats)
      } catch (err) {
        setError('Erro ao carregar dados do dashboard')
        console.error('Erro no dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Recados</h1>
            <p className="text-gray-600">Gerencie pessoas e envie recados de forma simples e eficiente</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Carregando dados...</div>
          </div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Recados</h1>
            <p className="text-gray-600">Gerencie pessoas e envie recados de forma simples e eficiente</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
            <button
                onClick={handleRetry}
                className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Tentar novamente
            </button>
          </div>
        </div>
    )
  }

  return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Recados</h1>
          <p className="text-gray-600">Gerencie pessoas e envie recados de forma simples e eficiente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total de Recados</h3>
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalRecados}</div>
            <p className="text-xs text-gray-500">
              {growth.recadosGrowth > 0 ? `+${growth.recadosGrowth} desde ontem` : 'Nenhum ontem'}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Pessoas Cadastradas</h3>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pessoasCadastradas}</div>
            <p className="text-xs text-gray-500">
              {growth.pessoasGrowth > 0 ? `+${growth.pessoasGrowth} esta semana` : 'Nenhuma esta semana'}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Recados Hoje</h3>
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.recadosHoje}</div>
            <p className="text-xs text-gray-500">Enviados hoje</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Não Lidos</h3>
              <Eye className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.recadosNaoLidos}</div>
            <p className="text-xs text-gray-500">Aguardando leitura</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5" />
                Gerenciar Recados
              </h2>
              <p className="text-gray-600">Visualize, crie, edite e exclua recados</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                  href="/recados"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver Todos os Recados
              </Link>
              <Link
                  href="/recados/novo"
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-center font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Recado
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                Gerenciar Pessoas
              </h2>
              <p className="text-gray-600">Cadastre e gerencie pessoas do sistema</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                  href="/pessoas"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver Todas as Pessoas
              </Link>
              <Link
                  href="/pessoas/nova"
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-center font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Pessoa
              </Link>
            </div>
          </div>
        </div>
      </div>
  )
}