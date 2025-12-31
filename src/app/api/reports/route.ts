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

    // Create PDF
    const pdf = new jsPDF()
    let currentPage = 1
    let yPos = 30

    // Helper function to check page break
    const checkPageBreak = (requiredSpace: number) => {
      if (yPos + requiredSpace > 270) {
        pdf.addPage()
        currentPage++
        yPos = 30
        return true
      }
      return false
    }

    // Helper function to add section header
    const addSectionHeader = (title: string, size: number = 14) => {
      checkPageBreak(20)
      pdf.setFontSize(size)
      pdf.setFont('helvetica', 'bold')
      pdf.text(title, 20, yPos)
      yPos += 15
      pdf.setFont('helvetica', 'normal')
    }

    // HEADER PAGE
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('LAPORAN DIAGNOSA KENDARAAN', 20, 30)
    pdf.text('AutoDiag Master AI', 20, 45)
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Nomor Laporan: ${reportNumber}`, 20, 65)
    pdf.text(`Tanggal: ${currentDate.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 20, 75)
    pdf.text(`Waktu: ${currentDate.toLocaleTimeString('id-ID')}`, 20, 85)
    pdf.text(`Diagnosis ID: ${diagnosisId}`, 20, 95)

    // Draw line separator
    pdf.line(20, 105, 190, 105)
    yPos = 120

    // INFORMASI KENDARAAN
    addSectionHeader('1. INFORMASI KENDARAAN', 16)
    
    const vehicleInfo = [
      ['Merek', diagnosis.brand],
      ['Model', diagnosis.model],
      ['Tahun', diagnosis.year],
      ['Kode Mesin', diagnosis.engineCode],
      ['Transmisi', diagnosis.transmission],
      ['Kilometer', `${diagnosis.mileage.toLocaleString('id-ID')} km`],
      ['VIN', diagnosis.vin || 'Tidak tersedia']
    ]

    pdf.setFontSize(10)
    vehicleInfo.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${label}:`, 25, yPos)
      pdf.setFont('helvetica', 'normal')
      pdf.text(value, 80, yPos)
      yPos += 8
    })

    yPos += 10

    // KELUHAN UTAMA
    addSectionHeader('2. KELUHAN UTAMA PELANGGAN')
    pdf.setFontSize(10)
    const complaintLines = pdf.splitTextToSize(diagnosis.complaint, 165)
    pdf.text(complaintLines, 25, yPos)
    yPos += complaintLines.length * 6 + 10

    // GEJALA YANG DIALAMI
    addSectionHeader('3. GEJALA YANG DIALAMI')
    pdf.setFontSize(10)
    
    const symptomCategories = [
      ['Suara Anomali', symptoms.sounds],
      ['Getaran', symptoms.vibrations],
      ['Bau Tidak Wajar', symptoms.smells],
      ['Lampu Indikator', symptoms.warningLights],
      ['Kondisi Munculnya', symptoms.conditions]
    ]

    symptomCategories.forEach(([category, items]) => {
      if (items.length > 0 && !items.includes('Tidak ada suara aneh') && !items.includes('Tidak ada getaran') && !items.includes('Tidak ada bau aneh') && !items.includes('Tidak ada lampu menyala')) {
        checkPageBreak(15)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${category}:`, 25, yPos)
        yPos += 8
        pdf.setFont('helvetica', 'normal')
        items.forEach(item => {
          checkPageBreak(8)
          pdf.text(`• ${item}`, 30, yPos)
          yPos += 6
        })
        yPos += 5
      }
    })

    // KODE ERROR DTC
    const errorCodes = JSON.parse(diagnosis.errorCodes || '[]')
    if (errorCodes.length > 0) {
      addSectionHeader('4. KODE ERROR DTC')
      pdf.setFontSize(10)
      errorCodes.forEach((code: string) => {
        checkPageBreak(8)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`• ${code}`, 25, yPos)
        pdf.setFont('helvetica', 'normal')
        yPos += 8
      })
      yPos += 10
    }

    // HASIL ANALISIS AI
    checkPageBreak(30)
    addSectionHeader('5. HASIL ANALISIS AI MASTER TECHNICIAN', 16)
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Tingkat Kepercayaan AI: ${Math.round(aiAnalysis.confidence * 100)}%`, 25, yPos)
    yPos += 15

    // PENYEBAB UTAMA
    addSectionHeader('5.1 PENYEBAB UTAMA')
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Komponen: ${aiAnalysis.primaryCause.component}`, 25, yPos)
    yPos += 8
    pdf.text(`Probabilitas: ${Math.round(aiAnalysis.primaryCause.probability * 100)}%`, 25, yPos)
    yPos += 8
    pdf.text(`Tingkat Kesulitan: ${aiAnalysis.primaryCause.repairComplexity}`, 25, yPos)
    yPos += 10

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    const descLines = pdf.splitTextToSize(aiAnalysis.primaryCause.description, 165)
    pdf.text(descLines, 25, yPos)
    yPos += descLines.length * 6 + 10

    // Gejala Terkait
    pdf.setFont('helvetica', 'bold')
    pdf.text('Gejala Terkait:', 25, yPos)
    yPos += 8
    pdf.setFont('helvetica', 'normal')
    aiAnalysis.primaryCause.symptoms.forEach((symptom: string) => {
      checkPageBreak(6)
      pdf.text(`• ${symptom}`, 30, yPos)
      yPos += 6
    })
    yPos += 10

    // Testing Required
    pdf.setFont('helvetica', 'bold')
    pdf.text('Pengujian yang Diperlukan:', 25, yPos)
    yPos += 8
    pdf.setFont('helvetica', 'normal')
    aiAnalysis.primaryCause.testingRequired.forEach((test: string) => {
      checkPageBreak(6)
      pdf.text(`• ${test}`, 30, yPos)
      yPos += 6
    })
    yPos += 15

    // KEMUNGKINAN PENYEBAB LAIN
    if (aiAnalysis.secondaryCauses && aiAnalysis.secondaryCauses.length > 0) {
      addSectionHeader('5.2 KEMUNGKINAN PENYEBAB LAIN')
      pdf.setFontSize(10)
      
      aiAnalysis.secondaryCauses.forEach((cause: any, index: number) => {
        checkPageBreak(25)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${index + 1}. ${cause.component} (${Math.round(cause.probability * 100)}%)`, 25, yPos)
        yPos += 8
        pdf.setFont('helvetica', 'normal')
        const causeDesc = pdf.splitTextToSize(cause.description, 160)
        pdf.text(causeDesc, 30, yPos)
        yPos += causeDesc.length * 6 + 8
      })
    }

    // PENJELASAN TEORI KERJA
    checkPageBreak(40)
    addSectionHeader('6. PENJELASAN TEORI KERJA', 16)
    pdf.setFontSize(10)
    const theoryLines = pdf.splitTextToSize(aiAnalysis.theoryExplanation, 165)
    theoryLines.forEach((line: string) => {
      checkPageBreak(6)
      pdf.text(line, 25, yPos)
      yPos += 6
    })
    yPos += 15

    // LANGKAH DIAGNOSA
    checkPageBreak(40)
    addSectionHeader('7. LANGKAH DIAGNOSA SISTEMATIS', 16)
    
    aiAnalysis.diagnosticSteps.forEach((step: any, index: number) => {
      checkPageBreak(35)
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`Langkah ${step.step}: ${step.title}`, 25, yPos)
      yPos += 10
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const stepDesc = pdf.splitTextToSize(step.description, 160)
      pdf.text(stepDesc, 30, yPos)
      yPos += stepDesc.length * 6 + 5
      
      pdf.setFont('helvetica', 'bold')
      pdf.text('Hasil yang Diharapkan:', 30, yPos)
      yPos += 6
      pdf.setFont('helvetica', 'normal')
      pdf.text(step.expectedResult, 35, yPos)
      yPos += 8
      
      pdf.setFont('helvetica', 'bold')
      pdf.text('Tools Diperlukan:', 30, yPos)
      yPos += 6
      pdf.setFont('helvetica', 'normal')
      step.tools.forEach((tool: string) => {
        pdf.text(`• ${tool}`, 35, yPos)
        yPos += 5
      })
      
      if (step.safetyNotes && step.safetyNotes.length > 0) {
        yPos += 3
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(200, 0, 0) // Red color for safety
        pdf.text('⚠ CATATAN KESELAMATAN:', 30, yPos)
        yPos += 6
        pdf.setFont('helvetica', 'normal')
        step.safetyNotes.forEach((note: string) => {
          pdf.text(`• ${note}`, 35, yPos)
          yPos += 5
        })
        pdf.setTextColor(0, 0, 0) // Reset to black
      }
      
      yPos += 10
    })

    // PROSEDUR PERBAIKAN
    checkPageBreak(40)
    addSectionHeader('8. PROSEDUR PERBAIKAN DETAIL', 16)
    
    aiAnalysis.repairProcedures.forEach((procedure: any, index: number) => {
      checkPageBreak(50)
      
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`8.${index + 1} ${procedure.title}`, 25, yPos)
      yPos += 10
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const procDesc = pdf.splitTextToSize(procedure.description, 160)
      pdf.text(procDesc, 30, yPos)
      yPos += procDesc.length * 6 + 10
      
      // Estimasi waktu dan kesulitan
      pdf.setFont('helvetica', 'bold')
      pdf.text(`Estimasi Waktu: ${procedure.estimatedTime} menit`, 30, yPos)
      yPos += 6
      pdf.text(`Tingkat Kesulitan: ${procedure.difficultyLevel}`, 30, yPos)
      yPos += 10
      
      // Langkah-langkah
      pdf.text('LANGKAH PERBAIKAN:', 30, yPos)
      yPos += 8
      pdf.setFont('helvetica', 'normal')
      procedure.steps.forEach((step: string, stepIndex: number) => {
        checkPageBreak(8)
        pdf.text(`${stepIndex + 1}. ${step}`, 35, yPos)
        yPos += 6
      })
      yPos += 8
      
      // Parts yang diperlukan
      if (procedure.requiredParts && procedure.requiredParts.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('PARTS DIPERLUKAN:', 30, yPos)
        yPos += 8
        pdf.setFont('helvetica', 'normal')
        procedure.requiredParts.forEach((part: any) => {
          checkPageBreak(6)
          pdf.text(`• ${part.name}`, 35, yPos)
          if (part.partNumber) {
            pdf.text(`Part #: ${part.partNumber}`, 120, yPos)
          }
          yPos += 5
          pdf.text(`Estimasi Harga: Rp ${part.estimatedPrice.toLocaleString('id-ID')}`, 40, yPos)
          yPos += 8
        })
      }
      
      // Tools yang diperlukan
      if (procedure.requiredTools && procedure.requiredTools.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('TOOLS DIPERLUKAN:', 30, yPos)
        yPos += 8
        pdf.setFont('helvetica', 'normal')
        procedure.requiredTools.forEach((tool: string) => {
          checkPageBreak(5)
          pdf.text(`• ${tool}`, 35, yPos)
          yPos += 5
        })
        yPos += 5
      }
      
      // Safety precautions
      if (procedure.safetyPrecautions && procedure.safetyPrecautions.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(200, 0, 0)
        pdf.text('⚠ PRECAUTIONS KESELAMATAN:', 30, yPos)
        yPos += 8
        pdf.setFont('helvetica', 'normal')
        procedure.safetyPrecautions.forEach((precaution: string) => {
          checkPageBreak(6)
          pdf.text(`• ${precaution}`, 35, yPos)
          yPos += 6
        })
        pdf.setTextColor(0, 0, 0)
        yPos += 5
      }
      
      // Quality checks
      if (procedure.qualityChecks && procedure.qualityChecks.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(0, 150, 0)
        pdf.text('✓ QUALITY CONTROL CHECKS:', 30, yPos)
        yPos += 8
        pdf.setFont('helvetica', 'normal')
        procedure.qualityChecks.forEach((check: string) => {
          checkPageBreak(6)
          pdf.text(`• ${check}`, 35, yPos)
          yPos += 6
        })
        pdf.setTextColor(0, 0, 0)
        yPos += 10
      }
    })

    // ESTIMASI BIAYA
    checkPageBreak(50)
    addSectionHeader('9. ESTIMASI BIAYA PERBAIKAN', 16)
    
    pdf.setFontSize(12)
    const costData = [
      ['Biaya Parts', `Rp ${aiAnalysis.estimatedTotalCost.parts.toLocaleString('id-ID')}`],
      ['Biaya Labor', `Rp ${aiAnalysis.estimatedTotalCost.labor.toLocaleString('id-ID')}`]
    ]
    
    costData.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'normal')
      pdf.text(label, 25, yPos)
      pdf.text(value, 120, yPos)
      yPos += 10
    })
    
    // Draw line for total
    pdf.line(25, yPos, 160, yPos)
    yPos += 10
    
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    pdf.text('TOTAL ESTIMASI', 25, yPos)
    pdf.text(`Rp ${aiAnalysis.estimatedTotalCost.total.toLocaleString('id-ID')}`, 120, yPos)
    yPos += 15
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'italic')
    pdf.text('* Estimasi biaya dapat berubah tergantung kondisi aktual dan harga pasar', 25, yPos)
    yPos += 5
    pdf.text('* Harga belum termasuk PPN dan biaya tambahan lainnya', 25, yPos)

    // REKOMENDASI
    checkPageBreak(30)
    addSectionHeader('10. REKOMENDASI TEKNISI', 16)
    pdf.setFontSize(10)
    pdf.text('1. Lakukan diagnosa sesuai langkah yang telah ditentukan', 25, yPos)
    yPos += 6
    pdf.text('2. Pastikan semua safety precautions diikuti dengan ketat', 25, yPos)
    yPos += 6
    pdf.text('3. Gunakan parts original atau yang berkualitas setara', 25, yPos)
    yPos += 6
    pdf.text('4. Lakukan quality control check setelah perbaikan', 25, yPos)
    yPos += 6
    pdf.text('5. Test drive kendaraan sebelum diserahkan ke pelanggan', 25, yPos)
    yPos += 15

    // FOOTER pada setiap halaman
    const totalPages = pdf.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      
      // Footer line
      pdf.line(20, 275, 190, 275)
      
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('AutoDiag Master AI - Sistem Diagnosa Otomotif Berbasis Artificial Intelligence', 20, 285)
      pdf.text(`Laporan ini dihasilkan secara otomatis | Halaman ${i} dari ${totalPages}`, 20, 292)
      pdf.text(`Dicetak pada: ${currentDate.toLocaleString('id-ID')}`, 130, 292)
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