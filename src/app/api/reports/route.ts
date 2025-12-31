import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jsPDF from 'jspdf'
import { aiMasterTechnician } from '@/lib/openai'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { diagnosisId } = body

    if (!diagnosisId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Diagnosis ID diperlukan' 
        },
        { status: 400 }
      )
    }

    // Get diagnosis data
    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id: diagnosisId }
    })

    if (!diagnosis) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Diagnosis tidak ditemukan' 
        },
        { status: 404 }
      )
    }

    // Parse AI analysis - regenerate if needed for dynamic data
    let aiAnalysis = diagnosis.aiAnalysis ? JSON.parse(diagnosis.aiAnalysis) : null

    // If no AI analysis exists or we want fresh dynamic data, generate new analysis
    if (!aiAnalysis) {
      console.log('Generating fresh AI analysis for report...')
      
      // Prepare diagnosis data for AI analysis
      const diagnosisData = {
        vehicle: {
          brand: diagnosis.brand,
          model: diagnosis.model,
          year: diagnosis.year,
          engineCode: diagnosis.engineCode,
          transmission: diagnosis.transmission,
          mileage: diagnosis.mileage,
          vin: diagnosis.vin || undefined
        },
        symptoms: {
          complaint: diagnosis.complaint,
          sounds: JSON.parse(diagnosis.sounds || '[]'),
          vibrations: JSON.parse(diagnosis.vibrations || '[]'),
          smells: JSON.parse(diagnosis.smells || '[]'),
          warningLights: JSON.parse(diagnosis.warningLights || '[]'),
          conditions: JSON.parse(diagnosis.conditions || '[]'),
          additionalNotes: diagnosis.additionalNotes || undefined
        },
        dtcCodes: JSON.parse(diagnosis.errorCodes || '[]'),
        serviceHistory: {
          lastServiceDate: diagnosis.lastServiceDate || undefined,
          partsReplaced: JSON.parse(diagnosis.partsReplaced || '[]'),
          modifications: JSON.parse(diagnosis.modifications || '[]')
        },
        testResults: {
          errorCodes: diagnosis.errorCodes || undefined,
          visualInspection: diagnosis.visualInspection || undefined,
          testDriveNotes: diagnosis.testDriveNotes || undefined
        }
      }

      try {
        // Generate fresh AI analysis with current market data
        aiAnalysis = await aiMasterTechnician.analyzeDiagnosis(diagnosisData)
        
        // Update diagnosis with fresh AI analysis
        await prisma.diagnosis.update({
          where: { id: diagnosisId },
          data: {
            aiAnalysis: JSON.stringify(aiAnalysis),
            updatedAt: new Date()
          }
        })
        
        console.log('✅ Fresh AI analysis generated successfully')
      } catch (error) {
        console.error('❌ Error generating fresh AI analysis:', error)
        return NextResponse.json(
          { 
            success: false, 
            error: 'Gagal menghasilkan analisis AI terbaru untuk laporan',
            details: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 500 }
        )
      }
    } else {
      console.log('Using existing AI analysis from database')
    }

    if (!aiAnalysis) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Data analisis AI tidak tersedia' 
        },
        { status: 400 }
      )
    }

    // Parse additional data
    const symptoms = {
      sounds: JSON.parse(diagnosis.sounds || '[]'),
      vibrations: JSON.parse(diagnosis.vibrations || '[]'),
      smells: JSON.parse(diagnosis.smells || '[]'),
      warningLights: JSON.parse(diagnosis.warningLights || '[]'),
      conditions: JSON.parse(diagnosis.conditions || '[]')
    }

    // Generate report number
    const reportNumber = `RPT-${Date.now()}`
    const currentDate = new Date()

    // Create PDF with professional block design
    const pdf = new jsPDF()
    let currentPage = 1
    let yPos = 20

    // Helper function to check page break
    const checkPageBreak = (requiredSpace: number) => {
      if (yPos + requiredSpace > 270) {
        pdf.addPage()
        currentPage++
        yPos = 20
        return true
      }
      return false
    }

    // Helper function to add professional block
    const addBlock = (title: string, content: any, color: [number, number, number] = [59, 130, 246]) => {
      checkPageBreak(25)
      
      // Block header with gradient effect
      pdf.setFillColor(color[0], color[1], color[2])
      pdf.roundedRect(15, yPos, 180, 12, 2, 2, 'F')
      
      // Title
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text(title, 20, yPos + 8)
      
      yPos += 15
      
      // Content area
      pdf.setFillColor(248, 250, 252)
      pdf.roundedRect(15, yPos, 180, content.height || 20, 2, 2, 'F')
      
      // Content
      pdf.setTextColor(51, 65, 85)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      
      if (typeof content === 'string') {
        const lines = pdf.splitTextToSize(content, 170)
        pdf.text(lines, 20, yPos + 6)
        yPos += Math.max(lines.length * 4 + 8, 20)
      } else if (content.type === 'grid') {
        content.items.forEach((item: any, index: number) => {
          const xOffset = (index % 2) * 90
          const yOffset = Math.floor(index / 2) * 12
          pdf.setFont('helvetica', 'bold')
          pdf.text(item.label + ':', 20 + xOffset, yPos + 6 + yOffset)
          pdf.setFont('helvetica', 'normal')
          pdf.text(item.value, 20 + xOffset + 35, yPos + 6 + yOffset)
        })
        yPos += Math.ceil(content.items.length / 2) * 12 + 8
      } else if (content.type === 'list') {
        content.items.forEach((item: string, index: number) => {
          pdf.text(`• ${item}`, 20, yPos + 6 + (index * 4))
        })
        yPos += content.items.length * 4 + 8
      }
      
      yPos += 5
      pdf.setTextColor(0, 0, 0)
    }

    // Helper function for metrics blocks (3-column layout)
    const addMetricsRow = (metrics: any[]) => {
      checkPageBreak(35)
      
      metrics.forEach((metric, index) => {
        const xPos = 15 + (index * 60)
        
        // Metric block
        pdf.setFillColor(metric.color[0], metric.color[1], metric.color[2])
        pdf.roundedRect(xPos, yPos, 55, 25, 2, 2, 'F')
        
        // Icon area (simulated)
        pdf.setFillColor(255, 255, 255, 0.2)
        pdf.circle(xPos + 12, yPos + 8, 4, 'F')
        
        // Value
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text(metric.value, xPos + 20, yPos + 10)
        
        // Label
        pdf.setFontSize(7)
        pdf.setFont('helvetica', 'normal')
        pdf.text(metric.label, xPos + 5, yPos + 20)
      })
      
      yPos += 35
      pdf.setTextColor(0, 0, 0)
    }

    // PROFESSIONAL HEADER BLOCK
    pdf.setFillColor(30, 41, 59) // slate-800
    pdf.roundedRect(15, yPos, 180, 35, 3, 3, 'F')
    
    // Logo area (simulated)
    pdf.setFillColor(59, 130, 246) // blue-600
    pdf.roundedRect(20, yPos + 5, 25, 25, 2, 2, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AI', 28, yPos + 20)
    
    // Title
    pdf.setFontSize(18)
    pdf.text('DIAGNOSTIC REPORT', 50, yPos + 15)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('AutoDiag Master AI System', 50, yPos + 25)
    
    // Report info
    pdf.setFontSize(8)
    pdf.text(`${reportNumber} | ${currentDate.toLocaleDateString('id-ID')} | ID: ${diagnosisId}`, 120, yPos + 30)
    
    yPos += 45

    // VEHICLE INFO BLOCK
    addBlock('INFORMASI KENDARAAN', {
      type: 'grid',
      items: [
        { label: 'Merek', value: diagnosis.brand },
        { label: 'Model', value: diagnosis.model },
        { label: 'Tahun', value: diagnosis.year },
        { label: 'Mesin', value: diagnosis.engineCode },
        { label: 'Transmisi', value: diagnosis.transmission },
        { label: 'Kilometer', value: `${diagnosis.mileage.toLocaleString('id-ID')} km` }
      ]
    }, [34, 197, 94]) // emerald-600

    // AI ANALYSIS METRICS
    const metrics = [
      {
        label: 'AI CONFIDENCE',
        value: `${Math.round(aiAnalysis.confidence * 100)}%`,
        color: [59, 130, 246] // blue-600
      },
      {
        label: 'COMPLEXITY',
        value: aiAnalysis.primaryCause.repairComplexity,
        color: [245, 101, 101] // red-500
      },
      {
        label: 'TOTAL COST',
        value: `Rp ${Math.round(aiAnalysis.estimatedTotalCost.total / 1000)}K`,
        color: [34, 197, 94] // green-500
      }
    ]
    addMetricsRow(metrics)

    // PRIMARY FAULT BLOCK
    addBlock('PRIMARY FAULT DIAGNOSIS', 
      `${aiAnalysis.primaryCause.component} (${Math.round(aiAnalysis.primaryCause.probability * 100)}%)\n\n${aiAnalysis.primaryCause.description}`,
      [220, 38, 127] // pink-600
    )

    // COMPLAINT & SYMPTOMS BLOCK
    const allSymptoms = [
      ...symptoms.sounds.filter(s => !s.includes('Tidak ada')),
      ...symptoms.vibrations.filter(s => !s.includes('Tidak ada')),
      ...symptoms.smells.filter(s => !s.includes('Tidak ada')),
      ...symptoms.warningLights.filter(s => !s.includes('Tidak ada')),
      ...symptoms.conditions.filter(s => !s.includes('Tidak ada'))
    ]

    addBlock('KELUHAN & GEJALA', {
      type: 'list',
      items: [diagnosis.complaint, ...allSymptoms.slice(0, 6)]
    }, [168, 85, 247]) // purple-600

    // DTC CODES BLOCK (if any)
    const errorCodes = JSON.parse(diagnosis.errorCodes || '[]')
    if (errorCodes.length > 0) {
      addBlock('KODE ERROR DTC', {
        type: 'list',
        items: errorCodes
      }, [239, 68, 68]) // red-500
    }

    // DIAGNOSTIC STEPS COMPACT
    addBlock('LANGKAH DIAGNOSA', {
      type: 'list',
      items: aiAnalysis.diagnosticSteps.slice(0, 4).map((step: any) => 
        `${step.step}. ${step.title}: ${step.expectedResult}`
      )
    }, [16, 185, 129]) // green-600

    // REPAIR PROCEDURES COMPACT
    if (aiAnalysis.repairProcedures && aiAnalysis.repairProcedures.length > 0) {
      const mainProcedure = aiAnalysis.repairProcedures[0]
      
      addBlock('PROSEDUR PERBAIKAN UTAMA', 
        `${mainProcedure.title}\n\nEstimasi: ${mainProcedure.estimatedTime} menit | Kesulitan: ${mainProcedure.difficultyLevel}\n\nLangkah utama:\n${mainProcedure.steps.slice(0, 3).map((step: string, i: number) => `${i+1}. ${step}`).join('\n')}`,
        [147, 51, 234] // purple-600
      )

      // Parts & Tools in compact grid
      if (mainProcedure.requiredParts && mainProcedure.requiredParts.length > 0) {
        addBlock('PARTS & TOOLS DIPERLUKAN', {
          type: 'grid',
          items: [
            ...mainProcedure.requiredParts.slice(0, 4).map((part: any) => ({
              label: part.name,
              value: `Rp ${part.estimatedPrice.toLocaleString('id-ID')}`
            })),
            ...mainProcedure.requiredTools.slice(0, 2).map((tool: string) => ({
              label: 'Tool',
              value: tool
            }))
          ]
        }, [245, 158, 11]) // amber-500
      }
    }

    // COST ANALYSIS COMPACT
    const costMetrics = [
      {
        label: 'PARTS COST',
        value: `Rp ${Math.round(aiAnalysis.estimatedTotalCost.parts / 1000)}K`,
        color: [34, 197, 94] // green-500
      },
      {
        label: 'LABOR COST', 
        value: `Rp ${Math.round(aiAnalysis.estimatedTotalCost.labor / 1000)}K`,
        color: [59, 130, 246] // blue-500
      },
      {
        label: 'TOTAL ESTIMATE',
        value: `Rp ${Math.round(aiAnalysis.estimatedTotalCost.total / 1000)}K`,
        color: [239, 68, 68] // red-500
      }
    ]
    addMetricsRow(costMetrics)

    // SECONDARY CAUSES COMPACT
    if (aiAnalysis.secondaryCauses && aiAnalysis.secondaryCauses.length > 0) {
      addBlock('KEMUNGKINAN PENYEBAB LAIN', {
        type: 'list',
        items: aiAnalysis.secondaryCauses.slice(0, 3).map((cause: any) => 
          `${cause.component} (${Math.round(cause.probability * 100)}%) - ${cause.description.substring(0, 80)}...`
        )
      }, [251, 146, 60]) // orange-500
    }

    // RECOMMENDATIONS BLOCK
    addBlock('REKOMENDASI TEKNISI', {
      type: 'list',
      items: [
        'Lakukan diagnosa sesuai langkah yang telah ditentukan',
        'Pastikan semua safety precautions diikuti dengan ketat',
        'Gunakan parts original atau yang berkualitas setara',
        'Lakukan quality control check setelah perbaikan',
        'Test drive kendaraan sebelum diserahkan ke pelanggan'
      ]
    }, [16, 185, 129]) // green-600

    // FOOTER pada setiap halaman
    const totalPages = pdf.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      
      // Professional footer
      pdf.setFillColor(248, 250, 252)
      pdf.rect(15, 275, 180, 15, 'F')
      
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 116, 139)
      pdf.text('AutoDiag Master AI - Sistem Diagnosa Otomotif Berbasis Artificial Intelligence', 20, 283)
      pdf.text(`${currentDate.toLocaleDateString('id-ID')} | Halaman ${i}/${totalPages} | ${reportNumber}`, 20, 288)
    }

    // Save report to database
    const report = await prisma.report.create({
      data: {
        diagnosisId: diagnosisId,
        reportNumber: reportNumber,
        customerInfo: JSON.stringify({}),
        technicianInfo: JSON.stringify({
          name: 'AI Master Technician',
          system: 'AutoDiag Master AI',
          version: '1.0'
        }),
        reportData: JSON.stringify({
          diagnosis: aiAnalysis,
          vehicle: {
            brand: diagnosis.brand,
            model: diagnosis.model,
            year: diagnosis.year,
            engineCode: diagnosis.engineCode,
            transmission: diagnosis.transmission,
            mileage: diagnosis.mileage
          },
          complaint: diagnosis.complaint,
          symptoms: symptoms,
          generatedAt: currentDate.toISOString(),
          reportNumber: reportNumber,
          totalPages: totalPages
        }),
        templateUsed: 'professional_v1'
      }
    })

    // Convert PDF to base64
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))
    const pdfBase64 = pdfBuffer.toString('base64')

    return NextResponse.json({
      success: true,
      data: {
        reportId: report.id,
        reportNumber: reportNumber,
        pdfData: pdfBase64,
        filename: `Laporan_Diagnosa_${reportNumber}.pdf`,
        totalPages: totalPages
      }
    })

  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal membuat laporan' 
      },
      { status: 500 }
    )
  }
}