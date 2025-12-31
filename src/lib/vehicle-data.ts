// Data kendaraan beredar di Indonesia 15 tahun terakhir (2009-2024)
// Sumber: Data penjualan otomotif Indonesia, Gaikindo

export interface Brand {
  id: string
  name: string
  country: string
  popular: boolean
}

export interface CarModel {
  id: string
  brandId: string
  name: string
  years: string // "2009-2024" format
  type: 'MPV' | 'Sedan' | 'SUV' | 'LCGC' | 'City Car' | 'Hatchback' | 'Pickup' | 'Double Cabin'
  segment: string
}

export interface Engine {
  id: string
  brand: string
  code: string
  displacement: number // cc
  cylinders: number
  fuel: 'Bensin' | 'Diesel' | 'Hybrid' | 'Electric'
  aspiration: 'Natural' | 'Turbo' | 'Supercharged'
  power: number // HP
  torque: number // Nm
  commonVehicles: string[]
}

export const BRANDS: Brand[] = [
  { id: 'toyota', name: 'Toyota', country: 'Jepang', popular: true },
  { id: 'honda', name: 'Honda', country: 'Jepang', popular: true },
  { id: 'suzuki', name: 'Suzuki', country: 'Jepang', popular: true },
  { id: 'daihatsu', name: 'Daihatsu', country: 'Jepang', popular: true },
  { id: 'mitsubishi', name: 'Mitsubishi', country: 'Jepang', popular: true },
  { id: 'hyundai', name: 'Hyundai', country: 'Korea', popular: true },
  { id: 'kia', name: 'Kia', country: 'Korea', popular: true },
  { id: 'nissan', name: 'Nissan', country: 'Jepang', popular: true },
  { id: 'mazda', name: 'Mazda', country: 'Jepang', popular: false },
  { id: 'ford', name: 'Ford', country: 'Amerika', popular: false },
  { id: 'chevrolet', name: 'Chevrolet', country: 'Amerika', popular: false },
  { id: 'wuling', name: 'Wuling', country: 'Cina', popular: false },
  { id: 'vw', name: 'Volkswagen', country: 'Jerman', popular: false }
]

