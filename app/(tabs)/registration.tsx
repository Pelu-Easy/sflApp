
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function IdentityValidationScreen() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    bvn: '',
    fullName: '',
    dob: new Date(),
    address: '',
  });

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dob: selectedDate });
    }
  };

  const handleVerify = async () => {
    if (formData.bvn.length !== 11) {
      Alert.alert("Validation Error", "BVN must be exactly 11 digits.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch('https://your-api-endpoint.com/verify-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY', // If required
        },
        body: JSON.stringify({
          bvn: formData.bvn,
          dob: formData.dob.toISOString().split('T')[0], // Sending YYYY-MM-DD
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormData({
          ...formData,
          fullName: result.data.fullName,
          address: result.data.address,
        });
        setIsVerified(true);
        Alert.alert("Identity Verified", `Records matched for ${result.data.fullName}`);
      } else {
        Alert.alert(
          "Verification Failed", 
          result.message || "The BVN and Date of Birth provided do not match official records."
        );
      }
    } catch (error) {
      Alert.alert("Network Error", "Unable to connect to the verification server. Please try again later.");
    } finally {
      setIsVerifying(false);
    }
  };

  const resetForm = () => {
    setFormData({ bvn: '', fullName: '', dob: new Date(), address: '' });
    setIsVerified(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Identity Verification</Text>
          <Text style={styles.subtitle}>Enter BVN and Date of Birth</Text>
        </View>

        

        <View style={styles.card}>
          <Text style={styles.label}>Bank Verification Number (BVN)</Text>
          <View style={[styles.inputWrapper, isVerified && styles.lockedWrapper]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={isVerified ? "#2E7D32" : "#666"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter 11-digit BVN"
              keyboardType="number-pad"
              maxLength={11}
              value={formData.bvn}
              onChangeText={(v) => setFormData({...formData, bvn: v.replace(/[^0-9]/g, '')})}
              editable={!isVerified}
            />
          </View>

          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity 
            style={[styles.inputWrapper, isVerified && styles.lockedWrapper]} 
            onPress={() => !isVerified && setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={20} color={isVerified ? "#2E7D32" : "#666"} style={styles.icon} />
            <View style={styles.input}>
                <Text style={{ color: isVerified ? '#2E7D32' : '#333', fontSize: 16 }}>
                    {formData.dob.toLocaleDateString()}
                </Text>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker 
              value={formData.dob} 
              mode="date" 
              display="default" 
              onChange={onDateChange} 
            />
          )}

          {!isVerified && (
            <TouchableOpacity 
              style={styles.verifyBtn} 
              onPress={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Verify Identity</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {isVerified && (
          <View style={[styles.card, styles.verifiedCard]}>
            <View style={styles.verifiedHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
              <Text style={styles.verifiedTitle}>Official Identity Confirmed</Text>
            </View>

            <Text style={styles.label}>Full Name (Official Record)</Text>
            <TextInput 
              style={[styles.input, styles.lockedInput]} 
              value={formData.fullName} 
              editable={false} 
            />

            <Text style={styles.label}>Registered Address</Text>
            <TextInput 
              style={[styles.input, styles.lockedInput, { height: 60 }]} 
              value={formData.address} 
              multiline 
              editable={false} 
            />

            <TouchableOpacity style={styles.resetBtn} onPress={resetForm}>
              <Text style={styles.resetBtnText}>New Verification Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  scrollContent: { padding: 20, paddingTop: 60 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  verifiedCard: { marginTop: 20, borderColor: '#2E7D32', borderTopWidth: 5 },
  verifiedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  verifiedTitle: { marginLeft: 10, fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 8, marginTop: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  lockedWrapper: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
  icon: { paddingHorizontal: 12 },
  input: { flex: 1, padding: 14, fontSize: 16, color: '#333', justifyContent: 'center' },
  lockedInput: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9', color: '#2E7D32', borderRadius: 10, borderWidth: 1, marginTop: 5, paddingHorizontal: 12 },
  verifyBtn: { backgroundColor: '#003366', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 25 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resetBtn: { marginTop: 20, alignItems: 'center' },
  resetBtnText: { color: '#D32F2F', fontWeight: 'bold' }
});
