import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, SafeAreaView, Dimensions 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProductDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // In a real app, you'd fetch this specific product by ID
  // For now, we use a mock detail object
  const product = {
    title: "SFL Fixed Income",
    roi: "15% per annum",
    duration: "12 Months",
    payout: "Quarterly",
    minAmount: "50,000",
    risk: "Low Risk",
    description: "Our Fixed Income Note is designed for conservative investors seeking steady returns. Funds are diversified across government bonds and high-yield corporate debt.",
    insured: "Protected by NDIC",
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan Details</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Ionicons name="share-outline" size={22} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* HERO SECTION */}
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="safe-square" size={32} color="#10B981" />
          </View>
          <Text style={styles.productName}>{product.title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.risk}</Text>
          </View>
        </View>

        {/* STATS GRID */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Expected ROI</Text>
            <Text style={styles.statValue}>{product.roi}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{product.duration}</Text>
          </View>
        </View>

        {/* INFO LIST */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About this Plan</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>

          <View style={styles.featureRow}>
            <Ionicons name="wallet-outline" size={20} color="#10B981" />
            <View style={styles.featureTextWrapper}>
              <Text style={styles.featureTitle}>Minimum Investment</Text>
              <Text style={styles.featureSub}>₦{product.minAmount}</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="calendar-outline" size={20} color="#10B981" />
            <View style={styles.featureTextWrapper}>
              <Text style={styles.featureTitle}>Payout Frequency</Text>
              <Text style={styles.featureSub}>{product.payout}</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
            <View style={styles.featureTextWrapper}>
              <Text style={styles.featureTitle}>Security</Text>
              <Text style={styles.featureSub}>{product.insured}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER ACTION */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.investBtn}
          onPress={() => router.push({
            pathname: '/wealth/book_investment' as any, // Added 'as any' here
            params: { id, name: product.title, roi: 15 }
            // Pass actual data
          })}
        >
          <Text style={styles.investBtnText}>Invest in this Plan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  shareBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scrollBody: { padding: 20, paddingBottom: 120 },
  heroCard: { alignItems: 'center', marginBottom: 30 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B98120', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  productName: { color: '#FFF', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  badge: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
  badgeText: { color: '#10B981', fontSize: 12, fontWeight: '700' },
  statsContainer: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statBox: { flex: 1, backgroundColor: '#1E293B', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#334155' },
  statLabel: { color: '#94A3B8', fontSize: 12, marginBottom: 5 },
  statValue: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  infoSection: { backgroundColor: '#1E293B', padding: 25, borderRadius: 30, borderWidth: 1, borderColor: '#334155' },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  descriptionText: { color: '#94A3B8', fontSize: 14, lineHeight: 22, marginBottom: 25 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15 },
  featureTextWrapper: { flex: 1 },
  featureTitle: { color: '#64748B', fontSize: 12 },
  featureSub: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: '#0F172A', borderTopWidth: 1, borderTopColor: '#1E293B' },
  investBtn: { backgroundColor: '#10B981', height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#10B981', shadowOpacity: 0.3, shadowRadius: 20 },
  investBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});