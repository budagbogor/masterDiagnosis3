import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { SupabaseService, Vehicle } from '../lib/supabase';
import AIConnectionNotification from '../components/AIConnectionNotification';

interface VehicleData {
  brand: string;
  model: string;
  year: number;
  engine: string;
}

export default function DiagnosisScreen() {
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState<VehicleData>({
    brand: '',
    model: '',
    year: 2024,
    engine: '',
  });
  const [symptoms, setSymptoms] = useState('');
  const [dtcCodes, setDtcCodes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAINotification, setShowAINotification] = useState(false);
  
  // Data dari Supabase
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    loadVehicleData();
  }, []);

  useEffect(() => {
    if (vehicle.brand) {
      loadModelsByBrand(vehicle.brand);
    }
  }, [vehicle.brand]);

  const loadVehicleData = async () => {
    const result = await SupabaseService.getVehicles();
    if (result.success && result.data) {
      setVehicles(result.data);
      const uniqueBrands = [...new Set(result.data.map(v => v.brand))].sort();
      setBrands(uniqueBrands);
    }
  };

  const loadModelsByBrand = async (brand: string) => {
    const result = await SupabaseService.getVehiclesByBrand(brand);
    if (result.success && result.data) {
      const uniqueModels = [...new Set(result.data.map(v => v.model))].sort();
      setModels(uniqueModels);
    }
  };

  const handleNext = () => {
    if (step === 1 && (!vehicle.brand || !vehicle.model)) {
      Alert.alert('Error', 'Pilih merek dan model kendaraan terlebih dahulu');
      return;
    }
    if (step === 2 && !symptoms.trim()) {
      Alert.alert('Error', 'Masukkan gejala yang dialami kendaraan');
      return;
    }
    setStep(step + 1);
  };

  const handleDiagnosis = async () => {
    setLoading(true);
    
    try {
      const dtcArray = dtcCodes.split(',').map(code => code.trim()).filter(code => code);
      
      const result = await SupabaseService.performAIDiagnosis(
        vehicle.brand,
        vehicle.model,
        vehicle.year,
        symptoms,
        dtcArray
      );

      if (result.success && result.data) {
        // Jika AI offline, tampilkan notifikasi
        if ('isOffline' in result.data && result.data.isOffline) {
          setShowAINotification(true);
        }

        // Simpan hasil diagnosis ke database
        const diagnosisData = {
          vehicle_brand: vehicle.brand,
          vehicle_model: vehicle.model,
          vehicle_year: vehicle.year,
          symptoms: symptoms,
          dtc_codes: dtcArray,
          diagnosis_result: result.data.diagnosis_result,
          recommendations: result.data.recommendations,
          confidence_score: result.data.confidence_score,
          severity: result.data.severity
        };

        const saveResult = await SupabaseService.saveDiagnosis(diagnosisData);
        
        if (saveResult.success) {
          Alert.alert(
            'Diagnosis Selesai',
            `Hasil diagnosis telah dibuat dengan confidence ${result.data.confidence_score}%. Periksa halaman riwayat untuk melihat detail.`,
            [
              {
                text: 'OK',
                onPress: () => {
                  setStep(1);
                  setVehicle({ brand: '', model: '', year: 2024, engine: '' });
                  setSymptoms('');
                  setDtcCodes('');
                }
              }
            ]
          );
        } else {
          Alert.alert('Error', 'Gagal menyimpan hasil diagnosis');
        }
      }
    } catch (error) {
      console.error('Diagnosis error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat melakukan diagnosis');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryAI = async () => {
    setShowAINotification(false);
    // Coba diagnosis ulang
    await handleDiagnosis();
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Pilih Kendaraan</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Merek Kendaraan</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.brand || ""}
            onValueChange={(value: string) => setVehicle({...vehicle, brand: value, model: ''})}
            style={styles.picker}
          >
            <Picker.Item label="Pilih Merek" value="" />
            {brands.map((brand) => (
              <Picker.Item key={brand} label={brand} value={brand} />
            ))}
          </Picker>
        </View>
      </View>

      {vehicle.brand && models.length > 0 && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Model Kendaraan</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={vehicle.model || ""}
              onValueChange={(value: string) => setVehicle({...vehicle, model: value})}
              style={styles.picker}
            >
              <Picker.Item label="Pilih Model" value="" />
              {models.map((model) => (
                <Picker.Item key={model} label={model} value={model} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tahun Kendaraan</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.year}
            onValueChange={(value: number) => setVehicle({...vehicle, year: value})}
            style={styles.picker}
          >
            {Array.from({length: 15}, (_, i) => 2024 - i).map((year) => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Gejala Kendaraan</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Deskripsi Gejala</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={6}
          placeholder="Jelaskan gejala yang dialami kendaraan Anda..."
          value={symptoms}
          onChangeText={setSymptoms}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Kode DTC (Opsional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Contoh: P0171, P0300"
          value={dtcCodes || ""}
          onChangeText={setDtcCodes}
        />
        <Text style={styles.helperText}>
          Pisahkan dengan koma jika ada beberapa kode
        </Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Konfirmasi Diagnosis</Text>
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Ringkasan</Text>
        <Text style={styles.summaryText}>Kendaraan: {vehicle.brand} {vehicle.model} {vehicle.year}</Text>
        <Text style={styles.summaryText}>Gejala: {symptoms}</Text>
        {dtcCodes && <Text style={styles.summaryText}>Kode DTC: {dtcCodes}</Text>}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Sedang melakukan diagnosis AI...</Text>
          <Text style={styles.loadingSubtext}>Menganalisis gejala dan kode DTC</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.primaryButton} onPress={handleDiagnosis}>
          <Ionicons name="medical" size={24} color="#fff" />
          <Text style={styles.primaryButtonText}>Mulai Diagnosis AI</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((stepNumber) => (
            <View key={stepNumber} style={styles.progressStep}>
              <View style={[
                styles.progressCircle,
                step >= stepNumber && styles.progressCircleActive
              ]}>
                <Text style={[
                  styles.progressText,
                  step >= stepNumber && styles.progressTextActive
                ]}>
                  {stepNumber}
                </Text>
              </View>
              {stepNumber < 3 && (
                <View style={[
                  styles.progressLine,
                  step > stepNumber && styles.progressLineActive
                ]} />
              )}
            </View>
          ))}
        </View>

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Navigation Buttons */}
        {step < 3 && (
          <View style={styles.buttonContainer}>
            {step > 1 && (
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={() => setStep(step - 1)}
              >
                <Text style={styles.secondaryButtonText}>Kembali</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
              <Text style={styles.primaryButtonText}>Lanjut</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* AI Connection Notification */}
      <AIConnectionNotification
        isVisible={showAINotification}
        onClose={() => setShowAINotification(false)}
        onRetry={handleRetryAI}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleActive: {
    backgroundColor: '#3b82f6',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
  },
  progressTextActive: {
    color: '#fff',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e2e8f0',
  },
  progressLineActive: {
    backgroundColor: '#3b82f6',
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  picker: {
    height: 50,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 12,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});