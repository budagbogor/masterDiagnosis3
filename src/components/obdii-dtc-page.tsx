'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Code,
  Database,
  Info,
  BookOpen,
  Zap,
  Car,
  Settings,
  Network,
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  Github,
  FileText,
  Cpu,
  Wrench,
  Search,
  Filter,
  Stethoscope
} from 'lucide-react'

interface DTCCode {
  id: string
  code: string
  system: string
  subsystem?: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  symptoms: string[]
  possibleCauses: string[]
  diagnosticSteps: string[]
  repairProcedures: string[]
  relatedSensors: string[]
  relatedActuators: string[]
  applicableVehicles: string[]
}

export default function OBDIIDTCPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [dtcCodes, setDtcCodes] = useState<DTCCode[]>([])
  const [filteredCodes, setFilteredCodes] = useState<DTCCode[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSystem, setSelectedSystem] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    p0: 0,
    p1: 0,
    u0: 0,
    critical: 0,
    high: 0,
    medium: 0
  })

  const dtcCategories = [
    {
      code: 'P',
      name: 'Powertrain',
      nameIndonesian: 'Sistem Powertrain',
      description: 'Engine, transmission, and emission control systems',
      descriptionIndonesian: 'Sistem mesin, transmisi, dan kontrol emisi',
      hexRange: '0x0000 - 0x3FFF',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      examples: ['P0171', 'P0300', 'P0420', 'P0101']
    },
    {
      code: 'C',
      name: 'Chassis',
      nameIndonesian: 'Sistem Chassis',
      description: 'Brake, steering, suspension, and stability systems',
      descriptionIndonesian: 'Sistem rem, kemudi, suspensi, dan stabilitas',
      hexRange: '0x4000 - 0x7FFF',
      icon: <Car className="w-6 h-6" />,
      color: 'bg-green-100 text-green-800 border-green-200',
      examples: ['C0035', 'C0040', 'C0561', 'C1201']
    },
    {
      code: 'B',
      name: 'Body',
      nameIndonesian: 'Sistem Body',
      description: 'Interior, exterior, and comfort systems',
      descriptionIndonesian: 'Sistem interior, eksterior, dan kenyamanan',
      hexRange: '0x8000 - 0xBFFF',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      examples: ['B0001', 'B1000', 'B1342', 'B2AAA']
    },
    {
      code: 'U',
      name: 'Network Communication',
      nameIndonesian: 'Komunikasi Jaringan',
      description: 'Communication bus and network systems',
      descriptionIndonesian: 'Sistem bus komunikasi dan jaringan',
      hexRange: '0xC000 - 0xFFFF',
      icon: <Network className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      examples: ['U0001', 'U0100', 'U0155', 'U2023']
    }
  ]

  const standards = [
    {
      name: 'ISO 15031-6',
      title: 'Road vehicles — Communication between vehicle and external equipment for emissions-related diagnostics',
      description: 'Standar internasional yang mendefinisikan kode DTC untuk sistem diagnostik OBD',
      year: '2015',
      organization: 'International Organization for Standardization'
    },
    {
      name: 'SAE J2012',
      title: 'Diagnostic Trouble Code Definitions',
      description: 'Standar SAE yang mendefinisikan kode DTC untuk sistem diagnostik kendaraan',
      year: '2013',
      organization: 'Society of Automotive Engineers'
    }
  ]

  const features = [
    {
      icon: <Database className="w-8 h-8 text-blue-600" />,
      title: 'Database DTC Lengkap',
      description: 'Database komprehensif kode DTC berdasarkan standar ISO 15031 dan SAE J2012'
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-green-600" />,
      title: 'Diagnosis Terintegrasi',
      description: 'Sistem diagnosis otomotif terintegrasi dengan database DTC yang lengkap'
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-600" />,
      title: 'Deskripsi Lengkap',
      description: 'Setiap kode DTC dilengkapi dengan deskripsi, gejala, dan prosedur perbaikan'
    },
    {
      icon: <Cpu className="w-8 h-8 text-purple-600" />,
      title: 'Kategorisasi Sistematis',
      description: 'Kode DTC dikategorikan berdasarkan sistem: Powertrain, Chassis, Body, Network'
    }
  ]

  // Load DTC codes from API
  useEffect(() => {
    loadDTCCodes()
  }, [])

  // Filter codes based on search and filters
  useEffect(() => {
    let filtered = dtcCodes

    if (searchTerm) {
      filtered = filtered.filter(code => 
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSystem !== 'all') {
      filtered = filtered.filter(code => code.system === selectedSystem)
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(code => code.severity === selectedSeverity)
    }

    setFilteredCodes(filtered)
  }, [dtcCodes, searchTerm, selectedSystem, selectedSeverity])

  const loadDTCCodes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/dtc-library')
      const data = await response.json()
      
      if (data.success) {
        setDtcCodes(data.data)
        
        // Calculate stats
        const total = data.data.length
        const p0 = data.data.filter((code: DTCCode) => code.system === 'P0').length
        const p1 = data.data.filter((code: DTCCode) => code.system === 'P1').length
        const u0 = data.data.filter((code: DTCCode) => code.system === 'U0').length
        const critical = data.data.filter((code: DTCCode) => code.severity === 'CRITICAL').length
        const high = data.data.filter((code: DTCCode) => code.severity === 'HIGH').length
        const medium = data.data.filter((code: DTCCode) => code.severity === 'MEDIUM').length
        
        setStats({ total, p0, p1, u0, critical, high, medium })
      }
    } catch (error) {
      console.error('Error loading DTC codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            <Stethoscope className="w-4 h-4" />
            Database DTC Komprehensif
          </div>
          <h1 className="text-4xl font-bold text-slate-900">
            OBDII.DTC Library
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Database lengkap kode Diagnostic Trouble Code (DTC) berdasarkan standar OBD-II 
            dengan kategorisasi sistematis dan deskripsi komprehensif untuk kendaraan di Indonesia.
          </p>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Kode DTC</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{stats.p0}</div>
              <div className="text-sm text-gray-600">P0 Generic</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-orange-600">{stats.p1}</div>
              <div className="text-sm text-gray-600">P1 Manufacturer</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <div className="text-sm text-gray-600">Critical Codes</div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b">
                <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-transparent">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="search" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Cari DTC
                  </TabsTrigger>
                  <TabsTrigger 
                    value="categories" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Kategori DTC
                  </TabsTrigger>
                  <TabsTrigger 
                    value="standards" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Standar
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-8">
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Tentang Database DTC</h2>
                    <div className="prose max-w-none">
                      <p className="text-slate-700 leading-relaxed mb-4">
                        Database DTC ini menyediakan koleksi lengkap kode Diagnostic Trouble Code (DTC) 
                        yang dikategorikan berdasarkan sistem On-board Diagnostics II (OBD-II). Database 
                        ini khusus disesuaikan untuk kendaraan yang beredar di Indonesia dalam 15 tahun terakhir.
                      </p>
                      <p className="text-slate-700 leading-relaxed mb-4">
                        Setiap kode DTC dilengkapi dengan deskripsi dalam bahasa Indonesia, gejala yang muncul, 
                        kemungkinan penyebab, langkah diagnosis, dan prosedur perbaikan yang sesuai dengan 
                        kondisi dan ketersediaan suku cadang di Indonesia.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                          <CheckCircle2 className="w-5 h-5" />
                          Keunggulan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Database DTC lengkap berdasarkan standar internasional
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Deskripsi dalam bahasa Indonesia
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Prosedur diagnosis dan perbaikan detail
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Disesuaikan untuk kendaraan di Indonesia
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Terintegrasi dengan sistem diagnosis AI
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-700">
                          <Wrench className="w-5 h-5" />
                          Aplikasi
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            Diagnosis otomotif profesional
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            Pelatihan teknisi otomotif
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            Bengkel dan service center
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            Sistem manajemen armada
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            Aplikasi diagnostik mobile
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="search" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Pencarian Kode DTC</h2>
                    <p className="text-slate-600 mb-6">
                      Cari kode DTC berdasarkan kode, deskripsi, atau sistem. Database saat ini memiliki {stats.total} kode DTC.
                    </p>
                  </div>

                  {/* Search and Filter Controls */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Cari kode DTC atau deskripsi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Sistem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Sistem</SelectItem>
                        <SelectItem value="P0">P0 - Generic Powertrain</SelectItem>
                        <SelectItem value="P1">P1 - Manufacturer Powertrain</SelectItem>
                        <SelectItem value="B0">B0 - Generic Body</SelectItem>
                        <SelectItem value="C0">C0 - Generic Chassis</SelectItem>
                        <SelectItem value="U0">U0 - Generic Network</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Severity</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Results */}
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Memuat data DTC...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          Menampilkan {filteredCodes.length} dari {dtcCodes.length} kode DTC
                        </p>
                      </div>
                      
                      <div className="grid gap-4">
                        {filteredCodes.slice(0, 20).map((code) => (
                          <Card key={code.id} className="shadow-sm border">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <Badge className={`font-mono font-bold ${getSeverityColor(code.severity)}`}>
                                    {code.code}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {code.system}
                                  </Badge>
                                  <Badge className={`text-xs ${getSeverityColor(code.severity)}`}>
                                    {code.severity}
                                  </Badge>
                                </div>
                              </div>
                              
                              <h3 className="font-semibold text-lg mb-2">{code.description}</h3>
                              
                              {code.symptoms.length > 0 && (
                                <div className="mb-3">
                                  <h4 className="font-medium text-sm text-gray-700 mb-1">Gejala:</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {code.symptoms.slice(0, 3).map((symptom, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {symptom}
                                      </Badge>
                                    ))}
                                    {code.symptoms.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{code.symptoms.length - 3} lainnya
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {code.applicableVehicles.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm text-gray-700 mb-1">Kendaraan:</h4>
                                  <p className="text-xs text-gray-600">
                                    {code.applicableVehicles.slice(0, 3).join(', ')}
                                    {code.applicableVehicles.length > 3 && ` +${code.applicableVehicles.length - 3} lainnya`}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {filteredCodes.length > 20 && (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-600">
                            Menampilkan 20 dari {filteredCodes.length} hasil. Gunakan filter untuk mempersempit pencarian.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="categories" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Kategori Kode DTC</h2>
                    <p className="text-slate-600 mb-6">
                      Kode DTC dikategorikan berdasarkan sistem kendaraan dengan prefix huruf dan range hex yang spesifik.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {dtcCategories.map((category, index) => (
                      <Card key={index} className="shadow-lg border-0">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                                {category.icon}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className={`text-lg px-3 py-1 font-mono font-bold ${category.color}`}>
                                  {category.code}
                                </Badge>
                                <h3 className="text-xl font-bold text-slate-900">
                                  {category.nameIndonesian}
                                </h3>
                              </div>
                              <p className="text-slate-600 mb-3">{category.descriptionIndonesian}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                                <span className="font-mono">Hex Range: {category.hexRange}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-700 mr-2">Contoh kode:</span>
                                <div className="flex gap-2 mt-1">
                                  {category.examples.map((example, idx) => (
                                    <Badge key={idx} variant="outline" className="font-mono">
                                      {example}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="standards" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Standar Internasional</h2>
                    <p className="text-slate-600 mb-6">
                      Database DTC ini mengikuti standar internasional yang ditetapkan oleh ISO dan SAE untuk 
                      memastikan konsistensi dan kompatibilitas global.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {standards.map((standard, index) => (
                      <Card key={index} className="shadow-lg border-0">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-mono">
                                  {standard.name}
                                </Badge>
                                <Badge variant="outline">{standard.year}</Badge>
                              </div>
                              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {standard.title}
                              </h3>
                              <p className="text-slate-600 mb-2">{standard.description}</p>
                              <p className="text-sm text-slate-500">{standard.organization}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Catatan:</strong> Standar ini memastikan bahwa kode DTC dapat digunakan 
                      secara universal di berbagai merek dan model kendaraan, memudahkan diagnosa 
                      dan perbaikan oleh teknisi otomotif di seluruh dunia.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="shadow-lg border-0 bg-slate-900 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Master Diagnosis BOA</h3>
            <p className="text-slate-300 mb-4">
              Sistem diagnosis otomotif berbasis AI dengan database DTC komprehensif untuk kendaraan Indonesia.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
                <Github className="w-4 h-4 mr-2" />
                GitHub Repository
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
                <FileText className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}