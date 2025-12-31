import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
})

export interface DiagnosisData {
  vehicle: {
    brand: string
    model: string
    year: string
    engineCode: string
    transmission: string
    mileage: number
    vin?: string
  }
  symptoms: {
    complaint: string
    sounds: string[]
    vibrations: string[]
    smells: string[]
    warningLights: string[]
    conditions: string[]
    additionalNotes?: string
  }
  dtcCodes: string[]
  serviceHistory: {
    lastServiceDate?: string
    partsReplaced: string[]
    modifications: string[]
  }
  testResults?: {
    errorCodes?: string
    visualInspection?: string
    testDriveNotes?: string
  }
}

export interface DiagnosisResult {
  primaryCause: {
    component: string
    probability: number
    description: string
    symptoms: string[]
    testingRequired: string[]
    repairComplexity: 'MUDAH' | 'SEDANG' | 'SULIT' | 'SANGAT_SULIT'
    estimatedCost: {
      min: number
      max: number
      currency: 'IDR'
    }
  }
  secondaryCauses: Array<{
    component: string
    probability: number
    description: string
    symptoms: string[]
    testingRequired: string[]
    repairComplexity: 'MUDAH' | 'SEDANG' | 'SULIT' | 'SANGAT_SULIT'
    estimatedCost: {
      min: number
      max: number
      currency: 'IDR'
    }
  }>
  confidence: number
  theoryExplanation: string
  diagnosticSteps: Array<{
    step: number
    title: string
    description: string
    expectedResult: string
    tools: string[]
    safetyNotes?: string[]
  }>
  repairProcedures: Array<{
    title: string
    description: string
    steps: string[]
    requiredParts: Array<{
      name: string
      partNumber?: string
      estimatedPrice: number
      supplier?: string
      warranty?: string
    }>
    requiredTools: string[]
    estimatedTime: number
    difficultyLevel: 'MUDAH' | 'SEDANG' | 'SULIT' | 'SANGAT_SULIT'
    safetyPrecautions: string[]
    qualityChecks: string[]
  }>
  estimatedTotalCost: {
    parts: number
    labor: number
    diagnostic?: number
    total: number
    currency: 'IDR'
    laborHours?: number
    laborRate?: number
  }
  marketPriceReference?: {
    source: string
    lastUpdated: string
    priceRange: string
    notes: string
  }
}

