'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Car,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react'

interface DiagnosisHistory {
  id: string
  brand: string
  model: string
  year: string
  mileage: number
  complaint: string
  status: string
  createdAt: string
}

interface DiagnosisHistoryProps {
  onNewDiagnosis?: () => void
  onViewDiagnosis?: (id: string) => void
}

export default function DiagnosisHistory({ onNewDiagnosis, onViewDiagnosis }: DiagnosisHistoryProps) {
  const [diagnoses, setDiagnoses] = useState<DiagnosisHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDiagnoses, setFilteredDiagnoses] = useState<DiagnosisHistory[]>([])

  const mockData: DiagnosisHistory[] = [
    {
      id: '1',
      brand: 'Toyota',
      model: 'Avanza',
      year: '2018',
      mileage: 85000,
      complaint: 'Mesin brebet saat akselerasi',
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '2',
      brand: 'Honda',
      model: 'Civic',
      year: '2015',
      mileage: 120000,
      complaint: 'Lampu check engine menyala',
      status: 'completed',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '3',
      brand: 'Mitsubishi',
      model: 'Pajero Sport',
      year: '2020',
      mileage: 45000,
      complaint: 'Getaran di setir saat 80-100 km/h',
      status: 'completed',
      createdAt: new Date(Date.now() - 345600000).toISOString()
    }
  ]

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setDiagnoses(mockData)
      setFilteredDiagnoses(mockData)
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDiagnoses(diagnoses)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredDiagnoses(
        diagnoses.filter(d =>
          d.brand.toLowerCase().includes(term) ||
          d.model.toLowerCase().includes(term) ||
          d.complaint.toLowerCase().includes(term) ||
          d.year.includes(term)
        )
      )
    }
  }, [searchTerm, diagnoses])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Selesai</Badge>
      case 'analyzing':
        return <Badge className="bg-blue-100 text-blue-800 text-xs"><Clock className="w-3 h-3 mr-1" />Analisa</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800 text-xs"><XCircle className="w-3 h-3 mr-1" />Error</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Kemarin'
    if (diffDays < 7) return `${diffDays} hari lalu`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 text-sm">Memuat riwayat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Cari diagnosa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {onNewDiagnosis && (
              <Button
                onClick={onNewDiagnosis}
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
              >
                + Baru
              </Button>
            )}
          </div>
          <p className="text-xs text-slate-500 text-center">
            {filteredDiagnoses.length} dari {diagnoses.length} diagnosa
          </p>
        </CardContent>
      </Card>

      {/* History List - Cards for all screens (mobile-first) */}
      {filteredDiagnoses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Car className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">Tidak ada diagnosa yang sesuai</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDiagnoses.map((diagnosis) => (
            <Card key={diagnosis.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">
                          {diagnosis.brand} {diagnosis.model}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {diagnosis.year} • {diagnosis.mileage.toLocaleString()} km
                        </p>
                      </div>
                      {getStatusBadge(diagnosis.status)}
                    </div>

                    <p className="text-sm text-slate-700 mb-2 line-clamp-2">
                      {diagnosis.complaint}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(diagnosis.createdAt)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDiagnosis?.(diagnosis.id)}
                        className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Lihat
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
