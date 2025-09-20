"use client"

import { useState, useEffect, use } from "react"
import { ArrowLeft, Edit, Trash2, MessageSquare, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { recadosService } from "@/services"
import type { Recado } from "@/services"

export default function RecadoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const [recado, setRecado] = useState<Recado | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [markingAsRead, setMarkingAsRead] = useState(false)

    useEffect(() => {
        const loadRecado = async () => {
            try {
                setLoading(true)
                const data = await recadosService.getById(parseInt(resolvedParams.id))
                setRecado(data)

                // Se o recado não foi lido, marca automaticamente como lido
                if (!data.lido) {
                    setMarkingAsRead(true)
                    try {
                        const updatedRecado = await recadosService.markAsRead(data.id)
                        setRecado(updatedRecado)
                    } catch (error) {
                        console.error("Erro ao marcar como lido:", error)
                    } finally {
                        setMarkingAsRead(false)
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar recado:", error)
                router.push("/recados")
            } finally {
                setLoading(false)
            }
        }

        if (resolvedParams.id) {
            loadRecado()
        }
    }, [resolvedParams.id, router])

    const handleDelete = async () => {
        if (!recado || !confirm('Tem certeza que deseja excluir este recado?')) {
            return
        }

        try {
            setDeleting(true)
            await recadosService.delete(recado.id)
            router.push("/recados")
        } catch (error) {
            console.error("Erro ao deletar recado:", error)
            alert("Erro ao excluir recado")
        } finally {
            setDeleting(false)
        }
    }

    const handleToggleRead = async () => {
        if (!recado) return

        try {
            const updatedRecado = await recadosService.update(recado.id, { lido: !recado.lido })
            setRecado(updatedRecado)
        } catch (error) {
            console.error("Erro ao alterar status de leitura:", error)
            alert("Erro ao alterar status de leitura")
        }
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <Link
                        href="/recados"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para Recados
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Detalhes do Recado</h1>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Carregando recado...</div>
                </div>
            </div>
        )
    }

    if (!recado) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <Link
                        href="/recados"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para Recados
                    </Link>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-800">Recado não encontrado</div>
                    <Link href="/recados" className="mt-2 text-red-600 hover:text-red-800 underline">
                        Voltar para lista de recados
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <Link
                    href="/recados"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Recados
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Detalhes do Recado</h1>
                        <p className="text-gray-600">Visualize as informações completas do recado</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={`/recados/${resolvedParams.id}/editar`}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Editar
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="border border-red-300 hover:bg-red-50 text-red-700 disabled:opacity-50 px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            {deleting ? "Excluindo..." : "Excluir"}
                        </button>
                    </div>
                </div>
            </div>

            {markingAsRead && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">Marcando recado como lido...</p>
                </div>
            )}

            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                                    <MessageSquare className="h-6 w-6" />
                                    Recado #{recado.id}
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDateTime(recado.data)}
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                        recado.lido
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                    {recado.lido ? 'Lido' : 'Não lido'}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <h3 className="text-sm font-medium text-gray-500">Remetente</h3>
                                </div>
                                <p className="font-semibold text-lg text-gray-900">{recado.de?.nome || 'Nome não disponível'}</p>
                                <p className="text-sm text-gray-600">ID: {recado.de?.id || 'N/A'}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <h3 className="text-sm font-medium text-gray-500">Destinatário</h3>
                                </div>
                                <p className="font-semibold text-lg text-gray-900">{recado.para?.nome || 'Nome não disponível'}</p>
                                <p className="text-sm text-gray-600">ID: {recado.para?.id || 'N/A'}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">Mensagem</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{recado.texto}</p>
                            </div>
                        </div>

                        {recado.createdAt && (
                            <div className="border-t pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                                    <div>
                                        <span className="font-medium">Criado em:</span> {formatDateTime(recado.createdAt)}
                                    </div>
                                    {recado.updatedAt && recado.updatedAt !== recado.createdAt && (
                                        <div>
                                            <span className="font-medium">Última atualização:</span> {formatDateTime(recado.updatedAt)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ações adicionais */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Ações</h3>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={`/recados/${resolvedParams.id}/editar`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Editar Recado
                        </Link>

                        <button
                            onClick={handleToggleRead}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                        >
                            {recado.lido ? 'Marcar como Não Lido' : 'Marcar como Lido'}
                        </button>

                        <Link
                            href="/recados/novo"
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                        >
                            Criar Novo Recado
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}