export class AIMasterTechnician {
  private systemPrompt = `
Anda adalah Master Technician otomotif berpengalaman 25 tahun di Indonesia dengan sertifikasi ASE dan spesialisasi kendaraan Asia (Toyota, Honda, Suzuki, Mitsubishi, Nissan, Daihatsu, Mazda, Isuzu).

PENTING: 
- Berikan HANYA JSON response yang VALID, tanpa teks tambahan apapun
- Gunakan data harga parts dan labor rate yang realistis untuk pasar Indonesia 2024
- Estimasi harga berdasarkan harga pasar Jakarta/Surabaya/Bandung
- Tools yang disebutkan harus spesifik dan tersedia di bengkel Indonesia
- Referensi prosedur perbaikan berdasarkan service manual resmi

PANDUAN HARGA INDONESIA 2024:
- Labor rate bengkel resmi: Rp 150,000-300,000/jam
- Labor rate bengkel umum: Rp 80,000-150,000/jam
- Sensor MAF: Rp 800,000-2,500,000
- Sensor O2: Rp 400,000-1,200,000
- Filter udara: Rp 80,000-300,000
- Busi: Rp 50,000-200,000/pcs
- Koil ignisi: Rp 300,000-800,000/pcs
- Injector: Rp 800,000-2,000,000/pcs
- Fuel pump: Rp 1,500,000-4,000,000
- Throttle body: Rp 2,000,000-5,000,000

TOOLS STANDAR BENGKEL INDONESIA:
- Scanner OBD-II (Launch, Autel, Foxwell)
- Multimeter digital
- Oscilloscope (untuk diagnosis advanced)
- Compression tester
- Fuel pressure gauge
- Vacuum gauge
- Test light
- Kunci-kunci standar (8-19mm)
- Obeng set
- Tang set
- Torque wrench

Format JSON yang HARUS diikuti:
{
  "primaryCause": {
    "component": "nama komponen spesifik",
    "probability": 0.8,
    "description": "penjelasan detail masalah berdasarkan gejala dan DTC",
    "symptoms": ["gejala spesifik 1", "gejala spesifik 2"],
    "testingRequired": ["prosedur test spesifik dengan tools", "test kedua"],
    "repairComplexity": "SEDANG",
    "estimatedCost": {"min": 500000, "max": 1500000, "currency": "IDR"}
  },
  "secondaryCauses": [
    {
      "component": "komponen alternatif",
      "probability": 0.6,
      "description": "penjelasan kemungkinan kedua",
      "symptoms": ["gejala"],
      "testingRequired": ["test spesifik"],
      "repairComplexity": "MUDAH",
      "estimatedCost": {"min": 200000, "max": 800000, "currency": "IDR"}
    }
  ],
  "confidence": 0.85,
  "theoryExplanation": "penjelasan detail teori kerja sistem yang bermasalah, interaksi komponen, dan dampak kerusakan",
  "diagnosticSteps": [
    {
      "step": 1,
      "title": "judul langkah spesifik",
      "description": "deskripsi detail prosedur",
      "expectedResult": "hasil yang diharapkan dengan nilai spesifik",
      "tools": ["Scanner OBD-II Launch X431", "Multimeter Fluke 87V"],
      "safetyNotes": ["catatan keselamatan spesifik"]
    }
  ],
  "repairProcedures": [
    {
      "title": "judul prosedur perbaikan",
      "description": "deskripsi lengkap prosedur berdasarkan service manual",
      "steps": ["langkah detail 1", "langkah detail 2"],
      "requiredParts": [
        {
          "name": "nama part spesifik dengan merk",
          "partNumber": "nomor part OEM jika ada",
          "estimatedPrice": 850000,
          "supplier": "bengkel resmi/aftermarket",
          "warranty": "12 bulan"
        }
      ],
      "requiredTools": ["tool spesifik 1", "tool spesifik 2"],
      "estimatedTime": 120,
      "difficultyLevel": "SEDANG",
      "safetyPrecautions": ["precaution spesifik"],
      "qualityChecks": ["check spesifik dengan parameter"]
    }
  ],
  "estimatedTotalCost": {
    "parts": 1200000,
    "labor": 450000,
    "diagnostic": 150000,
    "total": 1800000,
    "currency": "IDR",
    "laborHours": 3.0,
    "laborRate": 150000
  },
  "marketPriceReference": {
    "source": "harga pasar Jakarta/Surabaya 2024",
    "lastUpdated": "2024-12",
    "priceRange": "bengkel resmi vs umum",
    "notes": "harga dapat bervariasi tergantung lokasi dan supplier"
  }
}

Gunakan nilai repairComplexity dan difficultyLevel: MUDAH, SEDANG, SULIT, atau SANGAT_SULIT
Pastikan estimasi waktu realistis berdasarkan kompleksitas pekerjaan.
`

