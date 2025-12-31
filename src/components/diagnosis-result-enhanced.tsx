'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  DollarSign,
  FileText,
  Download,
  ArrowLeft,
  Info,
  AlertCircle,
  Zap,
  Settings,
  Hammer,
  Loader2
} from 'lucide-react'

interface DiagnosisResultProps {
  diagnosisId: string
  aiAnalysis: any
  onBack: () => void
}

export default function DiagnosisResultEnhanced({ 
  diagnosisId, 
  aiAnalysis, 
  onBack
}: DiagnosisResultProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true)
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagnosisId })
      })

      const result = await response.json()
      
      if (result.success) {
        // Download PDF
        const link = document.createElement('a')
        link.href = `data:application/pdf;base64,${result.data.pdfData}`
        link.download = result.data.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Show success message
        alert('Laporan berhasil diunduh!')
      } else {
        throw new Error(result.error || 'Gagal membuat laporan')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Gagal membuat laporan. Silakan coba lagi.')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'MUDAH': return 'bg-green-100 text-green-800'
      case 'SEDANG': return 'bg-yellow-100 text-yellow-800'
      case 'SULIT': return 'bg-orange-100 text-orange-800'
      case 'SANGAT_SULIT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'MUDAH': return <CheckCircle2 className="w-4 h-4" />
      case 'SEDANG': return <Clock className="w-4 h-4" />
      case 'SULIT': return <AlertTriangle className="w-4 h-4" />
      case 'SANGAT_SULIT': return <AlertCircle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (!aiAnalysis) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Data hasil analisis tidak tersedia. Silakan coba lagi.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Hasil Diagnosa AI Master Teknisi</h2>
          <p className="text-sm text-slate-600">
            Diagnosis ID: {diagnosisId} • Confidence: {Math.round(aiAnalysis.confidence * 100)}%
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className="w-full sm:w-auto"
          >
            {isGeneratingReport ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Membuat Laporan...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>

      {/* Confidence Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tingkat Kepercayaan AI</span>
            <span className="text-sm font-bold">{Math.round(aiAnalysis.confidence * 100)}%</span>
          </div>
          <Progress value={aiAnalysis.confidence * 100} className="h-2" />
          <p className="text-xs text-slate-500 mt-1">
            Semakin tinggi persentase, semakin akurat diagnosa AI
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile: Dropdown selector */}
        <div className="block sm:hidden mb-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih tab" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">📊 Overview</SelectItem>
              <SelectItem value="diagnosis">🔍 Langkah Diagnosa</SelectItem>
              <SelectItem value="theory">📚 Teori Kerja</SelectItem>
              <SelectItem value="procedures">🔧 Prosedur Perbaikan</SelectItem>
              <SelectItem value="cost">💰 Estimasi Biaya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: Tab list */}
        <TabsList className="hidden sm:grid w-full grid-cols-3 lg:grid-cols-5 h-auto p-1">
          <TabsTrigger value="overview" className="text-sm px-2 py-2">
            <span className="hidden lg:inline">📊 </span>Overview
          </TabsTrigger>
          <TabsTrigger value="diagnosis" className="text-sm px-2 py-2">
            <span className="hidden lg:inline">🔍 </span>Diagnosa
          </TabsTrigger>
          <TabsTrigger value="theory" className="text-sm px-2 py-2">
            <span className="hidden lg:inline">📚 </span>Teori
          </TabsTrigger>
          <TabsTrigger value="procedures" className="text-sm px-2 py-2">
            <span className="hidden lg:inline">🔧 </span>Prosedur
          </TabsTrigger>
          <TabsTrigger value="cost" className="text-sm px-2 py-2">
            <span className="hidden lg:inline">💰 </span>Biaya
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Primary Cause */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-500" />
                  Penyebab Utama
                </CardTitle>
                <CardDescription>
                  Probabilitas: {Math.round(aiAnalysis.primaryCause.probability * 100)}%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{aiAnalysis.primaryCause.component}</h4>
                  <p className="text-sm text-slate-600 mt-1">{aiAnalysis.primaryCause.description}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={getComplexityColor(aiAnalysis.primaryCause.repairComplexity)}>
                    {getComplexityIcon(aiAnalysis.primaryCause.repairComplexity)}
                    {aiAnalysis.primaryCause.repairComplexity}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {formatCurrency(aiAnalysis.primaryCause.estimatedCost.min)} - {formatCurrency(aiAnalysis.primaryCause.estimatedCost.max)}
                  </Badge>
                </div>

                <div>
                  <h5 className="font-medium text-sm mb-2">Gejala Terkait:</h5>
                  <div className="flex flex-wrap gap-1">
                    {aiAnalysis.primaryCause.symptoms.map((symptom: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Causes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-500" />
                  Kemungkinan Lain
                </CardTitle>
                <CardDescription>
                  {aiAnalysis.secondaryCauses.length} kemungkinan alternatif
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiAnalysis.secondaryCauses.slice(0, 3).map((cause: any, index: number) => (
                    <div key={index} className="border-l-2 border-slate-200 pl-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">{cause.component}</h5>
                        <span className="text-xs text-slate-500">
                          {Math.round(cause.probability * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{cause.description}</p>
                      <Badge className={`${getComplexityColor(cause.repairComplexity)} text-xs mt-1`}>
                        {cause.repairComplexity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Estimasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <DollarSign className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-sm text-slate-600">Total Estimasi</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-600">
                    {formatCurrency(aiAnalysis.estimatedTotalCost.total)}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Hammer className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <p className="text-sm text-slate-600">Biaya Parts</p>
                  <p className="text-lg sm:text-xl font-bold text-green-600">
                    {formatCurrency(aiAnalysis.estimatedTotalCost.parts)}
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg sm:col-span-2 lg:col-span-1">
                  <Wrench className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                  <p className="text-sm text-slate-600">Biaya Labor</p>
                  <p className="text-lg sm:text-xl font-bold text-orange-600">
                    {formatCurrency(aiAnalysis.estimatedTotalCost.labor)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diagnosis Tab */}
        <TabsContent value="diagnosis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Langkah Diagnosa</CardTitle>
              <CardDescription>
                Prosedur sistematis untuk memastikan diagnosa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiAnalysis.diagnosticSteps.map((step: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                        
                        <div className="mt-3 grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Hasil yang Diharapkan
                            </h5>
                            <p className="text-sm mt-1">{step.expectedResult}</p>
                          </div>
                          <div>
                            <h5 className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Tools Diperlukan
                            </h5>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {step.tools.map((tool: string, toolIndex: number) => (
                                <Badge key={toolIndex} variant="outline" className="text-xs">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {step.safetyNotes && step.safetyNotes.length > 0 && (
                          <Alert className="mt-3">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Catatan Keselamatan:</strong> {step.safetyNotes.join(', ')}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theory Tab */}
        <TabsContent value="theory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Penjelasan Teori Kerja</CardTitle>
              <CardDescription>
                Pemahaman mendalam tentang sistem yang bermasalah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                  {aiAnalysis.theoryExplanation}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Procedures Tab */}
        <TabsContent value="procedures" className="space-y-6">
          {aiAnalysis.repairProcedures.map((procedure: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{procedure.title}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getComplexityColor(procedure.difficultyLevel)}>
                      {getComplexityIcon(procedure.difficultyLevel)}
                      {procedure.difficultyLevel}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {procedure.estimatedTime} menit
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>{procedure.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Steps */}
                <div>
                  <h4 className="font-semibold mb-3">Langkah Perbaikan:</h4>
                  <ol className="space-y-2">
                    {procedure.steps.map((step: string, stepIndex: number) => (
                      <li key={stepIndex} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {stepIndex + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Separator />

                {/* Required Parts and Tools */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Parts Diperlukan:</h4>
                    <div className="space-y-2">
                      {procedure.requiredParts.map((part: any, partIndex: number) => (
                        <div key={partIndex} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div>
                            <p className="text-sm font-medium">{part.name}</p>
                            {part.partNumber && (
                              <p className="text-xs text-slate-500">Part #: {part.partNumber}</p>
                            )}
                          </div>
                          <span className="text-sm font-semibold">
                            {formatCurrency(part.estimatedPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Tools Diperlukan:</h4>
                    <div className="flex flex-wrap gap-2">
                      {procedure.requiredTools.map((tool: string, toolIndex: number) => (
                        <Badge key={toolIndex} variant="outline">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Safety and Quality */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600">Precautions Keselamatan:</h4>
                    <ul className="space-y-1">
                      {procedure.safetyPrecautions.map((precaution: string, precautionIndex: number) => (
                        <li key={precautionIndex} className="text-sm flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          {precaution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">Quality Checks:</h4>
                    <ul className="space-y-1">
                      {procedure.qualityChecks.map((check: string, checkIndex: number) => (
                        <li key={checkIndex} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Cost Tab */}
        <TabsContent value="cost" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Rincian Biaya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="font-medium">Biaya Parts</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(aiAnalysis.estimatedTotalCost.parts)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="font-medium">Biaya Labor</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(aiAnalysis.estimatedTotalCost.labor)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center p-3 bg-slate-100 rounded">
                  <span className="font-bold">Total Estimasi</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(aiAnalysis.estimatedTotalCost.total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Cost by Cause */}
            <Card>
              <CardHeader>
                <CardTitle>Estimasi per Penyebab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-red-500 pl-3">
                  <h4 className="font-semibold text-sm">{aiAnalysis.primaryCause.component}</h4>
                  <p className="text-xs text-slate-600">Penyebab Utama</p>
                  <p className="font-bold text-red-600">
                    {formatCurrency(aiAnalysis.primaryCause.estimatedCost.min)} - {formatCurrency(aiAnalysis.primaryCause.estimatedCost.max)}
                  </p>
                </div>
                
                {aiAnalysis.secondaryCauses.slice(0, 3).map((cause: any, index: number) => (
                  <div key={index} className="border-l-4 border-orange-300 pl-3">
                    <h4 className="font-semibold text-sm">{cause.component}</h4>
                    <p className="text-xs text-slate-600">Kemungkinan {Math.round(cause.probability * 100)}%</p>
                    <p className="font-bold text-orange-600">
                      {formatCurrency(cause.estimatedCost.min)} - {formatCurrency(cause.estimatedCost.max)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Catatan:</strong> Estimasi biaya berdasarkan harga pasar Indonesia tahun 2024. 
              Harga aktual dapat bervariasi tergantung lokasi, supplier, dan kondisi pasar.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}