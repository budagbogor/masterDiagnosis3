import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DTCCode {
  id: string;
  code: string;
  system: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  symptoms: string[];
  possibleCauses: string[];
  diagnosticSteps: string[];
  repairProcedures: string[];
}

export default function DTCLibraryScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('all');
  const [dtcCodes, setDtcCodes] = useState<DTCCode[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<DTCCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Sample DTC data
  const sampleDTCData: DTCCode[] = [
    {
      id: '1',
      code: 'P0100',
      system: 'P0',
      description: 'Kerusakan Sirkuit Sensor Aliran Udara (MAF/VAF)',
      severity: 'MEDIUM',
      symptoms: ['Mesin tidak stabil saat idle', 'Konsumsi bahan bakar meningkat', 'Tenaga mesin berkurang'],
      possibleCauses: ['Sensor MAF/VAF rusak atau kotor', 'Kabel sensor putus', 'Filter udara kotor'],
      diagnosticSteps: ['Periksa kode DTC', 'Inspeksi sensor MAF', 'Test tegangan sensor'],
      repairProcedures: ['Bersihkan atau ganti sensor MAF', 'Perbaiki kabel', 'Ganti filter udara'],
    },
    {
      id: '2',
      code: 'P0171',
      system: 'P0',
      description: 'Sistem Terlalu Kurus/Lean (Bank 1)',
      severity: 'MEDIUM',
      symptoms: ['Mesin tersendat saat akselerasi', 'Idle kasar', 'Konsumsi BBM meningkat'],
      possibleCauses: ['Kebocoran vacuum', 'Sensor O2 rusak', 'Filter bahan bakar tersumbat'],
      diagnosticSteps: ['Periksa sistem vacuum', 'Test tekanan bahan bakar', 'Periksa sensor O2'],
      repairProcedures: ['Perbaiki kebocoran vacuum', 'Ganti sensor O2', 'Ganti filter bahan bakar'],
    },
    {
      id: '3',
      code: 'P0300',
      system: 'P0',
      description: 'Terdeteksi Misfire Acak/Multiple Silinder',
      severity: 'HIGH',
      symptoms: ['Mesin bergetar kasar', 'Tenaga berkurang drastis', 'Check engine light berkedip'],
      possibleCauses: ['Busi aus', 'Koil ignisi rusak', 'Injector kotor', 'Kompresi rendah'],
      diagnosticSteps: ['Periksa busi semua silinder', 'Test koil ignisi', 'Test kompresi'],
      repairProcedures: ['Ganti busi', 'Ganti koil rusak', 'Bersihkan injector'],
    },
    {
      id: '4',
      code: 'P0420',
      system: 'P0',
      description: 'Efisiensi Sistem Katalis Di Bawah Ambang Batas',
      severity: 'MEDIUM',
      symptoms: ['Emisi gas buang tinggi', 'Gagal uji emisi', 'Bau sulfur dari knalpot'],
      possibleCauses: ['Catalytic converter rusak', 'Sensor O2 downstream rusak', 'Kebocoran exhaust'],
      diagnosticSteps: ['Periksa efisiensi catalyst', 'Test sensor O2', 'Periksa kebocoran exhaust'],
      repairProcedures: ['Ganti catalytic converter', 'Ganti sensor O2', 'Perbaiki kebocoran'],
    },
    {
      id: '5',
      code: 'U0100',
      system: 'U0',
      description: 'Hilang Komunikasi dengan ECM/PCM',
      severity: 'CRITICAL',
      symptoms: ['Mesin tidak start', 'Scanner tidak bisa komunikasi', 'Multiple warning lights'],
      possibleCauses: ['ECM/PCM rusak', 'CAN bus terputus', 'Power supply ECM bermasalah'],
      diagnosticSteps: ['Periksa power supply ECM', 'Test CAN bus', 'Test komunikasi dengan scanner'],
      repairProcedures: ['Ganti ECM/PCM', 'Perbaiki CAN bus', 'Perbaiki power supply'],
    },
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setDtcCodes(sampleDTCData);
      setFilteredCodes(sampleDTCData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = dtcCodes;

    if (searchTerm) {
      filtered = filtered.filter(code =>
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSystem !== 'all') {
      filtered = filtered.filter(code => code.system === selectedSystem);
    }

    setFilteredCodes(filtered);
  }, [dtcCodes, searchTerm, selectedSystem]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const renderDTCCard = ({ item }: { item: DTCCode }) => {
    const isExpanded = expandedCard === item.id;
    
    return (
      <TouchableOpacity
        style={styles.dtcCard}
        onPress={() => setExpandedCard(isExpanded ? null : item.id)}
      >
        <View style={styles.dtcHeader}>
          <View style={styles.dtcCodeContainer}>
            <Text style={styles.dtcCode}>{item.code}</Text>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
              <Text style={styles.severityText}>{item.severity}</Text>
            </View>
          </View>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#64748b" 
          />
        </View>
        
        <Text style={styles.dtcDescription}>{item.description}</Text>
        
        {isExpanded && (
          <View style={styles.dtcDetails}>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Gejala:</Text>
              {item.symptoms.map((symptom, index) => (
                <Text key={index} style={styles.detailItem}>• {symptom}</Text>
              ))}
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Kemungkinan Penyebab:</Text>
              {item.possibleCauses.map((cause, index) => (
                <Text key={index} style={styles.detailItem}>• {cause}</Text>
              ))}
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Langkah Diagnosis:</Text>
              {item.diagnosticSteps.map((step, index) => (
                <Text key={index} style={styles.detailItem}>{index + 1}. {step}</Text>
              ))}
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Prosedur Perbaikan:</Text>
              {item.repairProcedures.map((procedure, index) => (
                <Text key={index} style={styles.detailItem}>{index + 1}. {procedure}</Text>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Memuat database DTC...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kode DTC atau deskripsi..."
            value={searchTerm || ""}
            onChangeText={setSearchTerm}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {['all', 'P0', 'P1', 'U0', 'B0', 'C0'].map((system) => (
            <TouchableOpacity
              key={system}
              style={[
                styles.filterButton,
                selectedSystem === system && styles.filterButtonActive
              ]}
              onPress={() => setSelectedSystem(system)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedSystem === system && styles.filterButtonTextActive
              ]}>
                {system === 'all' ? 'Semua' : system}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Menampilkan {filteredCodes.length} dari {dtcCodes.length} kode DTC
        </Text>
      </View>

      {/* DTC List */}
      <FlatList
        data={filteredCodes}
        renderItem={renderDTCCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 12,
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#1e293b',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  statsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statsText: {
    fontSize: 14,
    color: '#64748b',
  },
  listContainer: {
    padding: 16,
  },
  dtcCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dtcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dtcCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dtcCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    fontFamily: 'monospace',
    marginRight: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  dtcDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 8,
  },
  dtcDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  detailItem: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 4,
  },
});