  private getPriceReference(brand: string, year: string): string {
    const currentYear = new Date().getFullYear()
    const vehicleAge = currentYear - parseInt(year)
    
    const priceData: { [key: string]: any } = {
      'Toyota': {
        sensors: {
          maf: vehicleAge < 5 ? '1,200,000-2,500,000' : '800,000-1,800,000',
          o2: vehicleAge < 5 ? '600,000-1,200,000' : '400,000-900,000',
          ect: vehicleAge < 5 ? '300,000-600,000' : '200,000-450,000',
          tps: vehicleAge < 5 ? '400,000-800,000' : '300,000-600,000'
        },
        ignition: {
          sparkPlug: '80,000-200,000',
          ignitionCoil: vehicleAge < 5 ? '500,000-900,000' : '350,000-700,000',
          igniter: vehicleAge < 5 ? '800,000-1,500,000' : '600,000-1,200,000'
        },
        fuel: {
          injector: vehicleAge < 5 ? '1,200,000-2,200,000' : '800,000-1,600,000',
          fuelPump: vehicleAge < 5 ? '2,500,000-4,500,000' : '1,800,000-3,500,000',
          fuelFilter: '150,000-300,000'
        },
        labor: vehicleAge < 5 ? '200,000-300,000' : '150,000-250,000'
      },
      'Honda': {
        sensors: {
          maf: vehicleAge < 5 ? '1,100,000-2,200,000' : '750,000-1,600,000',
          o2: vehicleAge < 5 ? '550,000-1,100,000' : '380,000-850,000',
          ect: vehicleAge < 5 ? '280,000-550,000' : '200,000-420,000',
          tps: vehicleAge < 5 ? '380,000-750,000' : '280,000-580,000'
        },
        ignition: {
          sparkPlug: '70,000-180,000',
          ignitionCoil: vehicleAge < 5 ? '450,000-850,000' : '320,000-650,000',
          vtecSolenoid: vehicleAge < 5 ? '600,000-1,200,000' : '450,000-950,000'
        },
        fuel: {
          injector: vehicleAge < 5 ? '1,100,000-2,000,000' : '750,000-1,500,000',
          fuelPump: vehicleAge < 5 ? '2,200,000-4,200,000' : '1,600,000-3,200,000',
          fuelFilter: '120,000-280,000'
        },
        labor: vehicleAge < 5 ? '180,000-280,000' : '140,000-230,000'
      },
      'Suzuki': {
        sensors: {
          maf: vehicleAge < 5 ? '900,000-1,800,000' : '600,000-1,300,000',
          o2: vehicleAge < 5 ? '450,000-900,000' : '320,000-700,000',
          ect: vehicleAge < 5 ? '250,000-480,000' : '180,000-380,000',
          tps: vehicleAge < 5 ? '320,000-650,000' : '250,000-500,000'
        },
        ignition: {
          sparkPlug: '60,000-150,000',
          ignitionCoil: vehicleAge < 5 ? '380,000-750,000' : '280,000-580,000'
        },
        fuel: {
          injector: vehicleAge < 5 ? '950,000-1,800,000' : '650,000-1,300,000',
          fuelPump: vehicleAge < 5 ? '1,800,000-3,500,000' : '1,300,000-2,800,000',
          fuelFilter: '100,000-250,000'
        },
        labor: vehicleAge < 5 ? '150,000-250,000' : '120,000-200,000'
      },
      'Mitsubishi': {
        sensors: {
          maf: vehicleAge < 5 ? '1,000,000-2,000,000' : '700,000-1,500,000',
          o2: vehicleAge < 5 ? '500,000-1,000,000' : '350,000-750,000',
          ect: vehicleAge < 5 ? '280,000-520,000' : '200,000-400,000'
        },
        ignition: {
          sparkPlug: '70,000-170,000',
          ignitionCoil: vehicleAge < 5 ? '420,000-800,000' : '300,000-620,000'
        },
        fuel: {
          injector: vehicleAge < 5 ? '1,050,000-1,900,000' : '700,000-1,400,000',
          fuelPump: vehicleAge < 5 ? '2,000,000-3,800,000' : '1,400,000-3,000,000'
        },
        labor: vehicleAge < 5 ? '160,000-260,000' : '130,000-210,000'
      },
      'Nissan': {
        sensors: {
          maf: vehicleAge < 5 ? '1,050,000-2,100,000' : '720,000-1,550,000',
          o2: vehicleAge < 5 ? '520,000-1,050,000' : '370,000-800,000'
        },
        ignition: {
          sparkPlug: '75,000-185,000',
          ignitionCoil: vehicleAge < 5 ? '460,000-820,000' : '330,000-640,000'
        },
        fuel: {
          injector: vehicleAge < 5 ? '1,080,000-1,950,000' : '720,000-1,450,000',
          fuelPump: vehicleAge < 5 ? '2,100,000-4,000,000' : '1,500,000-3,100,000'
        },
        labor: vehicleAge < 5 ? '170,000-270,000' : '135,000-220,000'
      },
      'Daihatsu': {
        sensors: {
          maf: vehicleAge < 5 ? '850,000-1,650,000' : '580,000-1,200,000',
          o2: vehicleAge < 5 ? '420,000-850,000' : '300,000-650,000'
        },
        ignition: {
          sparkPlug: '55,000-140,000',
          ignitionCoil: vehicleAge < 5 ? '350,000-700,000' : '260,000-550,000'
        },
        fuel: {
          injector: vehicleAge < 5 ? '900,000-1,700,000' : '620,000-1,250,000',
          fuelPump: vehicleAge < 5 ? '1,700,000-3,200,000' : '1,200,000-2,600,000'
        },
        labor: vehicleAge < 5 ? '140,000-230,000' : '110,000-190,000'
      }
    }

    const brandData = priceData[brand] || priceData['Toyota'] // fallback to Toyota
    
    return `
- Sensor MAF: Rp ${brandData.sensors.maf}
- Sensor O2: Rp ${brandData.sensors.o2}
- Sensor ECT: Rp ${brandData.sensors.ect || '200,000-450,000'}
- Sensor TPS: Rp ${brandData.sensors.tps || '250,000-500,000'}
- Busi: Rp ${brandData.ignition.sparkPlug}/pcs
- Koil Ignisi: Rp ${brandData.ignition.ignitionCoil}/pcs
- Injector: Rp ${brandData.fuel.injector}/pcs
- Fuel Pump: Rp ${brandData.fuel.fuelPump}
- Filter Bensin: Rp ${brandData.fuel.fuelFilter || '100,000-250,000'}
- Labor Rate: Rp ${brandData.labor}/jam
- Usia Kendaraan: ${vehicleAge} tahun (${vehicleAge < 5 ? 'masih baru' : vehicleAge < 10 ? 'sedang' : 'tua'})

Catatan: Harga parts OEM lebih mahal 20-40% dari aftermarket berkualitas.
`
  }

