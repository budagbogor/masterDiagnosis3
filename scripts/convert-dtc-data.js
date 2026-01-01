// Script untuk mengkonversi data DTC dari file Python ke format aplikasi
const fs = require('fs');

// Baca file Python yang sudah didownload
const pythonContent = fs.readFileSync('obd_codes.py', 'utf8');

// Extract DTC dictionary dari file Python
const dtcMatch = pythonContent.match(/DTC = \{([\s\S]*?)\}/);
if (!dtcMatch) {
  console.error('Tidak dapat menemukan dictionary DTC dalam file');
  process.exit(1);
}

const dtcContent = dtcMatch[1];

// Parse setiap entry DTC
const dtcEntries = [];
const lines = dtcContent.split('\n');

for (const line of lines) {
  const match = line.match(/^\s*"([^"]+)":\s*"([^"]+)",?\s*$/);
  if (match) {
    const [, code, description] = match;
    
    // Tentukan sistem berdasarkan prefix kode
    let system = 'P0';
    let subsystem = 'Generic';
    let severity = 'MEDIUM';
    
    if (code.startsWith('P0')) {
      system = 'P0';
      if (code >= 'P0100' && code <= 'P0199') {
        subsystem = 'Air/Fuel Metering';
      } else if (code >= 'P0200' && code <= 'P0299') {
        subsystem = 'Fuel System';
      } else if (code >= 'P0300' && code <= 'P0399') {
        subsystem = 'Ignition System';
        severity = 'HIGH';
      } else if (code >= 'P0400' && code <= 'P0499') {
        subsystem = 'Emission Control';
      } else if (code >= 'P0500' && code <= 'P0599') {
        subsystem = 'Auxiliary Emission';
      } else if (code >= 'P0600' && code <= 'P0699') {
        subsystem = 'Computer/Output Circuit';
        severity = 'HIGH';
      } else if (code >= 'P0700' && code <= 'P0999') {
        subsystem = 'Transmission';
      }
    } else if (code.startsWith('P1')) {
      system = 'P1';
      subsystem = 'Manufacturer Specific';
    } else if (code.startsWith('B')) {
      system = 'B0';
      subsystem = 'Body Control';
      severity = 'LOW';
    } else if (code.startsWith('C')) {
      system = 'C0';
      subsystem = 'Chassis Control';
    } else if (code.startsWith('U')) {
      system = 'U0';
      subsystem = 'Network Communication';
      severity = 'HIGH';
    }
    
    // Set severity khusus untuk kode-kode kritis
    if (code.includes('335') || code.includes('340') || code.includes('300') || 
        code.includes('301') || code.includes('302') || code.includes('303') || 
        code.includes('304') || code.includes('600') || code.includes('601')) {
      severity = 'CRITICAL';
    }
    
    // Generate symptoms, causes, dan procedures berdasarkan deskripsi
    const symptoms = generateSymptoms(code, description);
    const possibleCauses = generateCauses(code, description);
    const diagnosticSteps = generateDiagnosticSteps(code, description);
    const repairProcedures = generateRepairProcedures(code, description);
    const relatedSensors = generateRelatedSensors(code, description);
    const relatedActuators = generateRelatedActuators(code, description);
    
    dtcEntries.push({
      code,
      system,
      subsystem,
      description,
      descriptionIndonesian: translateToIndonesian(description),
      severity,
      symptoms,
      possibleCauses,
      diagnosticSteps,
      repairProcedures,
      relatedSensors,
      relatedActuators,
      applicableVehicles: ['Semua kendaraan EFI']
    });
  }
}

// Helper functions
function generateSymptoms(code, description) {
  const symptoms = [];
  
  if (description.includes('Misfire')) {
    symptoms.push('Mesin bergetar', 'Tenaga berkurang', 'Idle tidak stabil', 'Check engine light berkedip');
  } else if (description.includes('O2 Sensor') || description.includes('Oxygen')) {
    symptoms.push('Konsumsi BBM meningkat', 'Emisi gas buang tinggi', 'Check engine light');
  } else if (description.includes('MAF') || description.includes('Air Flow')) {
    symptoms.push('Idle tidak stabil', 'Hesitasi saat akselerasi', 'Konsumsi BBM tinggi');
  } else if (description.includes('Coolant Temperature')) {
    symptoms.push('Indikator suhu tidak akurat', 'Mesin overheat atau terlalu dingin');
  } else if (description.includes('Throttle')) {
    symptoms.push('Akselerasi tidak responsif', 'Mesin tersendat', 'Limp mode aktif');
  } else if (description.includes('Fuel')) {
    symptoms.push('Mesin sulit start', 'Performa menurun', 'Konsumsi BBM abnormal');
  } else if (description.includes('Ignition') || description.includes('Coil')) {
    symptoms.push('Mesin tidak start', 'Misfire', 'No spark');
  } else if (description.includes('Transmission')) {
    symptoms.push('Perpindahan gigi kasar', 'Slip transmisi', 'Limp mode');
  } else {
    symptoms.push('Check engine light menyala', 'Performa mesin menurun');
  }
  
  return symptoms;
}

