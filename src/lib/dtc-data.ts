// DTC data - disabled sementara untuk bypass cache issue

export interface DTCCode {
  code: string
  system: string
  subSystem: string
  description: string
  severity: string
  symptoms: string[]
  possibleCauses: string[]
  relatedSensors: string[]
  relatedActuators: string[]
  commonVehicles: string[]
  repairSteps: string[]
  estimatedCost?: string
  referenceSource: string[]
}

export const DTC_DATABASE: DTCCode[] = []

export function searchDTC(query: string): DTCCode[] {
  return []
}

export function getDTCByCode(code: string): DTCCode | undefined {
  return undefined
}

export function getAvailableSystems(): any[] {
  return []
}