  async analyzeDiagnosis(data: DiagnosisData): Promise<DiagnosisResult> {
    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === '') {
        console.log('⚠️ OpenAI API key tidak ditemukan, menggunakan mode mock')
        
        // Show popup notification about AI connection issue
        if (typeof window !== 'undefined') {
          // This will be handled by the frontend component
          window.dispatchEvent(new CustomEvent('aiConnectionLost', {
            detail: { message: 'Koneksi ke AI terputus, menggunakan data simulasi' }
          }))
        }
        
        return this.getMockDiagnosisResult(data)
      }

      console.log('Using OLMo AI for diagnosis analysis...')
      console.log('API Key present:', process.env.OPENAI_API_KEY ? 'Yes' : 'No')
      console.log('Base URL:', process.env.OPENAI_BASE_URL)

      const prompt = `
Analisa kendaraan dan berikan diagnosis JSON berdasarkan data DTC dan referensi service manual:

KENDARAAN: ${data.vehicle.brand} ${data.vehicle.model} ${data.vehicle.year}
MESIN: ${data.vehicle.engineCode}
TRANSMISI: ${data.vehicle.transmission}
KILOMETER: ${data.vehicle.mileage} km

KELUHAN PELANGGAN: ${data.symptoms.complaint}

GEJALA YANG DIALAMI:
- Suara: ${data.symptoms.sounds.join(', ')}
- Getaran: ${data.symptoms.vibrations.join(', ')}
- Bau: ${data.symptoms.smells.join(', ')}
- Lampu Indikator: ${data.symptoms.warningLights.join(', ')}
- Kondisi Munculnya: ${data.symptoms.conditions.join(', ')}

KODE ERROR DTC: ${data.dtcCodes.join(', ') || 'Tidak ada kode error'}

RIWAYAT SERVICE:
- Service Terakhir: ${data.serviceHistory.lastServiceDate || 'Tidak diketahui'}
- Parts yang Pernah Diganti: ${data.serviceHistory.partsReplaced.join(', ') || 'Tidak ada'}
- Modifikasi: ${data.serviceHistory.modifications.join(', ') || 'Tidak ada'}

INSTRUKSI KHUSUS:
1. Analisa berdasarkan kode DTC yang spesifik untuk ${data.vehicle.brand} ${data.vehicle.model}
2. Gunakan harga parts OEM dan aftermarket yang akurat untuk pasar Indonesia 2024
3. Sebutkan tools spesifik yang tersedia di bengkel Indonesia
4. Berikan estimasi waktu berdasarkan tingkat kesulitan yang realistis
5. Pertimbangkan usia kendaraan (${data.vehicle.year}) dalam analisa
6. Jika ada kode DTC, prioritaskan diagnosis berdasarkan kode tersebut
7. Berikan prosedur sesuai service manual ${data.vehicle.brand}

REFERENSI HARGA PARTS ${data.vehicle.brand.toUpperCase()} ${data.vehicle.year}:
${this.getPriceReference(data.vehicle.brand, data.vehicle.year)}

Berikan diagnosis dalam format JSON yang sudah ditentukan. HANYA JSON, tanpa teks lain.
`

