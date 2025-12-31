// Database DTC Lengkap untuk Kendaraan di Indonesia
// Berdasarkan standar OBD-II dan data kendaraan 15 tahun terakhir

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

// =====================================================
// P0xxx - POWERTRAIN GENERIC CODES
// =====================================================

export const P0_FUEL_AIR_METERING: DTCDataItem[] = [
  {
    code: 'P0100',
    system: 'P0',
    subsystem: 'Air/Fuel Metering',
    description: 'Mass or Volume Air Flow Circuit Malfunction',
    descriptionIndonesian: 'Kerusakan Sirkuit Sensor Aliran Udara (MAF/VAF)',
    severity: 'MEDIUM',
    symptoms: [
      'Mesin tidak stabil saat idle',
      'Konsumsi bahan bakar meningkat',
      'Tenaga mesin berkurang',
      'Mesin sulit distarter'
    ],
    possibleCauses: [
      'Sensor MAF/VAF rusak atau kotor',
      'Kabel sensor MAF putus atau korosi',
      'Kebocoran pada intake manifold',
      'Filter udara sangat kotor',
      'ECU rusak'
    ],
    diagnosticSteps: [
      'Periksa kode DTC dengan scanner',
      'Inspeksi visual sensor MAF dan kabelnya',
      'Bersihkan sensor MAF dengan cleaner khusus',
      'Periksa tegangan referensi sensor (5V)',
      'Test resistansi kabel sensor',
      'Periksa kebocoran pada sistem intake'
    ],
    repairProcedures: [
      'Bersihkan atau ganti sensor MAF',
      'Perbaiki kabel yang rusak',
      'Ganti filter udara',
      'Perbaiki kebocoran intake manifold',
      'Reset ECU setelah perbaikan'
    ],
    relatedSensors: ['Mass Air Flow Sensor', 'Intake Air Temperature Sensor'],
    relatedActuators: ['Throttle Body', 'Fuel Injectors'],
    applicableVehicles: ['Toyota Avanza', 'Honda Jazz', 'Suzuki Ertiga', 'Daihatsu Xenia', 'Mitsubishi Xpander']
  },
  {
    code: 'P0171',
    system: 'P0',
    subsystem: 'Fuel System',
    description: 'System Too Lean (Bank 1)',
    descriptionIndonesian: 'Sistem Terlalu Kurus/Lean (Bank 1)',
    severity: 'MEDIUM',
    symptoms: [
      'Mesin tersendat saat akselerasi',
      'Idle kasar dan tidak stabil',
      'Konsumsi bahan bakar meningkat',
      'Emisi NOx tinggi',
      'Check engine light menyala'
    ],
    possibleCauses: [
      'Kebocoran vacuum pada intake manifold',
      'Sensor O2 rusak atau terkontaminasi',
      'Filter bahan bakar tersumbat',
      'Pompa bahan bakar lemah',
      'Injector kotor atau tersumbat',
      'Sensor MAF kotor atau rusak',
      'Kebocoran pada sistem PCV'
    ],
    diagnosticSteps: [
      'Periksa sistem vacuum dengan smoke test',
      'Test tekanan bahan bakar',
      'Periksa sinyal sensor O2',
      'Analisa data fuel trim jangka pendek dan panjang',
      'Periksa kondisi filter udara',
      'Test sensor MAF'
    ],
    repairProcedures: [
      'Perbaiki kebocoran vacuum',
      'Ganti sensor O2 jika rusak',
      'Bersihkan atau ganti injector',
      'Ganti filter bahan bakar',
      'Ganti pompa bahan bakar jika perlu',
      'Reset adaptasi ECU'
    ],
    relatedSensors: ['O2 Sensor Bank 1', 'MAF Sensor', 'Fuel Pressure Sensor'],
    relatedActuators: ['Fuel Injectors Bank 1', 'Fuel Pump', 'EVAP Purge Valve'],
    applicableVehicles: ['Toyota Avanza', 'Honda Jazz', 'Suzuki Ertiga', 'Mitsubishi Xpander', 'Daihatsu Xenia']
  },
  {
    code: 'P0172',
    system: 'P0',
    subsystem: 'Fuel System',
    description: 'System Too Rich (Bank 1)',
    descriptionIndonesian: 'Sistem Terlalu Kaya/Rich (Bank 1)',
    severity: 'MEDIUM',
    symptoms: [
      'Asap hitam dari knalpot',
      'Bau bensin kuat',
      'Konsumsi BBM sangat boros',
      'Spark plug hitam/basah',
      'Performa mesin menurun'
    ],
    possibleCauses: [
      'Injector bocor atau stuck open',
      'Fuel pressure terlalu tinggi',
      'Sensor MAF rusak',
      'Sensor O2 rusak',
      'EVAP purge valve stuck open',
      'ECT sensor bermasalah'
    ],
    diagnosticSteps: [
      'Periksa fuel trim data',
      'Test fuel pressure',
      'Periksa injector untuk kebocoran',
      'Test sensor MAF',
      'Periksa EVAP system',
      'Test sensor ECT'
    ],
    repairProcedures: [
      'Ganti injector yang bocor',
      'Perbaiki fuel pressure regulator',
      'Ganti sensor MAF',
      'Ganti sensor O2',
      'Perbaiki EVAP system',
      'Reset fuel trim'
    ],
    relatedSensors: ['O2 Sensor', 'MAF Sensor', 'ECT Sensor', 'Fuel Pressure Sensor'],
    relatedActuators: ['Fuel Injectors', 'Fuel Pressure Regulator', 'EVAP Purge Valve'],
    applicableVehicles: ['Honda CR-V', 'Toyota Fortuner', 'Mitsubishi Pajero Sport', 'Nissan X-Trail']
  }
]

