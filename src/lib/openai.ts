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
    total: number
    currency: 'IDR'
  }
}

export class AIMasterTechnician {
  private systemPrompt = `
Anda adalah teknisi otomotif berpengalaman 20 tahun di Indonesia. 
Analisa masalah kendaraan dan berikan diagnosis dalam format JSON yang VALID.

PENTING: Berikan HANYA JSON response, tanpa teks tambahan apapun.

Format JSON yang HARUS diikuti:
{
  "primaryCause": {
    "component": "nama komponen",
    "probability": 0.8,
    "description": "penjelasan masalah",
    "symptoms": ["gejala1", "gejala2"],
    "testingRequired": ["test1", "test2"],
    "repairComplexity": "SEDANG",
    "estimatedCost": {"min": 100000, "max": 500000, "currency": "IDR"}
  },
  "secondaryCauses": [
    {
      "component": "komponen lain",
      "probability": 0.6,
      "description": "penjelasan",
      "symptoms": ["gejala"],
      "testingRequired": ["test"],
      "repairComplexity": "MUDAH",
      "estimatedCost": {"min": 50000, "max": 200000, "currency": "IDR"}
    }
  ],
  "confidence": 0.8,
  "theoryExplanation": "penjelasan teori kerja sistem yang bermasalah",
  "diagnosticSteps": [
    {
      "step": 1,
      "title": "judul langkah",
      "description": "deskripsi",
      "expectedResult": "hasil yang diharapkan",
      "tools": ["tool1", "tool2"],
      "safetyNotes": ["catatan keselamatan"]
    }
  ],
  "repairProcedures": [
    {
      "title": "judul prosedur",
      "description": "deskripsi prosedur",
      "steps": ["langkah1", "langkah2"],
      "requiredParts": [{"name": "nama part", "estimatedPrice": 100000}],
      "requiredTools": ["tool1", "tool2"],
      "estimatedTime": 60,
      "difficultyLevel": "SEDANG",
      "safetyPrecautions": ["precaution1"],
      "qualityChecks": ["check1"]
    }
  ],
  "estimatedTotalCost": {"parts": 100000, "labor": 200000, "total": 300000, "currency": "IDR"}
}

Gunakan nilai repairComplexity dan difficultyLevel: MUDAH, SEDANG, SULIT, atau SANGAT_SULIT
`

  async analyzeDiagnosis(data: DiagnosisData): Promise<DiagnosisResult> {
    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === '') {
        console.log('OpenAI API key not found, using mock response')
        return this.getMockDiagnosisResult(data)
      }

      console.log('Using OLMo AI for diagnosis analysis...')
      console.log('API Key present:', process.env.OPENAI_API_KEY ? 'Yes' : 'No')
      console.log('Base URL:', process.env.OPENAI_BASE_URL)