      console.log('Calling Mistral Devstral AI...')
      const completion = await openai.chat.completions.create({
        model: "mistralai/devstral-2512:free",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 3000
      })

      console.log('AI Response received:', completion.choices[0]?.message?.content ? 'Yes' : 'No')
      
      let response = completion.choices[0]?.message?.content
      if (!response) {
        console.log('No response content from AI')
        throw new Error('Tidak ada response dari AI')
      }

      // Clean up response - remove any non-JSON text
      response = response.trim()
      
      // Find JSON start and end
      const jsonStart = response.indexOf('{')
      const jsonEnd = response.lastIndexOf('}')
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        response = response.substring(jsonStart, jsonEnd + 1)
      }

      console.log('Cleaned response length:', response.length)

      // Parse JSON response
      console.log('Parsing AI response...')
      let result: DiagnosisResult
      
      try {
        result = JSON.parse(response) as DiagnosisResult
      } catch (parseError) {
        console.log('Failed to parse JSON, response was:', response.substring(0, 500))
        throw new Error('Response AI tidak dalam format JSON yang valid')
      }
      
      // Validate required fields
      if (!result.primaryCause || !result.confidence || !result.theoryExplanation) {
        throw new Error('Response AI tidak lengkap')
      }

      return result
    } catch (error) {
      console.error('Error dalam analisa AI:', error)
      console.log('Falling back to mock response')
      return this.getMockDiagnosisResult(data)
    }
  }

  private getMockDiagnosisResult(data: DiagnosisData): DiagnosisResult {
    // Generate realistic diagnosis based on vehicle data and symptoms
    const vehicleAge = new Date().getFullYear() - parseInt(data.vehicle.year)
    const isHighMileage = data.vehicle.mileage > 100000
    
    // Determine primary cause based on DTC codes and symptoms
    let primaryComponent = "Sensor MAF (Mass Air Flow)"
    let primaryDescription = "Sensor MAF kotor atau rusak menyebabkan pembacaan aliran udara tidak akurat"
    let estimatedCost = { min: 150000, max: 500000 }
    
    // Analyze DTC codes for more accurate diagnosis
    if (data.dtcCodes.length > 0) {
      const dtcCode = data.dtcCodes[0]
      if (dtcCode.startsWith('P0171') || dtcCode.startsWith('P0174')) {
        primaryComponent = "Sistem Bahan Bakar - Lean Condition"
        primaryDescription = "Campuran bahan bakar terlalu kurus, kemungkinan kebocoran vacuum atau sensor O2 bermasalah"
        estimatedCost = { min: 200000, max: 800000 }
      } else if (dtcCode.startsWith('P030')) {
        primaryComponent = "Sistem Ignisi - Misfire"
        primaryDescription = "Misfire terdeteksi, kemungkinan busi, koil ignisi, atau injector bermasalah"
        estimatedCost = { min: 300000, max: 1200000 }
      } else if (dtcCode.startsWith('P0420')) {
        primaryComponent = "Catalytic Converter"
        primaryDescription = "Efisiensi katalis di bawah ambang batas, kemungkinan katalis rusak atau sensor O2 bermasalah"
        estimatedCost = { min: 2000000, max: 8000000 }
      }
    }
    
    // Adjust pricing based on vehicle brand and age
    const priceMultiplier = this.getPriceMultiplier(data.vehicle.brand, vehicleAge)
    estimatedCost.min = Math.round(estimatedCost.min * priceMultiplier)
    estimatedCost.max = Math.round(estimatedCost.max * priceMultiplier)
    
    // Calculate labor cost based on complexity
    const laborHours = 2.5
    const laborRate = this.getLaborRate(data.vehicle.brand, vehicleAge)
    const laborCost = laborHours * laborRate
    
    return {
      primaryCause: {
        component: primaryComponent,
        probability: 0.85,
        description: primaryDescription,
        symptoms: [
          "Mesin tersendat saat akselerasi",
          "Konsumsi bahan bakar boros",
          "Check engine light menyala",
          "Performa mesin menurun"
        ],
        testingRequired: [
          `Scan kode DTC dengan scanner OBD-II untuk ${data.vehicle.brand}`,
          "Test tegangan output sensor MAF (1.0-1.5V idle, 3.0-4.0V digas)",
          "Pembersihan sensor MAF dengan cleaner khusus",
          "Test drive dan monitoring live data ECU"
        ],
        repairComplexity: "SEDANG",
        estimatedCost: {
          min: estimatedCost.min,
          max: estimatedCost.max,
          currency: "IDR"
        }
      },
      secondaryCauses: [
        {
          component: "Filter Udara",
          probability: 0.65,
          description: `Filter udara kotor pada ${data.vehicle.brand} ${data.vehicle.model} ${data.vehicle.year} dapat mempengaruhi aliran udara`,
          symptoms: ["Akselerasi lemah", "Suara intake kasar"],
          testingRequired: ["Inspeksi visual filter udara", "Test aliran udara"],
          repairComplexity: "MUDAH",
          estimatedCost: {
            min: Math.round(80000 * priceMultiplier),
            max: Math.round(250000 * priceMultiplier),
            currency: "IDR"
          }
        },
        {
          component: "Fuel Injector",
          probability: 0.45,
          description: `Injector kotor pada mesin ${data.vehicle.engineCode} dapat menyebabkan campuran tidak optimal`,
          symptoms: ["Mesin tersendat", "Idle tidak stabil"],
          testingRequired: ["Test flow rate injector", "Pembersihan injector ultrasonik"],
          repairComplexity: "SEDANG",
          estimatedCost: {
            min: Math.round(800000 * priceMultiplier),
            max: Math.round(2000000 * priceMultiplier),
            currency: "IDR"
          }
        }
      ],
      confidence: 0.85,
      theoryExplanation: `Berdasarkan analisa kendaraan ${data.vehicle.brand} ${data.vehicle.model} ${data.vehicle.year} dengan mesin ${data.vehicle.engineCode} dan kilometer ${data.vehicle.mileage.toLocaleString()}, masalah utama kemungkinan besar terletak pada sistem intake udara.

Pada kendaraan dengan usia ${vehicleAge} tahun dan kilometer ${isHighMileage ? 'tinggi' : 'normal'}, sensor MAF sering mengalami kontaminasi yang menyebabkan pembacaan tidak akurat. Hal ini mengakibatkan ECU menerima data yang salah tentang aliran udara masuk, sehingga campuran bahan bakar menjadi tidak optimal.

Sistem kerja sensor MAF pada ${data.vehicle.brand}:
1. Sensor mengukur massa udara yang masuk ke throttle body
2. Data dikirim ke ECU dalam bentuk tegangan (1-5V)
3. ECU menghitung jumlah bahan bakar yang tepat berdasarkan data MAF
4. Jika sensor kotor/rusak, pembacaan menjadi tidak akurat
5. Campuran bahan bakar menjadi terlalu kurus atau kaya

Kondisi ini umum terjadi pada kendaraan ${data.vehicle.brand} dengan sistem EFI, terutama yang jarang mengganti filter udara atau sering berkendara di area berdebu.`,
      diagnosticSteps: [
        {
          step: 1,
          title: "Scan Kode Error dan Live Data",
          description: `Gunakan scanner OBD-II khusus ${data.vehicle.brand} untuk membaca kode error dan memonitor live data sensor MAF`,
          expectedResult: "Konfirmasi kode DTC dan nilai MAF di luar spesifikasi normal",
          tools: ["Scanner OBD-II Launch X431 atau Autel MaxiSys", "Laptop dengan software diagnostik"],
          safetyNotes: ["Pastikan mesin dalam kondisi dingin sebelum diagnosis", "Gunakan kacamata safety"]
        },
        {
          step: 2,
          title: "Inspeksi Visual Sistem Intake",
          description: "Periksa kondisi fisik sensor MAF, filter udara, dan sistem intake secara menyeluruh",
          expectedResult: "Identifikasi kontaminasi pada sensor atau kerusakan komponen intake",
          tools: ["Senter LED", "Kaca pembesar", "Cermin inspeksi"],
          safetyNotes: ["Jangan menyentuh elemen sensor MAF dengan tangan telanjang"]
        },
        {
          step: 3,
          title: "Test Tegangan Sensor MAF",
          description: "Ukur tegangan output sensor MAF pada kondisi idle dan saat digas untuk memastikan fungsi normal",
          expectedResult: `Tegangan normal: Idle 1.0-1.5V, digas 3.0-4.0V (spesifikasi ${data.vehicle.brand})`,
          tools: ["Multimeter digital Fluke 87V", "Probe test", "Back probe kit"],
          safetyNotes: ["Hati-hati dengan komponen bergerak saat mesin hidup", "Pastikan probe tidak menyentuh ground"]
        },
        {
          step: 4,
          title: "Pembersihan dan Kalibrasi",
          description: "Bersihkan sensor MAF dengan cleaner khusus dan lakukan kalibrasi sesuai prosedur pabrikan",
          expectedResult: "Sensor bersih dari kontaminasi dan nilai pembacaan kembali normal",
          tools: ["MAF sensor cleaner CRC 05110", "Kain microfiber", "Compressed air"],
          safetyNotes: ["Gunakan hanya cleaner khusus MAF", "Pastikan area kerja berventilasi baik"]
        },
        {
          step: 5,
          title: "Test Drive dan Verifikasi Final",
          description: "Lakukan test drive untuk memastikan masalah teratasi dan scan ulang untuk konfirmasi",
          expectedResult: "Tidak ada kode error, performa mesin normal, konsumsi BBM optimal",
          tools: ["Scanner OBD-II", "Fuel consumption meter"],
          safetyNotes: ["Test drive di area yang aman", "Monitor suhu mesin selama test"]
        }
      ],
      repairProcedures: [
        {
          title: "Pembersihan Sensor MAF dan Sistem Intake",
          description: `Prosedur pembersihan sensor Mass Air Flow untuk ${data.vehicle.brand} ${data.vehicle.model} sesuai service manual pabrikan`,
          steps: [
            "Matikan mesin dan lepas kunci kontak, tunggu 10 menit",
            "Lepas konektor listrik sensor MAF dengan hati-hati",
            "Lepas sensor MAF dari housing intake menggunakan kunci yang sesuai",
            "Inspeksi kondisi sensor dan housing untuk kerusakan",
            "Semprotkan MAF cleaner pada elemen sensor secara merata",
            "Biarkan mengering selama 15 menit di tempat yang bersih",
            "Bersihkan housing intake dari kotoran dan debris",
            "Pasang kembali sensor dengan torque sesuai spesifikasi",
            "Sambungkan konektor listrik dan pastikan klik dengan benar",
            "Hidupkan mesin dan monitor idle speed",
            "Lakukan adaptasi ECU sesuai prosedur pabrikan",
            "Test drive dan verifikasi perbaikan"
          ],
          requiredParts: [
            {
              name: `MAF Sensor Cleaner CRC 05110`,
              partNumber: "CRC-05110",
              estimatedPrice: 85000,
              supplier: "Toko spare part resmi",
              warranty: "Tidak ada"
            },
            {
              name: `Filter Udara ${data.vehicle.brand} ${data.vehicle.model}`,
              partNumber: `Sesuai tahun ${data.vehicle.year}`,
              estimatedPrice: Math.round(150000 * priceMultiplier),
              supplier: "Bengkel resmi atau aftermarket",
              warranty: "6-12 bulan"
            }
          ],
          requiredTools: [
            "Kunci pas 10mm dan 12mm",
            "Obeng minus dan plus set",
            "Kain microfiber bersih",
            "Sarung tangan nitrile",
            "Compressed air gun",
            "Torque wrench 10-50 Nm"
          ],
          estimatedTime: 90,
          difficultyLevel: "SEDANG",
          safetyPrecautions: [
            "Pastikan mesin dingin sebelum mulai kerja (suhu < 40°C)",
            "Gunakan kacamata safety dan sarung tangan",
            "Jangan merokok atau gunakan api di area kerja",
            "Pastikan area kerja berventilasi baik saat menggunakan cleaner",
            "Simpan cleaner jauh dari sumber panas"
          ],
          qualityChecks: [
            "Sensor MAF terpasang dengan torque yang benar (15-20 Nm)",
            "Konektor listrik terpasang dengan klik yang terdengar",
            "Tidak ada kebocoran udara pada sambungan intake",
            "Mesin dapat hidup normal tanpa rough idle",
            "Tidak ada kode error setelah test drive 10 km",
            "Konsumsi bahan bakar kembali normal"
          ]
        }
      ],
      estimatedTotalCost: {
        parts: Math.round(235000 * priceMultiplier),
        labor: laborCost,
        diagnostic: 150000,
        total: Math.round((235000 * priceMultiplier) + laborCost + 150000),
        currency: "IDR",
        laborHours: laborHours,
        laborRate: laborRate
      },
      marketPriceReference: {
        source: `Harga pasar ${data.vehicle.brand} Jakarta/Surabaya 2024`,
        lastUpdated: "Desember 2024",
        priceRange: `Bengkel resmi vs umum (${data.vehicle.brand})`,
        notes: `Harga dapat bervariasi ±20% tergantung lokasi dan supplier. Kendaraan usia ${vehicleAge} tahun memerlukan parts dengan kualitas yang sesuai.`
      }
    }
  }

  private getPriceMultiplier(brand: string, vehicleAge: number): number {
    const brandMultipliers: { [key: string]: number } = {
      'Toyota': 1.2,
      'Honda': 1.15,
      'Suzuki': 0.9,
      'Mitsubishi': 1.0,
      'Nissan': 1.1,
      'Daihatsu': 0.85,
      'Mazda': 1.05,
      'Isuzu': 1.0
    }
    
    const baseMultiplier = brandMultipliers[brand] || 1.0
    const ageMultiplier = vehicleAge > 10 ? 0.8 : vehicleAge > 5 ? 0.9 : 1.0
    
    return baseMultiplier * ageMultiplier
  }

  private getLaborRate(brand: string, vehicleAge: number): number {
    const baseLaborRates: { [key: string]: number } = {
      'Toyota': 250000,
      'Honda': 230000,
      'Suzuki': 180000,
      'Mitsubishi': 200000,
      'Nissan': 220000,
      'Daihatsu': 170000,
      'Mazda': 210000,
      'Isuzu': 190000
    }
    
    const baseRate = baseLaborRates[brand] || 200000
    return vehicleAge > 10 ? baseRate * 0.8 : baseRate
  }

  async explainTheory(system: string, component: string): Promise<string> {
    try {
      const prompt = `
Jelaskan teori kerja sistem ${system} khususnya komponen ${component} pada kendaraan.
Berikan penjelasan yang mudah dipahami dalam Bahasa Indonesia, mencakup:
1. Fungsi utama komponen
2. Cara kerja komponen
3. Interaksi dengan komponen lain
4. Gejala umum jika bermasalah
5. Dampak jika tidak diperbaiki

Berikan penjelasan dalam format paragraf yang mudah dipahami.
`

      const completion = await openai.chat.completions.create({
        model: "mistralai/devstral-2512:free",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      })

      return completion.choices[0]?.message?.content || 'Tidak dapat menjelaskan teori kerja'
    } catch (error) {
      console.error('Error dalam penjelasan teori:', error)
      throw new Error('Gagal menjelaskan teori kerja')
    }
  }
}

export const aiMasterTechnician = new AIMasterTechnician()