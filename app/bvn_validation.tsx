import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  StyleSheet, Alert, ActivityIndicator, Modal 
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import Header from './header';
import useNigeriaSignUp from './bvn_input'; // Import the Zustand store

export default function BvnValidation() {
  const params = useLocalSearchParams();
  const animationRef = useRef<LottieView>(null);
  
  // --- FIXED: Hook into the Zustand store using correct property names ---
  const storeData = useNigeriaSignUp((state) => state.userNigeriaData);
  const setUserData = useNigeriaSignUp((state) => state.setUserData);

  const isNonNigerian = params.isNonNigerian === 'true';

  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // State for Dropdown Visibility
  const [activePicker, setActivePicker] = useState<string | null>(null);

  // --- FIXED: Initialize state from storeData (mapped to userNigeriaData) ---
  const [formData, setFormData] = useState({
    bvn: (params.bvn as string) || storeData.bvn || "", 
    firstname: (params.firstname as string) || (params.firstName as string) || storeData.firstname || "", 
    lastname: (params.lastname as string) || (params.lastName as string) || storeData.lastname || "",   
    dob: (params.dob as string) || storeData.dob || "",    
    phone: (params.phone as string) || storeData.phone || "",  
    email: (params.email as string) || storeData.email || "", 
    country: (params.country as string) || storeData.country || "Nigeria",
    title: "",
    customerType: "", 
    gender: "",       
    address: (params.address as string) || "",
    password: ""
  });

  useEffect(() => {
    const formalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
    
    // Sync local state if params or store changes
    if (params.bvn || params.firstname || storeData.firstname) {
      setFormData(prev => ({
        ...prev,
        bvn: (params.bvn as string) || storeData.bvn || prev.bvn,
        firstname: formalize((params.firstname as string) || (params.firstName as string) || storeData.firstname || prev.firstname),
        lastname: formalize((params.lastname as string) || (params.lastName as string) || storeData.lastname || prev.lastname),
        dob: (params.dob as string) || storeData.dob || prev.dob,
        phone: (params.phone as string) || storeData.phone || prev.phone,
        email: (params.email as string) || storeData.email || prev.email,
        country: (params.country as string) || storeData.country || prev.country,
      }));
    }
  }, [params.bvn, params.firstname, storeData]);

  const updateField = (field: string, value: string) => {
    // 1. Update local state immediately for the UI
    setFormData(prev => ({ ...prev, [field]: value }));

    // 2. Update global store separately (not inside the local setter)
    const storeFields = ['firstname', 'lastname', 'bvn', 'dob', 'phone', 'email', 'country'];
    if (storeFields.includes(field)) {
      setUserData({ [field]: value });
    }
  };

  const dropdownOptions: { [key: string]: string[] } = {
    customerType: ["private", "cooperate"],
    gender: ["Male", "Female"]
  };

  const canEdit = (key: string) => {
    if (['title', 'customerType', 'gender', 'address', 'password', 'phone', 'email'].includes(key)) return true;
    if (isNonNigerian && ['firstname', 'lastname', 'dob', 'bvn'].includes(key)) return true;
    return false;
  };

  const isOfficial = (key: string) => {
    return !isNonNigerian && ['bvn', 'firstname', 'lastname', 'dob'].includes(key);
  };

  const handleSubmitFinal = async () => {
    setShowSummary(false);
    setLoading(true);
    
    try {
      // Map local state keys to the camelCase keys expected by your backend
      const apiPayload = {
        bvn: formData.bvn,
        title: formData.title,
        customerType: formData.customerType,
        gender: formData.gender,
        firstName: formData.firstname, // Mapped from firstname
        lastName: formData.lastname,   // Mapped from lastname
        dob: formData.dob,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        password: formData.password,
        userType: isNonNigerian ? 'International' : 'Nigerian'
      };

      const response = await fetch('https://inv-backend-1.onrender.com/api/customers/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        const errData = await response.json();
        Alert.alert("Error", errData.message || "Failed to save profile.");
      }
    } catch (err) {
      Alert.alert("Network Error", "Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
          <Text style={styles.title}>{isNonNigerian ? "Profile Setup" : "Confirm Details"}</Text>
          <Text style={styles.subTitle}>
            {isNonNigerian 
              ? `Fill in details for client from ${formData.country}`
              : `Verified data for ${formData.firstname} ${formData.lastname} is locked.`}
          </Text>
        </View>

        <View style={styles.card}>
          {Object.entries(formData).map(([key, value]) => {
            if (key === 'country' && !isNonNigerian) return null;

            const editable = canEdit(key);
            const official = isOfficial(key);
            const isDropdown = dropdownOptions[key];
            
            let label = key.toUpperCase().replace(/([A-Z])/g, ' $1');
            if (isNonNigerian && key === 'bvn') label = "PASSPORT / ID NUMBER";

            return (
              <View key={key} style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>
                
                {isDropdown ? (
                  <TouchableOpacity 
                    style={styles.inputWrapper} 
                    onPress={() => setActivePicker(key)}
                  >
                    <Text style={[styles.textInput, !value && {color: '#94A3B8'}]}>
                      {value || `Select ${label.toLowerCase()}`}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#003366" />
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.inputWrapper, official && styles.officialLocked]}>
                    <TextInput
                      value={value}
                      onChangeText={(txt) => updateField(key, txt)}
                      editable={editable}
                      secureTextEntry={key === 'password'}
                      style={[styles.textInput, official && styles.officialText]}
                      placeholder={official ? "Verified via BVN" : `Enter ${key}`}
                      placeholderTextColor="#94A3B8"
                    />
                    {official && <Ionicons name="checkmark-circle" size={16} color="#10B981" />}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => {
          if(!formData.password || !formData.address || !formData.customerType || !formData.gender) {
            Alert.alert("Incomplete", "Please fill in all fields including Gender and Customer Type.");
            return;
          }
          setShowSummary(true);
        }}>
          <Text style={styles.btnText}>Review Summary</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Dropdown Selection Modal */}
      <Modal visible={activePicker !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setActivePicker(null)} 
          />
          <div style={styles.pickerSheet}>
            <View style={styles.indicator} />
            <Text style={styles.pickerTitle}>
              Select {activePicker === 'gender' ? 'Gender' : 'Account Type'}
            </Text>

            <View style={styles.optionsContainer}>
              {activePicker && dropdownOptions[activePicker].map((option) => {
                let iconName = "ellipse-outline";
                if (option === 'Male') iconName = "male";
                if (option === 'Female') iconName = "female";
                if (option === 'private') iconName = "person-outline";
                if (option === 'cooperate') iconName = "business-outline";

                const isSelected = formData[activePicker as keyof typeof formData] === option;

                return (
                  <TouchableOpacity 
                    key={option} 
                    style={[styles.optionTile, isSelected && styles.optionTileActive]} 
                    onPress={() => {
                      updateField(activePicker, option);
                      setActivePicker(null);
                    }}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[styles.iconCircle, isSelected && styles.iconCircleActive]}>
                        <Ionicons 
                          name={iconName as any} 
                          size={20} 
                          color={isSelected ? "#FFF" : "#64748B"} 
                        />
                      </View>
                      <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={24} color="#003366" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </div>
        </View>
      </Modal>

      {/* Summary Review Modal */}
      <Modal visible={showSummary} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Review Profile</Text>
            <ScrollView style={{ marginBottom: 20 }}>
              {Object.entries(formData).map(([key, val]) => (
                <View key={key} style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>{key === 'bvn' && isNonNigerian ? 'ID NUMBER' : key.toUpperCase()}</Text>
                  <Text style={styles.summaryVal}>{key === 'password' ? '••••••••' : val || 'N/A'}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.editBtn} onPress={() => setShowSummary(false)}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleSubmitFinal}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmText}>Confirm & Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Animation Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <LottieView
              ref={animationRef}
              autoPlay
              loop={false}
              style={{ width: 220, height: 220 }}
              source={{ uri: 'https://assets9.lottiefiles.com/packages/lf20_s2lryxtd.json' }}
            />
            <Text style={styles.successTitle}>Welcome to SFL!</Text>
            <Text style={styles.successSub}>
              Account for {formData.firstname} has been successfully created. You can now login to manage your wealth.
            </Text>
            <TouchableOpacity 
              style={styles.successBtn} 
              onPress={() => {
                setShowSuccess(false);
                router.replace('/login');
              }}
            >
              <Text style={styles.successBtnText}>Proceed to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20 },
  headerBox: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A' },
  subTitle: { fontSize: 14, color: '#64748B', marginTop: 5 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 10, fontWeight: '800', color: '#94A3B8', marginBottom: 6, letterSpacing: 1 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingVertical: 8 },
  officialLocked: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, borderRadius: 8, borderBottomWidth: 0 },
  textInput: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  officialText: { color: '#64748B' },
  btn: { backgroundColor: '#003366', padding: 18, borderRadius: 16, marginTop: 25, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  pickerSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  indicator: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  pickerTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 20, textAlign: 'center' },
  optionsContainer: { gap: 12 },
  optionTile: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#F1F5F9' },
  optionTileActive: { borderColor: '#003366', backgroundColor: '#F0F7FF' },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  iconCircleActive: { backgroundColor: '#003366' },
  optionText: { fontSize: 16, fontWeight: '600', color: '#475569' },
  optionTextActive: { color: '#003366' },
  summaryCard: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '80%', width: '100%' },
  summaryTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#0F172A' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  summaryKey: { fontSize: 11, color: '#94A3B8', fontWeight: '700' },
  summaryVal: { fontSize: 14, color: '#1E293B', fontWeight: '600' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  editBtn: { flex: 1, padding: 18, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center' },
  editBtnText: { color: '#475569', fontWeight: '700' },
  confirmBtn: { flex: 2, backgroundColor: '#003366', padding: 18, borderRadius: 16, alignItems: 'center' },
  confirmText: { color: '#FFF', fontWeight: '700' },
  successOverlay: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 30 },
  successCard: { width: '100%', alignItems: 'center' },
  successTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', textAlign: 'center' },
  successSub: { fontSize: 16, color: '#64748B', textAlign: 'center', marginVertical: 20, lineHeight: 24 },
  successBtn: { backgroundColor: '#003366', paddingVertical: 18, borderRadius: 20, width: '100%', alignItems: 'center' },
  successBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 }
});