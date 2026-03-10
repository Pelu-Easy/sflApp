import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, RefreshControl 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useNigeriaSignUp from '../bvn_input';
//import FundingPage from '../wealth/funding'; 

export default function Dashboard() {
  const router = useRouter();
  const { userNigeriaData, fetchUserProfile } = useNigeriaSignUp();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 1. AUTO-FETCH LOGIC
  // This runs when the dashboard opens and whenever the token changes
  useEffect(() => {
    if (userNigeriaData.token) {
      fetchUserProfile(userNigeriaData.token);
    }
  }, [userNigeriaData.token, fetchUserProfile]);

  // 2. REFRESH LOGIC
  const onRefresh = async () => {
    setRefreshing(true);
    if (userNigeriaData.token) {
      await fetchUserProfile(userNigeriaData.token);
    }
    setRefreshing(false);
  };

  // User Branding Logic
  const firstName = userNigeriaData.firstname || "SFL";
  const lastInitial = userNigeriaData.lastname ? userNigeriaData.lastname[0] : "";
  const displayName = `${firstName} ${lastInitial}${lastInitial ? '.' : 'User'}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfo} 
          onPress={() => router.push('/profile' as any)}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstName[0]}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color="#64748B" style={{ marginLeft: 5, marginTop: 15 }} />
        </TouchableOpacity>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color="#FFF" />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollBody}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
        }
      >
        
        {/* TOTAL WEALTH CARD */}
        <View style={styles.wealthCard}>
          <View style={styles.wealthHeader}>
            <Text style={styles.wealthLabel}>Total Wealth</Text>
            <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
              <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.balanceText}>
            {isBalanceVisible ? "₦0" : "****"}
            <Text style={styles.decimalText}>{isBalanceVisible ? ".00" : ""}</Text>
          </Text>
          
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.addMoneyBtn}
              onPress={() => router.push('/wealth/funding' as any)}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.btnText}>Deposit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.withdrawBtn}
              onPress={() => router.push('/wealth/withdrawal' as any)}
            >
              <Ionicons name="arrow-up" size={20} color="#FFF" />
              <Text style={styles.btnText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* QUICK STATS / REFERRALS */}
        <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statBox}>
                <View style={[styles.statIcon, {backgroundColor: '#451A03'}]}>
                    <Ionicons name="people" size={18} color="#D97706" />
                </View>
                <Text style={styles.statLabel}>Referrals</Text>
                <Text style={styles.statValue}>₦0.00</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statBox}>
                <View style={[styles.statIcon, {backgroundColor: '#064E3B'}]}>
                    <Ionicons name="trending-up" size={18} color="#10B981" />
                </View>
                <Text style={styles.statLabel}>Total ROI</Text>
                <Text style={styles.statValue}>+0%</Text>
            </TouchableOpacity>
        </View>

        {/* PORTFOLIO SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Investment Plan</Text>
          <TouchableOpacity onPress={() => router.push('/wealth/transactions' as any)}>
            <Text style={styles.sectionAction}>See All</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.assetCard}>
          <View style={[styles.assetIcon, { backgroundColor: '#10B981' }]}>
            <MaterialCommunityIcons name="briefcase-variant" size={22} color="#FFF" />
          </View>
          <View style={styles.assetText}>
            <Text style={styles.assetTitle}>Products Plan</Text>
            <Text style={styles.assetSub}>You have no active investments</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#334155" />
        </TouchableOpacity>

        {/* CASH / WALLETS */}
        <Text style={[styles.sectionTitle, { marginTop: 25, marginBottom: 15 }]}>Cash Wallets</Text>
        
        <View style={styles.assetCard}>
          <View style={[styles.assetIcon, { backgroundColor: '#6366F1' }]}>
            <FontAwesome5 name="wallet" size={18} color="#FFF" />
          </View>
          <View style={styles.assetText}>
            <Text style={styles.assetTitle}>USD Savings</Text>
            <Text style={styles.assetSub}>Safe-lock wallet</Text>
          </View>
          <Text style={styles.assetValue}>$0.00</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#334155' },
  avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  greeting: { color: '#64748B', fontSize: 12, fontWeight: '500' },
  userName: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  headerIcons: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 40, height: 40, backgroundColor: '#1E293B', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  dot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 2, borderColor: '#0F172A' },
  scrollBody: { paddingHorizontal: 20, paddingBottom: 40 },
  wealthCard: { backgroundColor: '#1E293B', borderRadius: 28, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  wealthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  wealthLabel: { color: '#94A3B8', fontSize: 14, fontWeight: '500' },
  balanceText: { color: '#FFF', fontSize: 38, fontWeight: '800', letterSpacing: -1 },
  decimalText: { color: '#475569', fontSize: 22 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 25 },
  addMoneyBtn: { flex: 1, backgroundColor: '#059669', height: 54, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  withdrawBtn: { flex: 1, backgroundColor: '#334155', height: 54, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statBox: { flex: 1, backgroundColor: '#1E293B', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  statIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statLabel: { color: '#64748B', fontSize: 12, marginBottom: 4 },
  statValue: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  sectionAction: { color: '#10B981', fontWeight: '700', fontSize: 13 },
  assetCard: { backgroundColor: '#1E293B', borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  assetIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  assetText: { flex: 1 },
  assetTitle: { color: '#FFF', fontWeight: '600', fontSize: 15, marginBottom: 2 },
  assetSub: { color: '#64748B', fontSize: 12 },
  assetValue: { color: '#FFF', fontWeight: '700', fontSize: 16 }
});