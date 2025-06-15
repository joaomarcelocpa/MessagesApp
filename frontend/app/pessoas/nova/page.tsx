"use client"

import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { pessoasService } from "@/services"
import type { CreatePessoaData } from "@/services"

export default function NovaPessoaPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<CreatePessoaData>({
        nome: "",
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.nome.trim()) {
            newErrors.nome = "Nome é obrigatório"
        } else if (formData.nome.trim().length < 4) {
            newErrors.nome = "Nome deve ter pelo menos 4 caracteres"
        } else if (formData.nome.trim().length > 100) {
            newErrors.nome = "Nome deve ter no máximo 100 caracteres"
        }

        if (!formData.email.trim()) {
            newErrors.email = "E-mail é obrigatório"
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "E-mail inválido"
            }
        }

        if (!formData.password) {
            newErrors.password = "Senha é obrigatória"
        } else if (formData.password.length < 4) {
            newErrors.password = "Senha deve ter pelo menos 4 caracteres"
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

            await pessoasService.create(formData)
            router.push("/pessoas")
        } catch (error: any) {
            console.error("Erro ao criar pessoa:", error)

            if (error.status === 409) {
                setErrors({ email: "Este e-mail já está cadastrado" })
            } else if (error.data?.message) {
                if (Array.isArray(error.data.message)) {
                    const newErrors: Record<string, string> = {}
                    error.data.message.forEach((msg: string) => {
                        if (msg.includes('nome')) newErrors.nome = msg
                        if (msg.includes('email')) newErrors.email = msg
                        if (msg.includes('password')) newErrors.password = msg
                    })
                    setErrors(newErrors)
                } else {
                    setErrors({ general: error.data.message })
                }
            } else {
                setErrors({ general: "Erro ao cadastrar pessoa. Tente novamente." })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: keyof CreatePessoaData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({ ...formData, [field]: e.target.value })
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" })
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <Link
                    href="/pessoas"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Pessoas
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Nova Pessoa</h1>
                <p className="text-gray-600">Cadastre uma nova pessoa no sistema</p>
            </div>

            {errors.general && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{errors.general}</p>
                </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-2xl">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Informações da Pessoa</h2>
                    <p className="text-gray-600 mt-1">Preencha os dados abaixo para cadastrar uma nova pessoa</p>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                id="nome"
                                value={formData.nome}
                                onChange={handleInputChange('nome')}
                                placeholder="Digite o nome completo"
                                required
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.nome ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.nome && (
                                <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                placeholder="Digite o e-mail"
                                required
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                placeholder="Digite a senha"
                                required
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.password ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {loading ? "Cadastrando..." : "Cadastrar Pessoa"}
                            </button>
                            <Link
                                href="/pessoas"
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