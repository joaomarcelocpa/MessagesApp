"use client"

import { useState, useEffect, use } from "react"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { recadosService } from "@/services"
import type { Recado, UpdateRecadoData } from "@/services"

export default function EditarRecadoPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const [recado, setRecado] = useState<Recado | null>(null)
    const [formData, setFormData] = useState<UpdateRecadoData>({
        texto: "",
        lido: false,
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        const loadRecado = async () => {
            try {
                setLoading(true)
                const data = await recadosService.getById(parseInt(resolvedParams.id))
                setRecado(data)
                setFormData({
                    texto: data.texto,
                    lido: data.lido,
                })
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

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.texto?.trim()) {
            newErrors.texto = "Texto do recado é obrigatório"
        } else if (formData.texto.trim().length < 2) {
            newErrors.texto = "Texto deve ter pelo menos 2 caracteres"
        } else if (formData.texto.trim().length > 200) {
            newErrors.texto = "Texto deve ter no máximo 200 caracteres"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            setSaving(true)
            setErrors({})

            const updateData: UpdateRecadoData = {
                texto: formData.texto?.trim(),
                lido: formData.lido,
            }

            await recadosService.update(parseInt(resolvedParams.id), updateData)
            router.push(`/recados/${resolvedParams.id}`)
        } catch (error: any) {
            console.error("Erro ao atualizar recado:", error)

            if (error.data?.message) {
                if (Array.isArray(error.data.message)) {
                    const newErrors: Record<string, string> = {}
                    error.data.message.forEach((msg: string) => {
                        if (msg.includes('texto')) newErrors.texto = msg
                    })
                    setErrors(newErrors)
                } else {
                    setErrors({ general: error.data.message })
                }
            } else {
                setErrors({ general: "Erro ao atualizar recado. Tente novamente." })
            }
        } finally {
            setSaving(false)
        }
    }

    const handleInputChange = (field: keyof UpdateRecadoData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
        setFormData({ ...formData, [field]: value })
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" })
        }
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR')
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <Link
                        href={`/recados/${resolvedParams.id}`}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para Detalhes
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Recado</h1>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Carregando dados do recado...</div>
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
                    href={`/recados/${resolvedParams.id}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Detalhes
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Recado</h1>
                <p className="text-gray-600">Atualize as informações do recado</p>
            </div>

            {errors.general && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{errors.general}</p>
                </div>
            )}

            <div className="space-y-6">
                {/* Informações do recado atual */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Atuais</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">De:</span> {recado.de?.nome || 'Nome não disponível'}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Para:</span> {recado.para?.nome || 'Nome não disponível'}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Enviado em:</span> {formatDateTime(recado.data)}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                recado.lido ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                {recado.lido ? 'Lido' : 'Não lido'}
              </span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Nota: Remetente e destinatário não podem ser alterados após a criação do recado.
                    </p>
                </div>

                {/* Formulário de edição */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-2xl">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Editar Recado</h2>
                        <p className="text-gray-600 mt-1">Atualize o texto e status do recado</p>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="texto" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mensagem
                                </label>
                                <textarea
                                    id="texto"
                                    value={formData.texto}
                                    onChange={handleInputChange('texto')}
                                    placeholder="Digite a mensagem do recado"
                                    rows={4}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.texto ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {errors.texto && (
                                        <p className="text-sm text-red-600">{errors.texto}</p>
                                    )}
                                    <p className="text-sm text-gray-500 ml-auto">
                                        {formData.texto?.length || 0}/200 caracteres
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="lido"
                                        checked={formData.lido}
                                        onChange={handleInputChange('lido')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="lido" className="ml-2 block text-sm text-gray-700">
                                        Marcar como lido
                                    </label>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Indica se o destinatário já visualizou este recado
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {saving ? "Salvando..." : "Salvar Alterações"}
                                </button>
                                <Link
                                    href={`/recados/${resolvedParams.id}`}
                                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors text-center"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}