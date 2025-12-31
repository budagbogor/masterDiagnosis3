'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  AlertTriangle,
  Car,
  ArrowLeft,
  BookOpen,
  Wrench,
  Cpu,
  Gauge,
  Activity,
  Shield,
  X
} from 'lucide-react'
import { DTCCode, searchDTC, getDTCByCode, getAvailableSystems } from '@/lib/dtc-data'

export default function DTCLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDTC, setSelectedDTC] = useState<DTCCode | null>(null)
  const [searchResults, setSearchResults] = useState<DTCCode[]>([])
  const [allSystems, setAllSystems] = useState<Array<{system: string, count: number, description: string}>>([])
  const [showQuickAccess, setShowQuickAccess] = useState(true)

  useEffect(() => {
    setAllSystems(getAvailableSystems())
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([])
      setShowQuickAccess(true)
    } else {
      const results = searchDTC(searchTerm)
      setSearchResults(results)
      setShowQuickAccess(false)
    }
  }, [searchTerm])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleSelectDTC = (dtc: DTCCode) => {
    setSelectedDTC(dtc)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600 text-white'
      case 'High': return 'bg-orange-500 text-white'
      case 'Medium': return 'bg-yellow-500 text-white'
      default: return 'bg-green-600 text-white'
    }
  }

  const getSystemColor = (system: string) => {
    switch (system) {
      case 'P': return 'bg-blue-100 text-blue-800'
      case 'C': return 'bg-purple-100 text-purple-800'
      case 'U': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Quick access codes - most common
  const quickAccessCodes = ['P0300', 'P0420', 'P0100', 'P0171', 'P0121', 'C0035', 'U0100']

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.reload()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">Library DTC</h1>
          <p className="text-sm text-slate-600">Database kode diagnosa otomotif standar</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Cari kode DTC (contoh: P0300, P0420, C0035)..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-11 text-base h-12"
            />
          </div>
        </CardContent>
      </Card>

      {!selectedDTC && (
        <div>
          {/* Quick Access - Show when no search */}
          {showQuickAccess && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Kode Sering Muncul
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quickAccessCodes.map(code => {
                    const dtc = getDTCByCode(code)
                    if (!dtc) return null
                    return (
                      <Button
                        key={code}
                        variant="outline"
                        onClick={() => handleSelectDTC(dtc)}
                        className="text-sm font-mono"
                      >
                        {code}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Categories */}
          {searchTerm.trim() === '' && (
            <div className="grid grid-cols-2 gap-3">
              {allSystems.map(sys => (
                <Card key={sys.system} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSystemColor(sys.system)}`}>
                        <Badge className="text-sm font-bold">{sys.system}</Badge>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{sys.description}</h3>
                        <p className="text-xs text-slate-600">{sys.count} kode tersedia</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(sys.system)}
                      className="w-full text-xs"
                    >
                      Lihat Semua
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && !selectedDTC && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            {searchResults.length} hasil pencarian untuk "{searchTerm}"
          </p>
          {searchResults.map(dtc => (
            <Card
              key={dtc.code}
              className={`border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                dtc.severity === 'Critical' ? 'border-l-red-600' :
                dtc.severity === 'High' ? 'border-l-orange-500' :
                dtc.severity === 'Medium' ? 'border-l-yellow-500' : 'border-l-green-600'
              }`}
              onClick={() => handleSelectDTC(dtc)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge className={`text-sm font-mono ${getSystemColor(dtc.system)}`}>
                        {dtc.code}
                      </Badge>
                      <Badge className={`text-xs ${getSeverityColor(dtc.severity)}`}>
                        {dtc.severity}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-base">{dtc.description}</h3>
                    <p className="text-xs text-slate-600">{dtc.subSystem}</p>
                  </div>
                  <Activity className="w-5 h-5 text-slate-400 shrink-0" />
                </div>

                {/* Symptoms Preview */}
                {dtc.symptoms.length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-3 mb-3">
                    <h4 className="font-semibold text-sm text-slate-900 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Gejala:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {dtc.symptoms.slice(0, 4).map((symptom, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                      {dtc.symptoms.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{dtc.symptoms.length - 4} lagi
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected DTC Detail View */}
      {selectedDTC && (
        <Card>
          <CardContent className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge className={`text-base font-mono ${getSystemColor(selectedDTC.system)}`}>
                    {selectedDTC.code}
                  </Badge>
                  <Badge className={`text-sm ${getSeverityColor(selectedDTC.severity)}`}>
                    {selectedDTC.severity}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedDTC.description}</h2>
                <p className="text-sm text-slate-600">{selectedDTC.subSystem}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDTC(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Symptoms */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 text-base mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Gejala yang Muncul
              </h3>
              <div className="bg-orange-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {selectedDTC.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-800">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Possible Causes */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 text-base mb-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Kemungkinan Penyebab
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {selectedDTC.possibleCauses.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-800">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Related Sensors & Actuators */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* Sensors */}
              {selectedDTC.relatedSensors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 text-base mb-3 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-600" />
                    Sensor Terkait
                  </h3>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedDTC.relatedSensors.map((sensor, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {sensor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Actuators */}
              {selectedDTC.relatedActuators.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 text-base mb-3 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-green-600" />
                    Aktuator Terkait
                  </h3>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedDTC.relatedActuators.map((actuator, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {actuator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Common Vehicles */}
            {selectedDTC.commonVehicles.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 text-base mb-3 flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  Sering Terjadi Pada
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedDTC.commonVehicles.map((vehicle, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {vehicle}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Repair Steps */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 text-base mb-3 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-slate-700" />
                Langkah Perbaikan
              </h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <ol className="space-y-3">
                  {selectedDTC.repairSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-800">
                      <span className="flex-shrink-0 w-7 h-7 bg-slate-700 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="flex-1 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Cost Estimate */}
            {selectedDTC.estimatedCost && (
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 text-base mb-3 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-slate-600" />
                  Estimasi Biaya Perbaikan
                </h3>
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-l-yellow-500">
                  <p className="text-lg font-bold text-slate-900">{selectedDTC.estimatedCost}</p>
                  <p className="text-xs text-slate-600 mt-2">
                    *Harga pera diperkirakan dan bisa berbeda tergantung lokasi & merek
                  </p>
                </div>
              </div>
            )}

            {/* Reference Sources */}
            {selectedDTC.referenceSource.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-slate-900 text-base mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Sumber Referensi
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedDTC.referenceSource.map((source, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-800">
                        <Shield className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={() => setSelectedDTC(null)}
                className="w-full"
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Pencarian
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {searchResults.length === 0 && searchTerm.trim() !== '' && !selectedDTC && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="font-semibold text-slate-900 text-lg mb-2">Tidak Ditemukan</h3>
            <p className="text-slate-600 mb-4">
              Tidak ada kode DTC yang sesuai dengan "{searchTerm}"
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
            >
              Cari Kode Lain
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
