'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Car,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Wrench,
  History,
  FileText,
  Search,
  Calendar,
  Loader2
} from 'lucide-react'

// Types untuk diagnosis data
export interface VehicleData {
  brand: string
  model: string
  year: string
  engineCode: string
  engineId?: string
  transmission: string
  mileage: number
  vin?: string
}

export interface SymptomData {
  complaint: string
  sounds: string[]
  vibrations: string[]
  smells: string[]
  warningLights: string[]
  conditions: string[]
  additionalNotes?: string
}

export interface ServiceHistory {
  lastServiceDate?: string
  partsReplaced: string[]
  modifications: string[]
}

export interface InitialChecks {
  errorCodes?: string
  visualInspection?: string
  testDriveNotes?: string
}

export interface DeepDiveData {
  [key: string]: string | string[]
}

export interface DiagnosisData {
  vehicle: VehicleData
  symptoms: SymptomData
  serviceHistory: ServiceHistory
  initialChecks: InitialChecks
  deepDive: DeepDiveData
  diagnosisId?: string
  aiAnalysis?: any
}

interface DiagnosisWizardProps {
  onComplete: (data: DiagnosisData) => void
  onCancel: () => void
}

// API interfaces
interface Brand {
  id: string
  name: string
  country: string
  popular: boolean
}

interface Vehicle {
  id: string
  brand: string
  model: string
  variant: string | null
  years: string
  type: string
  segment: string | null
  engines: Array<{
    id: string
    code: string
    displacement: number
    cylinders: number
    fuel: string
    aspiration: string
    power: number
    torque: number
    transmissions: string[]
  }>
}

const transmissionTypes = ['Manual (MT)', 'Otomatis (AT)', 'CVT', 'DCT', 'Hybrid']

const soundOptions = [
  'Knocking (ketukan keras)',
  'Whining (bunyi mendesing)',
  'Squealing (bunyi tajam)',
  'Grinding (bunyi kasar)',
  'Hissing (bunyi desing)',
  'Popping (bunyi meledak)',
  'Tidak ada suara aneh'
]

const vibrationOptions = [
  'Getaran di setir',
  'Getaran di pedal rem',
  'Getaran di pedal gas',
  'Getaran di kursi pengemudi',
  'Getaran di seluruh body',
  'Tidak ada getaran'
]

const smellOptions = [
  'Bau bensin',
  'Bau oli mesin',
  'Bau asap hitam (fuel rich)',
  'Bau asap putih (oli ikut terbakar)',
  'Bau asap biru (oli ikut terbakar)',
  'Bau plastik terbakar',
  'Bau karet terbakar',
  'Tidak ada bau aneh'
]

const warningLightOptions = [
  'Check Engine (CEL)',
  'ABS Warning',
  'Airbag Warning',
  'Battery/Alternator',
  'Oil Pressure',
  'Temperature Warning',
  'Brake System',
  'TPMS (Tire Pressure)',
  'Lampu indikator lainnya',
  'Tidak ada lampu menyala'
]

const conditionOptions = [
  'Saat idle (mesin diam)',
  'Saat akselerasi (gas)',
  'Saat deselerasi (rem/mundur)',
  'Saat kecepatan tinggi (highway)',
  'Saat kecepatan rendah (macet)',
  'Saat hujan/lembab',
  'Saat dingin (baru start)',
  'Saat panas (sudah jalan)',
  'Kapan saja/random',
  'Terus-menerus'
]

