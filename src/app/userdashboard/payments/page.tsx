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

// Sample payment data
const payments = [
  {
    id: 1,
    date: '2024-01-15',
    type: 'Livförsäkring',
    amount: '499 kr',
    status: 'Betald',
  },
  {
    id: 2,
    date: '2024-02-15',
    type: 'Livförsäkring',
    amount: '499 kr',
    status: 'Betald',
  },
  {
    id: 3,
    date: '2024-03-15',
    type: 'Inkomstbortfallsförsäkring',
    amount: '299 kr',
    status: 'Väntande',
  },
]

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Betalningar</h1>
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
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Väntande
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Betalningshistorik</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Försäkringstyp</TableHead>
                <TableHead>Belopp</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments
                .filter(payment => 
                  activeTab === 'all' || 
                  (activeTab === 'pending' && payment.status === 'Väntande')
                )
                .map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.date).toLocaleDateString('sv-SE')}</TableCell>
                    <TableCell>{payment.type}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'Betald'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment.status}
                      </span>
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