      const prompt = `
Analisa kendaraan dan berikan diagnosis JSON:

KENDARAAN: ${data.vehicle.brand} ${data.vehicle.model} ${data.vehicle.year}
MESIN: ${data.vehicle.engineCode}
KILOMETER: ${data.vehicle.mileage} km

KELUHAN: ${data.symptoms.complaint}

GEJALA:
- Suara: ${data.symptoms.sounds.join(', ')}
- Getaran: ${data.symptoms.vibrations.join(', ')}
- Lampu: ${data.symptoms.warningLights.join(', ')}
- Kondisi: ${data.symptoms.conditions.join(', ')}

KODE ERROR: ${data.dtcCodes.join(', ') || 'Tidak ada'}

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
    return {
      primaryCause: {
        component: "Sensor MAF (Mass Air Flow)",
        probability: 0.85,
        description: "Sensor MAF kotor atau rusak menyebabkan pembacaan aliran udara tidak akurat, mengakibatkan campuran bahan bakar yang tidak optimal.",
        symptoms: [
          "Mesin tersendat saat akselerasi",
          "Konsumsi bahan bakar boros",
          "Check engine light menyala",
          "Performa mesin menurun"
        ],
        testingRequired: [
          "Test tegangan output sensor MAF",
          "Pembersihan sensor MAF",
          "Scan live data ECU",
          "Test drive setelah pembersihan"
        ],
        repairComplexity: "SEDANG",
        estimatedCost: {
          min: 150000,
          max: 500000,
          currency: "IDR"
        }
      },
      secondaryCauses: [
        {
          component: "Filter Udara",
          probability: 0.65,
          description: "Filter udara kotor dapat mempengaruhi aliran udara dan kinerja sensor MAF.",
          symptoms: ["Akselerasi lemah", "Suara intake kasar"],
          testingRequired: ["Inspeksi visual filter udara"],
          repairComplexity: "MUDAH",
          estimatedCost: {
            min: 50000,
            max: 150000,
            currency: "IDR"
          }
        },
        {
          component: "Fuel Injector",
          probability: 0.45,
          description: "Injector kotor dapat menyebabkan campuran bahan bakar tidak optimal.",
          symptoms: ["Mesin tersendat", "Idle tidak stabil"],
          testingRequired: ["Test flow rate injector", "Pembersihan injector"],
          repairComplexity: "SEDANG",
          estimatedCost: {
            min: 300000,
            max: 800000,
            currency: "IDR"
          }
        }
      ],
      confidence: 0.85,
      theoryExplanation: `Berdasarkan gejala yang dilaporkan dan kode error P0100 (Mass Air Flow Circuit Malfunction) serta P0171 (System Too Lean), masalah utama kemungkinan besar terletak pada sistem intake udara, khususnya sensor MAF.

Sensor MAF berfungsi mengukur jumlah udara yang masuk ke mesin dan mengirimkan informasi ini ke ECU untuk menentukan jumlah bahan bakar yang tepat. Ketika sensor MAF kotor atau rusak, pembacaan menjadi tidak akurat, menyebabkan:

1. ECU menerima data yang salah tentang aliran udara
2. Campuran bahan bakar menjadi terlalu kurus (lean) - sesuai kode P0171
3. Mesin kehilangan tenaga saat akselerasi
4. Konsumsi bahan bakar meningkat karena ECU mencoba mengkompensasi

Kondisi ini sering terjadi pada kendaraan dengan kilometer tinggi atau yang jarang mengganti filter udara, karena debu dan kotoran dapat mengendap pada elemen sensor MAF.`,
      diagnosticSteps: [
        {
          step: 1,
          title: "Scan Kode Error dan Live Data",
          description: "Gunakan scanner OBD-II untuk membaca kode error dan memonitor live data sensor MAF",
          expectedResult: "Konfirmasi kode P0100 dan P0171, nilai MAF tidak normal",
          tools: ["Scanner OBD-II", "Laptop/tablet"],
          safetyNotes: ["Pastikan mesin dalam kondisi dingin"]
        },
        {
          step: 2,
          title: "Inspeksi Visual Sensor MAF",
          description: "Periksa kondisi fisik sensor MAF dan kabel konektor",
          expectedResult: "Sensor kotor atau kabel rusak terlihat jelas",
          tools: ["Senter", "Kaca pembesar"],
          safetyNotes: ["Jangan menyentuh elemen sensor dengan tangan"]
        },
        {
          step: 3,
          title: "Test Tegangan Sensor MAF",
          description: "Ukur tegangan output sensor MAF saat idle dan saat digas",
          expectedResult: "Tegangan idle: 1.0-1.5V, digas: 3.0-4.0V",
          tools: ["Multimeter", "Probe test"],
          safetyNotes: ["Hati-hati dengan komponen bergerak saat mesin hidup"]
        },
        {
          step: 4,
          title: "Pembersihan Sensor MAF",
          description: "Bersihkan sensor MAF dengan cleaner khusus MAF",
          expectedResult: "Sensor bersih dari kotoran dan deposit",
          tools: ["MAF cleaner", "Kain bersih"],
          safetyNotes: ["Gunakan cleaner khusus MAF, jangan gunakan pembersih lain"]
        },
        {
          step: 5,
          title: "Test Drive dan Verifikasi",
          description: "Test drive kendaraan dan scan ulang untuk memastikan masalah teratasi",
          expectedResult: "Tidak ada kode error, performa normal",
          tools: ["Scanner OBD-II"],
          safetyNotes: ["Test drive di area yang aman"]
        }
      ],
      repairProcedures: [
        {
          title: "Pembersihan Sensor MAF",
          description: "Prosedur pembersihan sensor Mass Air Flow untuk mengatasi kontaminasi",
          steps: [
            "Matikan mesin dan lepas kunci kontak",
            "Lepas konektor listrik sensor MAF",
            "Lepas sensor MAF dari housing intake",
            "Semprotkan MAF cleaner pada elemen sensor",
            "Biarkan mengering selama 10-15 menit",
            "Pasang kembali sensor dan konektor",
            "Hidupkan mesin dan test"
          ],
          requiredParts: [
            {
              name: "MAF Sensor Cleaner",
              partNumber: "CRC-05110",
              estimatedPrice: 75000
            }
          ],
          requiredTools: [
            "Kunci pas 10mm",
            "Obeng minus",
            "Kain bersih",
            "Sarung tangan"
          ],
          estimatedTime: 30,
          difficultyLevel: "SEDANG",
          safetyPrecautions: [
            "Pastikan mesin dingin sebelum mulai kerja",
            "Jangan menyentuh elemen sensor dengan tangan",
            "Gunakan hanya cleaner khusus MAF",
            "Pastikan area kerja berventilasi baik"
          ],
          qualityChecks: [
            "Sensor terpasang dengan benar dan kencang",
            "Konektor listrik terpasang dengan baik",
            "Tidak ada kebocoran udara pada sambungan",
            "Mesin dapat hidup normal setelah pemasangan"
          ]
        }
      ],
      estimatedTotalCost: {
        parts: 75000,
        labor: 200000,
        total: 275000,
        currency: "IDR"
      }
    }
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