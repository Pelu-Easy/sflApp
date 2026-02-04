import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import Header from './header';
// SYNC: Ensure this matches your bvn_input.tsx store name
import useNigeriaSignUp from "./bvn_input"; 

export default function NonNigerian() {
  // SYNC: Updated to use the NigeriaSignUp store we verified earlier
  const setUserData = useNigeriaSignUp((state) => state.setUserData);

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState('');

  const countries = [
    { label: 'Australia', value: 'AU' },
    { label: 'Brazil', value: 'BR' },
    { label: 'Canada', value: 'CA' },
    { label: 'China', value: 'CN' },
    { label: 'Egypt', value: 'EG' },
    { label: 'France', value: 'FR' },
    { label: 'Germany', value: 'DE' },
    { label: 'Ghana', value: 'GH' },
    { label: 'India', value: 'IN' },
    { label: 'Italy', value: 'IT' },
    { label: 'Japan', value: 'JP' },
    { label: 'Kenya', value: 'KE' },
    { label: 'Mexico', value: 'MX' },
    { label: 'Netherlands', value: 'NL' },
    { label: 'South Africa', value: 'ZA' },
    { label: 'Spain', value: 'ES' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'United States', value: 'US' },
  ];

  const handleSignUp = () => {
    if (!fname || !lname || !email || !selectedCountry) {
      Alert.alert("Required Fields", "Please fill in all fields marked with * to continue.");
      return;
    }

    // 1. Save to global store (using the object structure from our updated store)
    setUserData({
      firstname: fname,
      lastname: lname,
      email: email,
      country: selectedCountry,
    });

    // 2. Routing: lowercase params for perfect handshake with bvn_validation.tsx
    router.push({
      pathname: '/bvn_validation' as any,
      params: { 
        isNonNigerian: 'true',
        firstname: fname,
        lastname: lname,
        email: email,
        country: selectedCountry
      }
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          <Header />
          
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerSection}>
                <Text style={styles.titleText}>User Details</Text>
                <Text style={styles.subtitleText}>Provide the official information for non-resident clients.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>FIRST NAME <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={fname}
                placeholder='e.g. Israel'
                placeholderTextColor="#CBD5E1"
                onChangeText={setFname}
              />

              <Text style={styles.inputLabel}>LAST NAME <Text style={styles.asterisk}>*</Text></Text>
              <TextInput 
                style={styles.input}
                value={lname}
                placeholder='e.g. Adigun'
                placeholderTextColor="#CBD5E1"
                onChangeText={setLname}
              />

              <Text style={styles.inputLabel}>EMAIL ADDRESS <Text style={styles.asterisk}>*</Text></Text>
              <TextInput 
                style={styles.input}
                value={email}
                placeholder='israel.adigun@example.com'
                placeholderTextColor="#CBD5E1"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
              />

              <Text style={styles.inputLabel}>COUNTRY OF RESIDENCE <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.pickerWrapper}>
                <RNPickerSelect
                  onValueChange={(value) => setSelectedCountry(value)}
                  items={countries}
                  placeholder={{ label: 'Select country...', value: null }}
                  style={pickerSelectStyles}
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Continue to Form</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  headerSection: { marginVertical: 30, alignItems: 'center' },
  titleText: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitleText: { fontSize: 15, color: '#64748B', marginTop: 8, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, elevation: 3 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1, marginBottom: 8 },
  asterisk: { color: '#EF4444' },
  input: { borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingVertical: 10, marginBottom: 24, fontSize: 16, color: '#1E293B', fontWeight: '600' },
  pickerWrapper: { borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingVertical: 5 },
  signupButton: { backgroundColor: '#003366', height: 58, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 35 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
  backButton: { marginTop: 20, alignSelf: 'center' },
  backButtonText: { color: '#64748B', fontSize: 15, fontWeight: '600' },
});

// const pickerSelectStyles = {
//   inputIOS: { fontSize: 16, paddingVertical: 10, color: '#1E293B', fontWeight: '600' },
//   inputAndroid: { fontSize: 16, color: '#1E293B', fontWeight: '600', paddingVertical: 8 },
// };
// At the very bottom of your non_nigerian.tsx
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#1E293B',
    fontWeight: '600',
  },
  inputAndroid: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    paddingVertical: 8,
  },
  placeholder: {
    color: '#CBD5E1',
  }
});