export default function DiagnosisWizard({ onComplete, onCancel }: DiagnosisWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<DiagnosisData>({
    vehicle: {
      brand: '',
      model: '',
      year: '',
      engineCode: '',
      engineId: '',
      transmission: '',
      mileage: 0,
      vin: ''
    },
    symptoms: {
      complaint: '',
      sounds: [],
      vibrations: [],
      smells: [],
      warningLights: [],
      conditions: [],
      additionalNotes: ''
    },
    serviceHistory: {
      partsReplaced: [],
      modifications: []
    },
    initialChecks: {},
    deepDive: {}
  })

  // API state
  const [brands, setBrands] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  // Load brands on mount
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const response = await fetch('/api/vehicles/brands')
        const result = await response.json()
        if (result.success) {
          setBrands(result.data)
        }
      } catch (error) {
        console.error('Error loading brands:', error)
      }
    }
    loadBrands()
  }, [])

  // Load models when brand changes
  useEffect(() => {
    const loadModels = async () => {
      if (!data.vehicle.brand) {
        setModels([])
        return
      }

      try {
        const response = await fetch(`/api/vehicles/models?brand=${encodeURIComponent(data.vehicle.brand)}`)
        const result = await response.json()
        if (result.success) {
          setModels(result.data)
        }
      } catch (error) {
        console.error('Error loading models:', error)
      }
    }
    loadModels()
  }, [data.vehicle.brand])

  // Load vehicles when brand and model change
  useEffect(() => {
    const loadVehicles = async () => {
      if (!data.vehicle.brand || !data.vehicle.model) {
        setVehicles([])
        return
      }

      try {
        const response = await fetch(`/api/vehicles?brand=${encodeURIComponent(data.vehicle.brand)}&model=${encodeURIComponent(data.vehicle.model)}`)
        const result = await response.json()
        if (result.success) {
          setVehicles(result.data)
        }
      } catch (error) {
        console.error('Error loading vehicles:', error)
      }
    }
    loadVehicles()
  }, [data.vehicle.brand, data.vehicle.model])

  const calculateProgress = () => {
    let completed = 0
    const total = 5

    // Step 1: Vehicle data
    if (data.vehicle.brand && data.vehicle.model && data.vehicle.year &&
        data.vehicle.engineCode && data.vehicle.transmission && data.vehicle.mileage) {
      completed++
    }

    // Step 2: Symptoms
    if (data.symptoms.complaint &&
        (data.symptoms.sounds.length > 0 || data.symptoms.vibrations.length > 0 ||
         data.symptoms.smells.length > 0 || data.symptoms.warningLights.length > 0)) {
      completed++
    }

    // Step 3: Service history (optional but helpful)
    completed++

    // Step 4: Initial checks
    if (data.initialChecks.errorCodes || data.initialChecks.visualInspection || data.initialChecks.testDriveNotes) {
      completed++
    }

    // Step 5: Deep dive (dynamic, optional)
    completed++

    return (completed / total) * 100
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        // Untuk step 1, minimal butuh brand, model, year, transmission, dan mileage
        // Engine code opsional jika tidak ada data engine
        return data.vehicle.brand && data.vehicle.model && data.vehicle.year &&
               data.vehicle.transmission && data.vehicle.mileage > 0
      case 2:
        return data.symptoms.complaint?.trim().length > 0
      case 3:
        return true // Service history is optional
      case 4:
        return true // Initial checks are helpful but not required
      case 5:
        return true // Deep dive is optional
      default:
        return false
    }
  }

  const getStepTitle = (step: number) => {
    const titles = [
      'Identifikasi Kendaraan',
      'Gejala & Keluhan',
      'Riwayat Servis',
      'Pengecekan Awal',
      'Data Pendukung'
    ]
    return titles[step - 1]
  }

  const handleCheckboxChange = useCallback((category: keyof SymptomData | keyof ServiceHistory, value: string) => {
    if (category === 'partsReplaced' || category === 'modifications') {
      const currentArray = data.serviceHistory[category] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      setData(prev => ({
        ...prev,
        serviceHistory: { ...prev.serviceHistory, [category]: newArray }
      }))
    } else {
      const currentArray = data.symptoms[category] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      setData(prev => ({
        ...prev,
        symptoms: { ...prev.symptoms, [category]: newArray }
      }))
    }
  }, [data])

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsLoading(true)
      try {
        // Prepare data for API
        const diagnosisPayload = {
          vehicle: {
            ...data.vehicle,
            mileage: Number(data.vehicle.mileage)
          },
          symptoms: data.symptoms,
          serviceHistory: data.serviceHistory,
          dtcCodes: data.initialChecks.errorCodes ? 
            data.initialChecks.errorCodes.split(',').map(code => code.trim().toUpperCase()) : [],
          testResults: {
            visualInspection: data.initialChecks.visualInspection,
            testDriveNotes: data.initialChecks.testDriveNotes
          }
        }

        const response = await fetch('/api/diagnosis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(diagnosisPayload)
        })

        const result = await response.json()
        
        if (result.success) {
          onComplete({
            ...data,
            diagnosisId: result.data.id,
            aiAnalysis: result.data.aiAnalysis
          })
        } else {
          throw new Error(result.error || 'Gagal membuat diagnosis')
        }
      } catch (error) {
        console.error('Error creating diagnosis:', error)
        alert('Gagal membuat diagnosis. Silakan coba lagi.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onCancel()
    }
  }

  const handleBrandChange = (brand: string) => {
    setData(prev => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        brand: brand,
        model: '',
        engineCode: '',
        engineId: ''
      }
    }))
    setSelectedVehicle(null)
  }

  const handleModelChange = (model: string) => {
    setData(prev => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        model: model,
        engineCode: '',
        engineId: ''
      }
    }))
    setSelectedVehicle(null)
  }

  const handleVehicleVariantChange = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (vehicle) {
      setSelectedVehicle(vehicle)
      setData(prev => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          variant: vehicle.variant || '',
          years: vehicle.years
        }
      }))
    }
  }

  const handleEngineChange = (engineCode: string) => {
    const engine = selectedVehicle?.engines.find(e => e.code === engineCode)
    setData(prev => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        engineCode: engineCode,
        engineId: engine?.id || ''
      }
    }))
  }

  const getBrandInfo = () => {
    return data.vehicle.brand
  }

  const getEngineInfo = () => {
    const engine = selectedVehicle?.engines.find(e => e.code === data.vehicle.engineCode)
    if (engine) {
      return `${engine.code} - ${engine.fuel} ${engine.aspiration} - ${engine.displacement}cc (${engine.cylinders} cyl) - ${engine.power}HP/${engine.torque}Nm`
    }
    return data.vehicle.engineCode
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Brand Selection */}
      <div>
        <Label htmlFor="brand">Merek Kendaraan *</Label>
        <Select value={data.vehicle.brand} onValueChange={handleBrandChange}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih merek kendaraan" />
          </SelectTrigger>
          <SelectContent>
            {brands.map(brand => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model Selection */}
      {data.vehicle.brand && (
        <div>
          <Label htmlFor="model">Model Kendaraan *</Label>
          <Select value={data.vehicle.model} onValueChange={handleModelChange} disabled={!data.vehicle.brand}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih model kendaraan" />
            </SelectTrigger>
            <SelectContent className="max-h-[400px] overflow-y-auto z-50">
              {models.length > 0 ? (
                <>
                  <div className="px-3 py-2 text-sm text-slate-500 border-b sticky top-0 bg-white">
                    {models.length} model tersedia untuk {data.vehicle.brand}
                  </div>
                  {models.map(model => (
                    <SelectItem key={model} value={model} className="hover:bg-accent">
                      {model}
                    </SelectItem>
                  ))}
                </>
              ) : (
                <div className="px-3 py-8 text-center text-sm text-slate-500">
                  Silakan pilih merek terlebih dahulu
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Vehicle Variant Selection */}
      {data.vehicle.brand && data.vehicle.model && vehicles.length > 0 && (
        <div>
          <Label htmlFor="variant">Varian Kendaraan *</Label>
          <Select value={selectedVehicle?.id || ''} onValueChange={handleVehicleVariantChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih varian kendaraan" />
            </SelectTrigger>
            <SelectContent className="max-h-[400px] overflow-y-auto z-50">
              {vehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id} className="hover:bg-accent">
                  <div className="flex flex-col">
                    <span className="font-medium">{vehicle.variant || 'Standard'}</span>
                    <span className="text-xs text-slate-500">{vehicle.years} • {vehicle.type}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Year Selection */}
      <div>
        <Label htmlFor="year">Tahun Produksi *</Label>
        <Select 
          value={data.vehicle.year} 
          onValueChange={(value) => setData(prev => ({ ...prev, vehicle: { ...prev.vehicle, year: value } }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih tahun" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {Array.from({ length: 16 }, (_, i) => 2024 - i).map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Engine Selection atau Manual Input */}
      <div>
        <Label htmlFor="engineCode">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            <span>Kode Mesin</span>
          </div>
        </Label>
        
        {selectedVehicle && selectedVehicle.engines.length > 0 ? (
          // Jika ada data engine dari database
          <Select value={data.vehicle.engineCode} onValueChange={handleEngineChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kode mesin" />
            </SelectTrigger>
            <SelectContent className="max-h-[400px] overflow-y-auto z-50">
              <div className="px-3 py-2 text-sm text-slate-500 border-b sticky top-0 bg-white">
                {selectedVehicle.engines.length} varian mesin tersedia
              </div>
              {selectedVehicle.engines.map(engine => (
                <SelectItem key={engine.code} value={engine.code} className="hover:bg-accent">
                  <div className="flex flex-col">
                    <span className="font-medium">{engine.code} - {engine.fuel} {engine.aspiration}</span>
                    <span className="text-xs text-slate-500">{engine.displacement}cc • {engine.cylinders} cyl • {engine.power}HP</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          // Jika tidak ada data engine, input manual
          <Input
            id="engineCode"
            placeholder="Contoh: 1NZ-FE, K15B, 4A91"
            value={data.vehicle.engineCode}
            onChange={(e) => setData(prev => ({ ...prev, vehicle: { ...prev.vehicle, engineCode: e.target.value } }))}
          />
        )}
        
        {data.vehicle.engineCode && selectedVehicle && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Spesifikasi Mesin:</span> {getEngineInfo()}
            </p>
          </div>
        )}
        
        <p className="text-sm text-slate-500 mt-1">
          Masukkan kode mesin kendaraan (biasanya tertera di engine bay)
        </p>
      </div>

      {/* Transmission */}
      <div>
        <Label htmlFor="transmission">Jenis Transmisi *</Label>
        <Select
          value={data.vehicle.transmission}
          onValueChange={(value) =>
            setData(prev => ({ ...prev, vehicle: { ...prev.vehicle, transmission: value } }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih transmisi" />
          </SelectTrigger>
          <SelectContent>
            {transmissionTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mileage */}
      <div>
        <Label htmlFor="mileage">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Kilometer Saat Ini *</span>
          </div>
        </Label>
        <Input
          id="mileage"
          type="number"
          placeholder="Contoh: 150000"
          value={data.vehicle.mileage || ''}
          onChange={(e) => setData(prev => ({ ...prev, vehicle: { ...prev.vehicle, mileage: parseInt(e.target.value) || 0 } }))}
        />
        <p className="text-sm text-slate-500 mt-1">Dalam kilometer (km)</p>
      </div>

      {/* VIN */}
      <div>
        <Label htmlFor="vin">Nomor VIN (Opsional)</Label>
        <Input
          id="vin"
          placeholder="17 karakter kode VIN kendaraan"
          value={data.vehicle.vin}
          onChange={(e) => setData(prev => ({ ...prev, vehicle: { ...prev.vehicle, vin: e.target.value } }))}
        />
        <p className="text-sm text-slate-500 mt-1">
          <Info className="inline w-4 h-4 mr-1" />
          VIN membantu validasi spesifikasi kendaraan secara otomatis
        </p>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="complaint">Keluhan Utama Pelanggan *</Label>
        <Textarea
          id="complaint"
          placeholder="Jelaskan keluhan utama pelanggan secara detail..."
          rows={4}
          value={data.symptoms.complaint}
          onChange={(e) => setData(prev => ({
            ...prev,
            symptoms: { ...prev.symptoms, complaint: e.target.value }
          }))}
        />
        <p className="text-sm text-slate-500 mt-2">
          Contoh: Mesin mati mendadak saat lampu merah, ada getaran saat idle, konsumsi BBM boros
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="w-5 h-5" />
              Suara Anomali
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {soundOptions.map(sound => (
              <div key={sound} className="flex items-start space-x-3">
                <Checkbox
                  id={`sound-${sound}`}
                  checked={data.symptoms.sounds.includes(sound)}
                  onCheckedChange={() => handleCheckboxChange('sounds', sound)}
                />
                <Label htmlFor={`sound-${sound}`} className="text-sm font-normal cursor-pointer flex-1">
                  {sound}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="w-5 h-5" />
              Lokasi Getaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {vibrationOptions.map(vibration => (
              <div key={vibration} className="flex items-start space-x-3">
                <Checkbox
                  id={`vibration-${vibration}`}
                  checked={data.symptoms.vibrations.includes(vibration)}
                  onCheckedChange={() => handleCheckboxChange('vibrations', vibration)}
                />
                <Label htmlFor={`vibration-${vibration}`} className="text-sm font-normal cursor-pointer flex-1">
                  {vibration}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              💨 Bau Tidak Wajar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {smellOptions.map(smell => (
              <div key={smell} className="flex items-start space-x-3">
                <Checkbox
                  id={`smell-${smell}`}
                  checked={data.symptoms.smells.includes(smell)}
                  onCheckedChange={() => handleCheckboxChange('smells', smell)}
                />
                <Label htmlFor={`smell-${smell}`} className="text-sm font-normal cursor-pointer flex-1">
                  {smell}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              💡 Lampu Indikator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {warningLightOptions.map(light => (
              <div key={light} className="flex items-start space-x-3">
                <Checkbox
                  id={`light-${light}`}
                  checked={data.symptoms.warningLights.includes(light)}
                  onCheckedChange={() => handleCheckboxChange('warningLights', light)}
                />
                <Label htmlFor={`light-${light}`} className="text-sm font-normal cursor-pointer flex-1">
                  {light}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="w-5 h-5" />
            Kondisi Munculnya Gejala
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {conditionOptions.map(condition => (
              <div key={condition} className="flex items-start space-x-3">
                <Checkbox
                  id={`condition-${condition}`}
                  checked={data.symptoms.conditions.includes(condition)}
                  onCheckedChange={() => handleCheckboxChange('conditions', condition)}
                />
                <Label htmlFor={`condition-${condition}`} className="text-sm font-normal cursor-pointer flex-1">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="additionalNotes">Catatan Tambahan (Opsional)</Label>
        <Textarea
          id="additionalNotes"
          placeholder="Detail tambahan yang belum tercakup di atas..."
          rows={3}
          value={data.symptoms.additionalNotes}
          onChange={(e) => setData(prev => ({
            ...prev,
            symptoms: { ...prev.symptoms, additionalNotes: e.target.value }
          }))}
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Informasi riwayat servis dan modifikasi membantu AI memberikan diagnosa yang lebih akurat.
        </AlertDescription>
      </Alert>

      <div>
        <Label htmlFor="lastServiceDate">Tanggal Servis Terakhir</Label>
        <Input
          id="lastServiceDate"
          type="date"
          value={data.serviceHistory.lastServiceDate}
          onChange={(e) => setData(prev => ({
            ...prev,
            serviceHistory: { ...prev.serviceHistory, lastServiceDate: e.target.value }
          }))}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Part yang Pernah Diganti</CardTitle>
          <CardDescription>Pilih komponen yang sudah pernah diganti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              'Busi', 'Filter udara', 'Filter oli', 'Filter bensin',
              'Timing belt', 'Radiator', 'Water pump', 'Alternator',
              'Aki', 'Rem depan', 'Rem belakang', 'Shockbreaker',
              'Transmisi', 'ECU', 'Injektor', 'Turbo/Supercharger',
              'Catalytic converter', 'O2 sensor', 'Sensor lainnya', 'Tidak ada'
            ].map(part => (
              <div key={part} className="flex items-start space-x-3">
                <Checkbox
                  id={`part-${part}`}
                  checked={data.serviceHistory.partsReplaced.includes(part)}
                  onCheckedChange={() => handleCheckboxChange('partsReplaced', part)}
                />
                <Label htmlFor={`part-${part}`} className="text-sm font-normal cursor-pointer">
                  {part}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Modifikasi Kendaraan</CardTitle>
          <CardDescription>Pilih modifikasi yang pernah dilakukan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'ECU remap/tuning', 'Aftermarket turbo', 'Cold air intake',
              'Exhaust custom', 'Suspensi sport', 'Velg/ban lebar',
              'Sound system', 'Lampu custom', 'Body kit/spoiler',
              'Interior custom', 'Audio system', 'Modifikasi lainnya',
              'Tidak ada modifikasi'
            ].map(mod => (
              <div key={mod} className="flex items-start space-x-3">
                <Checkbox
                  id={`mod-${mod}`}
                  checked={data.serviceHistory.modifications.includes(mod)}
                  onCheckedChange={() => handleCheckboxChange('modifications', mod)}
                />
                <Label htmlFor={`mod-${mod}`} className="text-sm font-normal cursor-pointer">
                  {mod}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Pengecekan awal membantu mempersempit area masalah sebelum dilakukan diagnosa lebih detail.
        </AlertDescription>
      </Alert>

      <div>
        <Label htmlFor="errorCodes">Kode Error (OBD-II Scanner)</Label>
        <Input
          id="errorCodes"
          placeholder="Contoh: P0300, P0171, C0035 (pisahkan dengan koma)"
          value={data.initialChecks.errorCodes}
          onChange={(e) => setData(prev => ({
            ...prev,
            initialChecks: { ...prev.initialChecks, errorCodes: e.target.value }
          }))}
        />
        <p className="text-sm text-slate-500 mt-1">
          Masukkan kode yang muncul di scanner OBD-II untuk diagnosa lebih akurat
        </p>
      </div>

      <div>
        <Label htmlFor="visualInspection">Hasil Pengecekan Visual</Label>
        <Textarea
          id="visualInspection"
          placeholder="Catatan dari pengecekan visual (leak oli, kabel putus, komponen aus, dll)..."
          rows={4}
          value={data.initialChecks.visualInspection}
          onChange={(e) => setData(prev => ({
            ...prev,
            initialChecks: { ...prev.initialChecks, visualInspection: e.target.value }
          }))}
        />
      </div>

      <div>
        <Label htmlFor="testDriveNotes">Catatan Test Drive</Label>
        <Textarea
          id="testDriveNotes"
          placeholder="Observasi saat test drive (perilaku akselerasi, respons, suara, getaran, dll)..."
          rows={4}
          value={data.initialChecks.testDriveNotes}
          onChange={(e) => setData(prev => ({
            ...prev,
            initialChecks: { ...prev.initialChecks, testDriveNotes: e.target.value }
          }))}
        />
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          Data pendukung membantu AI memberikan diagnosa yang lebih komprehensif. Ini opsional tapi disarankan.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Data Kendaraan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Merek</p>
              <p className="font-semibold">{getBrandInfo()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Model</p>
              <p className="font-semibold">{data.vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Tahun</p>
              <p className="font-semibold">{data.vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Kilometer</p>
              <p className="font-semibold">{data.vehicle.mileage} km</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-500">Kode Mesin</p>
            <p className="font-semibold">{getEngineInfo()}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Transmisi</p>
            <p className="font-semibold">{data.vehicle.transmission}</p>
          </div>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="additionalData">Data Tambahan</Label>
        <Textarea
          id="additionalData"
          placeholder="Data tambahan yang relevan dengan diagnosa..."
          rows={6}
          onChange={(e) => setData(prev => ({
            ...prev,
            deepDive: { ...prev.deepDive, additionalData: e.target.value }
          }))}
        />
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Pastikan semua data yang diisi sudah benar. Klik "Selesai Diagnosa" untuk mendapatkan hasil analisa dari AI Master Teknisi.
        </AlertDescription>
      </Alert>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto pb-20 sm:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Wizard Diagnosa Kendaraan</h2>
          <p className="text-sm text-slate-600">
            Langkah {currentStep} dari 5: {getStepTitle(currentStep)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-slate-600"
        >
          <X className="w-4 h-4 mr-1" />
          Batal
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Progress</span>
          <span className="font-semibold text-blue-600">{Math.round(calculateProgress())}%</span>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </CardContent>
      </Card>

      {/* Navigation Buttons - Fixed at bottom for mobile */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 mt-6 -mx-4 sm:mx-0 sm:static sm:border-t-0 sm:bg-transparent sm:p-0">
        <div className="flex justify-between gap-4 max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex-1 h-12 text-base font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Batal' : 'Kembali'}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            className="flex-1 h-12 text-base font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menganalisa...
              </>
            ) : (
              <>
                {currentStep === 5 ? 'Selesai Diagnosa' : 'Lanjut'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
