'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Wrench,
  ArrowLeft,
  Printer,
  Clock,
  Car,
  ChevronRight,
  Shield,
  BrainCircuit
} from 'lucide-react'

interface PossibleCause {
  title: string
  probability: string
  reasoning: string
  symptomsMatch: string
  verificationSteps: string[]
  estimatedCost?: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
}

interface AnalysisResult {
  summary: string
  possibleCauses: PossibleCause[]
  recommendedChecks: any[]
  safetyWarnings: string[]
  commonMistakes: string[]
  technicalExplanation: {
    howItWorks: string
    whySymptomsOccur: string
  }
}

interface DiagnosisResultProps {
  data: {
    vehicle: {
      brand: string
      model: string
      year: string
      engineCode: string
      transmission: string
      mileage: string
    }
    symptoms: {
      complaint: string
    }
  }
  loading?: boolean
  onBack?: () => void
}

export default function DiagnosisResult({ data, loading = false, onBack }: DiagnosisResultProps) {
  const [isSaving, setIsSaving] = useState(false)

  const mockAnalysis: AnalysisResult = {
    summary: "Berdasarkan gejala yang dilaporkan, kemungkinan besar masalah berkaitan dengan sistem bahan bakar. Mileage tinggi mengindikasikan komponen bahan bakar perlu perawatan.",
    possibleCauses: [
      {
        title: "Injektor Botor / Macet",
        probability: "Very High (80-100%)",
        reasoning: "Mileage tinggi dengan gejala misfire sangat mengindikasikan injektor kotor.",
        symptomsMatch: "Getaran idle, konsumsi BBM boros",
        verificationSteps: [
          "Scan OBD untuk cek kode misfire",
          "Cek balance test injektor",
          "Lepas injektor dan tes spray pattern",
          "Bersihkan injektor atau ganti baru"
        ],
        estimatedCost: "Rp 800.000 - 1.500.000",
        severity: "High"
      },
      {
        title: "Sensor MAF Rusak",
        probability: "High (50-79%)",
        reasoning: "Sensor MAF kotor menyebabkan ECU salah menghitung udara.",
        symptomsMatch: "Getaran idle, akselerasi tidak smooth",
        verificationSteps: [
          "Scan untuk cek kode P0101",
          "Baca data live MAF dengan scanner",
          "Bersihkan sensor MAF",
          "Ganti jika masih error"
        ],
        estimatedCost: "Rp 1.200.000 - 2.500.000",
        severity: "Medium"
      }
    ],
    recommendedChecks: [],
    safetyWarnings: [
      "JANGAN membuka sistem bahan bakar saat mesin panas",
      "Gunakan sarung tangan dan kacamata safety",
      "Hindari api terbuka dekat fuel line"
    ],
    commonMistakes: [
      "Langsung ganti injektor tanpa cek coil/spark plug",
      "Tidak mengecek kebocoran udara di intake",
      "Gunakan injektor aftermarket yang tidak sesuai spesifikasi"
    ],
    technicalExplanation: {
      howItWorks: "Sistem injeksi bahan bakar elektronik mengatur aliran bahan bakar melalui injektor.",
      whySymptomsOccur: "Ketika injektor kotor, semprotan bahan bakar tidak optimal menyebabkan campuran salah."
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600 text-white'
      case 'High': return 'bg-orange-500 text-white'
      case 'Medium': return 'bg-yellow-500 text-white'
      default: return 'bg-slate-600 text-white'
    }
  }

  const getProbabilityBadge = (probability: string) => {
    if (probability.includes('Very High')) return 'bg-red-100 text-red-800 border-red-300'
    if (probability.includes('High')) return 'bg-orange-100 text-orange-800 border-orange-300'
    return 'bg-slate-100 text-slate-800 border-slate-300'
  }

  const handleExportPDF = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BrainCircuit className="w-7 h-7 text-blue-600 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Menganalisa dengan AI...</h3>
          <p className="text-slate-600 text-sm">Mohon tunggu sebentar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Vehicle Info - Simple */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 print:bg-white print:text-black print:border print:border-gray-300">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6" />
            <div className="flex-1">
              <div className="font-semibold text-lg">{data.vehicle.brand} {data.vehicle.model}</div>
              <div className="text-blue-100 text-sm">
                {data.vehicle.year} • {data.vehicle.mileage} km • {data.vehicle.engineCode}
              </div>
            </div>
            <Badge className="bg-white text-blue-600 no-print">AI Analyzed</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700 text-sm">
          {mockAnalysis.summary}
        </AlertDescription>
      </Alert>

      {/* Possible Causes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="font-bold text-lg text-slate-900">Kemungkinan Penyebab</h2>
        </div>

        {mockAnalysis.possibleCauses.map((cause, index) => (
          <Card key={index} className="border-l-4 border-l-blue-600">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className={`text-xs ${getProbabilityBadge(cause.probability)}`}>
                      #{index + 1}
                    </Badge>
                    <Badge className={`text-xs ${getSeverityColor(cause.severity)}`}>
                      {cause.severity}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900">{cause.title}</h3>
                </div>
                <Badge className={`text-xs ${getProbabilityBadge(cause.probability)} shrink-0`}>
                  {cause.probability}
                </Badge>
              </div>

              <p className="text-sm text-slate-700">{cause.reasoning}</p>

              <div>
                <h4 className="font-semibold text-sm text-slate-900 mb-2 flex items-center gap-1">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  Langkah Verifikasi:
                </h4>
                <ol className="space-y-2 ml-4">
                  {cause.verificationSteps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        {stepIndex + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {cause.estimatedCost && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription className="text-sm flex items-center justify-between">
                    <span>Estimasi Biaya:</span>
                    <span className="font-semibold">{cause.estimatedCost}</span>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SOP & Warnings */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Safety Warnings */}
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-red-900">
              <Shield className="w-4 h-4" />
              Peringatan Keamanan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {mockAnalysis.safetyWarnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-red-900">
                  <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-orange-900">
              <AlertTriangle className="w-4 h-4" />
              Kesalahan Umum
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {mockAnalysis.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="pt-0.5">{mistake}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <Button
          onClick={handleExportPDF}
          className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 no-print"
        >
          <Printer className="w-4 h-4" />
          Print / PDF
        </Button>
      </div>
    </div>
  )
}