function generateCauses(code, description) {
  const causes = [];
  
  if (description.includes('Circuit')) {
    causes.push('Kabel sensor putus atau korosi', 'Konektor longgar', 'Ground buruk');
  }
  if (description.includes('Sensor')) {
    causes.push('Sensor rusak', 'Kalibrasi sensor tidak tepat');
  }
  if (description.includes('High')) {
    causes.push('Short circuit ke power', 'Sensor rusak internal');
  }
  if (description.includes('Low')) {
    causes.push('Short circuit ke ground', 'Kabel putus');
  }
  if (description.includes('Performance') || description.includes('Range')) {
    causes.push('Sensor terkontaminasi', 'Kalibrasi tidak tepat', 'Komponen aus');
  }
  
  if (causes.length === 0) {
    causes.push('Komponen rusak', 'Kabel bermasalah', 'ECU bermasalah');
  }
  
  return causes;
}

function generateDiagnosticSteps(code, description) {
  const steps = [
    'Scan kode DTC dengan scanner OBD-II',
    'Periksa data live sensor terkait',
    'Inspeksi visual komponen dan kabel',
    'Test tegangan dan resistansi',
    'Bandingkan dengan spesifikasi pabrikan'
  ];
  
  return steps;
}

function generateRepairProcedures(code, description) {
  const procedures = [];
  
  if (description.includes('Circuit')) {
    procedures.push('Perbaiki kabel yang rusak', 'Bersihkan konektor');
  }
  if (description.includes('Sensor')) {
    procedures.push('Ganti sensor yang rusak');
  }
  if (description.includes('Performance')) {
    procedures.push('Kalibrasi ulang sistem', 'Bersihkan komponen');
  }
  
  procedures.push('Reset ECU setelah perbaikan', 'Test drive untuk verifikasi');
  
  return procedures;
}

function generateRelatedSensors(code, description) {
  const sensors = [];
  
  if (description.includes('MAF') || description.includes('Air Flow')) {
    sensors.push('MAF Sensor', 'IAT Sensor');
  } else if (description.includes('O2') || description.includes('Oxygen')) {
    sensors.push('O2 Sensor', 'A/F Sensor');
  } else if (description.includes('Coolant')) {
    sensors.push('ECT Sensor', 'CHT Sensor');
  } else if (description.includes('Throttle')) {
    sensors.push('TPS', 'APP Sensor');
  } else if (description.includes('Crankshaft')) {
    sensors.push('CKP Sensor');
  } else if (description.includes('Camshaft')) {
    sensors.push('CMP Sensor');
  }
  
  return sensors;
}

function generateRelatedActuators(code, description) {
  const actuators = [];
  
  if (description.includes('Fuel')) {
    actuators.push('Fuel Injectors', 'Fuel Pump');
  } else if (description.includes('Ignition')) {
    actuators.push('Ignition Coils', 'Spark Plugs');
  } else if (description.includes('Throttle')) {
    actuators.push('Throttle Body', 'IACV');
  } else if (description.includes('Transmission')) {
    actuators.push('Shift Solenoids', 'TCC Solenoid');
  }
  
  return actuators;
}

function translateToIndonesian(description) {
  // Mapping umum untuk terjemahan
  const translations = {
    'Circuit': 'Sirkuit',
    'Malfunction': 'Kerusakan',
    'Performance': 'Kinerja',
    'Range': 'Rentang',
    'High': 'Tinggi',
    'Low': 'Rendah',
    'Sensor': 'Sensor',
    'Control': 'Kontrol',
    'System': 'Sistem',
    'Too': 'Terlalu',
    'Detected': 'Terdeteksi',
    'Open': 'Terbuka',
    'Short': 'Hubung Singkat',
    'Intermittent': 'Intermiten',
    'No Signal': 'Tidak Ada Sinyal',
    'Misfire': 'Misfire',
    'Cylinder': 'Silinder',
    'Engine': 'Mesin',
    'Fuel': 'Bahan Bakar',
    'Air': 'Udara',
    'Temperature': 'Suhu',
    'Pressure': 'Tekanan',
    'Flow': 'Aliran',
    'Throttle': 'Throttle',
    'Ignition': 'Pengapian',
    'Transmission': 'Transmisi',
    'Exhaust': 'Knalpot',
    'Intake': 'Intake',
    'Coolant': 'Coolant'
  };
  
  let translated = description;
  for (const [english, indonesian] of Object.entries(translations)) {
    translated = translated.replace(new RegExp(english, 'gi'), indonesian);
  }
  
  return translated;
}