export const P0_IGNITION_SYSTEM: DTCDataItem[] = [
  {
    code: 'P0300',
    system: 'P0',
    subsystem: 'Ignition System',
    description: 'Random/Multiple Cylinder Misfire Detected',
    descriptionIndonesian: 'Terdeteksi Misfire Acak/Multiple Silinder',
    severity: 'HIGH',
    symptoms: [
      'Mesin bergetar kasar',
      'Tenaga mesin berkurang drastis',
      'Konsumsi bahan bakar meningkat',
      'Emisi gas buang tinggi',
      'Mesin terasa tidak halus',
      'Check engine light berkedip'
    ],
    possibleCauses: [
      'Busi aus atau gap tidak tepat',
      'Koil ignisi rusak',
      'Kabel busi rusak atau bocor',
      'Injector kotor atau rusak',
      'Kompresi mesin rendah',
      'Timing belt/chain kendor',
      'Kualitas bahan bakar buruk',
      'Vacuum leak'
    ],
    diagnosticSteps: [
      'Periksa kondisi busi semua silinder',
      'Test koil ignisi dengan oscilloscope',
      'Periksa resistansi kabel busi',
      'Test kompresi mesin',
      'Periksa timing ignisi',
      'Analisa pola misfire dengan scanner',
      'Periksa kebocoran vacuum'
    ],
    repairProcedures: [
      'Ganti busi yang aus',
      'Ganti koil ignisi yang rusak',
      'Ganti kabel busi jika perlu',
      'Bersihkan atau ganti injector',
      'Perbaiki masalah kompresi',
      'Setel timing ignisi',
      'Perbaiki vacuum leak'
    ],
    relatedSensors: ['Crankshaft Position Sensor', 'Camshaft Position Sensor', 'Knock Sensor'],
    relatedActuators: ['Ignition Coils', 'Spark Plugs', 'Fuel Injectors'],
    applicableVehicles: ['Toyota Avanza', 'Honda Jazz', 'Suzuki Ertiga', 'Mitsubishi Xpander', 'Daihatsu Xenia']
  },
  {
    code: 'P0301',
    system: 'P0',
    subsystem: 'Ignition System',
    description: 'Cylinder 1 Misfire Detected',
    descriptionIndonesian: 'Terdeteksi Misfire Silinder 1',
    severity: 'HIGH',
    symptoms: [
      'Mesin bergetar',
      'Tenaga berkurang',
      'Idle tidak stabil',
      'Check engine light berkedip'
    ],
    possibleCauses: [
      'Busi silinder 1 rusak',
      'Koil silinder 1 rusak',
      'Injector silinder 1 bermasalah',
      'Kompresi silinder 1 rendah',
      'Valve silinder 1 bermasalah'
    ],
    diagnosticSteps: [
      'Periksa busi silinder 1',
      'Test koil silinder 1',
      'Swap komponen dengan silinder lain',
      'Test kompresi silinder 1',
      'Periksa injector silinder 1'
    ],
    repairProcedures: [
      'Ganti busi silinder 1',
      'Ganti koil silinder 1',
      'Ganti injector jika perlu',
      'Perbaiki masalah kompresi'
    ],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Ignition Coil 1', 'Spark Plug 1', 'Injector 1'],
    applicableVehicles: ['Semua kendaraan EFI']
  }
]

export const P0_EMISSION_CONTROL: DTCDataItem[] = [
  {
    code: 'P0420',
    system: 'P0',
    subsystem: 'Emission Control',
    description: 'Catalyst System Efficiency Below Threshold (Bank 1)',
    descriptionIndonesian: 'Efisiensi Sistem Katalis Di Bawah Ambang Batas (Bank 1)',
    severity: 'MEDIUM',
    symptoms: [
      'Emisi gas buang tinggi',
      'Gagal uji emisi',
      'Check engine light',
      'Bau sulfur dari knalpot'
    ],
    possibleCauses: [
      'Catalytic converter rusak',
      'Sensor O2 downstream rusak',
      'Kebocoran exhaust',
      'Mesin running rich/lean',
      'Misfiring berkepanjangan'
    ],
    diagnosticSteps: [
      'Periksa efisiensi catalyst dengan O2 sensor',
      'Bandingkan sinyal upstream vs downstream O2',
      'Test emisi gas buang',
      'Periksa kebocoran exhaust',
      'Analisa fuel trim'
    ],
    repairProcedures: [
      'Ganti catalytic converter',
      'Ganti sensor O2 downstream',
      'Perbaiki kebocoran exhaust',
      'Perbaiki masalah fuel system',
      'Perbaiki misfire'
    ],
    relatedSensors: ['O2 Sensor B1S1', 'O2 Sensor B1S2'],
    relatedActuators: ['Catalytic Converter', 'Fuel Injectors'],
    applicableVehicles: ['Semua kendaraan EFI dengan catalytic converter']
  },
  {
    code: 'P0440',
    system: 'P0',
    subsystem: 'Emission Control',
    description: 'Evaporative Emission Control System Malfunction',
    descriptionIndonesian: 'Kerusakan Sistem Kontrol Emisi Evaporatif (EVAP)',
    severity: 'LOW',
    symptoms: [
      'Bau bensin',
      'Check engine light',
      'Gagal uji emisi'
    ],
    possibleCauses: [
      'Tutup tangki bensin longgar',
      'EVAP canister rusak',
      'Purge valve stuck',
      'Vent valve bermasalah',
      'Hose EVAP bocor'
    ],
    diagnosticSteps: [
      'Periksa tutup tangki bensin',
      'Test EVAP system dengan smoke test',
      'Periksa purge valve',
      'Test vent valve',
      'Periksa EVAP canister'
    ],
    repairProcedures: [
      'Kencangkan tutup tangki',
      'Ganti EVAP canister',
      'Ganti purge valve',
      'Ganti vent valve',
      'Perbaiki hose yang bocor'
    ],
    relatedSensors: ['Fuel Tank Pressure Sensor'],
    relatedActuators: ['EVAP Purge Valve', 'EVAP Vent Valve'],
    applicableVehicles: ['Semua kendaraan EFI modern']
  }
]

export const P0_AUXILIARY_EMISSION: DTCDataItem[] = [
  {
    code: 'P0505',
    system: 'P0',
    subsystem: 'Auxiliary Emission',
    description: 'Idle Air Control System Malfunction',
    descriptionIndonesian: 'Kerusakan Sistem Kontrol Udara Idle (IACV)',
    severity: 'MEDIUM',
    symptoms: [
      'Idle tidak stabil',
      'RPM idle terlalu tinggi/rendah',
      'Mesin mati saat idle',
      'Stalling saat berhenti'
    ],
    possibleCauses: [
      'IACV rusak atau kotor',
      'Throttle body kotor',
      'Vacuum leak',
      'Kabel IACV bermasalah',
      'ECU bermasalah'
    ],
    diagnosticSteps: [
      'Periksa operasi IACV',
      'Bersihkan throttle body',
      'Test vacuum system',
      'Periksa kabel IACV',
      'Test dengan scanner'
    ],
    repairProcedures: [
      'Bersihkan atau ganti IACV',
      'Bersihkan throttle body',
      'Perbaiki vacuum leak',
      'Perbaiki kabel IACV',
      'Reset idle learn'
    ],
    relatedSensors: ['TPS', 'ECT Sensor', 'MAP Sensor'],
    relatedActuators: ['Idle Air Control Valve', 'Throttle Body'],
    applicableVehicles: ['Toyota Kijang', 'Honda Civic', 'Suzuki Baleno', 'Mitsubishi Lancer']
  }
]

// =====================================================
// ADDITIONAL DTC CODES FOR INDONESIAN VEHICLES
// =====================================================

