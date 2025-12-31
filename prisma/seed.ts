import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Mulai seeding database...')

  // Seed Engines
  const engines = [
    // Toyota Engines
    {
      code: '1NZ-FE',
      brand: 'Toyota',
      displacement: 1496,
      cylinders: 4,
      fuel: 'BENSIN' as const,
      aspiration: 'NATURAL' as const,
      power: 109,
      torque: 141,
      commonVehicles: JSON.stringify(['Toyota Vios', 'Toyota Yaris']),
      commonIssues: JSON.stringify(['Carbon buildup', 'Timing chain stretch', 'VVT-i solenoid failure']),
    },
    {
      code: '2NR-FE',
      brand: 'Toyota',
      displacement: 1329,
      cylinders: 4,
      fuel: 'BENSIN' as const,
      aspiration: 'NATURAL' as const,
      power: 99,
      torque: 121,
      commonVehicles: JSON.stringify(['Toyota Agya', 'Toyota Calya', 'Daihatsu Ayla']),
      commonIssues: JSON.stringify(['Throttle body cleaning', 'Fuel injector cleaning']),
    },
    {
      code: '1KR-VE',
      brand: 'Toyota',
      displacement: 998,
      cylinders: 3,
      fuel: 'BENSIN' as const,
      aspiration: 'NATURAL' as const,
      power: 68,
      torque: 89,
      commonVehicles: JSON.stringify(['Toyota Agya', 'Daihatsu Ayla']),
      commonIssues: JSON.stringify(['Engine mount wear', 'Spark plug fouling']),
    },
    // Honda Engines
    {
      code: 'L15A7',
      brand: 'Honda',
      displacement: 1497,
      cylinders: 4,
      fuel: 'BENSIN' as const,
      aspiration: 'NATURAL' as const,
      power: 120,
      torque: 145,
      commonVehicles: JSON.stringify(['Honda Jazz', 'Honda City']),
      commonIssues: JSON.stringify(['VTEC solenoid failure', 'Timing chain tensioner']),
    },
    {
      code: 'R18A1',
      brand: 'Honda',
      displacement: 1799,
      cylinders: 4,
      fuel: 'BENSIN' as const,
      aspiration: 'NATURAL' as const,
      power: 140,
      torque: 174,
      commonVehicles: JSON.stringify(['Honda Civic', 'Honda CR-V']),
      commonIssues: JSON.stringify(['Carbon buildup', 'VTC actuator failure']),
    },
    // Mitsubishi Engines
    {
      code: '4A91',
      brand: 'Mitsubishi',
      displacement: 1499,
      cylinders: 4,
      fuel: 'BENSIN' as const,
      aspiration: 'NATURAL' as const,
      power: 109,
      torque: 143,
      commonVehicles: JSON.stringify(['Mitsubishi Mirage', 'Mitsubishi Xpander']),
      commonIssues: JSON.stringify(['Timing chain stretch', 'Oil consumption']),
    },
  ]

  for (const engine of engines) {
    await prisma.engine.upsert({
      where: { code: engine.code },
      update: {},
      create: engine,
    })
  }

  // Seed Vehicles
  const vehicles = [
    // Toyota
    {
      brand: 'Toyota',
      model: 'Agya',
      variant: '1.0 G',
      years: '2013-2024',
      type: 'HATCHBACK' as const,
      segment: 'A',
    },
    {
      brand: 'Toyota',
      model: 'Agya',
      variant: '1.2 TRD',
      years: '2017-2024',
      type: 'HATCHBACK' as const,
      segment: 'A',
    },
    {
      brand: 'Toyota',
      model: 'Yaris',
      variant: '1.5 G',
      years: '2014-2024',
      type: 'HATCHBACK' as const,
      segment: 'B',
    },
    {
      brand: 'Toyota',
      model: 'Vios',
      variant: '1.5 G',
      years: '2013-2024',
      type: 'SEDAN' as const,
      segment: 'B',
    },
    {
      brand: 'Toyota',
      model: 'Calya',
      variant: '1.2 G',
      years: '2016-2024',
      type: 'MPV' as const,
      segment: 'A',
    },
    // Honda
    {
      brand: 'Honda',
      model: 'Brio',
      variant: '1.2 E',
      years: '2012-2024',
      type: 'HATCHBACK' as const,
      segment: 'A',
    },
    {
      brand: 'Honda',
      model: 'Jazz',
      variant: '1.5 RS',
      years: '2014-2024',
      type: 'HATCHBACK' as const,
      segment: 'B',
    },
    {
      brand: 'Honda',
      model: 'City',
      variant: '1.5 E',
      years: '2014-2024',
      type: 'SEDAN' as const,
      segment: 'B',
    },
    {
      brand: 'Honda',
      model: 'Civic',
      variant: '1.8 E',
      years: '2012-2024',
      type: 'SEDAN' as const,
      segment: 'C',
    },
    {
      brand: 'Honda',
      model: 'CR-V',
      variant: '1.5 Turbo',
      years: '2017-2024',
      type: 'SUV' as const,
      segment: 'C',
    },
    // Mitsubishi
    {
      brand: 'Mitsubishi',
      model: 'Mirage',
      variant: '1.2 GLS',
      years: '2012-2024',
      type: 'HATCHBACK' as const,
      segment: 'A',
    },
    {
      brand: 'Mitsubishi',
      model: 'Xpander',
      variant: '1.5 Ultimate',
      years: '2017-2024',
      type: 'MPV' as const,
      segment: 'B',
    },
    // Daihatsu
    {
      brand: 'Daihatsu',
      model: 'Ayla',
      variant: '1.0 R',
      years: '2013-2024',
      type: 'HATCHBACK' as const,
      segment: 'A',
    },
    {
      brand: 'Daihatsu',
      model: 'Xenia',
      variant: '1.3 R',
      years: '2012-2024',
      type: 'MPV' as const,
      segment: 'B',
    },
    // Suzuki
    {
      brand: 'Suzuki',
      model: 'Karimun Wagon R',
      variant: '1.0 GS',
      years: '2013-2024',
      type: 'HATCHBACK' as const,
      segment: 'A',
    },
    {
      brand: 'Suzuki',
      model: 'Ertiga',
      variant: '1.5 GX',
      years: '2012-2024',
      type: 'MPV' as const,
      segment: 'B',
    },
  ]

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { 
        id: `${vehicle.brand}-${vehicle.model}-${vehicle.variant}`.toLowerCase().replace(/\s+/g, '-')
      },
      update: {},
      create: {
        id: `${vehicle.brand}-${vehicle.model}-${vehicle.variant}`.toLowerCase().replace(/\s+/g, '-'),
        ...vehicle,
      },
    })
  }

  // Seed DTC Codes
  const dtcCodes = [
    {
      code: 'P0100',
      system: 'ENGINE' as const,
      subsystem: 'Air Flow',
      description: 'Mass or Volume Air Flow Circuit Malfunction',
      descriptionIndonesian: 'Kerusakan Sirkuit Sensor Aliran Udara (MAF/VAF)',
      severity: 'MEDIUM' as const,
      symptoms: JSON.stringify([
        'Mesin tersendat saat akselerasi',
        'Konsumsi bahan bakar boros',
        'Mesin tidak stabil saat idle',
        'Lampu check engine menyala'
      ]),
      possibleCauses: JSON.stringify([
        'Sensor MAF kotor atau rusak',
        'Kabel sensor MAF putus atau korosi',
        'Kebocoran udara setelah sensor MAF',
        'ECU rusak'
      ]),
      diagnosticSteps: JSON.stringify([
        'Periksa kabel dan konektor sensor MAF',
        'Bersihkan sensor MAF dengan cleaner khusus',
        'Periksa kebocoran udara pada intake manifold',
        'Test sensor MAF dengan multimeter',
        'Ganti sensor MAF jika rusak'
      ]),
      repairProcedures: JSON.stringify([
        'Matikan mesin dan lepas kunci kontak',
        'Lepas konektor sensor MAF',
        'Lepas sensor MAF dari housing',
        'Bersihkan dengan MAF cleaner',
        'Pasang kembali dan test'
      ]),
    },
    {
      code: 'P0171',
      system: 'ENGINE' as const,
      subsystem: 'Fuel System',
      description: 'System Too Lean (Bank 1)',
      descriptionIndonesian: 'Sistem Bahan Bakar Terlalu Kurus (Bank 1)',
      severity: 'MEDIUM' as const,
      symptoms: JSON.stringify([
        'Mesin tersendat atau mati mendadak',
        'Konsumsi bahan bakar boros',
        'Mesin sulit hidup',
        'Performa mesin menurun'
      ]),
      possibleCauses: JSON.stringify([
        'Kebocoran udara pada intake manifold',
        'Sensor MAF kotor atau rusak',
        'Fuel injector tersumbat',
        'Fuel pump lemah',
        'Sensor O2 rusak'
      ]),
      diagnosticSteps: JSON.stringify([
        'Periksa kebocoran udara dengan smoke test',
        'Test tekanan bahan bakar',
        'Periksa sensor MAF dan O2',
        'Test fuel injector',
        'Scan data live ECU'
      ]),
      repairProcedures: JSON.stringify([
        'Perbaiki kebocoran udara jika ada',
        'Bersihkan atau ganti sensor MAF',
        'Bersihkan fuel injector',
        'Ganti fuel filter',
        'Reset ECU dan test drive'
      ]),
    },
    {
      code: 'P0300',
      system: 'ENGINE' as const,
      subsystem: 'Ignition System',
      description: 'Random/Multiple Cylinder Misfire Detected',
      descriptionIndonesian: 'Terdeteksi Misfire pada Beberapa Silinder',
      severity: 'HIGH' as const,
      symptoms: JSON.stringify([
        'Mesin bergetar kasar',
        'Tenaga mesin berkurang drastis',
        'Mesin tersendat saat akselerasi',
        'Suara mesin tidak normal',
        'Lampu check engine berkedip'
      ]),
      possibleCauses: JSON.stringify([
        'Busi aus atau kotor',
        'Koil pengapian rusak',
        'Fuel injector tersumbat',
        'Kompresi mesin rendah',
        'Timing belt/chain melompat'
      ]),
      diagnosticSteps: JSON.stringify([
        'Periksa kondisi busi semua silinder',
        'Test koil pengapian dengan oscilloscope',
        'Test kompresi mesin',
        'Periksa timing belt/chain',
        'Test fuel injector'
      ]),
      repairProcedures: JSON.stringify([
        'Ganti busi yang aus',
        'Ganti koil pengapian yang rusak',
        'Bersihkan atau ganti fuel injector',
        'Perbaiki timing jika melompat',
        'Overhaul mesin jika kompresi rendah'
      ]),
    },
  ]

  for (const dtc of dtcCodes) {
    await prisma.dTCCode.upsert({
      where: { code: dtc.code },
      update: {},
      create: dtc,
    })
  }

  // Seed Sensors
  const sensors = [
    {
      name: 'Mass Air Flow Sensor',
      nameIndonesian: 'Sensor Aliran Udara Massa (MAF)',
      type: 'MAF' as const,
      location: 'Antara air filter dan throttle body',
      specifications: JSON.stringify({
        voltage: '0.5-4.5V',
        resistance: '2-3 ohm',
        frequency: '30-150 Hz'
      }),
      testingProcedure: 'Gunakan multimeter untuk mengukur tegangan output sensor saat mesin idle dan saat digas',
      expectedValues: JSON.stringify([
        { condition: 'Idle', value: '1.0-1.5V' },
        { condition: 'Digas', value: '3.0-4.0V' }
      ]),
      commonFailures: JSON.stringify([
        'Sensor kotor karena debu',
        'Elemen sensor rusak',
        'Kabel putus atau korosi'
      ]),
    },
    {
      name: 'Oxygen Sensor',
      nameIndonesian: 'Sensor Oksigen (O2)',
      type: 'OXYGEN' as const,
      location: 'Pada exhaust manifold sebelum catalytic converter',
      specifications: JSON.stringify({
        voltage: '0.1-0.9V',
        response_time: '<100ms',
        operating_temp: '300-800°C'
      }),
      testingProcedure: 'Ukur tegangan output sensor dengan multimeter saat mesin panas',
      expectedValues: JSON.stringify([
        { condition: 'Lean mixture', value: '0.1-0.3V' },
        { condition: 'Rich mixture', value: '0.7-0.9V' }
      ]),
      commonFailures: JSON.stringify([
        'Sensor terkontaminasi oli',
        'Elemen sensor aus',
        'Kabel rusak karena panas'
      ]),
    },
  ]

  for (const sensor of sensors) {
    await prisma.sensor.upsert({
      where: { 
        id: sensor.name.toLowerCase().replace(/\s+/g, '-')
      },
      update: {},
      create: {
        id: sensor.name.toLowerCase().replace(/\s+/g, '-'),
        ...sensor,
      },
    })
  }

  // Seed Actuators
  const actuators = [
    {
      name: 'Fuel Injector',
      nameIndonesian: 'Injektor Bahan Bakar',
      type: 'INJECTOR' as const,
      location: 'Pada intake manifold setiap silinder',
      specifications: JSON.stringify({
        resistance: '12-16 ohm',
        flow_rate: '200-400 cc/min',
        pressure: '3.5 bar'
      }),
      testingProcedure: 'Test resistansi dengan multimeter dan flow rate dengan injector tester',
      operationalParameters: JSON.stringify([
        { parameter: 'Pulse width', range: '2-15 ms' },
        { parameter: 'Duty cycle', range: '10-90%' }
      ]),
      controlSignals: JSON.stringify([
        'PWM signal dari ECU',
        '12V power supply',
        'Ground signal'
      ]),
      commonFailures: JSON.stringify([
        'Injector tersumbat',
        'Coil injector putus',
        'O-ring bocor'
      ]),
    },
    {
      name: 'Ignition Coil',
      nameIndonesian: 'Koil Pengapian',
      type: 'IGNITION_COIL' as const,
      location: 'Di atas busi (coil on plug) atau di engine bay',
      specifications: JSON.stringify({
        primary_resistance: '0.5-2.0 ohm',
        secondary_resistance: '8000-15000 ohm',
        output_voltage: '25000-40000V'
      }),
      testingProcedure: 'Test resistansi primer dan sekunder dengan multimeter',
      operationalParameters: JSON.stringify([
        { parameter: 'Dwell time', range: '2-8 ms' },
        { parameter: 'Spark duration', range: '1-2 ms' }
      ]),
      controlSignals: JSON.stringify([
        'Trigger signal dari ECU',
        '12V power supply',
        'Ground signal'
      ]),
      commonFailures: JSON.stringify([
        'Coil primer putus',
        'Coil sekunder putus',
        'Isolasi rusak karena panas'
      ]),
    },
  ]

  for (const actuator of actuators) {
    await prisma.actuator.upsert({
      where: { 
        id: actuator.name.toLowerCase().replace(/\s+/g, '-')
      },
      update: {},
      create: {
        id: actuator.name.toLowerCase().replace(/\s+/g, '-'),
        ...actuator,
      },
    })
  }

  console.log('Seeding selesai!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })