
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config();

// Konfigurasi Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('🚀 Mulai seeding database (Vehicles & Engines) via Supabase REST...');

    const now = new Date().toISOString();

    // Helper to add common fields
    const addCommon = () => ({
        createdAt: now,
        updatedAt: now
    });

    // Seed Engines
    const engines = [
        { id: randomUUID(), ...addCommon(), code: '1NZ-FE', brand: 'Toyota', displacement: 1496, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 109, torque: 141, commonVehicles: JSON.stringify(['Toyota Vios', 'Toyota Yaris']), commonIssues: JSON.stringify(['Carbon buildup', 'Timing chain stretch', 'VVT-i solenoid failure']) },
        { id: randomUUID(), ...addCommon(), code: '2NR-FE', brand: 'Toyota', displacement: 1329, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 99, torque: 121, commonVehicles: JSON.stringify(['Toyota Agya', 'Toyota Calya', 'Daihatsu Ayla']), commonIssues: JSON.stringify(['Throttle body cleaning', 'Fuel injector cleaning']) },
        { id: randomUUID(), ...addCommon(), code: '1KR-VE', brand: 'Toyota', displacement: 998, cylinders: 3, fuel: 'BENSIN', aspiration: 'NATURAL', power: 68, torque: 89, commonVehicles: JSON.stringify(['Toyota Agya', 'Daihatsu Ayla']), commonIssues: JSON.stringify(['Engine mount wear', 'Spark plug fouling']) },
        { id: randomUUID(), ...addCommon(), code: '2GR-FE', brand: 'Toyota', displacement: 3456, cylinders: 6, fuel: 'BENSIN', aspiration: 'NATURAL', power: 277, torque: 346, commonVehicles: JSON.stringify(['Toyota Camry', 'Toyota Alphard']), commonIssues: JSON.stringify(['Carbon buildup', 'Water pump failure']) },
        { id: randomUUID(), ...addCommon(), code: '1GD-FTV', brand: 'Toyota', displacement: 2755, cylinders: 4, fuel: 'DIESEL', aspiration: 'TURBO', power: 177, torque: 450, commonVehicles: JSON.stringify(['Toyota Fortuner', 'Toyota Hilux']), commonIssues: JSON.stringify(['DPF clogging', 'Turbo failure', 'Fuel injector issues']) },
        { id: randomUUID(), ...addCommon(), code: '2TR-FE', brand: 'Toyota', displacement: 2694, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 166, torque: 245, commonVehicles: JSON.stringify(['Toyota Fortuner', 'Toyota Hilux']), commonIssues: JSON.stringify(['Timing chain stretch', 'VVT-i problems']) },
        { id: randomUUID(), ...addCommon(), code: '1TR-FE', brand: 'Toyota', displacement: 1998, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 136, torque: 183, commonVehicles: JSON.stringify(['Toyota Innova', 'Toyota Kijang']), commonIssues: JSON.stringify(['Carbon buildup', 'Oil consumption']) },
        { id: randomUUID(), ...addCommon(), code: '2ZR-FE', brand: 'Toyota', displacement: 1797, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 140, torque: 173, commonVehicles: JSON.stringify(['Toyota Corolla Altis']), commonIssues: JSON.stringify(['Oil consumption', 'VVT-i solenoid']) },
        { id: randomUUID(), ...addCommon(), code: 'M20A-FKS', brand: 'Toyota', displacement: 1987, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 169, torque: 205, commonVehicles: JSON.stringify(['Toyota Corolla Cross', 'Toyota C-HR']), commonIssues: JSON.stringify(['Direct injection carbon buildup']) },
        { id: randomUUID(), ...addCommon(), code: '1KR-FE', brand: 'Toyota', displacement: 996, cylinders: 3, fuel: 'BENSIN', aspiration: 'TURBO', power: 98, torque: 140, commonVehicles: JSON.stringify(['Toyota Raize', 'Daihatsu Rocky']), commonIssues: JSON.stringify(['Turbo lag', 'Carbon buildup']) },
        // Honda
        { id: randomUUID(), ...addCommon(), code: 'L15A7', brand: 'Honda', displacement: 1497, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 120, torque: 145, commonVehicles: JSON.stringify(['Honda Jazz', 'Honda City']), commonIssues: JSON.stringify(['VTEC solenoid failure', 'Timing chain tensioner']) },
        { id: randomUUID(), ...addCommon(), code: 'R18A1', brand: 'Honda', displacement: 1799, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 140, torque: 174, commonVehicles: JSON.stringify(['Honda Civic', 'Honda CR-V']), commonIssues: JSON.stringify(['Carbon buildup', 'VTC actuator failure']) },
        { id: randomUUID(), ...addCommon(), code: 'L15B7', brand: 'Honda', displacement: 1498, cylinders: 4, fuel: 'BENSIN', aspiration: 'TURBO', power: 173, torque: 220, commonVehicles: JSON.stringify(['Honda CR-V Turbo', 'Honda Civic Turbo']), commonIssues: JSON.stringify(['Turbo lag', 'Carbon buildup', 'Fuel dilution']) },
        { id: randomUUID(), ...addCommon(), code: 'L12B1', brand: 'Honda', displacement: 1198, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 90, torque: 110, commonVehicles: JSON.stringify(['Honda Brio']), commonIssues: JSON.stringify(['Timing chain noise', 'Oil consumption']) },
        { id: randomUUID(), ...addCommon(), code: 'K20C4', brand: 'Honda', displacement: 1996, cylinders: 4, fuel: 'BENSIN', aspiration: 'TURBO', power: 306, torque: 400, commonVehicles: JSON.stringify(['Honda Civic Type R']), commonIssues: JSON.stringify(['Turbo overheating', 'High fuel consumption']) },
        // Mitsubishi
        { id: randomUUID(), ...addCommon(), code: '4A91', brand: 'Mitsubishi', displacement: 1499, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 109, torque: 143, commonVehicles: JSON.stringify(['Mitsubishi Mirage', 'Mitsubishi Xpander']), commonIssues: JSON.stringify(['Timing chain stretch', 'Oil consumption']) },
        { id: randomUUID(), ...addCommon(), code: '4N15', brand: 'Mitsubishi', displacement: 2442, cylinders: 4, fuel: 'DIESEL', aspiration: 'TURBO', power: 181, torque: 430, commonVehicles: JSON.stringify(['Mitsubishi Pajero Sport', 'Mitsubishi Triton']), commonIssues: JSON.stringify(['DPF issues', 'Turbo failure', 'EGR valve problems']) },
        { id: randomUUID(), ...addCommon(), code: '4J11', brand: 'Mitsubishi', displacement: 2378, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 170, torque: 226, commonVehicles: JSON.stringify(['Mitsubishi Outlander']), commonIssues: JSON.stringify(['Timing chain stretch', 'Oil consumption']) },
        { id: randomUUID(), ...addCommon(), code: '4B12', brand: 'Mitsubishi', displacement: 2359, cylinders: 4, fuel: 'BENSIN', aspiration: 'TURBO', power: 150, torque: 240, commonVehicles: JSON.stringify(['Mitsubishi Eclipse Cross']), commonIssues: JSON.stringify(['Turbo failure', 'Carbon buildup']) },
        // Suzuki
        { id: randomUUID(), ...addCommon(), code: 'K15B', brand: 'Suzuki', displacement: 1462, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 105, torque: 138, commonVehicles: JSON.stringify(['Suzuki Ertiga', 'Suzuki Swift']), commonIssues: JSON.stringify(['Carbon buildup', 'Timing chain noise']) },
        { id: randomUUID(), ...addCommon(), code: 'K10B', brand: 'Suzuki', displacement: 998, cylinders: 3, fuel: 'BENSIN', aspiration: 'NATURAL', power: 68, torque: 90, commonVehicles: JSON.stringify(['Suzuki Karimun Wagon R', 'Suzuki Ignis']), commonIssues: JSON.stringify(['Engine mount wear', 'Throttle body issues']) },
        // Daihatsu
        { id: randomUUID(), ...addCommon(), code: '3SZ-VE', brand: 'Daihatsu', displacement: 1329, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 95, torque: 121, commonVehicles: JSON.stringify(['Daihatsu Xenia', 'Daihatsu Terios']), commonIssues: JSON.stringify(['VVT-i problems', 'Oil consumption']) },
        { id: randomUUID(), ...addCommon(), code: '1KR-DE', brand: 'Daihatsu', displacement: 996, cylinders: 3, fuel: 'BENSIN', aspiration: 'NATURAL', power: 68, torque: 91, commonVehicles: JSON.stringify(['Daihatsu Ayla']), commonIssues: JSON.stringify(['Engine mount wear', 'Carbon buildup']) },
        { id: randomUUID(), ...addCommon(), code: '2NR-VE', brand: 'Daihatsu', displacement: 1329, cylinders: 4, fuel: 'BENSIN', aspiration: 'NATURAL', power: 91, torque: 121, commonVehicles: JSON.stringify(['Daihatsu Sigra']), commonIssues: JSON.stringify(['VVT-i solenoid failure', 'Throttle body cleaning']) },
    ];

    console.log(`📤 Uploading ${engines.length} Engines...`);
    // Need to select to check existing if upsert by code doesn't map ID?
    // Upsert by code will update existing provided fields. If ID is provided, it might overwrite or be ignored if code matches.
    // Ideally we fetch existing IDs first to reuse them? 
    // Or just let Supabase upsert handle it. 
    // But if we pass a new random ID for an EXISTING code, upsert might try to update the ID?
    // ID is PK! code is Unique.
    // Upserting via PostgREST on UNIQUE column "code" works.
    // If record exists, it updates. If we send a new ID, does it update the ID? Providing ID is allowed.
    // But changing PK might be tricky.
    // Let's omit ID if we can? No, we need it for INSERT.
    // Solution: Fetch existing Engines by code first.

    const { data: existingEngines } = await supabase.from('Engine').select('id, code');
    const enginesToUpsert = engines.map(e => {
        const existing = existingEngines?.find(ex => ex.code === e.code);
        if (existing) {
            return { ...e, id: existing.id }; // Use existing ID
        }
        return e;
    });

    const { error: engineError } = await supabase.from('Engine').upsert(enginesToUpsert, { onConflict: 'code' });
    if (engineError) console.error('❌ Error uploading Engines:', engineError);
    else console.log('✅ Engines uploaded.');

    // Seed Vehicles (Partial list for demonstration/restoration basics)
    const vehicles = [
        { brand: 'Toyota', model: 'Agya', variant: '1.2 G', years: '2017-2024', type: 'HATCHBACK', segment: 'A' },
        { brand: 'Toyota', model: 'Avanza', variant: '1.3 G', years: '2012-2021', type: 'MPV', segment: 'B' },
        { brand: 'Toyota', model: 'Innova', variant: '2.0 G', years: '2012-2020', type: 'MPV', segment: 'C' },
        { brand: 'Honda', model: 'Brio', variant: '1.2 E', years: '2012-2024', type: 'HATCHBACK', segment: 'A' },
        { brand: 'Honda', model: 'Jazz', variant: '1.5 RS', years: '2014-2024', type: 'HATCHBACK', segment: 'B' },
        { brand: 'Honda', model: 'HR-V', variant: '1.5 E', years: '2015-2024', type: 'SUV', segment: 'B' },
        { brand: 'Mitsubishi', model: 'Xpander', variant: '1.5 Ultimate', years: '2017-2024', type: 'MPV', segment: 'B' },
        { brand: 'Daihatsu', model: 'Ayla', variant: '1.0 R', years: '2013-2024', type: 'HATCHBACK', segment: 'A' },
        { brand: 'Daihatsu', model: 'Sigra', variant: '1.2 R', years: '2016-2024', type: 'MPV', segment: 'A' },
        { brand: 'Daihatsu', model: 'Xenia', variant: '1.3 R', years: '2012-2024', type: 'MPV', segment: 'B' },
    ];

    const vehicleRecords = vehicles.map(v => ({
        ...v,
        id: `${v.brand}-${v.model}-${v.variant}`.toLowerCase().replace(/\s+/g, '-'),
        createdAt: now,
        updatedAt: now
    }));

    console.log(`📤 Uploading ${vehicleRecords.length} Vehicles...`);
    const { error: vehicleError } = await supabase.from('Vehicle').upsert(vehicleRecords, { onConflict: 'id' });
    if (vehicleError) console.error('❌ Error uploading Vehicles:', vehicleError);
    else console.log('✅ Vehicles uploaded.');

    // Relations
    const vehicleEngineRelations = [
        { vehicleBrand: 'Toyota', vehicleModel: 'Agya', engineCode: '2NR-FE', transmissions: ['Manual (MT)', 'Otomatis (AT)'] },
        { vehicleBrand: 'Toyota', vehicleModel: 'Avanza', engineCode: '2NR-FE', transmissions: ['Manual (MT)', 'Otomatis (AT)'] },
        { vehicleBrand: 'Toyota', vehicleModel: 'Innova', engineCode: '1TR-FE', transmissions: ['Manual (MT)', 'Otomatis (AT)'] },
        { vehicleBrand: 'Honda', vehicleModel: 'Brio', engineCode: 'L12B1', transmissions: ['Manual (MT)', 'CVT'] },
        { vehicleBrand: 'Honda', vehicleModel: 'Jazz', engineCode: 'L15A7', transmissions: ['Manual (MT)', 'CVT'] },
        { vehicleBrand: 'Honda', vehicleModel: 'HR-V', engineCode: 'L15A7', transmissions: ['Manual (MT)', 'CVT'] },
        { vehicleBrand: 'Mitsubishi', vehicleModel: 'Xpander', engineCode: '4A91', transmissions: ['Manual (MT)', 'Otomatis (AT)'] },
        { vehicleBrand: 'Daihatsu', vehicleModel: 'Ayla', engineCode: '1KR-DE', transmissions: ['Manual (MT)', 'Otomatis (AT)'] },
        { vehicleBrand: 'Daihatsu', vehicleModel: 'Sigra', engineCode: '2NR-VE', transmissions: ['Manual (MT)', 'Otomatis (AT)'] },
        { vehicleBrand: 'Daihatsu', vehicleModel: 'Xenia', engineCode: '2NR-VE', transmissions: ['Manual (MT)', 'Otomatis (AT)'] } // Xenia uses 2NR-VE? Check engines.
    ];

    console.log('🔗 Linking Vehicles and Engines...');

    // Fetch vehicles to get IDs
    const { data: dbVehicles } = await supabase.from('Vehicle').select('id, brand, model');
    const { data: dbEngines } = await supabase.from('Engine').select('id, code');

    if (!dbVehicles || !dbEngines) {
        console.log('Skipping relations (missing data)');
        return;
    }

    const relationsToInsert: any[] = [];

    // Fetch existing relations to prevent duplication if we are inserting
    // Or just upsert. But VehicleEngine has ID.
    // If we upsert on composite code, we need to provide ID for NEW records.
    // For existing, we need the ID.
    // Or we use ignoreDuplicates and don't provide ID?
    // If we don't provide ID, and column is not null, it fails.
    // So we MUST provide ID for insert.
    // Can we reliably generate ID? randomUUID().

    // We'll iterate and construct payload with random ID for everyone.
    // Upsert with onConflict on (vehicleId, engineId) should work if we let it update/ignore.
    // But if record exists, we might be changing its ID? No, upsert does not update PK unless specified?

    // Strategy: Delete all relations and re-insert is easiest for seeding?
    // Or better: Check if exists.

    // We'll stick to upsert but careful.
    // Since we ignoreDuplicates: true, it won't update.
    // So we can pass random ID. It will only be used if inserted.

    for (const rel of vehicleEngineRelations) {
        // Find vehicle ID (match brand/model, pick any)
        const veh = dbVehicles.find(v => v.brand === rel.vehicleBrand && v.model === rel.vehicleModel);
        const eng = dbEngines.find(e => e.code === rel.engineCode);

        if (veh && eng) {
            relationsToInsert.push({
                id: randomUUID(), // Generate ID
                vehicleId: veh.id,
                engineId: eng.id,
                transmissions: JSON.stringify(rel.transmissions)
            });
        }
    }

    if (relationsToInsert.length > 0) {
        // Using upsert with ignoreDuplicates to avoid PK issues?
        // But if we pass ID, and it exists, upsert tries to match?
        // onConflict is on vehicleId, engineId.
        // So if vehicleId+engineId exists, it ignores.
        // If not exists, it inserts with the provided ID.
        // This is safe.
        const { error: upsertError } = await supabase.from('VehicleEngine').upsert(relationsToInsert, { onConflict: 'vehicleId,engineId', ignoreDuplicates: true });

        if (upsertError) console.log('⚠️ Relation upsert error:', upsertError.message);
        else console.log(`✅ ${relationsToInsert.length} Relations processed.`);
    }

    console.log('🏁 Seeding finished.');
}

main();