export const P0_ADDITIONAL_CODES: DTCDataItem[] = [
  {
    code: 'P0101',
    system: 'P0',
    subsystem: 'Air/Fuel Metering',
    description: 'Mass or Volume Air Flow Circuit Range/Performance',
    descriptionIndonesian: 'Masalah Kinerja/Rentang Sirkuit Sensor Aliran Udara',
    severity: 'MEDIUM',
    symptoms: ['Idle tidak stabil', 'Hesitasi saat akselerasi', 'Konsumsi BBM tinggi', 'Emisi gas buang tinggi'],
    possibleCauses: ['Sensor MAF terkontaminasi', 'Kebocoran udara setelah MAF', 'Filter udara kotor', 'Masalah pada throttle body'],
    diagnosticSteps: ['Scan kode DTC', 'Periksa data live sensor MAF', 'Bandingkan dengan spesifikasi', 'Periksa kebocoran vacuum'],
    repairProcedures: ['Bersihkan sensor MAF', 'Ganti filter udara', 'Perbaiki kebocoran vacuum', 'Kalibrasi throttle body'],
    relatedSensors: ['MAF Sensor', 'MAP Sensor', 'IAT Sensor'],
    relatedActuators: ['Throttle Body', 'IACV'],
    applicableVehicles: ['Toyota Innova', 'Honda CR-V', 'Nissan X-Trail', 'Mazda CX-5']
  },
  {
    code: 'P0102',
    system: 'P0',
    subsystem: 'Air/Fuel Metering',
    description: 'Mass or Volume Air Flow Circuit Low Input',
    descriptionIndonesian: 'Input Rendah Sirkuit Sensor Aliran Udara',
    severity: 'MEDIUM',
    symptoms: ['Mesin mati mendadak', 'Idle sangat rendah', 'Akselerasi lemah', 'Check engine light menyala'],
    possibleCauses: ['Sensor MAF rusak', 'Kabel sensor putus', 'Konektor korosi', 'Ground circuit buruk'],
    diagnosticSteps: ['Periksa tegangan output MAF', 'Cek kontinuitas kabel', 'Inspeksi konektor', 'Test ground circuit'],
    repairProcedures: ['Ganti sensor MAF', 'Perbaiki kabel putus', 'Bersihkan konektor', 'Perbaiki ground'],
    relatedSensors: ['MAF Sensor'],
    relatedActuators: ['Throttle Body'],
    applicableVehicles: ['Toyota Fortuner', 'Mitsubishi Pajero Sport', 'Isuzu MU-X']
  },
  {
    code: 'P0105',
    system: 'P0',
    subsystem: 'Air/Fuel Metering',
    description: 'Manifold Absolute Pressure/Barometric Pressure Circuit Malfunction',
    descriptionIndonesian: 'Kerusakan Sirkuit Sensor MAP/Tekanan Barometrik',
    severity: 'MEDIUM',
    symptoms: ['Idle tidak stabil', 'Tenaga mesin berkurang', 'Konsumsi BBM tidak normal', 'Mesin sulit start'],
    possibleCauses: ['Sensor MAP rusak', 'Selang vacuum bocor atau lepas', 'Kabel sensor bermasalah', 'ECU rusak'],
    diagnosticSteps: ['Periksa selang vacuum ke MAP', 'Test tegangan sensor MAP', 'Periksa kontinuitas kabel', 'Bandingkan dengan tekanan atmosfer'],
    repairProcedures: ['Ganti sensor MAP', 'Perbaiki selang vacuum', 'Perbaiki kabel sensor', 'Reset ECU'],
    relatedSensors: ['MAP Sensor', 'Barometric Pressure Sensor'],
    relatedActuators: ['Throttle Body', 'Fuel Injectors'],
    applicableVehicles: ['Daihatsu Terios', 'Toyota Rush', 'Suzuki Vitara']
  },
  {
    code: 'P0110',
    system: 'P0',
    subsystem: 'Air/Fuel Metering',
    description: 'Intake Air Temperature Circuit Malfunction',
    descriptionIndonesian: 'Kerusakan Sirkuit Sensor Suhu Udara Masuk (IAT)',
    severity: 'LOW',
    symptoms: ['Konsumsi BBM sedikit meningkat', 'Performa cold start kurang optimal', 'Check engine light menyala'],
    possibleCauses: ['Sensor IAT rusak', 'Kabel sensor putus', 'Konektor korosi', 'ECU bermasalah'],
    diagnosticSteps: ['Periksa resistansi sensor IAT', 'Test tegangan referensi', 'Periksa kabel dan konektor', 'Bandingkan dengan suhu ambient'],
    repairProcedures: ['Ganti sensor IAT', 'Perbaiki kabel', 'Bersihkan konektor', 'Reset ECU'],
    relatedSensors: ['IAT Sensor', 'ECT Sensor'],
    relatedActuators: ['Fuel Injectors'],
    applicableVehicles: ['Semua kendaraan EFI']
  },
  {
    code: 'P0115',
    system: 'P0',
    subsystem: 'Air/Fuel Metering',
    description: 'Engine Coolant Temperature Circuit Malfunction',
    descriptionIndonesian: 'Kerusakan Sirkuit Sensor Suhu Coolant Mesin (ECT)',
    severity: 'MEDIUM',
    symptoms: ['Indikator suhu tidak akurat', 'Kipas radiator tidak bekerja normal', 'Mesin overheat atau terlalu dingin', 'Konsumsi BBM tinggi saat cold start'],
    possibleCauses: ['Sensor ECT rusak', 'Kabel sensor putus atau short', 'Konektor korosi', 'Level coolant rendah', 'ECU bermasalah'],
    diagnosticSteps: ['Periksa level coolant', 'Test resistansi sensor ECT', 'Periksa tegangan output', 'Bandingkan dengan termometer', 'Periksa kabel dan konektor'],
    repairProcedures: ['Ganti sensor ECT', 'Perbaiki kabel', 'Isi coolant', 'Bersihkan konektor', 'Reset ECU'],
    relatedSensors: ['ECT Sensor', 'Cylinder Head Temperature Sensor'],
    relatedActuators: ['Cooling Fan', 'Thermostat'],
    applicableVehicles: ['Toyota Kijang Innova', 'Honda Mobilio', 'Suzuki Ertiga', 'Mitsubishi Xpander']
  },
  {
    code: 'P0120',
    system: 'P0',
    subsystem: 'Air/Fuel Metering',
    description: 'Throttle/Pedal Position Sensor Circuit Malfunction',
    descriptionIndonesian: 'Kerusakan Sirkuit Sensor Posisi Throttle/Pedal (TPS)',
    severity: 'HIGH',
    symptoms: ['Akselerasi tidak responsif', 'Mesin tersendat', 'Idle tidak stabil', 'Mobil terasa tersentak', 'Limp mode aktif'],
    possibleCauses: ['Sensor TPS rusak', 'Kabel sensor bermasalah', 'Throttle body kotor', 'Pedal gas bermasalah', 'ECU rusak'],
    diagnosticSteps: ['Periksa tegangan TPS', 'Test sweep TPS dengan multimeter', 'Periksa kabel dan konektor', 'Bersihkan throttle body', 'Test pedal gas'],
    repairProcedures: ['Ganti sensor TPS', 'Bersihkan throttle body', 'Perbaiki kabel', 'Kalibrasi TPS', 'Reset ECU'],
    relatedSensors: ['TPS', 'APP Sensor'],
    relatedActuators: ['Throttle Body', 'Electronic Throttle Control'],
    applicableVehicles: ['Toyota Avanza', 'Daihatsu Xenia', 'Honda Jazz', 'Suzuki Swift']
  },
  {
    code: 'P0130',
    system: 'P0',
    subsystem: 'Fuel System',
    description: 'O2 Sensor Circuit Malfunction (Bank 1 Sensor 1)',
    descriptionIndonesian: 'Kerusakan Sirkuit Sensor O2 (Bank 1 Sensor 1)',
    severity: 'MEDIUM',
    symptoms: ['Konsumsi BBM meningkat', 'Emisi gas buang tinggi', 'Performa mesin menurun', 'Check engine light'],
    possibleCauses: ['Sensor O2 rusak', 'Kabel sensor putus', 'Konektor korosi', 'Kebocoran exhaust', 'ECU bermasalah'],
    diagnosticSteps: ['Periksa tegangan sensor O2', 'Test heater circuit', 'Periksa kabel dan konektor', 'Cek kebocoran exhaust', 'Analisa switching pattern'],
    repairProcedures: ['Ganti sensor O2', 'Perbaiki kabel', 'Perbaiki kebocoran exhaust', 'Reset fuel trim', 'Clear DTC'],
    relatedSensors: ['O2 Sensor B1S1', 'O2 Sensor B1S2'],
    relatedActuators: ['Fuel Injectors', 'Catalytic Converter'],
    applicableVehicles: ['Semua kendaraan EFI dengan catalytic converter']
  },
  {
    code: 'P0200',
    system: 'P0',
    subsystem: 'Fuel System',
    description: 'Injector Circuit Malfunction',
    descriptionIndonesian: 'Kerusakan Sirkuit Injector',
    severity: 'HIGH',
    symptoms: ['Mesin misfire', 'Tenaga berkurang', 'Idle kasar', 'Konsumsi BBM tidak normal'],
    possibleCauses: ['Injector rusak', 'Kabel injector putus', 'Konektor korosi', 'ECU driver rusak', 'Ground buruk'],
    diagnosticSteps: ['Test resistansi injector', 'Periksa tegangan supply', 'Test pulse injector', 'Periksa kabel dan konektor', 'Test ECU driver'],
    repairProcedures: ['Ganti injector rusak', 'Perbaiki kabel', 'Bersihkan konektor', 'Perbaiki ground', 'Ganti ECU jika perlu'],
    relatedSensors: ['Crankshaft Position Sensor', 'Camshaft Position Sensor'],
    relatedActuators: ['Fuel Injectors'],
    applicableVehicles: ['Semua kendaraan EFI']
  },
  {
    code: 'P0201',
    system: 'P0',
    subsystem: 'Fuel System',
    description: 'Injector Circuit Malfunction - Cylinder 1',
    descriptionIndonesian: 'Kerusakan Sirkuit Injector Silinder 1',
    severity: 'HIGH',
    symptoms: ['Misfire silinder 1', 'Mesin bergetar', 'Tenaga berkurang', 'Check engine light'],
    possibleCauses: ['Injector silinder 1 rusak', 'Kabel injector 1 putus', 'Konektor korosi', 'ECU driver rusak'],
    diagnosticSteps: ['Test resistansi injector 1', 'Swap injector dengan silinder lain', 'Periksa kabel', 'Test pulse dengan noid light'],
    repairProcedures: ['Ganti injector silinder 1', 'Perbaiki kabel', 'Bersihkan konektor'],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Injector Cylinder 1'],
    applicableVehicles: ['Semua kendaraan EFI']
  },
  {
    code: 'P0202',
    system: 'P0',
    subsystem: 'Fuel System',
    description: 'Injector Circuit Malfunction - Cylinder 2',
    descriptionIndonesian: 'Kerusakan Sirkuit Injector Silinder 2',
    severity: 'HIGH',
    symptoms: ['Misfire silinder 2', 'Mesin bergetar', 'Tenaga berkurang'],
    possibleCauses: ['Injector silinder 2 rusak', 'Kabel injector 2 putus', 'Konektor korosi'],
    diagnosticSteps: ['Test resistansi injector 2', 'Swap injector', 'Periksa kabel'],
    repairProcedures: ['Ganti injector silinder 2', 'Perbaiki kabel'],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Injector Cylinder 2'],
    applicableVehicles: ['Semua kendaraan EFI']
  },
  {
    code: 'P0203',
    system: 'P0',
    subsystem: 'Fuel System',
    description: 'Injector Circuit Malfunction - Cylinder 3',
    descriptionIndonesian: 'Kerusakan Sirkuit Injector Silinder 3',
    severity: 'HIGH',
    symptoms: ['Misfire silinder 3', 'Mesin bergetar', 'Tenaga berkurang'],
    possibleCauses: ['Injector silinder 3 rusak', 'Kabel injector 3 putus', 'Konektor korosi'],
    diagnosticSteps: ['Test resistansi injector 3', 'Swap injector', 'Periksa kabel'],
    repairProcedures: ['Ganti injector silinder 3', 'Perbaiki kabel'],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Injector Cylinder 3'],
    applicableVehicles: ['Semua kendaraan EFI']
  },
  {
    code: 'P0204',
    system: 'P0',
    subsystem: 'Fuel System',
    description: 'Injector Circuit Malfunction - Cylinder 4',
    descriptionIndonesian: 'Kerusakan Sirkuit Injector Silinder 4',
    severity: 'HIGH',
    symptoms: ['Misfire silinder 4', 'Mesin bergetar', 'Tenaga berkurang'],
    possibleCauses: ['Injector silinder 4 rusak', 'Kabel injector 4 putus', 'Konektor korosi'],
    diagnosticSteps: ['Test resistansi injector 4', 'Swap injector', 'Periksa kabel'],
    repairProcedures: ['Ganti injector silinder 4', 'Perbaiki kabel'],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Injector Cylinder 4'],
    applicableVehicles: ['Semua kendaraan EFI 4 silinder']
  },
  {
    code: 'P0302',
    system: 'P0',
    subsystem: 'Ignition System',
    description: 'Cylinder 2 Misfire Detected',
    descriptionIndonesian: 'Terdeteksi Misfire Silinder 2',
    severity: 'HIGH',
    symptoms: ['Mesin bergetar', 'Tenaga berkurang', 'Idle tidak stabil'],
    possibleCauses: ['Busi silinder 2 rusak', 'Koil silinder 2 rusak', 'Injector silinder 2 bermasalah', 'Kompresi rendah'],
    diagnosticSteps: ['Periksa busi silinder 2', 'Test koil silinder 2', 'Swap komponen', 'Test kompresi'],
    repairProcedures: ['Ganti busi', 'Ganti koil', 'Ganti injector jika perlu'],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Ignition Coil 2', 'Spark Plug 2', 'Injector 2'],
    applicableVehicles: ['Semua kendaraan EFI']
  },
  {
    code: 'P0303',
    system: 'P0',
    subsystem: 'Ignition System',
    description: 'Cylinder 3 Misfire Detected',
    descriptionIndonesian: 'Terdeteksi Misfire Silinder 3',
    severity: 'HIGH',
    symptoms: ['Mesin bergetar', 'Tenaga berkurang', 'Idle tidak stabil'],
    possibleCauses: ['Busi silinder 3 rusak', 'Koil silinder 3 rusak', 'Injector silinder 3 bermasalah', 'Kompresi rendah'],
    diagnosticSteps: ['Periksa busi silinder 3', 'Test koil silinder 3', 'Swap komponen', 'Test kompresi'],
    repairProcedures: ['Ganti busi', 'Ganti koil', 'Ganti injector jika perlu'],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Ignition Coil 3', 'Spark Plug 3', 'Injector 3'],
    applicableVehicles: ['Semua kendaraan EFI']
  },
  {
    code: 'P0304',
    system: 'P0',
    subsystem: 'Ignition System',
    description: 'Cylinder 4 Misfire Detected',
    descriptionIndonesian: 'Terdeteksi Misfire Silinder 4',
    severity: 'HIGH',
    symptoms: ['Mesin bergetar', 'Tenaga berkurang', 'Idle tidak stabil'],
    possibleCauses: ['Busi silinder 4 rusak', 'Koil silinder 4 rusak', 'Injector silinder 4 bermasalah', 'Kompresi rendah'],
    diagnosticSteps: ['Periksa busi silinder 4', 'Test koil silinder 4', 'Swap komponen', 'Test kompresi'],
    repairProcedures: ['Ganti busi', 'Ganti koil', 'Ganti injector jika perlu'],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Ignition Coil 4', 'Spark Plug 4', 'Injector 4'],
    applicableVehicles: ['Semua kendaraan EFI 4 silinder']
  },
  {
    code: 'P0325',
    system: 'P0',
    subsystem: 'Ignition System',
    description: 'Knock Sensor 1 Circuit Malfunction (Bank 1)',
    descriptionIndonesian: 'Kerusakan Sirkuit Sensor Knock 1 (Bank 1)',
    severity: 'MEDIUM',
    symptoms: ['Tenaga mesin berkurang', 'Konsumsi BBM meningkat', 'Mesin terasa tidak bertenaga', 'Check engine light'],
    possibleCauses: ['Sensor knock rusak', 'Kabel sensor putus', 'Konektor korosi', 'ECU bermasalah', 'Mounting sensor longgar'],
    diagnosticSteps: ['Periksa resistansi sensor knock', 'Test tegangan output', 'Periksa kabel dan konektor', 'Periksa mounting sensor', 'Test dengan ketukan pada mesin'],
    repairProcedures: ['Ganti sensor knock', 'Perbaiki kabel', 'Kencangkan mounting', 'Bersihkan konektor'],
    relatedSensors: ['Knock Sensor', 'CKP Sensor'],
    relatedActuators: ['Ignition Timing Control'],
    applicableVehicles: ['Toyota Innova', 'Honda CR-V', 'Mitsubishi Pajero', 'Nissan X-Trail']
  },
  {
    code: 'P0335',
    system: 'P0',
    subsystem: 'Ignition System',
    description: 'Crankshaft Position Sensor A Circuit Malfunction',
    descriptionIndonesian: 'Kerusakan Sirkuit Sensor Posisi Crankshaft A',
    severity: 'CRITICAL',
    symptoms: ['Mesin tidak mau start', 'Mesin mati mendadak', 'Mesin tersendat parah', 'No spark/no injection'],
    possibleCauses: ['Sensor CKP rusak', 'Kabel sensor putus', 'Reluctor wheel rusak', 'Air gap tidak tepat', 'ECU bermasalah'],
    diagnosticSteps: ['Periksa sinyal CKP dengan oscilloscope', 'Test resistansi sensor', 'Periksa air gap', 'Inspeksi reluctor wheel', 'Periksa kabel dan konektor'],
    repairProcedures: ['Ganti sensor CKP', 'Perbaiki kabel', 'Setel air gap', 'Ganti reluctor wheel jika rusak'],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Ignition System', 'Fuel Injection System'],
    applicableVehicles: ['Semua kendaraan EFI']
  },
  {
    code: 'P0340',
    system: 'P0',
    subsystem: 'Ignition System',
    description: 'Camshaft Position Sensor Circuit Malfunction',
    descriptionIndonesian: 'Kerusakan Sirkuit Sensor Posisi Camshaft',
    severity: 'HIGH',
    symptoms: ['Mesin sulit start', 'Mesin mati mendadak', 'Performa menurun', 'Check engine light'],
    possibleCauses: ['Sensor CMP rusak', 'Kabel sensor putus', 'Timing belt/chain kendor', 'Reluctor wheel rusak', 'ECU bermasalah'],
    diagnosticSteps: ['Periksa sinyal CMP', 'Test resistansi sensor', 'Periksa timing belt/chain', 'Inspeksi reluctor wheel', 'Periksa kabel'],
    repairProcedures: ['Ganti sensor CMP', 'Perbaiki kabel', 'Ganti timing belt/chain jika perlu', 'Ganti reluctor wheel'],
    relatedSensors: ['CMP Sensor', 'CKP Sensor'],
    relatedActuators: ['Ignition System', 'Variable Valve Timing'],
    applicableVehicles: ['Semua kendaraan EFI']
  }
]

