'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText } from 'lucide-react'

// Sample document data
const documents = [
  {
    id: 1,
    name: 'Livförsäkring - Villkor',
    type: 'Försäkringsvillkor',
    date: '2024-01-01',
    fileUrl: '/path-to-pdf/livforsakring-villkor.pdf',
  },
  {
    id: 2,
    name: 'Inkomstbortfallsförsäkring - Villkor',
    type: 'Försäkringsvillkor',
    date: '2024-01-01',
    fileUrl: '/path-to-pdf/inkomstbortfall-villkor.pdf',
  },
  {
    id: 3,
    name: 'Årlig försäkringsöversikt',
    type: 'Årssammanställning',
    date: '2024-03-15',
    fileUrl: '/path-to-pdf/arssammanstallning.pdf',
  },
]

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dokument</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Alla
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'policies'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Försäkringsvillkor
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dina dokument</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dokument</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Åtgärd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents
                .filter(doc => 
                  activeTab === 'all' || 
                  (activeTab === 'policies' && doc.type === 'Försäkringsvillkor')
                )
                .map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{new Date(doc.date).toLocaleDateString('sv-SE')}</TableCell>
                    <TableCell>
                      <a 
                        href={doc.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 text-purple-600 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
                      >
                        <FileText size={16} />
                        <span className="sr-only">Öppna PDF</span>
                      </a>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

