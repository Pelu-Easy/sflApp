import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import your global Zustand store - Ensure the path is correct
import useUserSignUp from "./userSignUp"; 

export default function SetPassword() {
  const router = useRouter();

  // Access the store correctly
  const { userData, setUserData } = useUserSignUp();
  const { fname, lname, email, phone_no, selectedCountry } = userData;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFinishRegistration = async () => {
    // 1. Validation
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Save all data including the new password to Zustand
      // Ensure your userSignUp.ts setUserData function accepts these 6 arguments
      setUserData(
        fname, 
        lname, 
        email, 
        phone_no.toString(), // Ensuring phone is string if store expects it
        selectedCountry, 
        password
      );

      Alert.alert("Account Ready", "Your profile has been created!");
      
      // 3. Navigate to the main app dashboard
      router.replace('/(tabs)'); 

    } catch (error) {
      Alert.alert("Error", "Could not complete registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#003366" />
          </TouchableOpacity>

          <Text style={styles.title}>Secure Your Account</Text>
          <Text style={styles.subtitle}>
            Create a password to access your sflApp account.
          </Text>

          {/* Password Input */}
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 characters"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons 
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Re-type password"
              secureTextEntry={!isPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity 
            style={[styles.primaryBtn, (!password || !confirmPassword) && styles.disabledBtn]} 
            onPress={handleFinishRegistration}
            disabled={isLoading || !password || !confirmPassword}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Complete Registration</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backBtn: { marginBottom: 20 },
  content: { paddingHorizontal: 30, paddingTop: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#003366', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 35 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F3F4F6', 
    borderRadius: 12, 
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  input: { flex: 1, height: 55, fontSize: 16, color: '#000' },
  primaryBtn: { 
    backgroundColor: '#003366', 
    height: 55, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20 
  },
  disabledBtn: { backgroundColor: '#BCCCDC' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});