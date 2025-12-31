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
  TrendingUp
} from 'lucide-react'
import { DTCCode, DTCSystem, DTCLibraryService } from '@/lib/dtc-library-service'

export default function DTCLibraryProfessional() {
  const [dtcCodes, setDtcCodes] = useState<DTCCode[]>([])
  const [filteredCodes, setFilteredCodes] = useState<DTCCode[]>([])
  const [selectedSystem, setSelectedSystem] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDTC, setSelectedDTC] = useState<DTCCode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSeeding, setIsSeeding] = useState(false)
  const [stats, setStats] = useState<{ [system: string]: number }>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'code' | 'severity' | 'system'>('code')

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

      if (result.success) {
        setStats(result.data)
      }
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

  // Get system info
  const getSystemInfo = (systemCode: string): DTCSystem | undefined => {
    return DTCLibraryService.SYSTEMS.find(s => s.code === systemCode)
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

  const sortedCodes = sortCodes(filteredCodes)
  const totalCodes = Object.values(stats).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Database className="w-4 h-4" />
            Library DTC Professional
          </div>
          <h1 className="text-4xl font-bold text-slate-900">
            Database Kode DTC Lengkap
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Koleksi lengkap Diagnostic Trouble Code dengan penjelasan bahasa Indonesia, 
            prosedur diagnosa, dan panduan perbaikan untuk teknisi otomotif profesional.
          </p>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{totalCodes}</div>
              <div className="text-sm text-slate-600">Total Kode DTC</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{DTCLibraryService.SYSTEMS.length}</div>
              <div className="text-sm text-slate-600">Sistem Kendaraan</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">{filteredCodes.length}</div>
              <div className="text-sm text-slate-600">Hasil Pencarian</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-sm text-slate-600">Merek Kendaraan</div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Cari kode DTC (contoh: P0171, P0300) atau deskripsi masalah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex gap-2">
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'code' | 'severity' | 'system')}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="code">Urutkan: Kode</option>
                  <option value="severity">Urutkan: Tingkat Bahaya</option>
                  <option value="system">Urutkan: Sistem</option>
                </select>

                <Button
                  variant="outline"
                  onClick={() => loadDTCCodes()}
                  disabled={isLoading}
                  className="h-10"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  onClick={seedDTCCodes}
                  disabled={isSeeding}
                  className="h-10"
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

        {/* System Filter Tabs */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Filter berdasarkan Sistem</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <button
                onClick={() => filterBySystem('ALL')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedSystem === 'ALL' 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Semua Sistem</div>
                    <div className="text-xs text-slate-500">{totalCodes} kode</div>
                  </div>
                </div>
              </button>

              {DTCLibraryService.SYSTEMS.map((system) => (
                <button
                  key={system.code}
                  onClick={() => filterBySystem(system.code)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedSystem === system.code 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">
                      {system.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{system.nameIndonesian}</div>
                      <div className="text-xs text-slate-500">{stats[system.code] || 0} kode</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid xl:grid-cols-3 gap-8">
          {/* DTC List */}
          <div className="xl:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <List className="w-5 h-5" />
                      Daftar Kode DTC
                      {selectedSystem !== 'ALL' && (
                        <Badge variant="outline" className="ml-2">
                          {getSystemInfo(selectedSystem)?.nameIndonesian}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {sortedCodes.length} kode DTC ditemukan
                      {searchTerm && ` untuk "${searchTerm}"`}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
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
                      <p className="text-lg font-medium mb-2">Tidak ada kode DTC ditemukan</p>
                      <p className="text-sm">
                        {searchTerm ? 
                          `Coba kata kunci lain atau hapus filter pencarian` :
                          'Pilih sistem atau gunakan pencarian untuk menemukan kode DTC'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {sortedCodes.map((dtc) => (
                        <div
                          key={dtc.id}
                          className={`p-4 cursor-pointer hover:bg-slate-50 transition-all ${
                            selectedDTC?.id === dtc.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => setSelectedDTC(dtc)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-lg text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {dtc.code}
                              </span>
                              {getSeverityBadge(dtc.severity)}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <span className="text-lg">{getSystemInfo(dtc.system)?.icon}</span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                          <h4 className="font-medium text-slate-900 mb-2 line-clamp-2">
                            {dtc.descriptionIndonesian}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <span>{getSystemInfo(dtc.system)?.icon}</span>
                              {getSystemInfo(dtc.system)?.nameIndonesian}
                            </span>
                            {dtc.subsystem && (
                              <span>• {dtc.subsystem}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DTC Detail Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Detail Kode DTC
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDTC ? (
                    <div className="space-y-6">
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                          <TabsTrigger value="overview" className="text-sm">Info & Gejala</TabsTrigger>
                          <TabsTrigger value="technical" className="text-sm">Teknis & Perbaikan</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                          <div className="text-center pb-4 border-b">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <span className="font-mono font-bold text-2xl text-blue-600">
                                {selectedDTC.code}
                              </span>
                              {getSeverityBadge(selectedDTC.severity)}
                            </div>
                            <h3 className="font-semibold text-lg text-slate-900 mb-2">
                              {selectedDTC.descriptionIndonesian}
                            </h3>
                            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                              <span>{getSystemInfo(selectedDTC.system)?.icon}</span>
                              <span>{getSystemInfo(selectedDTC.system)?.nameIndonesian}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-orange-600">
                              <AlertTriangle className="w-4 h-4" />
                              Gejala yang Muncul
                            </h4>
                            <ul className="space-y-2">
                              {selectedDTC.symptoms.map((symptom, index) => (
                                <li key={index} className="text-sm text-slate-700 flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                                  <span className="text-orange-500 mt-0.5">•</span>
                                  {symptom}
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
                                <li key={index} className="text-sm text-slate-700 flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                                  <span className="text-red-500 mt-0.5">•</span>
                                  {cause}
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

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2 text-purple-600">
                                <Zap className="w-4 h-4" />
                                Sensor
                              </h4>
                              <div className="space-y-1">
                                {selectedDTC.relatedSensors.map((sensor, index) => (
                                  <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                                    {sensor}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2 text-indigo-600">
                                <Settings className="w-4 h-4" />
                                Aktuator
                              </h4>
                              <div className="space-y-1">
                                {selectedDTC.relatedActuators.map((actuator, index) => (
                                  <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
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
                        gejala, diagnosa, dan prosedur perbaikan.
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
            <strong>Catatan Profesional:</strong> Database DTC ini disusun berdasarkan standar OBD-II internasional 
            dan pengalaman praktis teknisi otomotif bersertifikat. Selalu lakukan diagnosa menyeluruh dan ikuti 
            prosedur keselamatan sebelum melakukan perbaikan. Data ini mendukung kendaraan Indonesia 15 tahun terakhir.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}