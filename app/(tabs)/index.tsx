import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import useNigeriaSignUp from '../bvn_input'; // Import the store to get the user's name

export default function Dashboard() {
  // Pull data from sflApp store
  const { userNigeriaData } = useNigeriaSignUp();
  
  // Format name: "FirstName I." (e.g., "Adigun I.")
  const firstName = userNigeriaData.firstname || "SFL";
  const lastInitial = userNigeriaData.lastname ? userNigeriaData.lastname[0] : "Customer";
  const displayName = `${firstName} ${lastInitial}.`;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={16} color="#FFF" />
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Ionicons name="chevron-forward" size={14} color="#64748B" />
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity><Ionicons name="search" size={22} color="#FFF" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="notifications" size={22} color="#FFF" /></TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        {/* TOTAL WEALTH CARD */}
        <View style={styles.wealthCard}>
          <Text style={styles.wealthLabel}>
            Your total wealth in <Text style={styles.currencyHighlight}>NGN ↕</Text>
          </Text>
          <Text style={styles.balanceText}>₦0<Text style={styles.decimalText}>.00</Text></Text>
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.addMoneyBtn}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.btnText}>Deposit money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.withdrawBtn}>
              <Ionicons name="remove" size={20} color="#FFF" />
              <Text style={styles.btnText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* REFERRALS SECTION */}
        <TouchableOpacity style={styles.referralBar}>
          <View style={styles.referralLeft}>
            <View style={styles.referralIcon}>
              <Ionicons name="people" size={18} color="#D97706" />
            </View>
            <Text style={styles.referralText}>Referrals</Text>
          </View>
          <Text style={styles.referralAmount}>₦0.00</Text>
        </TouchableOpacity>

        {/* PROMO BANNER */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Ready to take an action?</Text>
            <Text style={styles.promoSub}>Deposit any amount today, your goals start here</Text>
          </View>
          <FontAwesome5 name="coins" size={35} color="#FBBF24" />
        </View>

        {/* PORTFOLIO SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <TouchableOpacity>
            <Text style={styles.sectionAction}>+ New Investment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assetCard}>
          <View style={[styles.assetIcon, { backgroundColor: '#10B981' }]}>
            <MaterialCommunityIcons name="briefcase-variant" size={22} color="#FFF" />
          </View>
          <View style={styles.assetText}>
            <Text style={styles.assetTitle}>No assets have been added yet</Text>
            <Text style={styles.assetSub}>Tap here to add assets to your portfolio</Text>
          </View>
        </View>

        {/* CASH SECTION */}
        <Text style={[styles.sectionTitle, { marginTop: 25, marginBottom: 15 }]}>Cash</Text>
        <View style={styles.assetCard}>
          <View style={[styles.assetIcon, { backgroundColor: '#6366F1' }]}>
            <Ionicons name="wallet" size={22} color="#FFF" />
          </View>
          <View style={styles.assetText}>
            <Text style={styles.assetTitle}>USD Wallet</Text>
          </View>
          <Text style={styles.assetValue}>$0.00</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  userName: { color: '#FFF', fontWeight: '700', fontSize: 16, marginRight: 5 },
  headerIcons: { flexDirection: 'row', gap: 15 },
  scrollBody: { paddingHorizontal: 20, paddingBottom: 40 },
  wealthCard: { backgroundColor: '#1E1E1E', borderRadius: 24, padding: 20, marginBottom: 15 },
  wealthLabel: { color: '#94A3B8', fontSize: 13, marginBottom: 8 },
  currencyHighlight: { color: '#10B981', fontWeight: '800' },
  balanceText: { color: '#FFF', fontSize: 36, fontWeight: '800' },
  decimalText: { color: '#475569', fontSize: 20 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  addMoneyBtn: { flex: 1, backgroundColor: '#059669', height: 48, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  withdrawBtn: { flex: 1, backgroundColor: '#334155', height: 48, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  referralBar: { backgroundColor: '#1E1E1E', borderRadius: 16, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  referralLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  referralIcon: { backgroundColor: '#451A03', padding: 6, borderRadius: 8 },
  referralText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  referralAmount: { color: '#FFF', fontWeight: '700' },
  promoBanner: { backgroundColor: '#312E81', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 15 },
  promoContent: { flex: 1 },
  promoTitle: { color: '#FFF', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  promoSub: { color: '#C7D2FE', fontSize: 12, lineHeight: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 15 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  sectionAction: { color: '#10B981', fontWeight: '700', fontSize: 13 },
  assetCard: { backgroundColor: '#1E1E1E', borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center' },
  assetIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  assetText: { flex: 1 },
  assetTitle: { color: '#FFF', fontWeight: '600', fontSize: 14, marginBottom: 2 },
  assetSub: { color: '#64748B', fontSize: 12 },
  assetValue: { color: '#FFF', fontWeight: '700' }
});



// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';

// export default function Dashboard() {
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.content}>
//         <View style={styles.header}>
//           <View>
//             <Text style={styles.welcomeText}>Welcome back,</Text>
//             <Text style={styles.userName}>SFL Customer</Text>
//           </View>
//           <TouchableOpacity style={styles.notificationBtn}>
//             <Ionicons name="notifications-outline" size={24} color="#003366" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.balanceCard}>
//           <Text style={styles.cardLabel}>Available Credit</Text>
//           <Text style={styles.balanceAmount}>₦ 0.00</Text>
//           <TouchableOpacity style={styles.actionBtn}>
//             <Text style={styles.actionText}>Apply for Loan</Text>
//           </TouchableOpacity>
//         </View>

//         <Text style={styles.sectionTitle}>Quick Actions</Text>
//         <View style={styles.grid}>
//           <TouchableOpacity style={styles.gridItem}>
//             <Ionicons name="card-outline" size={28} color="#003366" />
//             <Text style={styles.gridText}>Payments</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.gridItem}>
//             <Ionicons name="document-text-outline" size={28} color="#003366" />
//             <Text style={styles.gridText}>History</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8FAFC' },
//   content: { padding: 20 },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
//   welcomeText: { fontSize: 14, color: '#64748B' },
//   userName: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
//   notificationBtn: { backgroundColor: '#FFF', padding: 10, borderRadius: 12, elevation: 2 },
//   balanceCard: { backgroundColor: '#003366', borderRadius: 24, padding: 25, marginBottom: 30 },
//   cardLabel: { color: '#CBD5E1', fontSize: 14 },
//   balanceAmount: { color: '#FFF', fontSize: 32, fontWeight: '900', marginVertical: 10 },
//   actionBtn: { backgroundColor: '#FFF', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 10 },
//   actionText: { color: '#003366', fontWeight: '700' },
//   sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 15 },
//   grid: { flexDirection: 'row', gap: 15 },
//   gridItem: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 20, alignItems: 'center', elevation: 1 },
//   gridText: { marginTop: 10, fontWeight: '600', color: '#475569' }
// });
