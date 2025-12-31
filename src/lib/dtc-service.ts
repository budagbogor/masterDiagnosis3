import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface DTCDetails {
  id: string
  code: string
  system: string
  subsystem: string | null
  description: string
  descriptionIndonesian: string
  severity: string
  symptoms: string[]
  possibleCauses: string[]
  diagnosticSteps: string[]
  repairProcedures: string[]
  relatedSensors: Array<{
    id: string
    name: string
    nameIndonesian: string
    type: string
    location: string | null
    specifications: any
    testingProcedure: string | null
    expectedValues: any
    commonFailures: string[]
  }>
  relatedActuators: Array<{
    id: string
    name: string
    nameIndonesian: string
    type: string
    location: string | null
    specifications: any
    testingProcedure: string | null
    operationalParameters: any
    controlSignals: any
    commonFailures: string[]
  }>
}

export class DTCLibrary {
  async searchDTCs(query: string) {
    const dtcCodes = await prisma.dTCCode.findMany({
      where: {
        OR: [
          {
            code: {
              contains: query
            }
          },
          {
            description: {
              contains: query
            }
          },
          {
            descriptionIndonesian: {
              contains: query
            }
          },
          {
            subsystem: {
              contains: query
            }
          }
        ]
      },
      orderBy: { code: 'asc' },
      take: 50 // Limit hasil pencarian
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

  async getDTCDetails(code: string): Promise<DTCDetails | null> {
    const dtc = await prisma.dTCCode.findUnique({
      where: { code },
      include: {
        relatedSensors: {
          include: {
            sensor: true
          }
        },
        relatedActuators: {
          include: {
            actuator: true
          }
        }
      }
    })

    if (!dtc) return null

    return {
      id: dtc.id,
      code: dtc.code,
      system: dtc.system,
      subsystem: dtc.subsystem,
      description: dtc.description,
      descriptionIndonesian: dtc.descriptionIndonesian,
      severity: dtc.severity,
      symptoms: JSON.parse(dtc.symptoms || '[]'),
      possibleCauses: JSON.parse(dtc.possibleCauses || '[]'),
      diagnosticSteps: JSON.parse(dtc.diagnosticSteps || '[]'),
      repairProcedures: JSON.parse(dtc.repairProcedures || '[]'),
      relatedSensors: dtc.relatedSensors.map(rs => ({
        id: rs.sensor.id,
        name: rs.sensor.name,
        nameIndonesian: rs.sensor.nameIndonesian,
        type: rs.sensor.type,
        location: rs.sensor.location,
        specifications: JSON.parse(rs.sensor.specifications || '{}'),
        testingProcedure: rs.sensor.testingProcedure,
        expectedValues: JSON.parse(rs.sensor.expectedValues || '[]'),
        commonFailures: JSON.parse(rs.sensor.commonFailures || '[]')
      })),
      relatedActuators: dtc.relatedActuators.map(ra => ({
        id: ra.actuator.id,
        name: ra.actuator.name,
        nameIndonesian: ra.actuator.nameIndonesian,
        type: ra.actuator.type,
        location: ra.actuator.location,
        specifications: JSON.parse(ra.actuator.specifications || '{}'),
        testingProcedure: ra.actuator.testingProcedure,
        operationalParameters: JSON.parse(ra.actuator.operationalParameters || '[]'),
        controlSignals: JSON.parse(ra.actuator.controlSignals || '[]'),
        commonFailures: JSON.parse(ra.actuator.commonFailures || '[]')
      }))
    }
  }

  async getRelatedSensors(code: string) {
    const dtc = await prisma.dTCCode.findUnique({
      where: { code },
      include: {
        relatedSensors: {
          include: {
            sensor: true
          }
        }
      }
    })

    if (!dtc) return []

    return dtc.relatedSensors.map(rs => ({
      id: rs.sensor.id,
      name: rs.sensor.name,
      nameIndonesian: rs.sensor.nameIndonesian,
      type: rs.sensor.type,
      location: rs.sensor.location,
      specifications: JSON.parse(rs.sensor.specifications || '{}'),
      testingProcedure: rs.sensor.testingProcedure,
      expectedValues: JSON.parse(rs.sensor.expectedValues || '[]'),
      commonFailures: JSON.parse(rs.sensor.commonFailures || '[]')
    }))
  }

  async getRelatedActuators(code: string) {
    const dtc = await prisma.dTCCode.findUnique({
      where: { code },
      include: {
        relatedActuators: {
          include: {
            actuator: true
          }
        }
      }
    })

    if (!dtc) return []

    return dtc.relatedActuators.map(ra => ({
      id: ra.actuator.id,
      name: ra.actuator.name,
      nameIndonesian: ra.actuator.nameIndonesian,
      type: ra.actuator.type,
      location: ra.actuator.location,
      specifications: JSON.parse(ra.actuator.specifications || '{}'),
      testingProcedure: ra.actuator.testingProcedure,
      operationalParameters: JSON.parse(ra.actuator.operationalParameters || '[]'),
      controlSignals: JSON.parse(ra.actuator.controlSignals || '[]'),
      commonFailures: JSON.parse(ra.actuator.commonFailures || '[]')
    }))
  }

  async getDTCsBySystem(system: string) {
    const dtcCodes = await prisma.dTCCode.findMany({
      where: { system: system as any },
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

  async getAllSystems() {
    const systems = await prisma.dTCCode.findMany({
      select: {
        system: true
      },
      distinct: ['system'],
      orderBy: {
        system: 'asc'
      }
    })

    return systems.map(s => s.system)
  }

  async getDTCsBySeverity(severity: string) {
    const dtcCodes = await prisma.dTCCode.findMany({
      where: { severity: severity as any },
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
}

export const dtcLibrary = new DTCLibrary()