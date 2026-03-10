import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useNigeriaSignUp from '../bvn_input'; // To get token and balance

export default function BookInvestmentPage() {
  const router = useRouter();
  const { id, name, roi } = useLocalSearchParams();
  const { userNigeriaData } = useNigeriaSignUp();
  
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple calculation for preview
  const numericRoi = parseFloat(roi as string) || 15;
  const projectedReturn = amount ? (parseFloat(amount) * (1 + numericRoi / 100)).toLocaleString() : "0";

  const handleConfirmInvestment = async () => {
    const investmentAmount = parseFloat(amount);
    
    if (!investmentAmount || investmentAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://inv-backend-1.onrender.com/api/account/v1/invest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userNigeriaData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: id,
          amount: investmentAmount,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success! 🎉",
          `You have successfully invested ₦${investmentAmount.toLocaleString()} in ${name}.`,
          [{ text: "View Portfolio", onPress: () => router.replace('/(tabs)/invest') }]
        );
      } else {
        Alert.alert("Investment Failed", result.error || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invest in {name}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>How much do you want to invest?</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.currency}>₦</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#475569"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Expected ROI</Text>
            <Text style={styles.summaryValue}>{roi}%</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 10 }]}>
            <Text style={styles.summaryLabel}>Total Return (Capital + Profit)</Text>
            <Text style={styles.totalValue}>₦{projectedReturn}</Text>
          </View>
        </View>

        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={18} color="#94A3B8" />
          <Text style={styles.noteText}>
            Funds will be locked for the duration of the plan. Early liquidation may attract a fee.
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.confirmBtn, loading && { opacity: 0.7 }]} 
          onPress={handleConfirmInvestment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.confirmText}>Confirm Investment</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  content: { padding: 25 },
  label: { color: '#94A3B8', fontSize: 14, marginBottom: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  currency: { color: '#FFF', fontSize: 40, fontWeight: '800', marginRight: 10 },
  input: { flex: 1, color: '#FFF', fontSize: 40, fontWeight: '800' },
  summaryBox: { backgroundColor: '#1E293B', padding: 20, borderRadius: 20, marginBottom: 30, borderWidth: 1, borderColor: '#334155' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { color: '#94A3B8', fontSize: 13 },
  summaryValue: { color: '#10B981', fontWeight: '700' },
  totalValue: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  infoNote: { flexDirection: 'row', gap: 10, marginBottom: 40 },
  noteText: { color: '#64748B', fontSize: 12, flex: 1, lineHeight: 18 },
  confirmBtn: { backgroundColor: '#10B981', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  confirmText: { color: '#FFF', fontWeight: '700', fontSize: 16 }
});