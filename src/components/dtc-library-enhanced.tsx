'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
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
  Target
} from 'lucide-react'
import { DTCCode, DTCSystem, DTCLibraryService } from '@/lib/dtc-library-service'

export default function DTCLibraryEnhanced() {
  const [dtcCodes, setDtcCodes] = useState<DTCCode[]>([])
  const [filteredCodes, setFilteredCodes] = useState<DTCCode[]>([])
  const [selectedSystem, setSelectedSystem] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDTC, setSelectedDTC] = useState<DTCCode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSeeding, setIsSeeding] = useState(false)
  const [stats, setStats] = useState<{ [system: string]: number }>({})

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

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Kritis
          </Badge>
        )
      case 'HIGH':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Tinggi
          </Badge>
        )
      case 'MEDIUM':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Sedang
          </Badge>
        )
      case 'LOW':
        return (
          <Badge className="bg-green-100 text-green-800">
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Library DTC Lengkap</h2>
          <p className="text-sm text-slate-600">
            Database lengkap kode DTC (Diagnostic Trouble Code) dengan penjelasan bahasa Indonesia
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => loadDTCCodes()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button
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

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Cari kode DTC (contoh: P0171, P0300)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedSystem === 'ALL' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => filterBySystem('ALL')}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-slate-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="font-semibold text-sm">Semua Sistem</h3>
            <p className="text-xs text-slate-500 mt-1">
              {Object.values(stats).reduce((a, b) => a + b, 0)} kode
            </p>
          </CardContent>
        </Card>

        {DTCLibraryService.SYSTEMS.map((system) => (
          <Card
            key={system.code}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedSystem === system.code ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => filterBySystem(system.code)}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-slate-100 rounded-lg flex items-center justify-center text-lg">
                {system.icon}
              </div>
              <h3 className="font-semibold text-sm">{system.nameIndonesian}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {stats[system.code] || 0} kode
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DTC Codes List and Detail */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* DTC List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Daftar Kode DTC
              {selectedSystem !== 'ALL' && (
                <Badge variant="outline">
                  {getSystemInfo(selectedSystem)?.nameIndonesian}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {filteredCodes.length} kode DTC ditemukan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-slate-600">Memuat kode DTC...</span>
                </div>
              ) : filteredCodes.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  {searchTerm ? 
                    `Tidak ada kode DTC yang cocok dengan "${searchTerm}"` :
                    'Tidak ada kode DTC ditemukan'
                  }
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCodes.map((dtc) => (
                    <div
                      key={dtc.id}
                      className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                        selectedDTC?.id === dtc.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedDTC(dtc)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600">
                            {dtc.code}
                          </span>
                          {getSeverityBadge(dtc.severity)}
                        </div>
                        <span className="text-xs text-slate-500">
                          {getSystemInfo(dtc.system)?.icon}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2">
                        {dtc.descriptionIndonesian}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* DTC Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Detail Kode DTC
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDTC ? (
              <div className="space-y-4">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="overview" className="text-xs sm:text-sm">Info</TabsTrigger>
                    <TabsTrigger value="diagnosis" className="text-xs sm:text-sm">Diagnosa</TabsTrigger>
                    <TabsTrigger value="repair" className="text-xs sm:text-sm">Perbaikan</TabsTrigger>
                    <TabsTrigger value="components" className="text-xs sm:text-sm">Komponen</TabsTrigger>
                  </TabsList>

                  <div className="min-h-[400px]">
                    <TabsContent value="overview" className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono font-bold text-xl text-blue-600">
                            {selectedDTC.code}
                          </span>
                          {getSeverityBadge(selectedDTC.severity)}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                          {selectedDTC.descriptionIndonesian}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span>{getSystemInfo(selectedDTC.system)?.icon}</span>
                          <span>{getSystemInfo(selectedDTC.system)?.nameIndonesian}</span>
                          {selectedDTC.subsystem && (
                            <>
                              <span>•</span>
                              <span>{selectedDTC.subsystem}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          Gejala yang Muncul
                        </h4>
                        <ul className="space-y-1">
                          {selectedDTC.symptoms.map((symptom, index) => (
                            <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4 text-red-500" />
                          Kemungkinan Penyebab
                        </h4>
                        <ul className="space-y-1">
                          {selectedDTC.possibleCauses.map((cause, index) => (
                            <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="diagnosis" className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Search className="w-4 h-4 text-blue-500" />
                          Langkah Diagnosa
                        </h4>
                        <ol className="space-y-2">
                          {selectedDTC.diagnosticSteps.map((step, index) => (
                            <li key={index} className="text-sm text-slate-700 flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              <span className="flex-1">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </TabsContent>

                    <TabsContent value="repair" className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-green-500" />
                          Prosedur Perbaikan
                        </h4>
                        <ol className="space-y-2">
                          {selectedDTC.repairProcedures.map((procedure, index) => (
                            <li key={index} className="text-sm text-slate-700 flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              <span className="flex-1">{procedure}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </TabsContent>

                    <TabsContent value="components" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-purple-500" />
                            Sensor Terkait
                          </h4>
                          <div className="space-y-1">
                            {selectedDTC.relatedSensors.map((sensor, index) => (
                              <Badge key={index} variant="outline" className="mr-1 mb-1">
                                {sensor}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Settings className="w-4 h-4 text-indigo-500" />
                            Aktuator Terkait
                          </h4>
                          <div className="space-y-1">
                            {selectedDTC.relatedActuators.map((actuator, index) => (
                              <Badge key={index} variant="outline" className="mr-1 mb-1">
                                {actuator}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {selectedDTC.applicableVehicles && selectedDTC.applicableVehicles.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Car className="w-4 h-4 text-slate-500" />
                            Kendaraan yang Berlaku
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedDTC.applicableVehicles.map((vehicle, index) => (
                              <Badge key={index} variant="secondary">
                                {vehicle}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>Pilih kode DTC dari daftar untuk melihat detail lengkap</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Catatan:</strong> Data DTC ini berdasarkan standar OBD-II resmi dan pengalaman praktis teknisi otomotif. 
          Selalu lakukan diagnosa menyeluruh sebelum melakukan perbaikan.
        </AlertDescription>
      </Alert>
    </div>
  )
}