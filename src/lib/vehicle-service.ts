import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface SearchCriteria {
  brand?: string
  model?: string
  year?: string
  type?: string
  segment?: string
  fuel?: string
  query?: string
}

export interface VehicleDetails {
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

export class VehicleDatabase {
  async searchVehicles(criteria: SearchCriteria) {
    const where: any = {}

    if (criteria.brand) {
      where.brand = {
        contains: criteria.brand
      }
    }

    if (criteria.model) {
      where.model = {
        contains: criteria.model
      }
    }

    if (criteria.type) {
      where.type = criteria.type
    }

    if (criteria.segment) {
      where.segment = criteria.segment
    }

    if (criteria.query) {
      where.OR = [
        {
          brand: {
            contains: criteria.query
          }
        },
        {
          model: {
            contains: criteria.query
          }
        },
        {
          variant: {
            contains: criteria.query
          }
        }
      ]
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        engines: {
          include: {
            engine: true
          }
        }
      },
      orderBy: [
        { brand: 'asc' },
        { model: 'asc' },
        { variant: 'asc' }
      ]
    })

    return vehicles.map(vehicle => ({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      variant: vehicle.variant,
      years: vehicle.years,
      type: vehicle.type,
      segment: vehicle.segment,
      engines: vehicle.engines.map(ve => ({
        id: ve.engine.id,
        code: ve.engine.code,
        displacement: ve.engine.displacement,
        cylinders: ve.engine.cylinders,
        fuel: ve.engine.fuel,
        aspiration: ve.engine.aspiration,
        power: ve.engine.power,
        torque: ve.engine.torque,
        transmissions: JSON.parse(ve.transmissions || '[]')
      }))
    }))
  }

  async getVehicleDetails(vehicleId: string): Promise<VehicleDetails | null> {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        engines: {
          include: {
            engine: true
          }
        }
      }
    })

    if (!vehicle) return null

    return {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      variant: vehicle.variant,
      years: vehicle.years,
      type: vehicle.type,
      segment: vehicle.segment,
      engines: vehicle.engines.map(ve => ({
        id: ve.engine.id,
        code: ve.engine.code,
        displacement: ve.engine.displacement,
        cylinders: ve.engine.cylinders,
        fuel: ve.engine.fuel,
        aspiration: ve.engine.aspiration,
        power: ve.engine.power,
        torque: ve.engine.torque,
        transmissions: JSON.parse(ve.transmissions || '[]')
      }))
    }
  }

  async getEngineSpecs(engineCode: string) {
    const engine = await prisma.engine.findUnique({
      where: { code: engineCode },
      include: {
        vehicles: {
          include: {
            vehicle: true
          }
        }
      }
    })

    if (!engine) return null

    return {
      id: engine.id,
      code: engine.code,
      brand: engine.brand,
      displacement: engine.displacement,
      cylinders: engine.cylinders,
      fuel: engine.fuel,
      aspiration: engine.aspiration,
      power: engine.power,
      torque: engine.torque,
      commonVehicles: JSON.parse(engine.commonVehicles || '[]'),
      commonIssues: JSON.parse(engine.commonIssues || '[]'),
      maintenanceItems: JSON.parse(engine.maintenanceItems || '[]'),
      compatibleVehicles: engine.vehicles.map(ve => ({
        id: ve.vehicle.id,
        brand: ve.vehicle.brand,
        model: ve.vehicle.model,
        variant: ve.vehicle.variant,
        years: ve.vehicle.years
      }))
    }
  }

  async getCompatibleDTCs(vehicleId: string) {
    // Untuk saat ini, return semua DTC codes
    // Nanti bisa difilter berdasarkan sistem yang ada di kendaraan
    const dtcCodes = await prisma.dTCCode.findMany({
      orderBy: { code: 'asc' }
    })

    return dtcCodes.map(dtc => ({
      id: dtc.id,
      code: dtc.code,
      system: dtc.system,
      subsystem: dtc.subsystem,
      description: dtc.description,
      descriptionIndonesian: dtc.descriptionIndonesian,
      severity: dtc.severity,
      symptoms: JSON.parse(dtc.symptoms || '[]'),
      possibleCauses: JSON.parse(dtc.possibleCauses || '[]')
    }))
  }

  async getAllBrands() {
    const brands = await prisma.vehicle.findMany({
      select: {
        brand: true
      },
      distinct: ['brand'],
      orderBy: {
        brand: 'asc'
      }
    })

    return brands.map(b => b.brand)
  }

  async getModelsByBrand(brand: string) {
    const models = await prisma.vehicle.findMany({
      where: { brand },
      select: {
        model: true
      },
      distinct: ['model'],
      orderBy: {
        model: 'asc'
      }
    })

    return models.map(m => m.model)
  }

  async getVariantsByModel(brand: string, model: string) {
    const variants = await prisma.vehicle.findMany({
      where: { 
        brand,
        model 
      },
      select: {
        id: true,
        variant: true,
        years: true,
        type: true,
        segment: true
      },
      orderBy: {
        variant: 'asc'
      }
    })

    return variants
  }
}

export const vehicleDatabase = new VehicleDatabase()