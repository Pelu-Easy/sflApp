import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import useNigeriaSignUp from './bvn_input'; // Import the Zustand store

export default function OtpVerification() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Hook into the store using the correct setter
  const setUserData = useNigeriaSignUp((state) => state.setUserData); 

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanText.slice(-1);
    setOtp(newOtp);

    if (cleanText.length !== 0 && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      Alert.alert("Invalid Code", "Please enter the full 6-digit code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://inv-backend-1.onrender.com/api/auth/v1/validate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          otp: otpCode,
          bvn: params.bvn 
        }),
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Server error. Please try again later.");
      }

      if (response.ok && result.success === true) {
        const userData = result.existing; 

        if (!userData) {
          Alert.alert("Error", "User data not found in response.");
          return;
        }

        // --- UPDATED: Update Global State via Zustand with verified data ---
        setUserData({
          firstname: userData.first_name || "",
          lastname: userData.last_name || "",
          bvn: userData.bvn || (params.bvn as string),
          dob: userData.date_of_birth || "",
          email: userData.email || "",
          phone: (params.phone as string) || "",
          country: "Nigeria" 
        });

        Alert.alert("Identity Verified", "Your details have been confirmed.");
        
        // Navigate to validation screen
        router.push({
          pathname: '/bvn_validation' as any, 
          params: { 
            bvn: userData.bvn,
            firstname: userData.first_name,
            lastname: userData.last_name,
            dob: userData.date_of_birth,
            email: userData.email,
            address: userData.residential_address,
            phone: params.phone,
            isNonNigerian: 'false'
          }
        });
      } else {
        Alert.alert("Verification Failed", result.message || "Invalid OTP.");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Connection failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    
    setIsResending(true);
    try {
      const response = await fetch('https://inv-backend-1.onrender.com/api/auth/v1/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            identifier: params.isNonNigerian === 'true' ? params.email : params.bvn 
        }),
      });

      if (response.ok) {
        setTimer(60); 
        Alert.alert("Sent", "A new code has been sent to your device.");
      } else {
        const res = await response.json();
        Alert.alert("Error", res.message || "Failed to resend.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to your phone ending in {' '}
            <Text style={{fontWeight: 'bold', color: '#003366'}}>
              {params.phone ? params.phone.toString().slice(-4) : '****'}
            </Text>
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => { inputs.current[index] = el; }}
                style={[styles.otpInput, otp[index] !== '' && {borderColor: '#003366'}]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.verifyBtn, (otp.join('').length < 6 || isSubmitting) && styles.disabledBtn]}
            onPress={handleVerifyOtp}
            disabled={isSubmitting || otp.join('').length < 6}
          >
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify & Proceed</Text>}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didnt receive a code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={timer > 0 || isResending}>
              <Text style={[styles.resendLink, timer > 0 && { color: '#94A3B8' }]}>
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backBtn: { padding: 20 },
  content: { paddingHorizontal: 30, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: '800', color: '#003366', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#64748B', lineHeight: 22, marginBottom: 40 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  otpInput: {
    width: '14%',
    height: 55,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    backgroundColor: '#F8F9FA'
  },
  verifyBtn: { backgroundColor: '#003366', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  resendText: { color: '#64748B', fontSize: 14 },
  resendLink: { color: '#003366', fontWeight: '800', fontSize: 14 }
});