export const CAR_MODELS: CarModel[] = [
  // === TOYOTA ===
  // LCGC & City Car
  { brandId: 'toyota', name: 'Agya', years: '2012-2024', type: 'LCGC', segment: 'LCGC 7-Seater' },
  { brandId: 'toyota', name: 'Calya', years: '2016-2024', type: 'LCGC', segment: 'LCGC 7-Seater' },
  { brandId: 'toyota', name: 'Agya GR Sportivo', years: '2022-2024', type: 'LCGC', segment: 'LCGC 7-Seater' },
  { brandId: 'toyota', name: 'Yaris', years: '2009-2024', type: 'City Car', segment: 'B-Segment' },
  { brandId: 'toyota', name: 'Vios', years: '2009-2024', type: 'Sedan', segment: 'C-Segment' },

  // MPV
  { brandId: 'toyota', name: 'Avanza', years: '2009-2024', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'toyota', name: 'Avanza Veloz', years: '2011-2024', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'toyota', name: 'Avanza Xenia', years: '2009-2012', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'toyota', name: 'Innova', years: '2009-2015', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'toyota', name: 'Innova Reborn', years: '2015-2024', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'toyota', name: 'Kijang Innova', years: '2009-2024', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'toyota', name: 'Kijang Innova Reborn', years: '2016-2024', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'toyota', name: 'Sienta', years: '2009-2024', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'toyota', name: 'Sienta Gen 2', years: '2015-2024', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'toyota', name: 'Voxy', years: '2009-2013', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'toyota', name: 'Vozy Gen 2', years: '2014-2024', type: 'MPV', segment: 'MPV 7-Seater' },

  // SUV
  { brandId: 'toyota', name: 'Rush', years: '2009-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'toyota', name: 'Rush GR Sportivo', years: '2022-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'toyota', name: 'Fortuner', years: '2009-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'toyota', name: 'Fortuner VRZ', years: '2016-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'toyota', name: 'Raize', years: '2021-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'toyota', name: 'RAV4', years: '2009-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'toyota', name: 'RAV4 Gen 5', years: '2019-2024', type: 'SUV', segment: 'Compact SUV' },

  // Sedan
  { brandId: 'toyota', name: 'Corolla Altis', years: '2009-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'toyota', name: 'Corolla Altis Gen 12', years: '2014-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'toyota', name: 'Corolla Cross', years: '2020-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'toyota', name: 'Camry', years: '2009-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'toyota', name: 'Camry Gen 7', years: '2018-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'toyota', name: 'Vellfire', years: '2009-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'toyota', name: 'Crown', years: '2009-2024', type: 'Sedan', segment: 'E-Segment' },

  // === HONDA ===
  // City Car & LCGC
  { brandId: 'honda', name: 'Brio', years: '2012-2024', type: 'City Car', segment: 'A-Segment' },
  { brandId: 'honda', name: 'Brio Satya', years: '2017-2024', type: 'LCGC', segment: 'LCGC 7-Seater' },
  { brandId: 'honda', name: 'City', years: '2009-2014', type: 'City Car', segment: 'B-Segment' },
  { brandId: 'honda', name: 'City Gen 4', years: '2014-2024', type: 'City Car', segment: 'B-Segment' },

  // Hatchback
  { brandId: 'honda', name: 'Jazz', years: '2009-2024', type: 'Hatchback', segment: 'B-Segment' },
  { brandId: 'honda', name: 'Jazz Gen 3', years: '2014-2024', type: 'Hatchback', segment: 'B-Segment' },
  { brandId: 'honda', name: 'Jazz Gen 4', years: '2017-2024', type: 'Hatchback', segment: 'B-Segment' },
  { brandId: 'honda', name: 'Fit', years: '2009-2014', type: 'Hatchback', segment: 'B-Segment' },

  // Sedan
  { brandId: 'honda', name: 'Civic', years: '2009-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'honda', name: 'Civic Gen 10', years: '2016-2021', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'honda', name: 'Civic Gen 11', years: '2021-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'honda', name: 'Civic Turbo', years: '2017-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'honda', name: 'City Sedan', years: '2009-2014', type: 'Sedan', segment: 'B-Segment' },
  { brandId: 'honda', name: 'Accord', years: '2009-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'honda', name: 'Accord Gen 9', years: '2013-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'honda', name: 'Accord Gen 10', years: '2018-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'honda', name: 'City Hatchback', years: '2009-2014', type: 'Hatchback', segment: 'B-Segment' },

  // MPV
  { brandId: 'honda', name: 'Freed', years: '2009-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'honda', name: 'Freed Gen 2', years: '2016-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'honda', name: 'Mobilio', years: '2014-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'honda', name: 'Mobilio Gen 2', years: '2019-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'honda', name: 'BR-V', years: '2009-2015', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'honda', name: 'BR-V Gen 2', years: '2015-2024', type: 'SUV', segment: 'Compact SUV' },

  // SUV
  { brandId: 'honda', name: 'CR-V', years: '2009-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'honda', name: 'CR-V Gen 5', years: '2017-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'honda', name: 'CR-V Gen 6', years: '2023-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'honda', name: 'HR-V', years: '2009-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'honda', name: 'HR-V Gen 3', years: '2015-2024', type: 'SUV', segment: 'Compact SUV' },

  // === SUZUKI ===
  // LCGC
  { brandId: 'suzuki', name: 'Ignis', years: '2016-2024', type: 'LCGC', segment: 'LCGC 7-Seater' },
  { brandId: 'suzuki', name: 'Ignis Gen 2', years: '2023-2024', type: 'LCGC', segment: 'LCGC 7-Seater' },

  // MPV
  { brandId: 'suzuki', name: 'Ertiga', years: '2012-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'suzuki', name: 'Ertiga Gen 2', years: '2019-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'suzuki', name: 'Ertiga Hybrid', years: '2019-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'suzuki', name: 'Ertiga Gen 3', years: '2024-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'suzuki', name: 'APV', years: '2009-2024', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'suzuki', name: 'Karimun Wagon R', years: '2011-2024', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'suzuki', name: 'Karimun Wagon R Gen 2', years: '2017-2024', type: 'MPV', segment: 'MPV 7-Seater' },

  // Pickup
  { brandId: 'suzuki', name: 'Carry Futura', years: '2009-2024', type: 'Pickup', segment: 'Light Pickup' },
  { brandId: 'suzuki', name: 'Carry Gen 2', years: '2019-2024', type: 'Pickup', segment: 'Light Pickup' },

  // SUV
  { brandId: 'suzuki', name: 'Grand Vitara', years: '2009-2018', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'suzuki', name: 'Vitara', years: '2009-2018', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'suzuki', name: 'S-Cross', years: '2023-2024', type: 'SUV', segment: 'Compact SUV' },

  // City Car
  { brandId: 'suzuki', name: 'Swift', years: '2009-2024', type: 'City Car', segment: 'B-Segment' },
  { brandId: 'suzuki', name: 'Swift Gen 3', years: '2017-2024', type: 'City Car', segment: 'B-Segment' },
  { brandId: 'suzuki', name: 'Swift Gen 4', years: '2024-2024', type: 'City Car', segment: 'B-Segment' },

  // === MITSUBISHI ===
  // LCGC
  { brandId: 'mitsubishi', name: 'Xpander', years: '2017-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'mitsubishi', name: 'Xpander Cross', years: '2021-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'mitsubishi', name: 'Xpander Gen 2', years: '2022-2024', type: 'MPV', segment: 'Compact MPV' },

  // MPV
  { brandId: 'mitsubishi', name: 'Delica', years: '2009-2018', type: 'MPV', segment: 'Compact MPV' },

  // SUV
  { brandId: 'mitsubishi', name: 'Pajero Sport', years: '2009-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'mitsubishi', name: 'Pajero Sport Gen 3', years: '2020-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'mitsubishi', name: 'Pajero Sport Dakar', years: '2009-2019', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'mitsubishi', name: 'Pajero Sport Gen 4', years: '2023-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'mitsubishi', name: 'Outlander', years: '2009-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'mitsubishi', name: 'Outlander PHEV', years: '2013-2024', type: 'SUV', segment: 'Mid-Size SUV' },

  // City Car
  { brandId: 'mitsubishi', name: 'Mirage', years: '2012-2024', type: 'City Car', segment: 'A-Segment' },
  { brandId: 'mitsubishi', name: 'Mirage G4', years: '2017-2024', type: 'City Car', segment: 'A-Segment' },

  // Hatchback
  { brandId: 'mitsubishi', name: 'Lancer EX', years: '2009-2017', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'mitsubishi', name: 'Lancer Evolution', years: '2009-2016', type: 'Sedan', segment: 'C-Segment' },

  // === DAIHATSU ===
  // LCGC
  { brandId: 'daihatsu', name: 'Xenia', years: '2009-2012', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'daihatsu', name: 'Xenia Gen 2', years: '2012-2021', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'daihatsu', name: 'Xenia Gen 3', years: '2021-2024', type: 'MPV', segment: 'MPV 7-Seater' },

  // LCGC
  { brandId: 'daihatsu', name: 'Sigra', years: '2016-2024', type: 'LCGC', segment: 'LCGC 7-Seater' },
  { brandId: 'daihatsu', name: 'Sigra Gen 2', years: '2022-2024', type: 'LCGC', segment: 'LCGC 7-Seater' },
  { brandId: 'daihatsu', name: 'Ayla', years: '2012-2024', type: 'LCGC', segment: 'LCGC 7-Seater' },

  // SUV
  { brandId: 'daihatsu', name: 'Terios', years: '2009-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'daihatsu', name: 'Terios Gen 2', years: '2017-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'daihatsu', name: 'Rush', years: '2009-2017', type: 'SUV', segment: 'Compact SUV' },

  // City Car
  { brandId: 'daihatsu', name: 'Sirion', years: '2009-2024', type: 'Hatchback', segment: 'B-Segment' },
  { brandId: 'daihatsu', name: 'Sirion Gen 2', years: '2011-2024', type: 'Hatchback', segment: 'B-Segment' },
  { brandId: 'daihatsu', name: 'Luxio', years: '2009-2017', type: 'MPV', segment: 'Compact MPV' },

  // Pickup
  { brandId: 'daihatsu', name: 'Gran Max', years: '2009-2024', type: 'Pickup', segment: 'Light Pickup' },
  { brandId: 'daihatsu', name: 'Gran Max Gen 2', years: '2018-2024', type: 'Pickup', segment: 'Light Pickup' },

  // === HYUNDAI ===
  // SUV
  { brandId: 'hyundai', name: 'Santa Fe', years: '2009-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'hyundai', name: 'Santa Fe Gen 4', years: '2019-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'hyundai', name: 'Santa Fe Gen 5', years: '2023-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'hyundai', name: 'Tucson', years: '2009-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'hyundai', name: 'Tucson Gen 3', years: '2015-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'hyundai', name: 'Tucson Gen 4', years: '2020-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'hyundai', name: 'Creta', years: '2016-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'hyundai', name: 'Creta Gen 2', years: '2021-2024', type: 'SUV', segment: 'Compact SUV' },

  // City Car
  { brandId: 'hyundai', name: 'i10', years: '2009-2014', type: 'City Car', segment: 'A-Segment' },
  { brandId: 'hyundai', name: 'i10 Gen 2', years: '2014-2024', type: 'City Car', segment: 'A-Segment' },
  { brandId: 'hyundai', name: 'i20', years: '2009-2024', type: 'City Car', segment: 'B-Segment' },
  { brandId: 'hyundai', name: 'i20 Gen 2', years: '2014-2024', type: 'City Car', segment: 'B-Segment' },
  { brandId: 'hyundai', name: 'Grand i10', years: '2017-2024', type: 'City Car', segment: 'A-Segment' },
  { brandId: 'hyundai', name: 'Grand i20', years: '2020-2024', type: 'City Car', segment: 'B-Segment' },

  // Sedan
  { brandId: 'hyundai', name: 'Accent', years: '2009-2018', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'hyundai', name: 'Accent Gen 6', years: '2018-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'hyundai', name: 'Elantra', years: '2009-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'hyundai', name: 'Sonata', years: '2009-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'hyundai', name: 'Sonata Gen 8', years: '2015-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'hyundai', name: 'Sonata Gen 9', years: '2020-2024', type: 'Sedan', segment: 'D-Segment' },

  // MPV
  { brandId: 'hyundai', name: 'Starex', years: '2009-2024', type: 'MPV', segment: 'MPV 7-Seater' },
  { brandId: 'hyundai', name: 'Starex Gen 3', years: '2018-2024', type: 'MPV', segment: 'MPV 7-Seater' },

  // === KIA ===
  // SUV
  { brandId: 'kia', name: 'Sportage', years: '2009-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'kia', name: 'Sportage Gen 4', years: '2016-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'kia', name: 'Sportage Gen 5', years: '2021-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'kia', name: 'Sorento', years: '2009-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'kia', name: 'Sorento Gen 3', years: '2015-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'kia', name: 'Sorento Gen 4', years: '2020-2024', type: 'SUV', segment: 'Mid-Size SUV' },

  // City Car
  { brandId: 'kia', name: 'Picanto', years: '2009-2017', type: 'City Car', segment: 'A-Segment' },
  { brandId: 'kia', name: 'Picanto Gen 2', years: '2017-2024', type: 'City Car', segment: 'A-Segment' },
  { brandId: 'kia', name: 'Picanto Gen 3', years: '2024-2024', type: 'City Car', segment: 'A-Segment' },
  { brandId: 'kia', name: 'Morning', years: '2009-2015', type: 'City Car', segment: 'A-Segment' },
  { brandId: 'kia', name: 'Rio', years: '2009-2024', type: 'Sedan', segment: 'B-Segment' },
  { brandId: 'kia', name: 'Rio Gen 4', years: '2017-2024', type: 'Sedan', segment: 'B-Segment' },

  // Sedan
  { brandId: 'kia', name: 'Cerato', years: '2009-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'kia', name: 'Cerato Gen 4', years: '2019-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'kia', name: 'K5', years: '2009-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'kia', name: 'K5 Gen 2', years: '2016-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'kia', name: 'K5 Gen 3', years: '2021-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'kia', name: 'K8', years: '2010-2024', type: 'Sedan', segment: 'E-Segment' },

  // MPV
  { brandId: 'kia', name: 'Carnival', years: '2009-2024', type: 'MPV', segment: 'Large MPV' },
  { brandId: 'kia', name: 'Carnival Gen 4', years: '2015-2024', type: 'MPV', segment: 'Large MPV' },
  { brandId: 'kia', name: 'Sedona', years: '2009-2024', type: 'MPV', segment: 'Large MPV' },
  { brandId: 'kia', name: 'Carens', years: '2009-2018', type: 'MPV', segment: 'Compact MPV' },

  // === NISSAN ===
  // MPV
  { brandId: 'nissan', name: 'Livina', years: '2009-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'nissan', name: 'Grand Livina', years: '2009-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'nissan', name: 'Grand Livina Gen 2', years: '2019-2024', type: 'MPV', segment: 'Compact MPV' },

  // SUV
  { brandId: 'nissan', name: 'X-Trail', years: '2009-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'nissan', name: 'X-Trail Gen 3', years: '2014-2020', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'nissan', name: 'X-Trail Gen 4', years: '2021-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'nissan', name: 'Terra', years: '2018-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'nissan', name: 'Murano', years: '2009-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'nissan', name: 'Juke', years: '2011-2024', type: 'SUV', segment: 'Compact SUV' },

  // City Car & Sedan
  { brandId: 'nissan', name: 'March', years: '2009-2024', type: 'City Car', segment: 'A-Segment' },
  { brandId: 'nissan', name: 'March Gen 2', years: '2010-2017', type: 'City Car', segment: 'A-Segment' },
  { brandId: 'nissan', name: 'Note', years: '2009-2024', type: 'Hatchback', segment: 'B-Segment' },
  { brandId: 'nissan', name: 'Note Gen 2', years: '2013-2024', type: 'Hatchback', segment: 'B-Segment' },
  { brandId: 'nissan', name: 'Almera', years: '2009-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'nissan', name: 'Sylphy', years: '2009-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'nissan', name: 'Teana', years: '2009-2024', type: 'Sedan', segment: 'D-Segment' },
  { brandId: 'nissan', name: 'Serena', years: '2009-2024', type: 'MPV', segment: 'Compact MPV' },

  // Pickup
  { brandId: 'nissan', name: 'NP300', years: '2009-2024', type: 'Pickup', segment: 'Light Pickup' },
  { brandId: 'nissan', name: 'NP300 Gen 2', years: '2017-2024', type: 'Pickup', segment: 'Light Pickup' },

  // === MAZDA ===
  // SUV
  { brandId: 'mazda', name: 'CX-5', years: '2009-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'mazda', name: 'CX-5 Gen 2', years: '2012-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'mazda', name: 'CX-5 Gen 3', years: '2017-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'mazda', name: 'CX-7', years: '2009-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'mazda', name: 'CX-8', years: '2009-2020', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'mazda', name: 'CX-9', years: '2009-2015', type: 'SUV', segment: 'Mid-Size SUV' },

  // Sedan
  { brandId: 'mazda', name: 'Mazda2', years: '2009-2014', type: 'Sedan', segment: 'B-Segment' },
  { brandId: 'mazda', name: 'Mazda2 Gen 2', years: '2014-2024', type: 'Sedan', segment: 'B-Segment' },
  { brandId: 'mazda', name: 'Mazda3', years: '2009-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'mazda', name: 'Mazda3 Gen 3', years: '2013-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'mazda', name: 'Mazda3 Gen 4', years: '2019-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'mazda', name: 'Mazda6', years: '2009-2024', type: 'Sedan', segment: 'D-Segment' },

  // Hatchback
  { brandId: 'mazda', name: 'Mazda3 Hatchback', years: '2009-2013', type: 'Hatchback', segment: 'C-Segment' },
  { brandId: 'mazda', name: 'BT-50', years: '2010-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'mazda', name: 'CX-30', years: '2023-2024', type: 'SUV', segment: 'Compact SUV' },

  // === FORD ===
  // SUV
  { brandId: 'ford', name: 'Everest', years: '2009-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'ford', name: 'Everest Gen 3', years: '2015-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'ford', name: 'Everest Gen 4', years: '2022-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'ford', name: 'EcoSport', years: '2013-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'ford', name: 'EcoSport Gen 2', years: '2018-2024', type: 'SUV', segment: 'Compact SUV' },

  // Sedan
  { brandId: 'ford', name: 'Fiesta', years: '2009-2024', type: 'City Car', segment: 'B-Segment' },
  { brandId: 'ford', name: 'Focus', years: '2009-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'ford', name: 'Focus Gen 3', years: '2012-2018', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'ford', name: 'Focus Gen 4', years: '2018-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'ford', name: 'Mondeo', years: '2009-2015', type: 'Sedan', segment: 'D-Segment' },

  // Pickup
  { brandId: 'ford', name: 'Ranger', years: '2009-2024', type: 'Pickup', segment: 'Mid-Size Pickup' },
  { brandId: 'ford', name: 'Ranger Gen 2', years: '2015-2024', type: 'Pickup', segment: 'Mid-Size Pickup' },
  { brandId: 'ford', name: 'Ranger Gen 3', years: '2022-2024', type: 'Pickup', segment: 'Mid-Size Pickup' },

  // === CHEVROLET ===
  { brandId: 'chevrolet', name: 'Spin', years: '2012-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'chevrolet', name: 'Spin Gen 2', years: '2018-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'chevrolet', name: 'Captiva', years: '2009-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'chevrolet', name: 'Trax', years: '2012-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'chevrolet', name: 'Orlando', years: '2009-2018', type: 'MPV', segment: 'Compact MPV' },

  // Sedan
  { brandId: 'chevrolet', name: 'Cruze', years: '2009-2024', type: 'Sedan', segment: 'C-Segment' },
  { brandId: 'chevrolet', name: 'Sonic', years: '2012-2024', type: 'Sedan', segment: 'B-Segment' },

  // === WULING ===
  // MPV
  { brandId: 'wuling', name: 'Confero', years: '2017-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'wuling', name: 'Confero S', years: '2020-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'wuling', name: 'Almaz', years: '2019-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'wuling', name: 'Cortez', years: '2021-2024', type: 'SUV', segment: 'Compact SUV' },

  // === VOLKSWAGEN ===
  { brandId: 'vw', name: 'Tiguan', years: '2009-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'vw', name: 'Tiguan Gen 2', years: '2017-2024', type: 'SUV', segment: 'Compact SUV' },
  { brandId: 'vw', name: 'Tiguan Allspace', years: '2020-2024', type: 'SUV', segment: 'Mid-Size SUV' },
  { brandId: 'vw', name: 'Touran', years: '2009-2024', type: 'MPV', segment: 'Compact MPV' },
  { brandId: 'vw', name: 'Polo', years: '2010-2024', type: 'City Car', segment: 'B-Segment' }
]

export const ENGINES: Engine[] = [
  // === TOYOTA ENGINES ===
  // LCGC Engines (1.0-1.2L)
  { brand: 'Toyota', code: '1KR-FE', displacement: 998, cylinders: 3, fuel: 'Bensin', aspiration: 'Natural', power: 67, torque: 91, commonVehicles: ['Toyota Agya', 'Toyota Calya', 'Daihatsu Sigra'] },
  { brand: 'Toyota', code: '1KR-VE', displacement: 998, cylinders: 3, fuel: 'Bensin', aspiration: 'Natural', power: 70, torque: 92, commonVehicles: ['Toyota Agya', 'Daihatsu Sigra'] },
  { brand: 'Toyota', code: '1NR-FE', displacement: 1298, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 96, torque: 121, commonVehicles: ['Toyota Vios', 'Toyota Corolla Altis'] },
  { brand: 'Toyota', code: '1NR-FK', displacement: 1329, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 99, torque: 123, commonVehicles: ['Toyota Yaris'] },
  { brand: 'Toyota', code: '2NR-FE', displacement: 1496, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 107, torque: 141, commonVehicles: ['Toyota Avanza', 'Toyota Sienta', 'Toyota Vios'] },
  { brand: 'Toyota', code: '2NR-FKE', displacement: 1496, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 109, torque: 136, commonVehicles: ['Toyota Avanza Veloz', 'Toyota Rush'] },

  // MPV Engines (1.5-2.0L)
  { brand: 'Toyota', code: '1NZ-FE', displacement: 1497, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 109, torque: 141, commonVehicles: ['Toyota Vios Gen 1', 'Toyota Avanza Gen 1', 'Toyota Wish'] },
  { brand: 'Toyota', code: '1NZ-FXE', displacement: 1497, cylinders: 4, fuel: 'Hybrid', aspiration: 'Natural', power: 110, torque: 142, commonVehicles: ['Toyota Prius Gen 2', 'Toyota Aqua'] },
  { brand: 'Toyota', code: '2NZ-FE', displacement: 1298, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 87, torque: 116, commonVehicles: ['Toyota Vitz', 'Toyota Yaris Gen 1'] },
  { brand: 'Toyota', code: '2NZ-FXE', displacement: 1298, cylinders: 4, fuel: 'Hybrid', aspiration: 'Natural', power: 91, torque: 121, commonVehicles: ['Toyota Prius Gen 1'] },

  // Mid-Range Engines (1.8-2.4L)
  { brand: 'Toyota', code: '1ZR-FE', displacement: 1598, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 122, torque: 157, commonVehicles: ['Toyota Corolla Altis', 'Toyota Matrix'] },
  { brand: 'Toyota', code: '1ZR-FAE', displacement: 1598, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 125, torque: 159, commonVehicles: ['Toyota Corolla', 'Toyota Levin'] },
  { brand: 'Toyota', code: '1ZR-FBE', displacement: 1598, cylinders: 4, fuel: 'Hybrid', aspiration: 'Natural', power: 99, torque: 142, commonVehicles: ['Toyota Prius', 'Toyota Camry Hybrid'] },
  { brand: 'Toyota', code: '2ZR-FE', displacement: 1797, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 140, torque: 173, commonVehicles: ['Toyota Corolla', 'Toyota Levin', 'Toyota Wish'] },
  { brand: 'Toyota', code: '2ZR-FXE', displacement: 1797, cylinders: 4, fuel: 'Hybrid', aspiration: 'Natural', power: 99, torque: 142, commonVehicles: ['Toyota Prius Gen 3'] },
  { brand: 'Toyota', code: '2ZR-FXE', displacement: 1797, cylinders: 4, fuel: 'Hybrid', aspiration: 'Natural', power: 99, torque: 142, commonVehicles: ['Toyota Prius', 'Toyota Corolla Hybrid'] },
  { brand: 'Toyota', code: '7KR-FE', displacement: 1798, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 140, torque: 177, commonVehicles: ['Toyota Camry', 'Toyota Innova'] },
  { brand: 'Toyota', code: '7KR-FE', displacement: 1798, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 139, torque: 170, commonVehicles: ['Toyota Innova Reborn', 'Toyota Fortuner'] },
  { brand: 'Toyota', code: '7KR-FE', displacement: 1798, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 139, torque: 170, commonVehicles: ['Toyota Kijang Innova', 'Toyota Fortuner'] },

  // Large Engines (2.4-2.7L)
  { brand: 'Toyota', code: '2AZ-FE', displacement: 2362, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 167, torque: 224, commonVehicles: ['Toyota Camry', 'Toyota Harrier', 'Toyota Estima'] },
  { brand: 'Toyota', code: '2AZ-FXE', displacement: 2362, cylinders: 4, fuel: 'Hybrid', aspiration: 'Natural', power: 150, torque: 213, commonVehicles: ['Toyota Camry Hybrid'] },

  // AR Engines (2.7L)
  { brand: 'Toyota', code: 'AR', displacement: 2694, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 166, torque: 245, commonVehicles: ['Toyota Kijang Innova', 'Toyota Fortuner'] },

  // AZ Engines (2.0-2.4L)
  { brand: 'Toyota', code: '1AZ-FE', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 148, torque: 191, commonVehicles: ['Toyota Camry', 'Toyota Ipsum'] },
  { brand: 'Toyota', code: '1AZ-FSE', displacement: 1998, cylinders: 4, fuel: 'Hybrid', aspiration: 'Natural', power: 135, torque: 188, commonVehicles: ['Toyota Camry Hybrid'] },
  { brand: 'Toyota', code: '2AZ-FE', displacement: 2362, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 170, torque: 226, commonVehicles: ['Toyota Camry', 'Toyota Estima'] },
  { brand: 'Toyota', code: '2AZ-FXE', displacement: 2362, cylinders: 4, fuel: 'Hybrid', aspiration: 'Natural', power: 160, torque: 220, commonVehicles: ['Toyota Camry Hybrid'] },

  // GR Engines (2.0L Turbo)
  { brand: 'Toyota', code: 'M20A-FKS', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Turbo', power: 251, torque: 379, commonVehicles: ['Toyota GR Sportivo', 'Toyota GR Corolla'] },
  { brand: 'Toyota', code: 'M15A-FKS', displacement: 1496, cylinders: 4, fuel: 'Bensin', aspiration: 'Turbo', power: 165, torque: 250, commonVehicles: ['Toyota Raize', 'Toyota Veloz'] },

  // 8AR-FTS (2.0L Turbo)
  { brand: 'Toyota', code: '8AR-FTS', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Turbo', power: 231, torque: 350, commonVehicles: ['Toyota Harrier', 'Toyota Crown'] },

  // GD Engines (2.8L)
  { brand: 'Toyota', code: '2GD-FTV', displacement: 2755, cylinders: 4, fuel: 'Bensin', aspiration: 'Turbo', power: 278, torque: 450, commonVehicles: ['Toyota Kijang Innova Zenix', 'Toyota Hilux GR Sport'] },

  // === HONDA ENGINES ===
  // L-series (Small)
  { brand: 'Honda', code: 'L13A3', displacement: 1339, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 99, torque: 128, commonVehicles: ['Honda Jazz', 'Honda City'] },
  { brand: 'Honda', code: 'L13Z1', displacement: 1339, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 99, torque: 128, commonVehicles: ['Honda Jazz Gen 3', 'Honda City Gen 4'] },

  // L15 (Mid-Range)
  { brand: 'Honda', code: 'L15B', displacement: 1496, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 118, torque: 145, commonVehicles: ['Honda Jazz', 'Honda City', 'Honda Fit'] },
  { brand: 'Honda', code: 'L15A', displacement: 1496, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 120, torque: 145, commonVehicles: ['Honda City', 'Honda Fit'] },
  { brand: 'Honda', code: 'L15Z', displacement: 1496, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 130, torque: 155, commonVehicles: ['Honda Jazz', 'Honda City', 'Honda Vezel'] },
  { brand: 'Honda', code: 'L15Z7', displacement: 1496, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 127, torque: 155, commonVehicles: ['Honda Jazz', 'Honda Vezel'] },
  { brand: 'Honda', code: 'L15ZB', displacement: 1496, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 130, torque: 155, commonVehicles: ['Honda Jazz', 'Honda Mobilio'] },

  // L-series Earth Dreams (Turbo)
  { brand: 'Honda', code: 'L15B7', displacement: 1496, cylinders: 4, fuel: 'Bensin', aspiration: 'Turbo', power: 182, torque: 240, commonVehicles: ['Honda Civic RS', 'Honda HR-V Turbo'] },

  // R-series (Large)
  { brand: 'Honda', code: 'R18A', displacement: 1799, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 140, torque: 174, commonVehicles: ['Honda Civic', 'Honda Accord'] },
  { brand: 'Honda', code: 'R18Z', displacement: 1799, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 143, torque: 177, commonVehicles: ['Honda Civic', 'Honda CR-V', 'Honda Stream'] },
  { brand: 'Honda', code: 'R20A', displacement: 1997, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 155, torque: 189, commonVehicles: ['Honda Accord', 'Honda CR-V', 'Honda Stepwagon'] },
  { brand: 'Honda', code: 'R20A1', displacement: 1997, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 158, torque: 192, commonVehicles: ['Honda Accord', 'Honda CR-V'] },
  { brand: 'Honda', code: 'R20Z', displacement: 1997, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 160, torque: 193, commonVehicles: ['Honda CR-V', 'Honda Elysion'] },
  { brand: 'Honda', code: 'R20Z8', displacement: 1997, cylinders: 4, fuel: 'Bensin', aspiration: 'Turbo', power: 208, torque: 320, commonVehicles: ['Honda CR-V Turbo', 'Honda Civic Type R'] },

  // K-series (Large)
  { brand: 'Honda', code: 'K20A', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 155, torque: 190, commonVehicles: ['Honda Accord', 'Honda CR-V', 'Honda Stream'] },
  { brand: 'Honda', code: 'K20A3', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 160, torque: 193, commonVehicles: ['Honda Accord', 'Honda CR-V', 'Honda Inspire'] },
  { brand: 'Honda', code: 'K20Z', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 158, torque: 189, commonVehicles: ['Honda Accord', 'Honda CR-V', 'Honda Torneo'] },
  { brand: 'Honda', code: 'K24A', displacement: 2354, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 170, torque: 227, commonVehicles: ['Honda Accord', 'Honda CR-V', 'Honda Element'] },
  { brand: 'Honda', code: 'K24W', displacement: 2354, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 177, torque: 230, commonVehicles: ['Honda CR-V', 'Honda Stream'] },
  { brand: 'Honda', code: 'K24Z', displacement: 2354, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 190, torque: 247, commonVehicles: ['Honda Accord', 'Honda CR-V Turbo', 'Honda Acura RDX'] },
  { brand: 'Honda', code: 'K24Z3', displacement: 2354, cylinders: 4, fuel: 'Bensin', aspiration: 'Turbo', power: 208, torque: 353, commonVehicles: ['Honda CR-V Turbo', 'Honda Acura RDX'] },

  // J-series (V6)
  { brand: 'Honda', code: 'J35A', displacement: 3471, cylinders: 6, fuel: 'Bensin', aspiration: 'Natural', power: 280, torque: 343, commonVehicles: ['Honda Odyssey', 'Honda Legend', 'Honda Pilot', 'Honda Accord V6'] },

  // Earth Dreams Diesel
  { brand: 'Honda', code: 'N22A', displacement: 2199, cylinders: 4, fuel: 'Diesel', aspiration: 'Turbo', power: 150, torque: 350, commonVehicles: ['Honda CR-V Diesel', 'Honda Accord Diesel'] },

  // === SUZUKI ENGINES ===
  // K-series (Small)
  { brand: 'Suzuki', code: 'K10B', displacement: 996, cylinders: 3, fuel: 'Bensin', aspiration: 'Natural', power: 68, torque: 90, commonVehicles: ['Suzuki Karimun Wagon R', 'Suzuki Wagon R Plus'] },
  { brand: 'Suzuki', code: 'K12B', displacement: 1242, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 91, torque: 117, commonVehicles: ['Suzuki Splash', 'Suzuki Swift'] },
  { brand: 'Suzuki', code: 'K14B', displacement: 1372, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 95, torque: 130, commonVehicles: ['Suzuki Swift', 'Suzuki Ertiga'] },
  { brand: 'Suzuki', code: 'K14D', displacement: 1372, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 95, torque: 128, commonVehicles: ['Suzuki Swift'] },

  // M-series (Large)
  { brand: 'Suzuki', code: 'M13A', displacement: 1498, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 91, torque: 130, commonVehicles: ['Suzuki Ertiga', 'Suzuki APV', 'Suzuki Ciaz'] },
  { brand: 'Suzuki', code: 'M15A', displacement: 1490, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 103, torque: 138, commonVehicles: ['Suzuki SX4', 'Suzuki S-Cross'] },
  { brand: 'Suzuki', code: 'M16A', displacement: 1586, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 115, torque: 156, commonVehicles: ['Suzuki Grand Vitara'] },
  { brand: 'Suzuki', code: 'K15B-HE', displacement: 1496, cylinders: 4, fuel: 'Hybrid', aspiration: 'Natural', power: 109, torque: 140, commonVehicles: ['Suzuki Ertiga Hybrid'] },

  // === MITSUBISHI ENGINES ===
  // 4G series
  { brand: 'Mitsubishi', code: '4G13', displacement: 1299, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 86, torque: 120, commonVehicles: ['Mitsubishi Lancer', 'Mitsubishi Grand Lancer'] },
  { brand: 'Mitsubishi', code: '4G15', displacement: 1468, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 92, torque: 130, commonVehicles: ['Mitsubishi Lancer', 'Mitsubishi Mirage'] },
  { brand: 'Mitsubishi', code: '4G18', displacement: 1799, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 137, torque: 176, commonVehicles: ['Mitsubishi Lancer EX', 'Mitsubishi Outlander'] },
  { brand: 'Mitsubishi', code: '4G15', displacement: 1468, cylinders: 4, fuel: 'Diesel', aspiration: 'Natural', power: 100, torque: 300, commonVehicles: ['Mitsubishi Lancer Diesel'] },
  { brand: 'Mitsubishi', code: '4G18', displacement: 1799, cylinders: 4, fuel: 'Diesel', aspiration: 'Natural', power: 116, torque: 300, commonVehicles: ['Mitsubishi Outlander Diesel'] },

  // 4A9 (Large)
  { brand: 'Mitsubishi', code: '4A91', displacement: 1599, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 117, torque: 154, commonVehicles: ['Mitsubishi Lancer EX', 'Mitsubishi Outlander'] },

  // 4B1
  { brand: 'Mitsubishi', code: '4B10', displacement: 1599, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 105, torque: 149, commonVehicles: ['Mitsubishi Mirage', 'Mitsubishi Xpander'] },
  { brand: 'Mitsubishi', code: '4B11', displacement: 1799, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 137, torque: 176, commonVehicles: ['Mitsubishi Lancer', 'Mitsubishi Outlander'] },
  { brand: 'Mitsubishi', code: '4B12', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 154, torque: 193, commonVehicles: ['Mitsubishi Pajero Sport', 'Mitsubishi Triton'] },

  // 6G7
  { brand: 'Mitsubishi', code: '6G72', displacement: 2378, cylinders: 6, fuel: 'Bensin', aspiration: 'Natural', power: 170, torque: 245, commonVehicles: ['Mitsubishi Pajero Sport', 'Mitsubishi Triton'] },
  { brand: 'Mitsubishi', code: '6G72', displacement: 2378, cylinders: 6, fuel: 'Diesel', aspiration: 'Turbo', power: 181, torque: 430, commonVehicles: ['Mitsubishi Pajero Sport Diesel', 'Mitsubishi Triton'] },

  // === DAIHATSU ENGINES ===
  // 3-series
  { brand: 'Daihatsu', code: '3SZ-VE', displacement: 1498, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 103, torque: 136, commonVehicles: ['Daihatsu Xenia', 'Daihatsu Terios', 'Toyota Avanza', 'Toyota Rush'] },

  // K-series
  { brand: 'Daihatsu', code: 'K3-VE', displacement: 998, cylinders: 3, fuel: 'Bensin', aspiration: 'Natural', power: 63, torque: 91, commonVehicles: ['Daihatsu Ayla', 'Toyota Agya', 'Toyota Calya', 'Daihatsu Sigra'] },
  { brand: 'Daihatsu', code: 'K3-VET', displacement: 998, cylinders: 3, fuel: 'Bensin', aspiration: 'Turbo', power: 92, torque: 140, commonVehicles: ['Daihatsu Sirion Gen 2', 'Daihatsu Luxio'] },

  // E-series
  { brand: 'Daihatsu', code: 'EJ-VE', displacement: 1329, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 92, torque: 117, commonVehicles: ['Daihatsu Terios', 'Daihatsu Xenia', 'Toyota Avanza'] },
  { brand: 'Daihatsu', code: 'EJ-VE', displacement: 1329, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 96, torque: 126, commonVehicles: ['Daihatsu Terios Gen 2', 'Daihatsu Rush'] },

  // === HYUNDAI/KIA ENGINES ===
  // Gamma (Small)
  { brand: 'Hyundai', code: 'Gamma 1.6 MPI', displacement: 1591, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 124, torque: 151, commonVehicles: ['Hyundai Elantra', 'Hyundai Tucson', 'Hyundai Kona'] },

  // Beta (Mid-Range)
  { brand: 'Hyundai', code: 'Beta 2.0 MPI', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 155, torque: 192, commonVehicles: ['Hyundai Santa Fe', 'Hyundai Tucson', 'Kia Sportage'] },
  { brand: 'Hyundai', code: 'Beta 2.0 MPI', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 166, torque: 205, commonVehicles: ['Hyundai Santa Fe', 'Hyundai Creta'] },

  // Theta (Large)
  { brand: 'Hyundai', code: 'Theta 2.0 MPi', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 163, torque: 197, commonVehicles: ['Hyundai Sonata', 'Kia K5', 'Hyundai Grandeur'] },
  { brand: 'Hyundai', code: 'Theta 2.4 MPI', displacement: 2359, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 174, torque: 228, commonVehicles: ['Hyundai Santa Fe', 'Kia Sorento', 'Hyundai Grandeur'] },

  // U (Compact)
  { brand: 'Hyundai', code: 'U 1.4 MPI', displacement: 1396, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 100, torque: 134, commonVehicles: ['Hyundai Elantra', 'Hyundai i30', 'Hyundai Creta'] },

  // Nu (Compact)
  { brand: 'Hyundai', code: 'Nu 1.6 MPI', displacement: 1591, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 122, torque: 151, commonVehicles: ['Hyundai i20', 'Hyundai Veloster'] },

  // R (Diesel)
  { brand: 'Hyundai', code: 'R 2.0 CRDi', displacement: 1998, cylinders: 4, fuel: 'Diesel', aspiration: 'Turbo', power: 140, torque: 311, commonVehicles: ['Hyundai Santa Fe Diesel', 'Kia Sorento Diesel'] },
  { brand: 'Hyundai', code: 'R 2.2 CRDi', displacement: 2199, cylinders: 4, fuel: 'Diesel', aspiration: 'Turbo', power: 155, torque: 353, commonVehicles: ['Hyundai Santa Fe Diesel', 'Kia Sorento Diesel'] },

  // Smartstream (V6)
  { brand: 'Hyundai', code: 'Smartstream 2.4', displacement: 2351, cylinders: 6, fuel: 'Bensin', aspiration: 'Natural', power: 175, torque: 227, commonVehicles: ['Hyundai Santa Fe', 'Kia Sedona', 'Hyundai Grandeur'] },

  // === NISSAN ENGINES ===
  // HR (Compact)
  { brand: 'Nissan', code: 'HR15DE', displacement: 1598, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 111, torque: 148, commonVehicles: ['Nissan Note', 'Nissan Tiida', 'Nissan Juke'] },
  { brand: 'Nissan', code: 'HR16DE', displacement: 1598, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 113, torque: 156, commonVehicles: ['Nissan Note', 'Nissan Tiida', 'Nissan Qashqai'] },

  // MR (Mid-Range)
  { brand: 'Nissan', code: 'MR20DE', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 140, torque: 196, commonVehicles: ['Nissan Serena', 'Nissan X-Trail', 'Nissan Teana'] },
  { brand: 'Nissan', code: 'MR20DD', displacement: 1998, cylinders: 4, fuel: 'Diesel', aspiration: 'Turbo', power: 143, torque: 320, commonVehicles: ['Nissan X-Trail Diesel', 'Nissan Qashqai Diesel'] },
  { brand: 'Nissan', code: 'MR20DE', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 147, torque: 210, commonVehicles: ['Nissan Serena', 'Nissan X-Trail', 'Nissan Pathfinder'] },

  // QR (Large)
  { brand: 'Nissan', code: 'QR25DE', displacement: 2488, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 166, torque: 213, commonVehicles: ['Nissan Teana', 'Nissan Serena', 'Nissan Murano'] },
  { brand: 'Nissan', code: 'QR25DD', displacement: 2488, cylinders: 4, fuel: 'Diesel', aspiration: 'Turbo', power: 190, torque: 450, commonVehicles: ['Nissan Pathfinder Diesel', 'Nissan Murano Diesel'] },

  // VK (V6)
  { brand: 'Nissan', code: 'VK56VD', displacement: 5552, cylinders: 8, fuel: 'Diesel', aspiration: 'Turbo', power: 298, torque: 550, commonVehicles: ['Nissan Patrol', 'Nissan Titan', 'Nissan Armada'] },

  // === MAZDA ENGINES ===
  // Skyactiv (New)
  { brand: 'Mazda', code: 'Skyactiv-G 1.5', displacement: 1496, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 114, torque: 148, commonVehicles: ['Mazda2', 'Mazda3', 'Mazda CX-30'] },
  { brand: 'Mazda', code: 'Skyactiv-G 2.0', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 155, torque: 200, commonVehicles: ['Mazda3', 'Mazda6', 'Mazda CX-5'] },
  { brand: 'Mazda', code: 'Skyactiv-G 2.0 Turbo', displacement: 1998, cylinders: 4, fuel: 'Bensin', aspiration: 'Turbo', power: 250, torque: 420, commonVehicles: ['Mazda3 Turbo', 'Mazda CX-5 Turbo', 'Mazda CX-60'] },

  // Skyactiv-X (Diesel)
  { brand: 'Mazda', code: 'Skyactiv-D 1.8', displacement: 1798, cylinders: 4, fuel: 'Diesel', aspiration: 'Turbo', power: 129, torque: 300, commonVehicles: ['Mazda3', 'Mazda CX-5', 'Mazda6 Diesel'] },
  { brand: 'Mazda', code: 'Skyactiv-D 2.2', displacement: 2191, cylinders: 4, fuel: 'Diesel', aspiration: 'Turbo', power: 175, torque: 420, commonVehicles: ['Mazda6', 'Mazda CX-8', 'Mazda CX-9'] },

  // Old MZR
  { brand: 'Mazda', code: 'MZR 2.0', displacement: 1999, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 147, torque: 189, commonVehicles: ['Mazda3', 'Mazda6', 'Mazda CX-7'] },
  { brand: 'Mazda', code: 'MZR 2.0', displacement: 1999, cylinders: 4, fuel: 'Diesel', aspiration: 'Turbo', power: 140, torque: 320, commonVehicles: ['Mazda6 Diesel', 'Mazda CX-7 Diesel'] },
  { brand: 'Mazda', code: 'MZR 2.3', displacement: 2260, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 166, torque: 204, commonVehicles: ['Mazda6', 'Mazda CX-9'] },

  // L3 (V6)
  { brand: 'Mazda', code: 'L3-VE', displacement: 2229, cylinders: 6, fuel: 'Bensin', aspiration: 'Natural', power: 170, torque: 220, commonVehicles: ['Mazda6', 'Mazda CX-9'] },

  // === FORD ENGINES ===
  // Duratec
  { brand: 'Ford', code: 'Duratec 1.6 Ti-VCT', displacement: 1596, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 125, torque: 159, commonVehicles: ['Ford Focus', 'Ford EcoSport', 'Ford Kuga'] },
  { brand: 'Ford', code: 'Duratec 2.0 Ti-VCT', displacement: 1999, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 145, torque: 186, commonVehicles: ['Ford Focus', 'Ford Mondeo', 'Ford Galaxy'] },
  { brand: 'Ford', code: 'Duratec 2.3', displacement: 2261, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 160, torque: 208, commonVehicles: ['Ford Focus', 'Ford Mondeo', 'Ford Ranger'] },
  { brand: 'Ford', code: 'Duratec 2.5', displacement: 2494, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 166, torque: 225, commonVehicles: ['Ford Focus', 'Ford Mondeo', 'Ford Ranger'] },

  // EcoBoost (Turbo)
  { brand: 'Ford', code: 'EcoBoost 1.0', displacement: 999, cylinders: 3, fuel: 'Bensin', aspiration: 'Turbo', power: 125, torque: 170, commonVehicles: ['Ford Fiesta', 'Ford Ecosport'] },
  { brand: 'Ford', code: 'EcoBoost 1.5', displacement: 1499, cylinders: 3, fuel: 'Bensin', aspiration: 'Turbo', power: 180, torque: 240, commonVehicles: ['Ford Focus', 'Ford EcoSport', 'Ford Escape'] },
  { brand: 'Ford', code: 'EcoBoost 1.6', displacement: 1596, cylinders: 4, fuel: 'Bensin', aspiration: 'Turbo', power: 182, torque: 240, commonVehicles: ['Ford Focus', 'Ford EcoSport', 'Ford Escape', 'Ford Kuga'] },
  { brand: 'Ford', code: 'EcoBoost 2.0', displacement: 1997, cylinders: 4, fuel: 'Bensin', aspiration: 'Turbo', power: 240, torque: 350, commonVehicles: ['Ford Focus', 'Ford Mondeo', 'Ford Edge', 'Ford Explorer'] },
  { brand: 'Ford', code: 'EcoBoost 2.3', displacement: 2261, cylinders: 4, fuel: 'Bensin', aspiration: 'Turbo', power: 276, torque: 420, commonVehicles: ['Ford Ranger', 'Ford Everest'] },

  // Duratorq (Diesel)
  { brand: 'Ford', code: 'Duratorq 2.2 TDCi', displacement: 2198, cylinders: 4, fuel: 'Diesel', aspiration: 'Turbo', power: 150, torque: 370, commonVehicles: ['Ford Ranger', 'Ford Everest'] },
  { brand: 'Ford', code: 'Duratorq 2.0 TDCi', displacement: 1997, cylinders: 4, fuel: 'Diesel', aspiration: 'Turbo', power: 140, torque: 320, commonVehicles: ['Ford Ranger', 'Ford Everest', 'Ford Transit'] },

  // === CHEVROLET ENGINES ===
  // Family 1
  { brand: 'Chevrolet', code: 'Family 1 1.4', displacement: 1399, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 98, torque: 130, commonVehicles: ['Chevrolet Sonic', 'Chevrolet Cruze', 'Chevrolet Spin'] },
  { brand: 'Chevrolet', code: 'Family 1 1.6', displacement: 1598, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 115, torque: 155, commonVehicles: ['Chevrolet Cruze', 'Chevrolet Spin', 'Chevrolet Orlando'] },
  { brand: 'Chevrolet', code: 'Family 1 1.8', displacement: 1796, cylinders: 4, fuel: 'Bensin', aspiration: 'Natural', power: 140, torque: 175, commonVehicles: ['Chevrolet Cruze', 'Chevrolet Captiva', 'Chevrolet Trax'] },

  // S-TEC III
  { brand: 'Chevrolet', code: 'S-TEC 2.0', displacement: 1998, cylinders: 4, fuel: 'Diesel', aspiration: 'Turbo', power: 163, torque: 360, commonVehicles: ['Chevrolet Captiva', 'Chevrolet Orlando', 'Chevrolet Trailblazer'] },
]

export function getCarModelsByBrand(brandId: string): CarModel[] {
  return CAR_MODELS.filter(model => model.brandId === brandId)
}

export function getEnginesByBrand(brand: string): Engine[] {
  return ENGINES.filter(engine => engine.brand === brand)
}

export function getPopularBrands(): Brand[] {
  return BRANDS.filter(brand => brand.popular)
}

export function getAllBrands(): Brand[] {
  return BRANDS
}
