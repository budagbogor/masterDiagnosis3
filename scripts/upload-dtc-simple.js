// Script sederhana untuk mengupload data DTC menggunakan API route
const fs = require('fs');

// Baca file comprehensive DTC data
const dtcFile = fs.readFileSync('src/lib/comprehensive-dtc-data.ts', 'utf8');

// Extract hanya beberapa data sample untuk testing
const sampleDTCData = [
  {
    code: 'P0001',
    system: 'P0',
    subsystem: 'Fuel System',
    description: 'Fuel Volume Regulator Control Circuit/Open',
    descriptionIndonesian: 'Kerusakan Sirkuit Kontrol Regulator Volume Bahan Bakar',
    severity: 'MEDIUM',
    symptoms: ['Mesin sulit start', 'Performa menurun', 'Konsumsi BBM abnormal'],
    possibleCauses: ['Regulator volume bahan bakar rusak', 'Kabel sirkuit putus', 'Konektor korosi'],
    diagnosticSteps: ['Scan kode DTC dengan scanner OBD-II', 'Periksa tegangan sirkuit regulator', 'Test resistansi kabel'],
    repairProcedures: ['Ganti regulator volume bahan bakar', 'Perbaiki kabel yang rusak', 'Reset ECU'],
    relatedSensors: ['Fuel Pressure Sensor', 'Fuel Volume Regulator'],
    relatedActuators: ['Fuel Volume Regulator', 'Fuel Pump'],
    applicableVehicles: ['Semua kendaraan EFI']
  },
  {
    code: 'P0002',
    system: 'P0',
    subsystem: 'Fuel System',
    description: 'Fuel Volume Regulator Control Circuit Range/Performance',
    descriptionIndonesian: 'Masalah Kinerja Sirkuit Kontrol Regulator Volume Bahan Bakar',
    severity: 'MEDIUM',
    symptoms: ['Idle tidak stabil', 'Hesitasi saat akselerasi', 'Konsumsi BBM tinggi'],
    possibleCauses: ['Regulator tidak bekerja optimal', 'Kalibrasi tidak tepat', 'Kontaminasi sistem'],
    diagnosticSteps: ['Periksa kinerja regulator', 'Bandingkan dengan spesifikasi', 'Test kalibrasi'],
    repairProcedures: ['Kalibrasi ulang regulator', 'Bersihkan sistem', 'Ganti jika perlu'],
    relatedSensors: ['Fuel Pressure Sensor'],
    relatedActuators: ['Fuel Volume Regulator'],
    applicableVehicles: ['Semua kendaraan EFI']
  },
  {
    code: 'P0100',
    system: 'P0',
    subsystem: 'Air/Fuel Metering',
    description: 'Mass or Volume Air Flow Circuit',
    descriptionIndonesian: 'Kerusakan Sirkuit Sensor Aliran Udara (MAF/VAF)',
    severity: 'MEDIUM',
    symptoms: ['Mesin tidak stabil saat idle', 'Konsumsi bahan bakar meningkat', 'Tenaga mesin berkurang'],
    possibleCauses: ['Sensor MAF/VAF rusak atau kotor', 'Kabel sensor putus', 'Filter udara kotor'],
    diagnosticSteps: ['Periksa kode DTC', 'Inspeksi sensor MAF', 'Test tegangan sensor'],
    repairProcedures: ['Bersihkan atau ganti sensor MAF', 'Perbaiki kabel', 'Ganti filter udara'],
    relatedSensors: ['Mass Air Flow Sensor', 'Intake Air Temperature Sensor'],
    relatedActuators: ['Throttle Body', 'Fuel Injectors'],
    applicableVehicles: ['Toyota Avanza', 'Honda Jazz', 'Suzuki Ertiga']
  },
  {
    code: 'P0300',
    system: 'P0',
    subsystem: 'Ignition System',
    description: 'Random/Multiple Cylinder Misfire Detected',
    descriptionIndonesian: 'Terdeteksi Misfire Acak/Multiple Silinder',
    severity: 'HIGH',
    symptoms: ['Mesin bergetar kasar', 'Tenaga berkurang drastis', 'Check engine light berkedip'],
    possibleCauses: ['Busi aus', 'Koil ignisi rusak', 'Injector kotor', 'Kompresi rendah'],
    diagnosticSteps: ['Periksa busi semua silinder', 'Test koil ignisi', 'Test kompresi'],
    repairProcedures: ['Ganti busi', 'Ganti koil rusak', 'Bersihkan injector'],
    relatedSensors: ['Crankshaft Position Sensor', 'Camshaft Position Sensor'],
    relatedActuators: ['Ignition Coils', 'Spark Plugs', 'Fuel Injectors'],
    applicableVehicles: ['Semua kendaraan EFI']
  },
  {
    code: 'P0420',
    system: 'P0',
    subsystem: 'Emission Control',
    description: 'Catalyst System Efficiency Below Threshold',
    descriptionIndonesian: 'Efisiensi Sistem Katalis Di Bawah Ambang Batas',
    severity: 'MEDIUM',
    symptoms: ['Emisi gas buang tinggi', 'Gagal uji emisi', 'Bau sulfur dari knalpot'],
    possibleCauses: ['Catalytic converter rusak', 'Sensor O2 downstream rusak', 'Kebocoran exhaust'],
    diagnosticSteps: ['Periksa efisiensi catalyst', 'Test sensor O2', 'Periksa kebocoran exhaust'],
    repairProcedures: ['Ganti catalytic converter', 'Ganti sensor O2', 'Perbaiki kebocoran'],
    relatedSensors: ['O2 Sensor B1S1', 'O2 Sensor B1S2'],
    relatedActuators: ['Catalytic Converter'],
    applicableVehicles: ['Semua kendaraan dengan catalytic converter']
  }
];

console.log('📊 Sample DTC Data yang akan diupload:');
console.log(`Total: ${sampleDTCData.length} kode DTC`);

sampleDTCData.forEach(dtc => {
  console.log(`- ${dtc.code}: ${dtc.descriptionIndonesian} (${dtc.severity})`);
});

// Export data untuk digunakan oleh script lain
module.exports = { sampleDTCData };

console.log('\n✅ Data sample DTC siap untuk diupload');
console.log('💡 Gunakan API route /api/dtc-library dengan action=seed untuk mengupload ke Supabase');