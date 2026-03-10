import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useNigeriaSignUp from '../bvn_input'; // Import your store to get the token

export default function FundingPage() {
  const router = useRouter();
  const { userNigeriaData } = useNigeriaSignUp();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('bank');

  const handleFunding = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter an amount greater than zero.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://inv-backend-1.onrender.com/api/account/v1/deposit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userNigeriaData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          payment_method: selectedMethod,
        }),
      });

      const result = await response.json();
      console.log("Funding API Result:", result);

      if (response.ok) {
        // Success logic: Typically shows virtual account details or a payment link
        Alert.alert(
          "Deposit Initiated", 
          `Reference: ${result.data?.reference || 'Pending'}\nFollow the instructions to complete your payment.`
        );
      } else {
        Alert.alert("Funding Failed", result.error || "Could not process deposit at this time.");
      }
    } catch (error) {
      console.error("Funding Error:", error);
      Alert.alert("Connection Error", "Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const methods = [
    { id: 'bank', title: 'Bank Transfer', sub: 'Instant via virtual account', icon: 'bank' },
    { id: 'card', title: 'Debit Card', sub: 'Visa, Mastercard, Verve', icon: 'credit-card' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Funding</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Enter Amount</Text>
        <View style={styles.amountWrapper}>
          <Text style={styles.currency}>₦</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#475569"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        {methods.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[
              styles.methodCard, 
              selectedMethod === item.id && styles.activeMethodCard
            ]}
            onPress={() => setSelectedMethod(item.id)}
          >
            <View style={styles.methodIcon}>
              <MaterialCommunityIcons name={item.icon as any} size={24} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitle}>{item.title}</Text>
              <Text style={styles.methodSub}>{item.sub}</Text>
            </View>
            <Ionicons 
              name={selectedMethod === item.id ? "radio-button-on" : "chevron-forward"} 
              size={20} 
              color={selectedMethod === item.id ? "#10B981" : "#475569"} 
            />
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.continueBtn, loading && { opacity: 0.7 }]} 
          onPress={handleFunding}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.continueText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  content: { padding: 20 },
  label: { color: '#94A3B8', fontSize: 14, marginBottom: 10 },
  amountWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 10, marginBottom: 30 },
  currency: { color: '#FFF', fontSize: 32, fontWeight: '700', marginRight: 10 },
  input: { flex: 1, color: '#FFF', fontSize: 32, fontWeight: '700' },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 15 },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  activeMethodCard: { borderColor: '#10B981', backgroundColor: '#1E293B' },
  methodIcon: { width: 48, height: 48, backgroundColor: '#064E3B', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  methodTitle: { color: '#FFF', fontWeight: '600', fontSize: 15 },
  methodSub: { color: '#64748B', fontSize: 12 },
  continueBtn: { backgroundColor: '#10B981', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  continueText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});