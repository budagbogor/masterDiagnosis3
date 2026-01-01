'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  DollarSign,
  FileText,
  ArrowLeft,
  Info,
  AlertCircle,
  Zap,
  Settings,
  Hammer,
  Loader2,
  Target,
  TrendingUp,
  Shield,
  Gauge,
  Activity,
  ChevronDown
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: Target },
    { id: 'diagnosis', label: 'DIAGNOSIS', icon: Zap },
    { id: 'theory', label: 'THEORY', icon: Settings },
    { id: 'procedures', label: 'REPAIR', icon: Wrench },
    { id: 'cost', label: 'COST', icon: DollarSign }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)!

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
      case 'MUDAH': return 'bg-emerald-500 text-white'
      case 'SEDANG': return 'bg-amber-500 text-white'
      case 'SULIT': return 'bg-orange-500 text-white'
      case 'SANGAT_SULIT': return 'bg-red-500 text-white'
      default: return 'bg-slate-500 text-white'
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-emerald-600 bg-emerald-50'
    if (confidence >= 0.7) return 'text-blue-600 bg-blue-50'
    if (confidence >= 0.5) return 'text-amber-600 bg-amber-50'
    return 'text-red-600 bg-red-50'
  }

  if (!aiAnalysis) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Data hasil analisis tidak tersedia. Silakan coba lagi.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen p-4">
      {/* Professional Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">DIAGNOSTIC REPORT</h1>
                <p className="text-sm text-slate-600 font-mono">ID: {diagnosisId}</p>
              </div>
            </div>
            
            {/* Confidence Meter */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${getConfidenceColor(aiAnalysis.confidence)}`}>
              <Gauge className="w-4 h-4" />
              CONFIDENCE: {Math.round(aiAnalysis.confidence * 100)}%
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {isGeneratingReport ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  GENERATING...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  EXPORT PDF
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onBack} className="font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Professional Tab Navigation - Responsive Design */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
          {/* Desktop & Tablet Tab Navigation (md and up) */}
          <div className="hidden md:block">
            <TabsList className="grid w-full grid-cols-5 h-12 md:h-14 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-1 gap-0.5 md:gap-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id}
                    className="font-bold text-[10px] md:text-xs lg:text-sm xl:text-base text-slate-300 hover:text-white transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg rounded-md flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-1 lg:gap-2 px-0.5 md:px-1 lg:px-2 min-w-0 py-1"
                  >
                    <IconComponent className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="text-[9px] md:text-[10px] lg:text-xs xl:text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-full">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {/* Mobile Dropdown Navigation (below md) */}
          <div className="md:hidden relative" ref={dropdownRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg p-3 flex items-center justify-between font-bold text-sm"
            >
              <div className="flex items-center gap-2">
                <activeTabData.icon className="w-4 h-4" />
                <span>{activeTabData.label}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isMobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  {tabs.map((tab, index) => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id)
                          setIsMobileMenuOpen(false)
                        }}
                        className={`w-full px-4 py-3 flex items-center gap-3 text-left font-semibold text-sm transition-all duration-200 ${
                          activeTab === tab.id 
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600' 
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        } ${index !== tabs.length - 1 ? 'border-b border-slate-100' : ''}`}
                      >
                        <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
                          activeTab === tab.id ? 'bg-blue-200' : 'bg-slate-100'
                        }`}>
                          <IconComponent className="w-4 h-4 flex-shrink-0" />
                        </div>
                        <span className="flex-1">{tab.label}</span>
                        {activeTab === tab.id && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overview Tab - Technical Dashboard Style */}
        <TabsContent value="overview" className="space-y-6">
          {/* Primary Diagnosis Block */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg text-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">PRIMARY FAULT</h2>
                <p className="text-red-100 text-sm">PROBABILITY: {Math.round(aiAnalysis.primaryCause.probability * 100)}%</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">{aiAnalysis.primaryCause.component}</h3>
              <p className="text-red-100 leading-relaxed">{aiAnalysis.primaryCause.description}</p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${getComplexityColor(aiAnalysis.primaryCause.repairComplexity)}`}>
                  {getComplexityIcon(aiAnalysis.primaryCause.repairComplexity)}
                  <span className="ml-1">{aiAnalysis.primaryCause.repairComplexity}</span>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                  {formatCurrency(aiAnalysis.primaryCause.estimatedCost.min)} - {formatCurrency(aiAnalysis.primaryCause.estimatedCost.max)}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cost Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">COST ANALYSIS</h3>
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Parts</span>
                  <span className="font-bold text-green-600">{formatCurrency(aiAnalysis.estimatedTotalCost.parts)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Labor</span>
                  <span className="font-bold text-blue-600">{formatCurrency(aiAnalysis.estimatedTotalCost.labor)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">TOTAL</span>
                  <span className="font-bold text-xl text-slate-900">{formatCurrency(aiAnalysis.estimatedTotalCost.total)}</span>
                </div>
              </div>
            </div>

            {/* Confidence Meter */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">AI CONFIDENCE</h3>
                <Gauge className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Progress value={aiAnalysis.confidence * 100} className="h-3" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white mix-blend-difference">
                      {Math.round(aiAnalysis.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 text-center">
                  {aiAnalysis.confidence >= 0.9 ? 'VERY HIGH' : 
                   aiAnalysis.confidence >= 0.7 ? 'HIGH' : 
                   aiAnalysis.confidence >= 0.5 ? 'MODERATE' : 'LOW'} CONFIDENCE
                </p>
              </div>
            </div>

            {/* Complexity Rating */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">REPAIR COMPLEXITY</h3>
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${getComplexityColor(aiAnalysis.primaryCause.repairComplexity)}`}>
                  {getComplexityIcon(aiAnalysis.primaryCause.repairComplexity)}
                  {aiAnalysis.primaryCause.repairComplexity}
                </div>
                <p className="text-xs text-slate-600 mt-2">Primary fault complexity level</p>
              </div>
            </div>
          </div>

          {/* Secondary Causes - Technical List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              ALTERNATIVE DIAGNOSES
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {aiAnalysis.secondaryCauses.slice(0, 6).map((cause: any, index: number) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm text-slate-900">{cause.component}</h4>
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      {Math.round(cause.probability * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2">{cause.description}</p>
                  <div className="flex items-center justify-between">
                    <div className={`px-2 py-1 rounded text-xs font-bold ${getComplexityColor(cause.repairComplexity)}`}>
                      {cause.repairComplexity}
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      {formatCurrency(cause.estimatedCost.min)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Symptoms Matrix */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              SYMPTOM CORRELATION
            </h3>
            <div className="flex flex-wrap gap-2">
              {aiAnalysis.primaryCause.symptoms.map((symptom: string, index: number) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {symptom}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Diagnosis Tab - Technical Steps */}
        <TabsContent value="diagnosis" className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-600" />
              DIAGNOSTIC PROCEDURE
            </h2>
            
            <div className="space-y-6">
              {aiAnalysis.diagnosticSteps.map((step: any, index: number) => (
                <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                  {/* Step Header */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{step.title}</h3>
                        <p className="text-sm text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <div className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-slate-900 uppercase tracking-wide">Expected Result</h4>
                        <p className="text-sm text-slate-700 bg-green-50 p-3 rounded border-l-4 border-green-500">
                          {step.expectedResult}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-slate-900 uppercase tracking-wide">Required Tools</h4>
                        <div className="flex flex-wrap gap-2">
                          {step.tools.map((tool: string, toolIndex: number) => (
                            <span key={toolIndex} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {step.safetyNotes && step.safetyNotes.length > 0 && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          <strong>SAFETY:</strong> {step.safetyNotes.join(' • ')}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Theory Tab - Technical Documentation */}
        <TabsContent value="theory" className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              TECHNICAL THEORY
            </h2>
            <div className="prose prose-slate max-w-none">
              <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-blue-500 text-slate-700 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                {aiAnalysis.theoryExplanation}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Procedures Tab - Technical Manual Style */}
        <TabsContent value="procedures" className="space-y-6">
          {aiAnalysis.repairProcedures.map((procedure: any, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Procedure Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{procedure.title}</h2>
                    <p className="text-slate-300 text-sm leading-relaxed">{procedure.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:flex-shrink-0">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getComplexityColor(procedure.difficultyLevel)}`}>
                      {getComplexityIcon(procedure.difficultyLevel)}
                      <span className="ml-2">{procedure.difficultyLevel}</span>
                    </div>
                    <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full text-sm font-bold">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{procedure.estimatedTime} MIN</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Repair Steps */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    REPAIR STEPS
                  </h3>
                  <div className="space-y-3">
                    {procedure.steps.map((step: string, stepIndex: number) => (
                      <div key={stepIndex} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {stepIndex + 1}
                        </div>
                        <p className="text-sm text-slate-700 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parts and Tools Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Hammer className="w-5 h-5 text-green-600" />
                      REQUIRED PARTS
                    </h3>
                    <div className="space-y-3">
                      {procedure.requiredParts.map((part: any, partIndex: number) => (
                        <div key={partIndex} className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-500">
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{part.name}</p>
                            {part.partNumber && (
                              <p className="text-xs text-slate-600 font-mono">#{part.partNumber}</p>
                            )}
                          </div>
                          <span className="font-bold text-green-700">
                            {formatCurrency(part.estimatedPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      REQUIRED TOOLS
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {procedure.requiredTools.map((tool: string, toolIndex: number) => (
                        <div key={toolIndex} className="bg-blue-50 text-blue-800 px-3 py-2 rounded text-sm font-medium text-center">
                          {tool}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Safety and Quality */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      SAFETY PRECAUTIONS
                    </h3>
                    <ul className="space-y-2">
                      {procedure.safetyPrecautions.map((precaution: string, precautionIndex: number) => (
                        <li key={precautionIndex} className="text-sm text-red-700 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {precaution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      QUALITY CHECKS
                    </h3>
                    <ul className="space-y-2">
                      {procedure.qualityChecks.map((check: string, checkIndex: number) => (
                        <li key={checkIndex} className="text-sm text-green-700 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Cost Tab - Financial Analysis */}
        <TabsContent value="cost" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Total Cost Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                COST BREAKDOWN
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 text-base">PARTS COST</span>
                    <span className="font-bold text-xl text-blue-700 ml-4">
                      {formatCurrency(aiAnalysis.estimatedTotalCost.parts)}
                    </span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-900 text-base">LABOR COST</span>
                    <span className="font-bold text-xl text-green-700 ml-4">
                      {formatCurrency(aiAnalysis.estimatedTotalCost.labor)}
                    </span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-lg">TOTAL ESTIMATE</span>
                    <span className="font-bold text-2xl text-slate-900 ml-4">
                      {formatCurrency(aiAnalysis.estimatedTotalCost.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost by Diagnosis */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-orange-600" />
                COST BY DIAGNOSIS
              </h2>
              <div className="space-y-4">
                <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
                  <h3 className="font-bold text-red-900 text-lg mb-1">{aiAnalysis.primaryCause.component}</h3>
                  <p className="text-red-700 text-sm mb-3">PRIMARY FAULT</p>
                  <p className="font-bold text-xl text-red-800">
                    {formatCurrency(aiAnalysis.primaryCause.estimatedCost.min)} - {formatCurrency(aiAnalysis.primaryCause.estimatedCost.max)}
                  </p>
                </div>
                
                {aiAnalysis.secondaryCauses.slice(0, 3).map((cause: any, index: number) => (
                  <div key={index} className="bg-orange-50 p-5 rounded-lg border-l-4 border-orange-300">
                    <h3 className="font-bold text-orange-900 text-lg mb-1">{cause.component}</h3>
                    <p className="text-orange-700 text-sm mb-3">PROBABILITY {Math.round(cause.probability * 100)}%</p>
                    <p className="font-bold text-lg text-orange-800">
                      {formatCurrency(cause.estimatedCost.min)} - {formatCurrency(cause.estimatedCost.max)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>DISCLAIMER:</strong> Estimasi biaya berdasarkan harga pasar Indonesia 2024. 
              Harga aktual dapat bervariasi tergantung lokasi, supplier, dan kondisi pasar saat ini.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}