// =====================================================
// P1xxx - MANUFACTURER SPECIFIC CODES
// =====================================================

export const P1_TOYOTA_SPECIFIC: DTCDataItem[] = [
  {
    code: 'P1300',
    system: 'P1',
    subsystem: 'Toyota Specific',
    description: 'Igniter Circuit Malfunction (Toyota)',
    descriptionIndonesian: 'Kerusakan Sirkuit Igniter (Toyota)',
    severity: 'HIGH',
    symptoms: [
      'Mesin tidak mau start',
      'Misfire parah',
      'No spark',
      'Check engine light'
    ],
    possibleCauses: [
      'Igniter rusak',
      'Kabel igniter putus',
      'ECU bermasalah',
      'Power supply igniter bermasalah'
    ],
    diagnosticSteps: [
      'Test sinyal igniter',
      'Periksa power supply',
      'Test resistansi igniter',
      'Periksa kabel'
    ],
    repairProcedures: [
      'Ganti igniter',
      'Perbaiki kabel',
      'Perbaiki power supply'
    ],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Igniter', 'Ignition Coils'],
    applicableVehicles: ['Toyota Kijang', 'Toyota Avanza', 'Toyota Innova', 'Toyota Fortuner']
  },
  {
    code: 'P1349',
    system: 'P1',
    subsystem: 'Toyota Specific',
    description: 'VVT System Malfunction (Toyota)',
    descriptionIndonesian: 'Kerusakan Sistem VVT (Variable Valve Timing) Toyota',
    severity: 'MEDIUM',
    symptoms: [
      'Performa mesin menurun',
      'Konsumsi BBM meningkat',
      'Idle kasar',
      'Check engine light'
    ],
    possibleCauses: [
      'VVT solenoid rusak',
      'Oil pressure rendah',
      'VVT actuator rusak',
      'Timing chain kendor'
    ],
    diagnosticSteps: [
      'Periksa oil pressure',
      'Test VVT solenoid',
      'Periksa VVT actuator',
      'Periksa timing chain'
    ],
    repairProcedures: [
      'Ganti VVT solenoid',
      'Perbaiki oil pressure',
      'Ganti VVT actuator',
      'Ganti timing chain'
    ],
    relatedSensors: ['CMP Sensor', 'Oil Pressure Sensor'],
    relatedActuators: ['VVT Solenoid', 'VVT Actuator'],
    applicableVehicles: ['Toyota Vios', 'Toyota Yaris', 'Toyota Camry', 'Toyota Corolla Altis']
  }
]

