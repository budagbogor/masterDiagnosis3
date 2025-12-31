'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Car,
  BrainCircuit,
  History,
  Zap,
  ShieldCheck,
  Menu
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import DiagnosisWizard, { DiagnosisData } from '@/components/diagnosis-wizard'
import DiagnosisResultEnhanced from '@/components/diagnosis-result-enhanced'
import DiagnosisHistory from '@/components/diagnosis-history'
import DTCLibrary from '@/components/dtc-library'

type View = 'home' | 'new-diagnosis' | 'history' | 'diagnosis-result' | 'dtc-library'

export default function AutoDiagMasterAI() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null)

  const handleDiagnosisComplete = (data: any) => {
    setDiagnosisResult(data)
    setCurrentView('diagnosis-result')
  }

  const renderDiagnosisResultView = () => {
    if (!diagnosisResult) return null
    return (
      <DiagnosisResultEnhanced
        diagnosisId={diagnosisResult.diagnosisId}
        aiAnalysis={diagnosisResult.aiAnalysis}
        onBack={() => {
          setDiagnosisResult(null)
          setCurrentView('home')
        }}
      />
    )
  }

  const renderNewDiagnosisView = () => (
    <DiagnosisWizard
      onComplete={handleDiagnosisComplete}
      onCancel={() => setCurrentView('home')}
    />
  )

  const renderHistoryView = () => (
    <DiagnosisHistory
      onNewDiagnosis={() => setCurrentView('new-diagnosis')}
      onViewDiagnosis={(id) => {
        console.log('View diagnosis:', id)
        setCurrentView('home')
      }}
    />
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCurrentView('home')}
            >
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900 hidden sm:block">AutoDiag</span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <Button
                size="sm"
                variant={currentView === 'home' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('home')}
                className={currentView === 'home' ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-600'}
              >
                <Car className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={currentView === 'new-diagnosis' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('new-diagnosis')}
                className={currentView === 'new-diagnosis' ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-600'}
              >
                <Zap className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={currentView === 'history' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('history')}
                className={currentView === 'history' ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-600'}
              >
                <History className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={currentView === 'dtc-library' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('dtc-library')}
                className={currentView === 'dtc-library' ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-600'}
              >
                <BrainCircuit className="w-4 h-4" />
              </Button>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden ml-2">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-base">
                      <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                        <Car className="w-4 h-4 text-white" />
                      </div>
                      AutoDiag Master AI
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 mt-4">
                    <Button
                      variant={currentView === 'home' ? 'default' : 'outline'}
                      onClick={() => { setCurrentView('home'); setMobileMenuOpen(false) }}
                      className="justify-start"
                    >
                      <Car className="w-4 h-4 mr-2" />
                      Beranda
                    </Button>
                    <Button
                      variant={currentView === 'new-diagnosis' ? 'default' : 'outline'}
                      onClick={() => { setCurrentView('new-diagnosis'); setMobileMenuOpen(false) }}
                      className="justify-start"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Diagnosa Baru
                    </Button>
                    <Button
                      variant={currentView === 'history' ? 'default' : 'outline'}
                      onClick={() => { setCurrentView('history'); setMobileMenuOpen(false) }}
                      className="justify-start"
                    >
                      <History className="w-4 h-4 mr-2" />
                      Riwayat
                    </Button>
                    <Button
                      variant={currentView === 'dtc-library' ? 'default' : 'outline'}
                      onClick={() => { setCurrentView('dtc-library'); setMobileMenuOpen(false) }}
                      className="justify-start"
                    >
                      <BrainCircuit className="w-4 h-4 mr-2" />
                      Library DTC
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {currentView === 'home' && (
          <div className="space-y-4">
            {/* Hero Card - Simple */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-2">
                  <BrainCircuit className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">AutoDiag Master AI</h1>
                  <p className="text-blue-100 text-base">Diagnosa kerusakan mobil dengan AI Teknisi Otomotif</p>
                </div>
                <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 py-6 text-base w-full"
                    onClick={() => setCurrentView('new-diagnosis')}
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Mulai Diagnosa
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30 py-4 w-full"
                    onClick={() => setCurrentView('history')}
                  >
                    <History className="mr-2 h-5 w-5" />
                    Lihat Riwayat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'new-diagnosis' && renderNewDiagnosisView()}
        {currentView === 'history' && renderHistoryView()}
        {currentView === 'diagnosis-result' && renderDiagnosisResultView()}
        {currentView === 'dtc-library' && <DTCLibrary />}
      </main>

      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-4 mt-auto">
        <div className="max-w-2xl mx-auto px-4 text-center text-xs">
          © 2024 AutoDiag Master AI
        </div>
      </footer>
    </div>
  )
}
