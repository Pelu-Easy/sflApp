import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InvestScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  const assets = [
    { id: 1, title: 'US Stocks', sub: 'Buy U.S companies.', icon: '🇺🇸', type: 'USD' },
    { id: 2, title: 'NG Stocks', sub: 'Buy local companies.', icon: '🇳🇬', type: 'Naira' },
    { id: 3, title: 'Treasury Bills', sub: 'Buy government bills.', icon: '📜', type: 'Naira' },
    { id: 4, title: 'Naira Savings', sub: 'Earn up to 16% per annum.', icon: '🔒', type: 'Naira', tag: 'New' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Assets</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* FILTER CHIPS */}
        <View style={styles.filterRow}>
          {['All', 'USD only', 'Naira only'].map((filter) => (
            <TouchableOpacity 
              key={filter} 
              onPress={() => setActiveFilter(filter)}
              style={[styles.chip, activeFilter === filter && styles.activeChip]}
            >
              <Text style={[styles.chipText, activeFilter === filter && styles.activeChipText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PROMO CARD */}
        <View style={styles.promoCard}>
          <View style={styles.promoTextContent}>
            <Text style={styles.promoTitle}>Personalised investing?</Text>
            <Text style={styles.promoSub}>Set up your account to work for you.</Text>
            <TouchableOpacity style={styles.getStarted}>
              <Text style={styles.getStartedText}>Get Started  ›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoImagePlaceholder}>
             <Ionicons name="rocket" size={60} color="#10B981" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>All Assets Offerings</Text>

        {/* ASSET GRID */}
        <View style={styles.grid}>
          {assets.map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridItem}>
              {item.tag && <View style={styles.newTag}><Text style={styles.newTagText}>{item.tag}</Text></View>}
              <Text style={styles.gridIcon}>{item.icon}</Text>
              <Text style={styles.gridTitle}>{item.title}</Text>
              <Text style={styles.gridSub}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', textAlign: 'center', marginVertical: 15 },
  scrollBody: { paddingHorizontal: 20 },
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#062010' },
  activeChip: { backgroundColor: '#E2E8F0' },
  chipText: { color: '#10B981', fontWeight: '600', fontSize: 13 },
  activeChipText: { color: '#000' },
  promoCard: { backgroundColor: '#043927', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  promoTextContent: { flex: 1 },
  promoTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  promoSub: { color: '#A7F3D0', fontSize: 13, marginVertical: 8, lineHeight: 18 },
  getStarted: { marginTop: 5 },
  getStartedText: { color: '#D1FAE5', fontWeight: '800', fontSize: 14 },
  promoImagePlaceholder: { marginLeft: 10 },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: '700', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: '#1C1C1E', borderRadius: 24, padding: 20, marginBottom: 15, height: 160 },
  gridIcon: { fontSize: 30, marginBottom: 15 },
  gridTitle: { color: '#FFF', fontWeight: '700', fontSize: 15, marginBottom: 4 },
  gridSub: { color: '#8E8E93', fontSize: 12, lineHeight: 16 },
  newTag: { position: 'absolute', top: 12, right: 12, backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  newTagText: { fontSize: 10, fontWeight: '800', color: '#000' }
});