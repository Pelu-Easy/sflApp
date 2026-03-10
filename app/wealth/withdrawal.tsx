import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useNigeriaSignUp from '../bvn_input'; // Import your store

export default function WithdrawalPage() {
  const router = useRouter();
  const { userNigeriaData } = useNigeriaSignUp();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  // Note: In a real app, you'd fetch this from an API like /api/v1/banks
  const handleBankSelect = () => {
    Alert.alert("Select Bank", "Bank list integration coming soon. For now, your primary linked bank will be used.");
    // Mock selection
    setSelectedBank({ name: "Access Bank", account: "0123456789" } as any);
  };

  const handleWithdrawal = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter how much you want to withdraw.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://inv-backend-1.onrender.com/api/account/v1/withdraw', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userNigeriaData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          bank_code: "044", // Example code for Access Bank
          account_number: "0123456789",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Withdrawal Successful",
          "Your request has been received and is being processed.",
          [{ text: "OK", onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        Alert.alert("Withdrawal Failed", result.error || "Insufficient funds or bank error.");
      }
    } catch (error) {
      console.error("Withdrawal Error:", error);
      Alert.alert("Error", "Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw Funds</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>₦0.00</Text>
        </View>

        <Text style={styles.label}>Amount to Withdraw</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="₦0.00"
          placeholderTextColor="#475569"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity style={styles.bankSelect} onPress={handleBankSelect}>
          <Ionicons name="business" size={20} color="#10B981" />
          <Text style={styles.bankText}>
            {selectedBank ? `${(selectedBank as any).name} - ${(selectedBank as any).account}` : "Select Destination Bank"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.withdrawBtn, (!amount || loading) && { opacity: 0.5 }]} 
          onPress={handleWithdrawal}
          disabled={loading || !amount}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.withdrawText}>Confirm Withdrawal</Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.footerNote}>
          Note: Withdrawals may take up to 24 hours to reflect in your bank account.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  content: { padding: 20 },
  balanceInfo: { backgroundColor: '#1E293B', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 30, borderWidth: 1, borderColor: '#334155' },
  balanceLabel: { color: '#94A3B8', fontSize: 14, marginBottom: 5 },
  balanceValue: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  label: { color: '#94A3B8', fontSize: 14, marginBottom: 12 },
  amountInput: { backgroundColor: '#1E293B', height: 60, borderRadius: 16, paddingHorizontal: 20, color: '#FFF', fontSize: 18, fontWeight: '600', marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  bankSelect: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', height: 60, borderRadius: 16, paddingHorizontal: 20, gap: 12, marginBottom: 40, borderStyle: 'dashed', borderWidth: 1, borderColor: '#475569' },
  bankText: { flex: 1, color: '#FFF', fontSize: 15 },
  withdrawBtn: { backgroundColor: '#EF4444', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  withdrawText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  footerNote: { color: '#64748B', fontSize: 12, textAlign: 'center', marginTop: 20, lineHeight: 18 }
});