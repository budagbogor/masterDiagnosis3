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

    // Helper function to check page break with footer space
    const checkPageBreak = (requiredSpace: number) => {
      if (yPos + requiredSpace > 250) { // Leave more space for footer
        pdf.addPage()
        currentPage++
        yPos = 20
        return true
      }
      return false
    }

    // Helper function to add professional block with consistent spacing
    const addBlock = (title: string, content: any, color: [number, number, number] = [59, 130, 246]) => {
      const lineHeight = 5 // Consistent line height
      const padding = 8 // Consistent padding
      
      // Calculate content height more accurately
      let contentHeight = 0
      let contentLines: string[] = []
      
      if (typeof content === 'string') {
        contentLines = pdf.splitTextToSize(content, 170)
        contentHeight = contentLines.length * lineHeight + (padding * 2)
      } else if (content.type === 'grid') {
        const rows = Math.ceil(content.items.length / 2)
        contentHeight = rows * (lineHeight + 2) + (padding * 2)
      } else if (content.type === 'list') {
        // Calculate height for list items with proper line wrapping
        let totalLines = 0
        content.items.forEach((item: string) => {
          const itemLines = pdf.splitTextToSize(`• ${item}`, 170)
          totalLines += itemLines.length
        })
        contentHeight = totalLines * lineHeight + (padding * 2)
      }
      
      const totalBlockHeight = 12 + contentHeight + 5 // Header + content + spacing
      
      checkPageBreak(totalBlockHeight)
      
      // Block header
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
      pdf.roundedRect(15, yPos, 180, contentHeight, 2, 2, 'F')
      
      // Content with consistent spacing
      pdf.setTextColor(51, 65, 85)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      
      let currentY = yPos + padding
      
      if (typeof content === 'string') {
        contentLines.forEach((line: string, index: number) => {
          pdf.text(line, 20, currentY + (index * lineHeight))
        })
      } else if (content.type === 'grid') {
        content.items.forEach((item: any, index: number) => {
          const col = index % 2
          const row = Math.floor(index / 2)
          const xOffset = col * 90
          const yOffset = row * (lineHeight + 2)
          
          pdf.setFont('helvetica', 'bold')
          pdf.text(item.label + ':', 20 + xOffset, currentY + yOffset)
          pdf.setFont('helvetica', 'normal')
          
          // Handle long values with text wrapping
          const valueLines = pdf.splitTextToSize(item.value, 50)
          valueLines.forEach((valueLine: string, lineIndex: number) => {
            pdf.text(valueLine, 20 + xOffset + 35, currentY + yOffset + (lineIndex * lineHeight))
          })
        })
      } else if (content.type === 'list') {
        let currentLineIndex = 0
        content.items.forEach((item: string) => {
          const itemLines = pdf.splitTextToSize(`• ${item}`, 170)
          itemLines.forEach((line: string, lineIndex: number) => {
            pdf.text(line, 20, currentY + (currentLineIndex * lineHeight))
            currentLineIndex++
          })
        })
      }
      
      yPos += contentHeight + 8 // Move to next position with consistent spacing
      pdf.setTextColor(0, 0, 0)
    }

    // Helper function for metrics blocks (3-column layout) with consistent spacing
    const addMetricsRow = (metrics: any[]) => {
      checkPageBreak(40)
      
      metrics.forEach((metric, index) => {
        const xPos = 15 + (index * 60)
        
        // Metric block
        pdf.setFillColor(metric.color[0], metric.color[1], metric.color[2])
        pdf.roundedRect(xPos, yPos, 55, 30, 2, 2, 'F')
        
        // Icon area (simulated)
        pdf.setFillColor(255, 255, 255, 0.2)
        pdf.circle(xPos + 12, yPos + 10, 4, 'F')
        
        // Value with proper positioning
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text(metric.value, xPos + 20, yPos + 12)
        
        // Label with proper spacing
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')
        const labelLines = pdf.splitTextToSize(metric.label, 50)
        labelLines.forEach((line: string, lineIndex: number) => {
          pdf.text(line, xPos + 5, yPos + 22 + (lineIndex * 4))
        })
      })
      
      yPos += 40 // Consistent spacing after metrics
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

    // VEHICLE INFO BLOCK - MORE DETAILED
    const vehicleDetails = [
      { label: 'Merek', value: diagnosis.brand },
      { label: 'Model', value: diagnosis.model },
      { label: 'Tahun', value: diagnosis.year.toString() },
      { label: 'Kode Mesin', value: diagnosis.engineCode },
      { label: 'Transmisi', value: diagnosis.transmission },
      { label: 'Kilometer', value: `${diagnosis.mileage.toLocaleString('id-ID')} km` },
      { label: 'VIN', value: diagnosis.vin || 'Tidak tersedia' },
      { label: 'Tanggal Service Terakhir', value: diagnosis.lastServiceDate || 'Tidak tersedia' }
    ]
    
    addBlock('INFORMASI KENDARAAN DETAIL', {
      type: 'grid',
      items: vehicleDetails
    }, [34, 197, 94]) // emerald-600

    // SERVICE HISTORY DETAIL
    const partsReplaced = JSON.parse(diagnosis.partsReplaced || '[]')
    const modifications = JSON.parse(diagnosis.modifications || '[]')
    
    if (partsReplaced.length > 0 || modifications.length > 0) {
      const serviceHistory = [
        ...partsReplaced.map((part: string) => `Parts Diganti: ${part}`),
        ...modifications.map((mod: string) => `Modifikasi: ${mod}`)
      ]
      
      addBlock('RIWAYAT SERVICE & MODIFIKASI', {
        type: 'list',
        items: serviceHistory
      }, [168, 85, 247]) // purple-500
    }

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

    // COMPLAINT & SYMPTOMS BLOCK - MORE DETAILED
    const allSymptoms = [
      ...symptoms.sounds.filter(s => !s.includes('Tidak ada')),
      ...symptoms.vibrations.filter(s => !s.includes('Tidak ada')),
      ...symptoms.smells.filter(s => !s.includes('Tidak ada')),
      ...symptoms.warningLights.filter(s => !s.includes('Tidak ada')),
      ...symptoms.conditions.filter(s => !s.includes('Tidak ada'))
    ]

    addBlock('KELUHAN UTAMA', diagnosis.complaint, [220, 38, 127]) // pink-600

    if (allSymptoms.length > 0) {
      addBlock('GEJALA YANG DILAPORKAN', {
        type: 'list',
        items: allSymptoms
      }, [168, 85, 247]) // purple-600
    }

    // ADDITIONAL NOTES
    if (diagnosis.additionalNotes) {
      addBlock('CATATAN TAMBAHAN', diagnosis.additionalNotes, [99, 102, 241]) // indigo-500
    }

    // VISUAL INSPECTION & TEST RESULTS
    if (diagnosis.visualInspection || diagnosis.testDriveNotes) {
      const inspectionData = []
      if (diagnosis.visualInspection) inspectionData.push(`Visual Inspection: ${diagnosis.visualInspection}`)
      if (diagnosis.testDriveNotes) inspectionData.push(`Test Drive: ${diagnosis.testDriveNotes}`)
      
      addBlock('HASIL INSPEKSI & TEST', {
        type: 'list',
        items: inspectionData
      }, [16, 185, 129]) // green-600
    }

    // DTC CODES BLOCK (if any)
    const errorCodes = JSON.parse(diagnosis.errorCodes || '[]')
    if (errorCodes.length > 0) {
      addBlock('KODE ERROR DTC', {
        type: 'list',
        items: errorCodes
      }, [239, 68, 68]) // red-500
    }

    // DIAGNOSTIC STEPS - DETAILED VERSION with proper spacing
    const diagnosticStepsFormatted = aiAnalysis.diagnosticSteps.map((step: any) => {
      return `STEP ${step.step}: ${step.title}\n` +
             `Deskripsi: ${step.description}\n` +
             `Expected Result: ${step.expectedResult}\n` +
             `Tools: ${step.tools.join(', ')}\n`
    })
    
    addBlock('LANGKAH DIAGNOSA DETAIL', {
      type: 'list',
      items: diagnosticStepsFormatted
    }, [16, 185, 129]) // green-600

    // THEORY EXPLANATION - DETAILED
    if (aiAnalysis.theoryExplanation) {
      addBlock('PENJELASAN TEORI TEKNIS', 
        aiAnalysis.theoryExplanation,
        [99, 102, 241] // indigo-500
      )
    }

    // REPAIR PROCEDURES - DETAILED VERSION with proper formatting
    if (aiAnalysis.repairProcedures && aiAnalysis.repairProcedures.length > 0) {
      aiAnalysis.repairProcedures.forEach((procedure: any, index: number) => {
        const procedureDescription = `Deskripsi: ${procedure.description}\n\n` +
                                   `Tingkat Kesulitan: ${procedure.difficultyLevel}\n` +
                                   `Estimasi Waktu: ${procedure.estimatedTime} menit\n\n` +
                                   `Langkah-langkah Detail:`
        
        addBlock(`PROSEDUR PERBAIKAN ${index + 1}: ${procedure.title}`, 
          procedureDescription,
          [147, 51, 234] // purple-600
        )

        // Steps as separate block for better formatting
        addBlock(`LANGKAH KERJA - ${procedure.title}`, {
          type: 'list',
          items: procedure.steps.map((step: string, i: number) => `${i+1}. ${step}`)
        }, [99, 102, 241]) // indigo-500

        // Safety Precautions
        if (procedure.safetyPrecautions && procedure.safetyPrecautions.length > 0) {
          addBlock(`KESELAMATAN KERJA - ${procedure.title}`, {
            type: 'list',
            items: procedure.safetyPrecautions
          }, [239, 68, 68]) // red-500
        }

        // Quality Checks
        if (procedure.qualityChecks && procedure.qualityChecks.length > 0) {
          addBlock(`QUALITY CONTROL - ${procedure.title}`, {
            type: 'list',
            items: procedure.qualityChecks
          }, [34, 197, 94]) // green-500
        }

        // Required Parts Detail
        if (procedure.requiredParts && procedure.requiredParts.length > 0) {
          addBlock(`PARTS DIPERLUKAN - ${procedure.title}`, {
            type: 'grid',
            items: procedure.requiredParts.map((part: any) => ({
              label: part.name,
              value: `${part.partNumber || 'N/A'}\nRp ${part.estimatedPrice.toLocaleString('id-ID')}`
            }))
          }, [245, 158, 11]) // amber-500
        }

        // Required Tools Detail
        if (procedure.requiredTools && procedure.requiredTools.length > 0) {
          addBlock(`TOOLS DIPERLUKAN - ${procedure.title}`, {
            type: 'list',
            items: procedure.requiredTools
          }, [168, 85, 247]) // purple-500
        }
      })
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

    // SECONDARY CAUSES - DETAILED VERSION with better formatting
    if (aiAnalysis.secondaryCauses && aiAnalysis.secondaryCauses.length > 0) {
      const secondaryCausesFormatted = aiAnalysis.secondaryCauses.map((cause: any) => {
        return `${cause.component} (Probabilitas: ${Math.round(cause.probability * 100)}%)\n` +
               `Deskripsi: ${cause.description}\n` +
               `Kompleksitas: ${cause.repairComplexity}\n` +
               `Estimasi Biaya: Rp ${cause.estimatedCost.min.toLocaleString('id-ID')} - Rp ${cause.estimatedCost.max.toLocaleString('id-ID')}\n`
      })
      
      addBlock('KEMUNGKINAN PENYEBAB ALTERNATIF', {
        type: 'list',
        items: secondaryCausesFormatted
      }, [251, 146, 60]) // orange-500
    }

    // DETAILED COST BREAKDOWN
    addBlock('ANALISIS BIAYA DETAIL', {
      type: 'grid',
      items: [
        { label: 'Biaya Parts', value: `Rp ${aiAnalysis.estimatedTotalCost.parts.toLocaleString('id-ID')}` },
        { label: 'Biaya Labor', value: `Rp ${aiAnalysis.estimatedTotalCost.labor.toLocaleString('id-ID')}` },
        { label: 'Total Estimasi', value: `Rp ${aiAnalysis.estimatedTotalCost.total.toLocaleString('id-ID')}` },
        { label: 'Primary Cause Min', value: `Rp ${aiAnalysis.primaryCause.estimatedCost.min.toLocaleString('id-ID')}` },
        { label: 'Primary Cause Max', value: `Rp ${aiAnalysis.primaryCause.estimatedCost.max.toLocaleString('id-ID')}` },
        { label: 'Confidence Level', value: `${Math.round(aiAnalysis.confidence * 100)}%` }
      ]
    }, [34, 197, 94]) // green-500

    // SYMPTOMS CORRELATION DETAIL with proper formatting
    if (aiAnalysis.primaryCause.symptoms && aiAnalysis.primaryCause.symptoms.length > 0) {
      const symptomsFormatted = aiAnalysis.primaryCause.symptoms.map((symptom: string) => 
        `✓ ${symptom}\n  Berkaitan dengan: ${aiAnalysis.primaryCause.component}`
      )
      
      addBlock('KORELASI GEJALA DENGAN DIAGNOSA', {
        type: 'list',
        items: symptomsFormatted
      }, [168, 85, 247]) // purple-500
    }

    // ADDITIONAL TECHNICAL INFO
    addBlock('INFORMASI TEKNIS TAMBAHAN', {
      type: 'grid',
      items: [
        { label: 'Sistem Terdampak', value: aiAnalysis.primaryCause.component },
        { label: 'Tingkat Urgensi', value: aiAnalysis.primaryCause.repairComplexity },
        { label: 'Waktu Diagnosa', value: `${currentDate.toLocaleString('id-ID')}` },
        { label: 'AI Model Version', value: 'GPT-4 Turbo' },
        { label: 'Database Version', value: '2024.12' },
        { label: 'Report Format', value: 'Professional v1.3' }
      ]
    }, [99, 102, 241]) // indigo-500

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

    // FOOTER pada setiap halaman dengan jarak yang cukup
    const totalPages = pdf.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      
      // Professional footer dengan jarak yang aman dari konten
      pdf.setFillColor(248, 250, 252)
      pdf.rect(15, 270, 180, 20, 'F') // Posisi lebih rendah dan tinggi lebih besar
      
      // Border atas footer
      pdf.setDrawColor(226, 232, 240)
      pdf.setLineWidth(0.5)
      pdf.line(15, 270, 195, 270)
      
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(71, 85, 105)
      pdf.text('AutoDiag Master AI - Sistem Diagnosa Otomotif Berbasis Artificial Intelligence', 20, 278)
      
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(7)
      pdf.setTextColor(100, 116, 139)
      pdf.text(`Generated: ${currentDate.toLocaleDateString('id-ID')} ${currentDate.toLocaleTimeString('id-ID')}`, 20, 283)
      pdf.text(`Report ID: ${reportNumber} | Diagnosis ID: ${diagnosisId}`, 20, 287)
      pdf.text(`Halaman ${i} dari ${totalPages} | © 2024 AutoDiag Master AI`, 130, 283)
      pdf.text('Laporan ini dibuat secara otomatis oleh sistem AI', 130, 287)
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