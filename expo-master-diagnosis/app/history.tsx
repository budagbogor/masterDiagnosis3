import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DiagnosisHistory {
  id: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  symptoms: string;
  dtcCodes: string[];
  diagnosis: string;
  recommendations: string[];
  createdAt: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export default function HistoryScreen() {
  const [historyData, setHistoryData] = useState<DiagnosisHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Sample history data
  const sampleHistoryData: DiagnosisHistory[] = [
    {
      id: '1',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Avanza',
      vehicleYear: 2020,
      symptoms: 'Mesin bergetar saat idle, konsumsi BBM meningkat',
      dtcCodes: ['P0300', 'P0171'],
      diagnosis: 'Terdeteksi misfire pada multiple silinder dan sistem terlalu lean. Kemungkinan disebabkan oleh busi aus dan kebocoran vacuum.',
      recommendations: [
        'Ganti busi semua silinder',
        'Periksa dan perbaiki kebocoran vacuum',
        'Bersihkan throttle body',
        'Test kompresi mesin'
      ],
      createdAt: '2024-12-30T10:30:00Z',
      severity: 'HIGH'
    },
    {
      id: '2',
      vehicleBrand: 'Honda',
      vehicleModel: 'Jazz',
      vehicleYear: 2019,
      symptoms: 'Check engine light menyala, emisi gas buang tinggi',
      dtcCodes: ['P0420'],
      diagnosis: 'Efisiensi catalytic converter di bawah ambang batas. Sistem emisi tidak bekerja optimal.',
      recommendations: [
        'Ganti catalytic converter',
        'Periksa sensor O2 downstream',
        'Test emisi gas buang',
        'Perbaiki kebocoran exhaust jika ada'
      ],
      createdAt: '2024-12-28T14:15:00Z',
      severity: 'MEDIUM'
    },
    {
      id: '3',
      vehicleBrand: 'Suzuki',
      vehicleModel: 'Ertiga',
      vehicleYear: 2021,
      symptoms: 'Mesin tidak mau start, scanner tidak bisa komunikasi',
      dtcCodes: ['U0100'],
      diagnosis: 'Hilang komunikasi dengan ECM/PCM. Masalah pada sistem komunikasi CAN bus atau ECU rusak.',
      recommendations: [
        'Periksa power supply ECU',
        'Test CAN bus communication',
        'Periksa ground ECU',
        'Kemungkinan perlu ganti ECU'
      ],
      createdAt: '2024-12-25T09:45:00Z',
      severity: 'CRITICAL'
    }
  ];

  useEffect(() => {
    // Simulate loading from Supabase
    setTimeout(() => {
      setHistoryData(sampleHistoryData);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteHistory = (id: string) => {
    Alert.alert(
      'Hapus Riwayat',
      'Apakah Anda yakin ingin menghapus riwayat diagnosis ini?',
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setHistoryData(prev => prev.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const renderHistoryCard = ({ item }: { item: DiagnosisHistory }) => {
    const isExpanded = expandedCard === item.id;
    
    return (
      <TouchableOpacity
        style={styles.historyCard}
        onPress={() => setExpandedCard(isExpanded ? null : item.id)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleText}>
              {item.vehicleBrand} {item.vehicleModel} {item.vehicleYear}
            </Text>
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.headerActions}>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
              <Text style={styles.severityText}>{item.severity}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteHistory(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dtcCodesContainer}>
          {item.dtcCodes.map((code, index) => (
            <View key={index} style={styles.dtcCodeBadge}>
              <Text style={styles.dtcCodeText}>{code}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.symptomsText} numberOfLines={isExpanded ? undefined : 2}>
          {item.symptoms}
        </Text>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.diagnosisSection}>
              <Text style={styles.sectionTitle}>Hasil Diagnosis:</Text>
              <Text style={styles.diagnosisText}>{item.diagnosis}</Text>
            </View>

            <View style={styles.recommendationsSection}>
              <Text style={styles.sectionTitle}>Rekomendasi Perbaikan:</Text>
              {item.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>
                    {index + 1}. {recommendation}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.reportButton}>
                <Ionicons name="document-text" size={20} color="#3b82f6" />
                <Text style={styles.reportButtonText}>Generate PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share" size={20} color="#10b981" />
                <Text style={styles.shareButtonText}>Bagikan</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.expandIndicator}>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#64748b" 
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Memuat riwayat diagnosis...</Text>
      </View>
    );
  }

  if (historyData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={64} color="#cbd5e1" />
        <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
        <Text style={styles.emptyText}>
          Riwayat diagnosis Anda akan muncul di sini setelah melakukan diagnosis pertama
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Riwayat Diagnosis</Text>
        <Text style={styles.headerSubtitle}>
          {historyData.length} diagnosis tersimpan
        </Text>
      </View>

      <FlatList
        data={historyData}
        renderItem={renderHistoryCard}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  historyCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  severityText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },
  dtcCodesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  dtcCodeBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  dtcCodeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    fontFamily: 'monospace',
  },
  symptomsText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  diagnosisSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  diagnosisText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  recommendationsSection: {
    marginBottom: 16,
  },
  recommendationItem: {
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reportButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 4,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginLeft: 4,
  },
  expandIndicator: {
    alignItems: 'center',
    marginTop: 8,
  },
});