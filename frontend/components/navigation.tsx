"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, Users } from "lucide-react"

export function Navigation() {
    const pathname = usePathname()

    const navigation = [
        { name: "Início", href: "/", icon: Home },
        { name: "Recados", href: "/recados", icon: MessageSquare },
        { name: "Pessoas", href: "/pessoas", icon: Users },
    ]

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl font-bold text-gray-900">
                            Sistema de Recados
                        </Link>

                        <div className="hidden md:flex space-x-4">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
