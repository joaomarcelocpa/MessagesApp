"use client"

import { useState, useEffect } from "react"
import { Plus, Eye, Edit, Trash2, MessageSquare } from "lucide-react"
import Link from "next/link"
import { recadosService } from "@/services"
import type { Recado } from "@/services"

export default function RecadosPage() {
    const [recados, setRecados] = useState<Recado[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const loadRecados = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await recadosService.getAll()
            setRecados(data)
        } catch (err) {
            setError('Erro ao carregar recados')
            console.error('Erro ao carregar recados:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRecados()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este recado?')) {
            return
        }

        try {
            setDeletingId(id)
            await recadosService.delete(id)
            setRecados(recados.filter(recado => recado.id !== id))
        } catch (err) {
            console.error('Erro ao deletar recado:', err)
            alert('Erro ao excluir recado')
        } finally {
            setDeletingId(null)
        }
    }

    const handleMarkAsRead = async (id: number) => {
        try {
            const updatedRecado = await recadosService.markAsRead(id)
            setRecados(recados.map(recado =>
                recado.id === id ? updatedRecado : recado
            ))
        } catch (err) {
            console.error('Erro ao marcar como lido:', err)
            alert('Erro ao marcar recado como lido')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recados</h1>
                        <p className="text-gray-600">Gerencie todos os recados do sistema</p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Carregando recados...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recados</h1>
                        <p className="text-gray-600">Gerencie todos os recados do sistema</p>
                    </div>
                    <Link
                        href="/recados/novo"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Novo Recado
                    </Link>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-800">{error}</div>
                    <button
                        onClick={loadRecados}
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Recados</h1>
                    <p className="text-gray-600">Gerencie todos os recados do sistema</p>
                </div>
                <Link
                    href="/recados/novo"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Novo Recado
                </Link>
            </div>

            <div className="space-y-4">
                {recados.map((recado) => (
                    <div
                        key={recado.id}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="h-5 w-5 text-gray-400" />
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {recado.texto.length > 100
                                                ? `${recado.texto.substring(0, 100)}...`
                                                : recado.texto
                                            }
                                        </h3>
                                        {!recado.lido && (
                                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Não lido
                      </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        De: <strong>{recado.de.nome}</strong> para <strong>{recado.para.nome}</strong> • {formatDate(recado.data)}
                                    </p>
                                    {recado.texto.length > 100 && (
                                        <p className="text-gray-700 text-sm">
                                            {recado.texto.substring(100, 200)}
                                            {recado.texto.length > 200 && '...'}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <Link
                                        href={`/recados/${recado.id}`}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        title="Visualizar"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={`/recados/${recado.id}/editar`}
                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                        title="Editar"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    {!recado.lido && (
                                        <button
                                            onClick={() => handleMarkAsRead(recado.id)}
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                            title="Marcar como lido"
                                        >
                                            ✓
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(recado.id)}
                                        disabled={deletingId === recado.id}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                        title="Excluir"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {recados.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum recado encontrado</h3>
                        <p className="text-gray-500 mb-4">Comece criando seu primeiro recado</p>
                        <Link
                            href="/recados/novo"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Criar Recado
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}