// Generate TypeScript file
const tsContent = `// Database DTC Lengkap - Generated from OBD-II Standard
// Total: ${dtcEntries.length} kode DTC

export interface DTCDataItem {
  code: string
  system: string
  subsystem?: string
  description: string
  descriptionIndonesian: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  symptoms: string[]
  possibleCauses: string[]
  diagnosticSteps: string[]
  repairProcedures: string[]
  relatedSensors: string[]
  relatedActuators: string[]
  applicableVehicles?: string[]
}

export const COMPREHENSIVE_DTC_DATA: DTCDataItem[] = ${JSON.stringify(dtcEntries, null, 2)}

// Helper functions
export function findDTCByCode(code: string): DTCDataItem | undefined {
  return COMPREHENSIVE_DTC_DATA.find(dtc => dtc.code === code)
}

export function findDTCBySystem(system: string): DTCDataItem[] {
  return COMPREHENSIVE_DTC_DATA.filter(dtc => dtc.system === system)
}

export function searchDTCCodes(query: string): DTCDataItem[] {
  const searchTerm = query.toLowerCase()
  return COMPREHENSIVE_DTC_DATA.filter(dtc => 
    dtc.code.toLowerCase().includes(searchTerm) ||
    dtc.description.toLowerCase().includes(searchTerm) ||
    dtc.descriptionIndonesian.toLowerCase().includes(searchTerm)
  )
}

export function getDTCStatistics() {
  const total = COMPREHENSIVE_DTC_DATA.length
  const bySeverity = {
    LOW: COMPREHENSIVE_DTC_DATA.filter(dtc => dtc.severity === 'LOW').length,
    MEDIUM: COMPREHENSIVE_DTC_DATA.filter(dtc => dtc.severity === 'MEDIUM').length,
    HIGH: COMPREHENSIVE_DTC_DATA.filter(dtc => dtc.severity === 'HIGH').length,
    CRITICAL: COMPREHENSIVE_DTC_DATA.filter(dtc => dtc.severity === 'CRITICAL').length
  }
  
  const bySystem = {
    P0: COMPREHENSIVE_DTC_DATA.filter(dtc => dtc.system === 'P0').length,
    P1: COMPREHENSIVE_DTC_DATA.filter(dtc => dtc.system === 'P1').length,
    B0: COMPREHENSIVE_DTC_DATA.filter(dtc => dtc.system === 'B0').length,
    C0: COMPREHENSIVE_DTC_DATA.filter(dtc => dtc.system === 'C0').length,
    U0: COMPREHENSIVE_DTC_DATA.filter(dtc => dtc.system === 'U0').length
  }
  
  return {
    total,
    bySeverity,
    bySystem
  }
}
`;

// Tulis file TypeScript
fs.writeFileSync('src/lib/comprehensive-dtc-data.ts', tsContent);

console.log(`✅ Berhasil mengkonversi ${dtcEntries.length} kode DTC`);
console.log('📁 File disimpan di: src/lib/comprehensive-dtc-data.ts');

// Generate summary
const stats = {
  total: dtcEntries.length,
  bySystem: {
    P0: dtcEntries.filter(dtc => dtc.system === 'P0').length,
    P1: dtcEntries.filter(dtc => dtc.system === 'P1').length,
    B0: dtcEntries.filter(dtc => dtc.system === 'B0').length,
    C0: dtcEntries.filter(dtc => dtc.system === 'C0').length,
    U0: dtcEntries.filter(dtc => dtc.system === 'U0').length
  },
  bySeverity: {
    LOW: dtcEntries.filter(dtc => dtc.severity === 'LOW').length,
    MEDIUM: dtcEntries.filter(dtc => dtc.severity === 'MEDIUM').length,
    HIGH: dtcEntries.filter(dtc => dtc.severity === 'HIGH').length,
    CRITICAL: dtcEntries.filter(dtc => dtc.severity === 'CRITICAL').length
  }
};

console.log('\n📊 Statistik DTC:');
console.log(`Total: ${stats.total} kode`);
console.log(`P0 (Generic): ${stats.bySystem.P0}`);
console.log(`P1 (Manufacturer): ${stats.bySystem.P1}`);
console.log(`B0 (Body): ${stats.bySystem.B0}`);
console.log(`C0 (Chassis): ${stats.bySystem.C0}`);
console.log(`U0 (Network): ${stats.bySystem.U0}`);
console.log(`\nSeverity:`);
console.log(`LOW: ${stats.bySeverity.LOW}`);
console.log(`MEDIUM: ${stats.bySeverity.MEDIUM}`);
console.log(`HIGH: ${stats.bySeverity.HIGH}`);
console.log(`CRITICAL: ${stats.bySeverity.CRITICAL}`);