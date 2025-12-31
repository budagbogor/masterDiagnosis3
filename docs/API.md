# API Documentation

AutoDiag Master AI menyediakan REST API untuk integrasi dengan sistem eksternal.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Saat ini API tidak memerlukan authentication, namun untuk production disarankan menggunakan API key.

## Endpoints

### Vehicles API

#### GET /api/vehicles
Mendapatkan daftar semua kendaraan.

**Query Parameters:**
- `brand` (optional): Filter berdasarkan merek
- `model` (optional): Filter berdasarkan model
- `year` (optional): Filter berdasarkan tahun

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "brand": "Toyota",
      "model": "Avanza",
      "year": "2023",
      "engineCode": "2NR-VE",
      "transmission": "Manual",
      "variants": ["1.3 E", "1.3 G", "1.5 G"]
    }
  ]
}
```

#### GET /api/vehicles/brands
Mendapatkan daftar merek kendaraan.

**Response:**
```json
{
  "success": true,
  "data": ["Toyota", "Honda", "Mitsubishi", "Suzuki"]
}
```

#### GET /api/vehicles/models
Mendapatkan daftar model berdasarkan merek.

**Query Parameters:**
- `brand` (required): Merek kendaraan

**Response:**
```json
{
  "success": true,
  "data": ["Avanza", "Innova", "Fortuner", "Camry"]
}
```

### Diagnosis API

#### POST /api/diagnosis
Membuat diagnosis baru.

**Request Body:**
```json
{
  "vehicleData": {
    "brand": "Toyota",
    "model": "Avanza",
    "year": "2023",
    "engineCode": "2NR-VE",
    "transmission": "Manual",
    "mileage": 15000,
    "vin": "MHKA1234567890123"
  },
  "complaint": "Mesin terasa kasar saat idle",
  "symptoms": {
    "sounds": ["Suara kasar saat idle"],
    "vibrations": ["Getaran pada steering wheel"],
    "smells": [],
    "warningLights": ["Check Engine"],
    "conditions": ["Saat mesin dingin"]
  },
  "errorCodes": ["P0300", "P0171"],
  "serviceHistory": {
    "lastServiceDate": "2024-10-15",
    "partsReplaced": ["Filter udara", "Oli mesin"],
    "modifications": []
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "diagnosisId": "diag_123456789",
    "aiAnalysis": {
      "confidence": 0.85,
      "primaryCause": {
        "component": "Fuel Injector",
        "probability": 0.75,
        "description": "Kemungkinan fuel injector kotor atau tersumbat",
        "repairComplexity": "SEDANG",
        "estimatedCost": {
          "min": 500000,
          "max": 1500000
        }
      },
      "secondaryCauses": [...],
      "diagnosticSteps": [...],
      "repairProcedures": [...],
      "estimatedTotalCost": {
        "parts": 800000,
        "labor": 400000,
        "total": 1200000
      }
    }
  }
}
```

#### GET /api/diagnosis/{id}
Mendapatkan detail diagnosis berdasarkan ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "diag_123456789",
    "vehicleData": {...},
    "complaint": "Mesin terasa kasar saat idle",
    "aiAnalysis": {...},
    "createdAt": "2024-12-31T10:00:00Z"
  }
}
```

#### GET /api/diagnosis
Mendapatkan daftar semua diagnosis.

**Query Parameters:**
- `limit` (optional): Jumlah data per halaman (default: 10)
- `offset` (optional): Offset untuk pagination (default: 0)
- `brand` (optional): Filter berdasarkan merek kendaraan

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "diag_123456789",
      "brand": "Toyota",
      "model": "Avanza",
      "complaint": "Mesin terasa kasar saat idle",
      "confidence": 0.85,
      "createdAt": "2024-12-31T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### Reports API

#### POST /api/reports
Generate PDF report dari diagnosis.

**Request Body:**
```json
{
  "diagnosisId": "diag_123456789"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "rpt_123456789",
    "reportNumber": "RPT-1735632000000",
    "pdfData": "base64_encoded_pdf_data",
    "filename": "Laporan_Diagnosa_RPT-1735632000000.pdf",
    "totalPages": 3
  }
}
```

### DTC Library API

#### GET /api/dtc-library
Mendapatkan daftar kode DTC.

**Query Parameters:**
- `search` (optional): Pencarian berdasarkan kode atau deskripsi
- `system` (optional): Filter berdasarkan sistem (ENGINE, TRANSMISSION, ABS, etc.)
- `limit` (optional): Jumlah data per halaman (default: 20)
- `offset` (optional): Offset untuk pagination (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "P0300",
      "description": "Random/Multiple Cylinder Misfire Detected",
      "system": "ENGINE",
      "severity": "HIGH",
      "possibleCauses": [
        "Faulty spark plugs",
        "Clogged fuel injectors",
        "Low fuel pressure"
      ],
      "diagnosticSteps": [
        "Check spark plugs condition",
        "Test fuel pressure",
        "Inspect ignition coils"
      ]
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

## Error Handling

Semua endpoint menggunakan format error response yang konsisten:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (resource tidak ditemukan)
- `500` - Internal Server Error

## Rate Limiting

Saat ini tidak ada rate limiting, namun untuk production disarankan:
- 100 requests per minute untuk diagnosis API
- 1000 requests per minute untuk read-only endpoints

## Examples

### Curl Examples

**Create Diagnosis:**
```bash
curl -X POST http://localhost:3000/api/diagnosis \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleData": {
      "brand": "Toyota",
      "model": "Avanza",
      "year": "2023",
      "engineCode": "2NR-VE",
      "transmission": "Manual",
      "mileage": 15000
    },
    "complaint": "Mesin terasa kasar saat idle",
    "symptoms": {
      "sounds": ["Suara kasar saat idle"],
      "vibrations": ["Getaran pada steering wheel"],
      "smells": [],
      "warningLights": ["Check Engine"],
      "conditions": ["Saat mesin dingin"]
    },
    "errorCodes": ["P0300"]
  }'
```

**Generate Report:**
```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{"diagnosisId": "diag_123456789"}'
```

**Search DTC:**
```bash
curl "http://localhost:3000/api/dtc-library?search=P0300&system=ENGINE"
```