"use client";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, CreditCard, Shield } from 'lucide-react'
import Link from "next/link"
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">Jesper</span>
                <Link href="/profile" className="text-sm text-blue-600 hover:underline">
                  Inställningar
                </Link>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <nav className="space-y-2 px-4 py-4">
              <Link 
                href="/userdashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 ${
                  pathname === '/userdashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Mina Försäkringar</span>
              </Link>
              <Link 
                href="/userdashboard/documents"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 ${
                  pathname === '/userdashboard/documents' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Dokument</span>
              </Link>
              <Link 
                href="/userdashboard/payments"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 ${
                  pathname === '/userdashboard/payments' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Betalningar</span>
              </Link>
            </nav>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}