export const P1_HONDA_SPECIFIC: DTCDataItem[] = [
  {
    code: 'P1259',
    system: 'P1',
    subsystem: 'Honda Specific',
    description: 'VTEC System Malfunction (Honda)',
    descriptionIndonesian: 'Kerusakan Sistem VTEC (Honda)',
    severity: 'MEDIUM',
    symptoms: [
      'Performa tinggi tidak tercapai',
      'Mesin tidak bertenaga di RPM tinggi',
      'Check engine light',
      'VTEC tidak engage'
    ],
    possibleCauses: [
      'VTEC solenoid rusak',
      'Oil pressure rendah',
      'VTEC pressure switch rusak',
      'Rocker arm VTEC rusak'
    ],
    diagnosticSteps: [
      'Periksa oil level dan pressure',
      'Test VTEC solenoid',
      'Test VTEC pressure switch',
      'Periksa rocker arm'
    ],
    repairProcedures: [
      'Ganti oli mesin',
      'Ganti VTEC solenoid',
      'Ganti pressure switch',
      'Perbaiki rocker arm'
    ],
    relatedSensors: ['Oil Pressure Switch', 'VTEC Pressure Switch'],
    relatedActuators: ['VTEC Solenoid', 'VTEC Mechanism'],
    applicableVehicles: ['Honda Jazz', 'Honda City', 'Honda Civic', 'Honda CR-V', 'Honda Accord']
  }
]

