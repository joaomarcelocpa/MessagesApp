"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { recadosService, pessoasService } from "@/services"
import type { CreateRecadoData } from "@/services"

export default function NovoRecadoPage() {
    const router = useRouter()
    const [pessoas, setPessoas] = useState<Array<{ id: number; nome: string }>>([])
    const [formData, setFormData] = useState({
        texto: "",
        deId: "",
        paraId: "",
    })
    const [loading, setLoading] = useState(false)
    const [loadingPessoas, setLoadingPessoas] = useState(true)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        const loadPessoas = async () => {
            try {
                setLoadingPessoas(true)
                const data = await pessoasService.getPessoasForSelect()
                setPessoas(data)
            } catch (error) {
                console.error("Erro ao carregar pessoas:", error)
                setErrors({ general: "Erro ao carregar lista de pessoas" })
            } finally {
                setLoadingPessoas(false)
            }
        }

        loadPessoas()
    }, [])

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.texto.trim()) {
            newErrors.texto = "Texto do recado é obrigatório"
        } else if (formData.texto.trim().length < 2) {
            newErrors.texto = "Texto deve ter pelo menos 2 caracteres"
        } else if (formData.texto.trim().length > 200) {
            newErrors.texto = "Texto deve ter no máximo 200 caracteres"
        }

        if (!formData.deId) {
            newErrors.deId = "Selecione o remetente"
        }

        if (!formData.paraId) {
            newErrors.paraId = "Selecione o destinatário"
        }

        if (formData.deId && formData.paraId && formData.deId === formData.paraId) {
            newErrors.paraId = "O remetente e destinatário devem ser diferentes"
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
            setLoading(true)
            setErrors({})

            const recadoData: CreateRecadoData = {
                texto: formData.texto.trim(),
                deId: parseInt(formData.deId),
                paraId: parseInt(formData.paraId),
            }

            await recadosService.create(recadoData)
            router.push("/recados")
        } catch (error: any) {
            console.error("Erro ao criar recado:", error)

            if (error.data?.message) {
                if (Array.isArray(error.data.message)) {
                    const newErrors: Record<string, string> = {}
                    error.data.message.forEach((msg: string) => {
                        if (msg.includes('texto')) newErrors.texto = msg
                        if (msg.includes('deId')) newErrors.deId = msg
                        if (msg.includes('paraId')) newErrors.paraId = msg
                    })
                    setErrors(newErrors)
                } else {
                    setErrors({ general: error.data.message })
                }
            } else {
                setErrors({ general: "Erro ao criar recado. Tente novamente." })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [field]: e.target.value })
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" })
        }
    }

    if (loadingPessoas) {
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Recado</h1>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Carregando formulário...</div>
                </div>
            </div>
        )
    }

    if (pessoas.length === 0) {
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Recado</h1>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-yellow-800 mb-2">
                        Nenhuma pessoa cadastrada
                    </h3>
                    <p className="text-yellow-700 mb-4">
                        Para criar recados, é necessário ter pelo menos 2 pessoas cadastradas no sistema.
                    </p>
                    <div className="flex gap-2">
                        <Link
                            href="/pessoas/nova"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                        >
                            Cadastrar Primeira Pessoa
                        </Link>
                        <Link
                            href="/pessoas"
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                        >
                            Ver Pessoas
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (pessoas.length < 2) {
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Recado</h1>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-yellow-800 mb-2">
                        Poucas pessoas cadastradas
                    </h3>
                    <p className="text-yellow-700 mb-4">
                        Para criar recados, é necessário ter pelo menos 2 pessoas cadastradas no sistema.
                        Atualmente há apenas {pessoas.length} pessoa(s) cadastrada(s).
                    </p>
                    <Link
                        href="/pessoas/nova"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        Cadastrar Mais Pessoas
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Recado</h1>
                <p className="text-gray-600">Crie um novo recado para enviar</p>
            </div>

            {errors.general && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{errors.general}</p>
                </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-2xl">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Informações do Recado</h2>
                    <p className="text-gray-600 mt-1">Preencha os dados abaixo para criar um novo recado</p>
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
                                    {formData.texto.length}/200 caracteres
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="de" className="block text-sm font-medium text-gray-700 mb-2">
                                    De (Remetente)
                                </label>
                                <select
                                    id="de"
                                    value={formData.deId}
                                    onChange={handleInputChange('deId')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.deId ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Selecione o remetente</option>
                                    {pessoas.map((pessoa) => (
                                        <option key={pessoa.id} value={pessoa.id.toString()}>
                                            {pessoa.nome}
                                        </option>
                                    ))}
                                </select>
                                {errors.deId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.deId}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="para" className="block text-sm font-medium text-gray-700 mb-2">
                                    Para (Destinatário)
                                </label>
                                <select
                                    id="para"
                                    value={formData.paraId}
                                    onChange={handleInputChange('paraId')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.paraId ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Selecione o destinatário</option>
                                    {pessoas
                                        .filter(pessoa => pessoa.id.toString() !== formData.deId)
                                        .map((pessoa) => (
                                            <option key={pessoa.id} value={pessoa.id.toString()}>
                                                {pessoa.nome}
                                            </option>
                                        ))}
                                </select>
                                {errors.paraId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.paraId}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {loading ? "Criando..." : "Criar Recado"}
                            </button>
                            <Link
                                href="/recados"
                                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors text-center"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}