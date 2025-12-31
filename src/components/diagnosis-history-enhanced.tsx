'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Search,
  Calendar,
  Car,
  FileText,
  Trash2,
  Eye,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2
} from 'lucide-react'
import { DiagnosisResult } from '@/lib/diagnosis-service'

interface DiagnosisHistoryProps {
  onViewDiagnosis: (diagnosisId: string, aiAnalysis: any) => void
  onNewDiagnosis: () => void
}

export default function DiagnosisHistoryEnhanced({ 
  onViewDiagnosis, 
  onNewDiagnosis 
}: DiagnosisHistoryProps) {
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  })

  // Load diagnoses
  const loadDiagnoses = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: refresh ? '0' : pagination.offset.toString()
      })

      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/diagnosis?${params}`)
      const result = await response.json()

      if (result.success) {
        if (refresh) {
          setDiagnoses(result.data)
          setPagination({
            ...result.pagination,
            offset: 0
          })
        } else {
          setDiagnoses(prev => 
            pagination.offset === 0 ? result.data : [...prev, ...result.data]
          )
          setPagination(result.pagination)
        }
      }
    } catch (error) {
      console.error('Error loading diagnoses:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Load more diagnoses
  const loadMore = () => {
    setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))
  }

  // Delete diagnosis
  const deleteDiagnosis = async (diagnosisId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus diagnosis ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/diagnosis/${diagnosisId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setDiagnoses(prev => prev.filter(d => d.id !== diagnosisId))
        alert('Diagnosis berhasil dihapus')
      } else {
        alert('Gagal menghapus diagnosis')
      }
    } catch (error) {
      console.error('Error deleting diagnosis:', error)
      alert('Gagal menghapus diagnosis')
    }
  }

  // Filter diagnoses
  const filteredDiagnoses = diagnoses.filter(diagnosis => {
    const matchesSearch = searchTerm === '' || 
      diagnosis.vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.symptoms.complaint.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Selesai
          </Badge>
        )
      case 'ANALYZING':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Menganalisa
          </Badge>
        )
      case 'ERROR':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Load data on mount and when filters change
  useEffect(() => {
    loadDiagnoses()
  }, [statusFilter])

  // Load more when offset changes
  useEffect(() => {
    if (pagination.offset > 0) {
      loadDiagnoses()
    }
  }, [pagination.offset])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Riwayat Diagnosis</h2>
          <p className="text-sm text-slate-600">
            {pagination.total} diagnosis tersimpan
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => loadDiagnoses(true)}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button onClick={onNewDiagnosis}>
            <FileText className="w-4 h-4 mr-2" />
            Diagnosis Baru
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Cari berdasarkan merek, model, atau keluhan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="COMPLETED">Selesai</SelectItem>
                  <SelectItem value="ANALYZING">Menganalisa</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis List */}
      {isLoading && diagnoses.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">Memuat riwayat diagnosis...</span>
        </div>
      ) : filteredDiagnoses.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {searchTerm ? 
              `Tidak ada diagnosis yang cocok dengan pencarian "${searchTerm}"` :
              'Belum ada riwayat diagnosis. Mulai diagnosis baru untuk melihat riwayat.'
            }
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {filteredDiagnoses.map((diagnosis) => (
            <Card key={diagnosis.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Car className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-lg">
                        {diagnosis.vehicle.brand} {diagnosis.vehicle.model} ({diagnosis.vehicle.year})
                      </h3>
                      {getStatusBadge(diagnosis.status)}
                    </div>
                    
                    <p className="text-slate-600 mb-2 line-clamp-2">
                      <strong>Keluhan:</strong> {diagnosis.symptoms.complaint}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(diagnosis.createdAt)}
                      </div>
                      <div>
                        Engine: {diagnosis.vehicle.engineCode || 'Tidak diketahui'}
                      </div>
                      <div>
                        {diagnosis.vehicle.mileage.toLocaleString()} km
                      </div>
                      {diagnosis.aiAnalysis && (
                        <div>
                          Confidence: {Math.round((diagnosis.aiAnalysis.confidence || 0) * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDiagnosis(diagnosis.id, diagnosis.aiAnalysis)}
                      disabled={!diagnosis.aiAnalysis}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDiagnosis(diagnosis.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More */}
      {pagination.hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              'Muat Lebih Banyak'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}