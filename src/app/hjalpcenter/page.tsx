'use client'

import { useState } from 'react'
import { Search, FileText, MessageSquare, HelpCircle, MessageCircle } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HelpCenter() {
  const [showChat, setShowChat] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-transparent pb-32 pt-16">
        <div className="container mx-auto px-4">
          <div className="relative z-10">
            <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Hjälpcenter
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
              Hitta svar på dina frågor om våra försäkringar och tjänster
            </p>
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input 
                  type="search"
                  placeholder="Sök efter hjälpartiklar..."
                  className="w-full pl-10 pr-4 py-6 text-lg"
                />
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4">
            <div className="relative h-72 w-72 rotate-12">
              <div className="absolute h-32 w-32 rounded-lg bg-purple-200 transform rotate-45"></div>
              <div className="absolute left-20 top-20 h-24 w-24 rounded-lg bg-blue-200 transform -rotate-12"></div>
              <div className="absolute right-0 bottom-0 h-28 w-28 rounded-lg bg-pink-200 transform rotate-90"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Solution Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Utforska efter ämne
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <FileText className="h-8 w-8 text-purple-600" />
              <CardTitle className="mt-4">Allmän Information</CardTitle>
              <CardDescription>
                Grundläggande information om våra försäkringar och tjänster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start">
                Läs mer →
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <CardTitle className="mt-4">Support och Ärenden</CardTitle>
              <CardDescription>
                Få hjälp med dina försäkringsärenden och frågor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start">
                Läs mer →
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <HelpCircle className="h-8 w-8 text-purple-600" />
              <CardTitle className="mt-4">Hjälpcenter</CardTitle>
              <CardDescription>
                Vanliga frågor och svar om våra tjänster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start">
                Läs mer →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Öppna chat</span>
      </button>

      {/* Chat Window (simplified) */}
      {showChat && (
        <div className="fixed bottom-24 right-8 w-96 rounded-lg bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-lg font-semibold">Chatta med oss</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="h-64 overflow-y-auto py-4">
            <p className="text-gray-600">
              Hur kan vi hjälpa dig idag?
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

