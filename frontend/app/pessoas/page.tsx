"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Users, Mail } from "lucide-react"
import Link from "next/link"
import { pessoasService } from "@/services"
import type { Pessoa } from "@/services"

export default function PessoasPage() {
    const [pessoas, setPessoas] = useState<Pessoa[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const loadPessoas = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await pessoasService.getAll()
            setPessoas(data)
        } catch (err) {
            setError('Erro ao carregar pessoas')
            console.error('Erro ao carregar pessoas:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPessoas()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta pessoa? Todos os recados relacionados também serão excluídos.')) {
            return
        }

        try {
            setDeletingId(id)
            await pessoasService.delete(id)
            setPessoas(pessoas.filter(pessoa => pessoa.id !== id))
        } catch (err) {
            console.error('Erro ao deletar pessoa:', err)
            alert('Erro ao excluir pessoa. Verifique se não há recados relacionados.')
        } finally {
            setDeletingId(null)
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Data não disponível'
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const getInitials = (nome: string) => {
        return nome
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pessoas</h1>
                        <p className="text-gray-600">Gerencie todas as pessoas cadastradas no sistema</p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Carregando pessoas...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pessoas</h1>
                        <p className="text-gray-600">Gerencie todas as pessoas cadastradas no sistema</p>
                    </div>
                    <Link
                        href="/pessoas/nova"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Nova Pessoa
                    </Link>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-800">{error}</div>
                    <button
                        onClick={loadPessoas}
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Pessoas</h1>
                    <p className="text-gray-600">Gerencie todas as pessoas cadastradas no sistema</p>
                </div>
                <Link
                    href="/pessoas/nova"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Nova Pessoa
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pessoas.map((pessoa) => (
                    <div
                        key={pessoa.id}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {getInitials(pessoa.nome)}
                  </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{pessoa.nome}</h3>
                                    <p className="text-gray-600 flex items-center gap-1 text-sm">
                                        <Mail className="h-3 w-3" />
                                        {pessoa.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Cadastrado em {formatDate(pessoa.createdAt)}
                                </p>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/pessoas/${pessoa.id}/editar`}
                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                        title="Editar"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(pessoa.id)}
                                        disabled={deletingId === pessoa.id}
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

            {pessoas.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                        <Users className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pessoa encontrada</h3>
                        <p className="text-gray-500 mb-4">Comece cadastrando a primeira pessoa</p>
                        <Link
                            href="/pessoas/nova"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Cadastrar Pessoa
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}