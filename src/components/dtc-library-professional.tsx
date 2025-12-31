'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Database,
  Wrench,
  Zap,
  Settings,
  Car,
  Info,
  BookOpen,
  Target,
  ChevronRight,
  Grid3X3,
  List,
  Download,
} from 'lucide-react'
import { DTCCode, DTCSystem, DTCLibraryService } from '@/lib/dtc-library-service'

export default function DTCLibraryProfessional() {
  const [dtcCodes, setDtcCodes] = useState<DTCCode[]>([])
  const [filteredCodes, setFilteredCodes] = useState<DTCCode[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDTC, setSelectedDTC] = useState<DTCCode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSeeding, setIsSeeding] = useState(false)
  const [showEducation, setShowEducation] = useState(false)

  // Load DTC codes
  const loadDTCCodes = async (system?: string) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (system && system !== 'ALL') {
        params.append('system', system)
      }

      const response = await fetch(`/api/dtc-library?${params}`)
      const result = await response.json()

      if (result.success) {
        setDtcCodes(result.data)
        setFilteredCodes(result.data)
      }
    } catch (error) {
      console.error('Error loading DTC codes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await fetch('/api/dtc-library/stats')
      const result = await response.json()
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  // Seed DTC codes
  const seedDTCCodes = async () => {
    try {
      setIsSeeding(true)
      const response = await fetch('/api/dtc-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed' })
      })

      const result = await response.json()
      if (result.success) {
        alert('DTC codes berhasil di-seed ke database!')
        loadDTCCodes()
        loadStats()
      } else {
        alert('Gagal seed DTC codes: ' + result.error)
      }
    } catch (error) {
      console.error('Error seeding DTC codes:', error)
      alert('Gagal seed DTC codes')
    } finally {
      setIsSeeding(false)
    }
  }

  // Search DTC codes
  const searchDTCCodes = async (term: string) => {
    if (!term.trim()) {
      setFilteredCodes(dtcCodes)
      return
    }

    try {
      const response = await fetch(`/api/dtc-library?search=${encodeURIComponent(term)}`)
      const result = await response.json()

      if (result.success) {
        setFilteredCodes(result.data)
      }
    } catch (error) {
      console.error('Error searching DTC codes:', error)
    }
  }

  // Filter by system
  const filterBySystem = (system: string) => {
    setSelectedSystem(system)
    if (system === 'ALL') {
      setFilteredCodes(dtcCodes)
    } else {
      setFilteredCodes(dtcCodes.filter(dtc => dtc.system === system))
    }
  }

  // Sort codes
  const sortCodes = (codes: DTCCode[]) => {
    return [...codes].sort((a, b) => {
      switch (sortBy) {
        case 'code':
          return a.code.localeCompare(b.code)
        case 'severity':
          const severityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 }
          return (severityOrder[a.severity as keyof typeof severityOrder] || 4) - 
                 (severityOrder[b.severity as keyof typeof severityOrder] || 4)
        case 'system':
          return a.system.localeCompare(b.system)
        default:
          return 0
      }
    })
  }

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Kritis
          </Badge>
        )
      case 'HIGH':
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Tinggi
          </Badge>
        )
      case 'MEDIUM':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Sedang
          </Badge>
        )
      case 'LOW':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Rendah
          </Badge>
        )
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  // OBD-II Structure helpers
  const getSystemInfo = (code: string) => {
    const firstChar = code.charAt(0)
    switch (firstChar) {
      case 'P': return { name: 'Powertrain', desc: 'Mesin, transmisi, dan sistem emisi', color: 'blue', icon: '🔧' }
      case 'B': return { name: 'Body', desc: 'Interior, airbag, dan fitur kenyamanan', color: 'green', icon: '🚗' }
      case 'C': return { name: 'Chassis', desc: 'Rem (ABS), suspensi, dan kemudi', color: 'orange', icon: '⚙️' }
      case 'U': return { name: 'Network', desc: 'Komunikasi data antar modul (CAN bus)', color: 'purple', icon: '📡' }
      default: return { name: 'Unknown', desc: 'Sistem tidak dikenal', color: 'gray', icon: '❓' }
    }
  }

  const getTypeInfo = (code: string) => {
    const secondChar = code.charAt(1)
    switch (secondChar) {
      case '0': return { name: 'Standar SAE', desc: 'Kode standar umum (SAE)', color: 'blue' }
      case '1': return { name: 'Khusus Pabrikan', desc: 'Kode khusus pabrikan (Toyota, Honda, dll)', color: 'green' }
      default: return { name: 'Lainnya', desc: 'Tipe kode lainnya', color: 'gray' }
    }
  }

  const getSubsystemInfo = (code: string) => {
    const thirdChar = code.charAt(2)
    switch (thirdChar) {
      case '1':
      case '2': return { name: 'Udara/Bahan Bakar', desc: 'Pengaturan udara dan bahan bakar', color: 'red' }
      case '3': return { name: 'Sistem Pengapian', desc: 'Sistem pengapian (misfire)', color: 'orange' }
      case '4': return { name: 'Kontrol Emisi', desc: 'Kontrol emisi tambahan', color: 'green' }
      case '5': return { name: 'Kecepatan/Idle', desc: 'Kontrol kecepatan dan idle', color: 'blue' }
      case '6': return { name: 'Komputer/Output', desc: 'Komputer dan output circuit', color: 'purple' }
      case '7':
      case '8': return { name: 'Transmisi', desc: 'Sistem transmisi', color: 'indigo' }
      default: return { name: 'Lainnya', desc: 'Sub-sistem lainnya', color: 'gray' }
    }
  }

  // Enhanced filtering
  const applyFilters = () => {
    setFilteredCodes(dtcCodes)
  }

  // Load data on mount
  useEffect(() => {
    loadDTCCodes()
    loadStats()
  }, [])

  // Handle search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchDTCCodes(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Apply filters when filter states change
  useEffect(() => {
    applyFilters()
  }, [dtcCodes])

  const sortedCodes = [...filteredCodes].sort((a, b) => a.code.localeCompare(b.code))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Database className="w-4 h-4" />
            OBD-II Diagnostic Trouble Codes
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Database Kode DTC Lengkap
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
            Koleksi lengkap Diagnostic Trouble Code berstandar OBD-II dengan penjelasan bahasa Indonesia, 
            struktur kode sistematis, dan panduan perbaikan untuk teknisi otomotif profesional.
          </p>
          
          {/* OBD-II Education Toggle */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowEducation(!showEducation)}
              className="text-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {showEducation ? 'Sembunyikan' : 'Pelajari'} Struktur OBD-II
            </Button>
          </div>

          {/* OBD-II Education Panel */}
          {showEducation && (
            <Card className="text-left max-w-4xl mx-auto mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Memahami Struktur Kode DTC OBD-II
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">Format Kode: [Huruf][4 Angka]</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-mono text-lg font-bold text-center mb-2">P 0 4 2 0</div>
                      <div className="text-sm space-y-1">
                        <div><span className="font-semibold">P:</span> Sistem (Powertrain)</div>
                        <div><span className="font-semibold">0:</span> Tipe (Standar SAE)</div>
                        <div><span className="font-semibold">4:</span> Sub-sistem (Kontrol Emisi)</div>
                        <div><span className="font-semibold">20:</span> Identifikasi Spesifik</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">Sistem Utama (Huruf Pertama)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <span className="font-mono font-bold">P</span>
                        <span>Powertrain - Mesin, transmisi, emisi</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <span className="font-mono font-bold">B</span>
                        <span>Body - Interior, airbag, kenyamanan</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <span className="font-mono font-bold">C</span>
                        <span>Chassis - Rem, suspensi, kemudi</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                        <span className="font-mono font-bold">U</span>
                        <span>Network - Komunikasi data modul</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-orange-600">Tipe Kode (Angka Pertama)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <span className="font-mono font-bold">0</span>
                        <span>Standar SAE - Kode universal</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <span className="font-mono font-bold">1</span>
                        <span>Khusus Pabrikan - Toyota, Honda, dll</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-purple-600">Sub-sistem (Angka Kedua)</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-mono font-bold">1-2:</span> Udara/Bahan Bakar</div>
                      <div><span className="font-mono font-bold">3:</span> Sistem Pengapian</div>
                      <div><span className="font-mono font-bold">4:</span> Kontrol Emisi</div>
                      <div><span className="font-mono font-bold">5:</span> Kecepatan/Idle</div>
                      <div><span className="font-mono font-bold">6:</span> Komputer/Output</div>
                      <div><span className="font-mono font-bold">7-8:</span> Transmisi</div>
                    </div>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Contoh Umum:</strong> P0300 (Misfire acak), P0420 (Katalis tidak efisien), 
                    P0171 (Campuran terlalu miskin). Gunakan OBD-II Scanner untuk membaca kode dari port 16-pin kendaraan.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
          

        </div>

        {/* Search Section */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Cari kode DTC (P0171, P0300) atau deskripsi masalah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-white shadow-sm"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {/* Control Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadDTCCodes()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  size="sm"
                  onClick={seedDTCCodes}
                  disabled={isSeeding}
                >
                  {isSeeding ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="w-4 h-4 mr-2" />
                  )}
                  Seed Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - DTC List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DTC List */}
          <div>
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <List className="w-5 h-5" />
                  Daftar Kode DTC
                  {searchTerm && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Hasil pencarian: "{searchTerm}"
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {sortedCodes.length} kode DTC {searchTerm ? 'ditemukan' : 'tersedia'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[700px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-slate-600">Memuat kode DTC...</p>
                      </div>
                    </div>
                  ) : sortedCodes.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium mb-2">
                        {searchTerm ? 'Tidak ada kode DTC ditemukan' : 'Belum ada data DTC'}
                      </p>
                      <p className="text-sm">
                        {searchTerm ? 
                          `Coba kata kunci lain untuk "${searchTerm}"` :
                          'Klik tombol Seed Data untuk memuat kode DTC'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {sortedCodes.map((dtc, index) => {
                        const systemInfo = getSystemInfo(dtc.code)
                        
                        return (
                          <div
                            key={`${dtc.code}-${dtc.system}-${index}`}
                            className={`p-4 cursor-pointer hover:bg-slate-50 transition-all ${
                              selectedDTC?.id === dtc.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                            }`}
                            onClick={() => setSelectedDTC(dtc)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="font-mono font-bold text-lg text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">
                                  {dtc.code}
                                </span>
                                {getSeverityBadge(dtc.severity)}
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            </div>
                            
                            <h4 className="font-medium text-slate-900 mb-2 line-clamp-2">
                              {dtc.descriptionIndonesian}
                            </h4>
                            
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <span className="text-lg">{systemInfo.icon}</span>
                              <span>{systemInfo.name}</span>
                              <span className="text-slate-400">•</span>
                              <span>{systemInfo.desc}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DTC Detail Panel */}
          <div>
            <div className="lg:sticky lg:top-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="w-5 h-5" />
                    Detail Kode DTC
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedDTC ? (
                    <div className="space-y-6">
                      {/* DTC Header with OBD-II Structure */}
                      <div className="text-center pb-4 border-b">
                        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                          <span className="font-mono font-bold text-2xl text-blue-600">
                            {selectedDTC.code}
                          </span>
                          {getSeverityBadge(selectedDTC.severity)}
                        </div>
                        <h3 className="font-semibold text-lg text-slate-900 mb-4">
                          {selectedDTC.descriptionIndonesian}
                        </h3>
                        
                        {/* OBD-II Structure Breakdown */}
                        <div className="bg-slate-50 rounded-lg p-4 text-left">
                          <h4 className="font-semibold text-sm text-slate-700 mb-3">Struktur Kode OBD-II:</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-lg text-blue-600 w-6">
                                {selectedDTC.code.charAt(0)}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium">{getSystemInfo(selectedDTC.code).name}</div>
                                <div className="text-slate-500 text-xs">{getSystemInfo(selectedDTC.code).desc}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-lg text-green-600 w-6">
                                {selectedDTC.code.charAt(1)}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium">{getTypeInfo(selectedDTC.code).name}</div>
                                <div className="text-slate-500 text-xs">{getTypeInfo(selectedDTC.code).desc}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-lg text-orange-600 w-6">
                                {selectedDTC.code.charAt(2)}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium">{getSubsystemInfo(selectedDTC.code).name}</div>
                                <div className="text-slate-500 text-xs">{getSubsystemInfo(selectedDTC.code).desc}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-lg text-purple-600 w-6">
                                {selectedDTC.code.slice(3)}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium">Identifikasi Spesifik</div>
                                <div className="text-slate-500 text-xs">Kode unik untuk masalah tertentu</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 h-auto">
                          <TabsTrigger value="overview" className="text-sm py-2">Info & Gejala</TabsTrigger>
                          <TabsTrigger value="technical" className="text-sm py-2">Teknis & Perbaikan</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-orange-600">
                              <AlertTriangle className="w-4 h-4" />
                              Gejala yang Muncul
                            </h4>
                            <ul className="space-y-2">
                              {selectedDTC.symptoms.map((symptom, index) => (
                                <li key={index} className="text-sm text-slate-700 flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                                  <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
                                  <span>{symptom}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                              <Target className="w-4 h-4" />
                              Kemungkinan Penyebab
                            </h4>
                            <ul className="space-y-2">
                              {selectedDTC.possibleCauses.map((cause, index) => (
                                <li key={index} className="text-sm text-slate-700 flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                                  <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                                  <span>{cause}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TabsContent>

                        <TabsContent value="technical" className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-600">
                              <Search className="w-4 h-4" />
                              Langkah Diagnosa
                            </h4>
                            <ol className="space-y-2">
                              {selectedDTC.diagnosticSteps.map((step, index) => (
                                <li key={index} className="text-sm text-slate-700 flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  <span className="flex-1">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                              <Wrench className="w-4 h-4" />
                              Prosedur Perbaikan
                            </h4>
                            <ol className="space-y-2">
                              {selectedDTC.repairProcedures.map((procedure, index) => (
                                <li key={index} className="text-sm text-slate-700 flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  <span className="flex-1">{procedure}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2 text-purple-600">
                                <Zap className="w-4 h-4" />
                                Sensor Terkait
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {selectedDTC.relatedSensors.map((sensor, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {sensor}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2 text-indigo-600">
                                <Settings className="w-4 h-4" />
                                Aktuator Terkait
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {selectedDTC.relatedActuators.map((actuator, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {actuator}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {selectedDTC.applicableVehicles && selectedDTC.applicableVehicles.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-600">
                                <Car className="w-4 h-4" />
                                Kendaraan yang Berlaku
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {selectedDTC.applicableVehicles.map((vehicle, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {vehicle}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium mb-2">Pilih Kode DTC</p>
                      <p className="text-sm">
                        Klik salah satu kode DTC dari daftar untuk melihat detail lengkap, 
                        struktur OBD-II, gejala, diagnosa, dan prosedur perbaikan.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Standar OBD-II:</strong> Database ini mengikuti standar On-Board Diagnostics II 
            dengan struktur kode sistematis. Gunakan OBD-II Scanner pada port 16-pin kendaraan untuk 
            membaca kode. Aplikasi seperti Torque Pro atau Car Scanner ELM OBD2 dapat membantu diagnosa. 
            Data mendukung kendaraan Indonesia 15 tahun terakhir.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}