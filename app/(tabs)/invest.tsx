import React from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Dimensions 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85; // Cards will take up 85% of screen width

// DUMMY DATA - Scalable structure
const DUMMY_PRODUCTS = [
  {
    id: 'p1',
    title: 'SFL Fixed Income',
    roi: '12% - 15%',
    duration: '6-12 Months',
    risk: 'Low',
    minAmount: '50,000',
    icon: 'safe-square-outline',
    theme: '#10B981' // Green theme
  },
  {
    id: 'p2',
    title: 'Real Estate Portfolio',
    roi: '20% - 25%',
    duration: '24 Months',
    risk: 'Medium',
    minAmount: '250,000',
    icon: 'home-outline',
    theme: '#6366F1' // Indigo theme
  },
  {
    id: 'p3',
    title: 'Agriculture Fund',
    roi: '30%+',
    duration: '9 Months',
    risk: 'High',
    minAmount: '100,000',
    icon: 'leaf-outline',
    theme: '#F59E0B' // Amber theme
  },
];

export default function InvestTab() {
  const router = useRouter();

  const renderProductCard = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/wealth/product_detail?id=${item.id}` as any)}
    >
      <View style={styles.cardTop}>
        <View style={[styles.iconBox, { backgroundColor: `${item.theme}20` }]}>
          <MaterialCommunityIcons name={item.icon} size={28} color={item.theme} />
        </View>
        <View style={[styles.riskBadge, { borderColor: item.theme }]}>
          <Text style={[styles.riskText, { color: item.theme }]}>{item.risk} Risk</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{item.title}</Text>
      
      <View style={styles.statGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Expected ROI</Text>
          <Text style={styles.statValue}>{item.roi} <Text style={styles.pAm}>p.a</Text></Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{item.duration}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.minLabel}>Min. Investment: <Text style={styles.minVal}>₦{item.minAmount}</Text></Text>
        <Ionicons name="arrow-forward-circle" size={32} color={item.theme} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Investment Plans</Text>
        <Text style={styles.headerSub}>Explore curated plans to grow your wealth</Text>
      </View>

      <View>
        <FlatList
          data={DUMMY_PRODUCTS}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20} // Snap effect for smooth scrolling
          decelerationRate="fast"
          contentContainerStyle={styles.listPadding}
        />
      </View>

      {/* ADDITIONAL SECTIONS CAN GO HERE (e.g., My Portfolio) */}
      <View style={styles.portfolioTeaser}>
          <Text style={styles.teaserTitle}>Why invest with SFL?</Text>
          <View style={styles.benefitRow}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Fully insured & regulated assets</Text>
          </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 25 },
  headerTitle: { color: '#FFF', fontSize: 26, fontWeight: '800' },
  headerSub: { color: '#94A3B8', fontSize: 14, marginTop: 5 },
  listPadding: { paddingLeft: 25, paddingRight: 25, paddingVertical: 10 },
  card: { 
    backgroundColor: '#1E293B', 
    width: CARD_WIDTH, 
    borderRadius: 30, 
    padding: 25, 
    marginRight: 20,
    borderWidth: 1, 
    borderColor: '#334155',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  iconBox: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  riskBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  riskText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  cardTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', marginBottom: 25 },
  statGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statItem: { flex: 1 },
  statLabel: { color: '#64748B', fontSize: 12, marginBottom: 5 },
  statValue: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  pAm: { fontSize: 10, color: '#94A3B8' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 15 },
  minLabel: { color: '#94A3B8', fontSize: 13 },
  minVal: { color: '#FFF', fontWeight: '600' },
  portfolioTeaser: { margin: 25, padding: 20, backgroundColor: '#1E293B60', borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#334155' },
  teaserTitle: { color: '#FFF', fontWeight: '700', marginBottom: 10 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  benefitText: { color: '#94A3B8', fontSize: 13 }
});