export const P1_MITSUBISHI_SPECIFIC: DTCDataItem[] = [
  {
    code: 'P1400',
    system: 'P1',
    subsystem: 'Mitsubishi Specific',
    description: 'EGR Solenoid Circuit Malfunction (Mitsubishi)',
    descriptionIndonesian: 'Kerusakan Sirkuit Solenoid EGR (Mitsubishi)',
    severity: 'MEDIUM',
    symptoms: [
      'Idle kasar',
      'Emisi tinggi',
      'Check engine light',
      'Knocking'
    ],
    possibleCauses: [
      'EGR solenoid rusak',
      'Kabel solenoid putus',
      'EGR valve stuck',
      'Vacuum hose bocor'
    ],
    diagnosticSteps: [
      'Test EGR solenoid',
      'Periksa kabel',
      'Test EGR valve',
      'Periksa vacuum'
    ],
    repairProcedures: [
      'Ganti EGR solenoid',
      'Perbaiki kabel',
      'Bersihkan EGR valve'
    ],
    relatedSensors: ['MAP Sensor', 'TPS'],
    relatedActuators: ['EGR Solenoid', 'EGR Valve'],
    applicableVehicles: ['Mitsubishi Pajero Sport', 'Mitsubishi Xpander', 'Mitsubishi Outlander', 'Mitsubishi Triton']
  }
]

export const P1_SUZUKI_SPECIFIC: DTCDataItem[] = [
  {
    code: 'P1400',
    system: 'P1',
    subsystem: 'Suzuki Specific',
    description: 'EGR Valve Position Sensor Circuit Malfunction (Suzuki)',
    descriptionIndonesian: 'Kerusakan Sirkuit Sensor Posisi EGR Valve (Suzuki)',
    severity: 'MEDIUM',
    symptoms: [
      'Idle tidak stabil',
      'Emisi tinggi',
      'Check engine light',
      'Performa menurun'
    ],
    possibleCauses: [
      'EGR position sensor rusak',
      'Kabel sensor putus',
      'EGR valve stuck',
      'Carbon buildup'
    ],
    diagnosticSteps: [
      'Test EGR position sensor',
      'Periksa kabel sensor',
      'Test EGR valve movement',
      'Periksa carbon buildup'
    ],
    repairProcedures: [
      'Ganti EGR position sensor',
      'Perbaiki kabel',
      'Bersihkan EGR valve',
      'Bersihkan carbon'
    ],
    relatedSensors: ['EGR Position Sensor', 'MAP Sensor'],
    relatedActuators: ['EGR Valve', 'EGR Solenoid'],
    applicableVehicles: ['Suzuki Ertiga', 'Suzuki Swift', 'Suzuki Baleno', 'Suzuki Vitara', 'Suzuki APV']
  }
]

export const P1_NISSAN_SPECIFIC: DTCDataItem[] = [
  {
    code: 'P1320',
    system: 'P1',
    subsystem: 'Nissan Specific',
    description: 'Ignition Signal Primary Circuit Malfunction (Nissan)',
    descriptionIndonesian: 'Kerusakan Sirkuit Primer Sinyal Ignisi (Nissan)',
    severity: 'HIGH',
    symptoms: [
      'Mesin tidak start',
      'Misfire parah',
      'No spark',
      'Check engine light'
    ],
    possibleCauses: [
      'Power transistor rusak',
      'Ignition coil rusak',
      'Kabel ignisi putus',
      'ECU bermasalah'
    ],
    diagnosticSteps: [
      'Test power transistor',
      'Periksa ignition coil',
      'Test kabel ignisi',
      'Periksa sinyal ECU'
    ],
    repairProcedures: [
      'Ganti power transistor',
      'Ganti ignition coil',
      'Perbaiki kabel ignisi'
    ],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Power Transistor', 'Ignition Coils'],
    applicableVehicles: ['Nissan March', 'Nissan Grand Livina', 'Nissan X-Trail', 'Nissan Teana', 'Nissan Serena']
  }
]

