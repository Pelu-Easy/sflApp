import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useNigeriaSignUp from './bvn_input';
import Header from './header'; // Import your custom header

export default function LoginScreen() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://inv-backend-1.onrender.com/api/auth/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // SUCCESS: replace clears the login stack so user can't go "back" to login
        router.replace('/(tabs)'); 
      } else {
        Alert.alert("Access Denied", result.message || "Invalid email or password.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Unable to reach the server. Please check your internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const RequiredLabel = ({ text }: { text: string }) => (
    <Text style={styles.label}>{text} <Text style={styles.asterisk}>*</Text></Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.logoContainer}>
            {/* Using your branded Header here */}
            <Header />
            <Text style={styles.bankName}>SFL LTD</Text>
            <Text style={styles.tagline}>Customer Access Portal</Text>
          </View>

          <View style={styles.form}>
            <RequiredLabel text="Email Address" />
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#003366" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <RequiredLabel text="Password" />
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#003366" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} color="#666" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.signInBtn, isLoading && styles.disabledBtn]} 
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signInText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupRow}>
              <Text style={styles.noAccountText}>Dont have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/question')}>
                <Text style={styles.signUpLinkText}>Sign Up here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 25, flexGrow: 1, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  bankName: { fontSize: 22, fontWeight: '800', color: '#003366', marginTop: 10, letterSpacing: 1 },
  tagline: { fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' },
  form: { width: '100%' },
  label: { fontSize: 12, fontWeight: '700', color: '#1E293B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  asterisk: { color: '#EF4444' }, 
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 58,
    marginBottom: 20,
    backgroundColor: '#F8FAFC'
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#0F172A', fontWeight: '500' },
  signInBtn: {
    backgroundColor: '#003366',
    height: 58,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  disabledBtn: { backgroundColor: '#94A3B8' },
  signInText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  noAccountText: { color: '#64748B', fontSize: 14 },
  signUpLinkText: { color: '#003366', fontSize: 14, fontWeight: '700' },
});
