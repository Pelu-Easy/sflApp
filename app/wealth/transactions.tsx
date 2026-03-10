import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useNigeriaSignUp from '../bvn_input'; // Import your store

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  status: string;
  created_at: string;
  description: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const { userNigeriaData } = useNigeriaSignUp();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://inv-backend-1.onrender.com/api/account/v1/history', {
        headers: {
          'Authorization': `Bearer ${userNigeriaData.token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={[styles.iconContainer, { backgroundColor: item.type === 'credit' ? '#10B98120' : '#EF444420' }]}>
        <Ionicons 
          name={item.type === 'credit' ? "arrow-down-outline" : "arrow-up-outline"} 
          size={20} 
          color={item.type === 'credit' ? "#10B981" : "#EF4444"} 
        />
      </View>
      
      <View style={styles.details}>
        <Text style={styles.description}>{item.description || (item.type === 'credit' ? 'Wallet Funding' : 'Withdrawal')}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: item.type === 'credit' ? '#10B981' : '#EF4444' }]}>
          {item.type === 'credit' ? '+' : '-'} ₦{item.amount.toLocaleString()}
        </Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity History</Text>
        <TouchableOpacity onPress={fetchTransactions}>
          <Ionicons name="refresh" size={22} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Fetching transactions...</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={64} color="#334155" />
              <Text style={styles.emptyText}>No transactions yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  listContent: { padding: 20 },
  transactionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  iconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  details: { flex: 1 },
  description: { color: '#FFF', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  date: { color: '#64748B', fontSize: 12 },
  amountContainer: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  status: { color: '#94A3B8', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94A3B8', marginTop: 12 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#64748B', marginTop: 16, fontSize: 16 }
});