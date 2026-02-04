import { 
  View, TextInput, Text, TouchableOpacity, Platform, 
  StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView 
} from 'react-native';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import Header from './header';

const BVN_LENGTH = 11;

const BVNInput = ({ onComplete }: { onComplete: (bvn: string) => void }) => {
  const [digits, setDigits] = useState<string[]>(Array(BVN_LENGTH).fill(""));
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < BVN_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    const fullBvn = newDigits.join("");
    if (fullBvn.length === BVN_LENGTH) onComplete(fullBvn);
  };

  const handleBackspace = (index: number) => {
    if (digits[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={localStyles.bvnGrid}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => { inputsRef.current[index] = el; }}
          style={[localStyles.bvnBox, digit !== "" && localStyles.bvnBoxActive]}
          value={digit}
          onChangeText={(v) => handleChange(v, index)}
          onKeyPress={({ nativeEvent }) => nativeEvent.key === "Backspace" && handleBackspace(index)}
          keyboardType="number-pad"
          maxLength={1}
          placeholder="-"
          placeholderTextColor="#CBD5E1"
        />
      ))}
    </View>
  );
};

export default function BvnValidation() {
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 20);
  
  const [date, setDate] = useState(defaultDate);
  const [show, setShow] = useState(false);
  const [bvnValue, setBvnValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (bvnValue.length !== 11) {
      Alert.alert("Invalid BVN", "Please enter your 11-digit BVN.");
      return;
    }
    
    setLoading(true);

    try {
      const formattedDate = date.toISOString().split('T')[0];
      const payload = {
        bvn: bvnValue,
        dob: formattedDate,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); 

      const response = await fetch('https://inv-backend-1.onrender.com/api/auth/v1/validate-bvn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Invalid server response format");
      }

      if (response.ok && (result.success || result.status === "success")) {
        Alert.alert("Success", "Identity verified.");
        // We navigate to bvn_validation directly to complete the profile
        router.push({ 
          pathname: '/otp_screen' as any, 
          params: { 
            bvn: bvnValue,
            firstname: result.data?.firstName || result.data?.firstname || "",
            lastname: result.data?.lastName || result.data?.lastname || "",
            dob: formattedDate,
            phone: result.data?.phoneNumber || result.data?.phone || "",
            email: result.data?.email || "",
            isNonNigerian: 'false'
          } 
        }); 
      } else {
        Alert.alert("Notice", result.message || "Could not verify BVN.");
      }
      console.log(result.email);
      console.log(result);
    } catch (error: any) {
      Alert.alert("Error", error.name === 'AbortError' ? "Timeout. Try again." : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={localStyles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <Header />
          <ScrollView contentContainerStyle={localStyles.scrollContainer}>
            <View style={localStyles.textSection}>
              <Text style={localStyles.mainTitle}>Verify Identity</Text>
              <Text style={localStyles.subTitle}>Select your Date of Birth carefully.</Text>
            </View>

            <View style={localStyles.card}>
              <Text style={localStyles.inputLabel}>11-DIGIT BVN</Text>
              <BVNInput onComplete={(val) => setBvnValue(val)} />

              <Text style={[localStyles.inputLabel, { marginTop: 30 }]}>DATE OF BIRTH</Text>
              <TouchableOpacity style={localStyles.dateButton} onPress={() => setShow(true)}>
                <View>
                   <Text style={localStyles.dateText}>
                     {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                   </Text>
                </View>
                <Ionicons name="calendar-outline" size={22} color="#003366" />
              </TouchableOpacity>
            </View>

            {show && (
              <View style={Platform.OS === 'ios' ? localStyles.iosPickerContainer : null}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner" 
                  maximumDate={new Date()} 
                  onChange={(e, d) => {
                    if (Platform.OS === 'android') setShow(false); 
                    if (d) setDate(d);
                  }}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity onPress={() => setShow(false)} style={localStyles.doneBtn}>
                    <Text style={localStyles.doneBtnText}>Confirm Date</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity 
              style={[localStyles.primaryBtn, (bvnValue.length !== 11 || loading) && localStyles.disabledBtn]} 
              onPress={handleVerify}
              disabled={loading || bvnValue.length !== 11}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={localStyles.btnText}>Verify & Continue</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={localStyles.exitBtn}>
              <Text style={localStyles.exitText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  textSection: { marginVertical: 30, alignItems: 'center' },
  mainTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subTitle: { fontSize: 15, color: '#64748B', marginTop: 8, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, elevation: 3 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1 },
  bvnGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  bvnBox: { width: '8%', borderBottomWidth: 2, borderBottomColor: '#E2E8F0', textAlign: 'center', fontSize: 18, fontWeight: '700' },
  bvnBoxActive: { borderBottomColor: '#003366' },
  dateButton: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingVertical: 12, marginTop: 10 },
  dateText: { fontSize: 16, color: '#1E293B', fontWeight: '600' },
  primaryBtn: { backgroundColor: '#003366', height: 58, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  exitBtn: { marginTop: 25, alignSelf: 'center' },
  exitText: { color: '#64748B', fontWeight: '600' },
  iosPickerContainer: { backgroundColor: '#E2E8F0', borderRadius: 15, marginTop: 10, padding: 10 },
  doneBtn: { backgroundColor: '#003366', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 5 },
  doneBtnText: { color: 'white', fontWeight: 'bold' }
});