export const P1_MAZDA_SPECIFIC: DTCDataItem[] = [
  {
    code: 'P1260',
    system: 'P1',
    subsystem: 'Mazda Specific',
    description: 'Theft Deterrent System Fuel Disable (Mazda)',
    descriptionIndonesian: 'Sistem Anti Maling Menonaktifkan Bahan Bakar (Mazda)',
    severity: 'HIGH',
    symptoms: [
      'Mesin tidak start',
      'Fuel pump tidak bekerja',
      'Security light menyala',
      'Immobilizer aktif'
    ],
    possibleCauses: [
      'Immobilizer bermasalah',
      'Kunci tidak terbaca',
      'Antena immobilizer rusak',
      'ECU immobilizer rusak'
    ],
    diagnosticSteps: [
      'Periksa kunci immobilizer',
      'Test antena immobilizer',
      'Periksa ECU immobilizer',
      'Reset immobilizer system'
    ],
    repairProcedures: [
      'Program ulang kunci',
      'Ganti antena immobilizer',
      'Ganti ECU immobilizer',
      'Reset system'
    ],
    relatedSensors: ['Immobilizer Antenna'],
    relatedActuators: ['Fuel Pump Relay', 'Ignition System'],
    applicableVehicles: ['Mazda 2', 'Mazda 3', 'Mazda CX-5', 'Mazda 6', 'Mazda Biante']
  }
]

export const P1_DAIHATSU_SPECIFIC: DTCDataItem[] = [
  {
    code: 'P1301',
    system: 'P1',
    subsystem: 'Daihatsu Specific',
    description: 'Igniter Circuit Malfunction (Daihatsu)',
    descriptionIndonesian: 'Kerusakan Sirkuit Igniter (Daihatsu)',
    severity: 'HIGH',
    symptoms: [
      'Mesin tidak start',
      'Misfire parah',
      'No spark',
      'Check engine light'
    ],
    possibleCauses: [
      'Igniter module rusak',
      'Kabel igniter putus',
      'Power supply bermasalah',
      'ECU bermasalah'
    ],
    diagnosticSteps: [
      'Test igniter module',
      'Periksa kabel igniter',
      'Test power supply',
      'Periksa sinyal ECU'
    ],
    repairProcedures: [
      'Ganti igniter module',
      'Perbaiki kabel',
      'Perbaiki power supply'
    ],
    relatedSensors: ['CKP Sensor', 'CMP Sensor'],
    relatedActuators: ['Igniter Module', 'Ignition Coils'],
    applicableVehicles: ['Daihatsu Xenia', 'Daihatsu Terios', 'Daihatsu Ayla', 'Daihatsu Sirion', 'Daihatsu Gran Max']
  }
]

export const P1_ISUZU_SPECIFIC: DTCDataItem[] = [
  {
    code: 'P1400',
    system: 'P1',
    subsystem: 'Isuzu Specific',
    description: 'EGR System Malfunction (Isuzu)',
    descriptionIndonesian: 'Kerusakan Sistem EGR (Isuzu)',
    severity: 'MEDIUM',
    symptoms: [
      'Idle kasar',
      'Emisi tinggi',
      'Check engine light',
      'Knocking'
    ],
    possibleCauses: [
      'EGR valve stuck',
      'EGR cooler tersumbat',
      'Vacuum actuator rusak',
      'EGR temperature sensor rusak'
    ],
    diagnosticSteps: [
      'Test EGR valve operation',
      'Periksa EGR cooler',
      'Test vacuum actuator',
      'Periksa temperature sensor'
    ],
    repairProcedures: [
      'Bersihkan atau ganti EGR valve',
      'Bersihkan EGR cooler',
      'Ganti vacuum actuator',
      'Ganti temperature sensor'
    ],
    relatedSensors: ['EGR Temperature Sensor', 'MAP Sensor'],
    relatedActuators: ['EGR Valve', 'EGR Vacuum Actuator'],
    applicableVehicles: ['Isuzu Panther', 'Isuzu MU-X', 'Isuzu D-Max', 'Isuzu Elf']
  }
]

// =====================================================
// B0xxx - BODY CONTROL CODES
// =====================================================

export const B0_BODY_CONTROL: DTCDataItem[] = [
  {
    code: 'B1000',
    system: 'B0',
    subsystem: 'Body Control',
    description: 'ECU Internal Malfunction',
    descriptionIndonesian: 'Kerusakan Internal ECU',
    severity: 'CRITICAL',
    symptoms: [
      'Berbagai sistem tidak bekerja',
      'Check engine light',
      'Limp mode',
      'Sistem elektrik bermasalah'
    ],
    possibleCauses: [
      'ECU rusak internal',
      'Power supply ECU bermasalah',
      'Ground ECU buruk',
      'Korosi pada ECU'
    ],
    diagnosticSteps: [
      'Periksa power supply ECU',
      'Test ground ECU',
      'Periksa konektor ECU',
      'Test internal ECU'
    ],
    repairProcedures: [
      'Ganti ECU',
      'Perbaiki power supply',
      'Perbaiki ground',
      'Bersihkan konektor'
    ],
    relatedSensors: ['All Engine Sensors'],
    relatedActuators: ['All Engine Actuators'],
    applicableVehicles: ['Semua kendaraan EFI']
  }
]

// =====================================================
// C0xxx - CHASSIS CONTROL CODES
// =====================================================

export const C0_CHASSIS_CONTROL: DTCDataItem[] = [
  {
    code: 'C1201',
    system: 'C0',
    subsystem: 'Chassis Control',
    description: 'Engine Control System Malfunction',
    descriptionIndonesian: 'Kerusakan Sistem Kontrol Mesin',
    severity: 'HIGH',
    symptoms: [
      'ABS tidak bekerja',
      'VSC tidak bekerja',
      'Traction control bermasalah',
      'Warning light menyala'
    ],
    possibleCauses: [
      'Komunikasi ECU bermasalah',
      'CAN bus bermasalah',
      'Sensor wheel speed rusak',
      'ABS module rusak'
    ],
    diagnosticSteps: [
      'Periksa komunikasi CAN bus',
      'Test sensor wheel speed',
      'Periksa ABS module',
      'Test kabel komunikasi'
    ],
    repairProcedures: [
      'Perbaiki CAN bus',
      'Ganti sensor wheel speed',
      'Ganti ABS module',
      'Perbaiki kabel'
    ],
    relatedSensors: ['Wheel Speed Sensors', 'Steering Angle Sensor'],
    relatedActuators: ['ABS Module', 'VSC System'],
    applicableVehicles: ['Toyota dengan VSC', 'Honda dengan VSA', 'Mitsubishi dengan ASC']
  }
]

// =====================================================
// U0xxx - NETWORK COMMUNICATION CODES
// =====================================================

