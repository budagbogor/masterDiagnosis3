import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Ionicons name="medical" size={64} color="#3b82f6" />
          <Text style={styles.heroTitle}>Master Diagnosis BOA</Text>
          <Text style={styles.heroSubtitle}>
            Sistem Diagnosis Otomotif Berbasis AI untuk Kendaraan Indonesia
          </Text>
        </View>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Fitur Utama</Text>
        
        <View style={styles.featuresGrid}>
          <Link href="/diagnosis" asChild>
            <TouchableOpacity style={styles.featureCard}>
              <Ionicons name="car-sport" size={32} color="#10b981" />
              <Text style={styles.featureTitle}>Diagnosis AI</Text>
              <Text style={styles.featureDescription}>
                Diagnosis otomatis dengan teknologi AI
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/dtc-library" asChild>
            <TouchableOpacity style={styles.featureCard}>
              <Ionicons name="library" size={32} color="#f59e0b" />
              <Text style={styles.featureTitle}>Database DTC</Text>
              <Text style={styles.featureDescription}>
                2,061 kode DTC lengkap dengan solusi
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/history" asChild>
            <TouchableOpacity style={styles.featureCard}>
              <Ionicons name="time" size={32} color="#8b5cf6" />
              <Text style={styles.featureTitle}>Riwayat</Text>
              <Text style={styles.featureDescription}>
                Lihat riwayat diagnosis sebelumnya
              </Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="document-text" size={32} color="#ef4444" />
            <Text style={styles.featureTitle}>Laporan PDF</Text>
            <Text style={styles.featureDescription}>
              Generate laporan diagnosis profesional
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Statistik Database</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2,061</Text>
            <Text style={styles.statLabel}>Kode DTC</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>173</Text>
            <Text style={styles.statLabel}>Model Kendaraan</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>56</Text>
            <Text style={styles.statLabel}>Tipe Mesin</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Merek</Text>
          </View>
        </View>
      </View>

      {/* Quick Start */}
      <View style={styles.quickStartContainer}>
        <Text style={styles.sectionTitle}>Mulai Diagnosis</Text>
        <Text style={styles.quickStartText}>
          Pilih kendaraan Anda dan mulai diagnosis dengan teknologi AI terdepan
        </Text>
        <Link href="/diagnosis" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="play-circle" size={24} color="#fff" />
            <Text style={styles.primaryButtonText}>Mulai Diagnosis</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  hero: {
    backgroundColor: '#1e293b',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 80) / 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  quickStartContainer: {
    padding: 20,
    alignItems: 'center',
  },
  quickStartText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});