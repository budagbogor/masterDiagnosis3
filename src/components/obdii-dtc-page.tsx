'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  Wrench
} from 'lucide-react'

export default function OBDIIDTCPage() {
  const [activeTab, setActiveTab] = useState('overview')

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
      title: 'Koleksi DTC Lengkap',
      description: 'Database komprehensif kode DTC berdasarkan standar ISO 15031 dan SAE J2012'
    },
    {
      icon: <Code className="w-8 h-8 text-green-600" />,
      title: '.NET Standard Library',
      description: 'Library yang dapat digunakan di berbagai platform .NET untuk integrasi aplikasi'
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-600" />,
      title: 'Deskripsi Lengkap',
      description: 'Setiap kode DTC dilengkapi dengan deskripsi yang jelas dan mudah dipahami'
    },
    {
      icon: <Cpu className="w-8 h-8 text-purple-600" />,
      title: 'Kategorisasi Sistematis',
      description: 'Kode DTC dikategorikan berdasarkan sistem: Powertrain, Chassis, Body, Network'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            <Github className="w-4 h-4" />
            Open Source Library
          </div>
          <h1 className="text-4xl font-bold text-slate-900">
            OBDII.DTC
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            .NET Standard library yang menyediakan koleksi lengkap kode Diagnostic Trouble Code (DTC) 
            berdasarkan standar On-board Diagnostics II (OBDII) dengan kategorisasi sistematis dan 
            deskripsi yang komprehensif.
          </p>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Package
            </Button>
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
                  <TabsTrigger 
                    value="usage" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Penggunaan
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-8">
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Tentang OBDII.DTC</h2>
                    <div className="prose max-w-none">
                      <p className="text-slate-700 leading-relaxed mb-4">
                        OBDII.DTC adalah library .NET Standard yang menyediakan koleksi lengkap kode 
                        Diagnostic Trouble Code (DTC) generik (non-manufacturer specific) yang dikategorikan 
                        berdasarkan sistem On-board Diagnostics II (OBDII).
                      </p>
                      <p className="text-slate-700 leading-relaxed mb-4">
                        Kode DTC dikategorikan sebagai Powertrain (kode P), Chassis (kode C), Body (kode B), 
                        atau Network Communication (kode U). Setiap kode memiliki nilai hex berdasarkan 
                        kategorinya sesuai dengan standar ISO 15031 dan SAE J2012.
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
                            Koleksi DTC lengkap berdasarkan standar internasional
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Kategorisasi sistematis (P, C, B, U codes)
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Deskripsi lengkap untuk setiap kode
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Compatible dengan .NET Standard
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            Open source dengan lisensi MIT
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
                            Aplikasi diagnostik otomotif
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            Scanner OBD-II software
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            Fleet management systems
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            Automotive repair software
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            Educational tools untuk teknisi
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
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
                      OBDII.DTC mengikuti standar internasional yang ditetapkan oleh ISO dan SAE untuk 
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

                <TabsContent value="usage" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Cara Penggunaan</h2>
                    <p className="text-slate-600 mb-6">
                      Panduan instalasi dan penggunaan library OBDII.DTC dalam proyek .NET Anda.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          Instalasi
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 mb-4">Install package dari NuGet:</p>
                        <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                          Install-Package OBDII.DTC
                        </div>
                        <p className="text-slate-600 mt-4">Atau menggunakan .NET CLI:</p>
                        <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                          dotnet add package OBDII.DTC
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Code className="w-5 h-5" />
                          Contoh Penggunaan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 mb-4">
                          Setelah instalasi, enum DTC dapat digunakan untuk referensi kode trouble:
                        </p>
                        <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                          <div className="text-blue-400">using</div> OBDII.DTC;<br/><br/>
                          
                          <div className="text-green-400">// Mengakses kode DTC</div><br/>
                          <div className="text-yellow-400">var</div> code = DTC.P0171;<br/>
                          <div className="text-yellow-400">var</div> description = code.GetDescription();<br/><br/>
                          
                          <div className="text-green-400">// Mendapatkan kategori</div><br/>
                          <div className="text-yellow-400">var</div> category = code.GetCategory();<br/>
                          <div className="text-yellow-400">var</div> hexValue = code.GetHexValue();<br/><br/>
                          
                          <div className="text-green-400">// Contoh output</div><br/>
                          Console.WriteLine($<div className="text-orange-400">"Code: {'{'}code{'}'}"</div>);<br/>
                          Console.WriteLine($<div className="text-orange-400">"Description: {'{'}description{'}'}"</div>);<br/>
                          Console.WriteLine($<div className="text-orange-400">"Category: {'{'}category{'}'}"</div>);
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Github className="w-5 h-5" />
                          Kontribusi
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 mb-4">
                          Jika ada kode yang salah atau hilang, kontribusi sangat dihargai untuk 
                          membantu meningkatkan library ini.
                        </p>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Buka Issue
                          </Button>
                          <Button variant="outline" size="sm">
                            <Github className="w-4 h-4 mr-2" />
                            Fork Repository
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="shadow-lg border-0 bg-slate-900 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Github className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Open Source Project</h3>
            <p className="text-slate-300 mb-4">
              OBDII.DTC dirilis di bawah lisensi MIT. Gratis untuk digunakan dalam proyek komersial dan non-komersial.
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