export const U0_NETWORK_COMMUNICATION: DTCDataItem[] = [
  {
    code: 'U0100',
    system: 'U0',
    subsystem: 'Network Communication',
    description: 'Lost Communication With ECM/PCM',
    descriptionIndonesian: 'Hilang Komunikasi dengan ECM/PCM',
    severity: 'CRITICAL',
    symptoms: [
      'Mesin tidak start',
      'Berbagai sistem tidak bekerja',
      'Scanner tidak bisa komunikasi',
      'Multiple warning lights'
    ],
    possibleCauses: [
      'ECM/PCM rusak',
      'CAN bus terputus',
      'Power supply ECM bermasalah',
      'Ground ECM buruk'
    ],
    diagnosticSteps: [
      'Periksa power supply ECM',
      'Test CAN bus',
      'Periksa ground ECM',
      'Test komunikasi dengan scanner'
    ],
    repairProcedures: [
      'Ganti ECM/PCM',
      'Perbaiki CAN bus',
      'Perbaiki power supply',
      'Perbaiki ground'
    ],
    relatedSensors: ['All CAN Bus Connected Sensors'],
    relatedActuators: ['All CAN Bus Connected Actuators'],
    applicableVehicles: ['Semua kendaraan modern dengan CAN bus']
  }
]

// =====================================================
// EXPORT ALL DTC DATA - COMPLETE VERSION
// =====================================================

export const ALL_DTC_DATA: DTCDataItem[] = [
  ...P0_FUEL_AIR_METERING,
  ...P0_IGNITION_SYSTEM,
  ...P0_EMISSION_CONTROL,
  ...P0_AUXILIARY_EMISSION,
  ...P0_ADDITIONAL_CODES,
  ...P1_TOYOTA_SPECIFIC,
  ...P1_HONDA_SPECIFIC,
  ...P1_MITSUBISHI_SPECIFIC,
  ...P1_SUZUKI_SPECIFIC,
  ...P1_NISSAN_SPECIFIC,
  ...P1_MAZDA_SPECIFIC,
  ...P1_DAIHATSU_SPECIFIC,
  ...P1_ISUZU_SPECIFIC,
  ...B0_BODY_CONTROL,
  ...C0_CHASSIS_CONTROL,
  ...U0_NETWORK_COMMUNICATION
]

// Helper function untuk mencari DTC berdasarkan kode
export function findDTCByCode(code: string): DTCDataItem | undefined {
  return ALL_DTC_DATA.find(dtc => dtc.code === code)
}

// Helper function untuk mencari DTC berdasarkan sistem
export function findDTCBySystem(system: string): DTCDataItem[] {
  return ALL_DTC_DATA.filter(dtc => dtc.system === system)
}

// Helper function untuk mencari DTC berdasarkan kendaraan
export function findDTCByVehicle(vehicle: string): DTCDataItem[] {
  return ALL_DTC_DATA.filter(dtc => 
    dtc.applicableVehicles?.some(v => 
      v.toLowerCase().includes(vehicle.toLowerCase())
    )
  )
}

// Helper function untuk mencari DTC berdasarkan severity
export function findDTCBySeverity(severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): DTCDataItem[] {
  return ALL_DTC_DATA.filter(dtc => dtc.severity === severity)
}

// Helper function untuk mencari DTC berdasarkan merek kendaraan
export function findDTCByBrand(brand: string): DTCDataItem[] {
  const brandLower = brand.toLowerCase()
  return ALL_DTC_DATA.filter(dtc => 
    dtc.applicableVehicles?.some(v => 
      v.toLowerCase().includes(brandLower)
    )
  )
}

// Helper function untuk mendapatkan statistik DTC
export function getDTCStatistics() {
  const total = ALL_DTC_DATA.length
  const bySeverity = {
    LOW: ALL_DTC_DATA.filter(dtc => dtc.severity === 'LOW').length,
    MEDIUM: ALL_DTC_DATA.filter(dtc => dtc.severity === 'MEDIUM').length,
    HIGH: ALL_DTC_DATA.filter(dtc => dtc.severity === 'HIGH').length,
    CRITICAL: ALL_DTC_DATA.filter(dtc => dtc.severity === 'CRITICAL').length
  }
  
  const bySystem = {
    P0: ALL_DTC_DATA.filter(dtc => dtc.system === 'P0').length,
    P1: ALL_DTC_DATA.filter(dtc => dtc.system === 'P1').length,
    B0: ALL_DTC_DATA.filter(dtc => dtc.system === 'B0').length,
    C0: ALL_DTC_DATA.filter(dtc => dtc.system === 'C0').length,
    U0: ALL_DTC_DATA.filter(dtc => dtc.system === 'U0').length
  }
  
  return {
    total,
    bySeverity,
    bySystem
  }
}


// Helper function untuk mendapatkan statistik DTC lengkap
export function getDTCStatisticsComplete() {
  const total = ALL_DTC_DATA.length
  const bySeverity = {
    LOW: ALL_DTC_DATA.filter(dtc => dtc.severity === 'LOW').length,
    MEDIUM: ALL_DTC_DATA.filter(dtc => dtc.severity === 'MEDIUM').length,
    HIGH: ALL_DTC_DATA.filter(dtc => dtc.severity === 'HIGH').length,
    CRITICAL: ALL_DTC_DATA.filter(dtc => dtc.severity === 'CRITICAL').length
  }
  
  const bySystem = {
    P0: ALL_DTC_DATA.filter(dtc => dtc.system === 'P0').length,
    P1: ALL_DTC_DATA.filter(dtc => dtc.system === 'P1').length,
    B0: ALL_DTC_DATA.filter(dtc => dtc.system === 'B0').length,
    C0: ALL_DTC_DATA.filter(dtc => dtc.system === 'C0').length,
    U0: ALL_DTC_DATA.filter(dtc => dtc.system === 'U0').length
  }
  
  const byBrand = {
    Toyota: ALL_DTC_DATA.filter(dtc => 
      dtc.applicableVehicles?.some(v => v.toLowerCase().includes('toyota'))
    ).length,
    Honda: ALL_DTC_DATA.filter(dtc => 
      dtc.applicableVehicles?.some(v => v.toLowerCase().includes('honda'))
    ).length,
    Suzuki: ALL_DTC_DATA.filter(dtc => 
      dtc.applicableVehicles?.some(v => v.toLowerCase().includes('suzuki'))
    ).length,
    Mitsubishi: ALL_DTC_DATA.filter(dtc => 
      dtc.applicableVehicles?.some(v => v.toLowerCase().includes('mitsubishi'))
    ).length,
    Nissan: ALL_DTC_DATA.filter(dtc => 
      dtc.applicableVehicles?.some(v => v.toLowerCase().includes('nissan'))
    ).length,
    Daihatsu: ALL_DTC_DATA.filter(dtc => 
      dtc.applicableVehicles?.some(v => v.toLowerCase().includes('daihatsu'))
    ).length,
    Mazda: ALL_DTC_DATA.filter(dtc => 
      dtc.applicableVehicles?.some(v => v.toLowerCase().includes('mazda'))
    ).length,
    Isuzu: ALL_DTC_DATA.filter(dtc => 
      dtc.applicableVehicles?.some(v => v.toLowerCase().includes('isuzu'))
    ).length
  }
  
  return {
    total,
    bySeverity,
    bySystem,
    byBrand
  }
}