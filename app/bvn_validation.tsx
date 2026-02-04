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

export default function BvnValidation() {
  const params = useLocalSearchParams();
  const animationRef = useRef<LottieView>(null);

  const isNonNigerian = params.isNonNigerian === 'true';

  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // State for Dropdown Visibility
  const [activePicker, setActivePicker] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bvn: (params.bvn as string) || "", 
    firstname: (params.firstname as string) || "", 
    lastname: (params.lastname as string) || "",  
    dob: (params.dob as string) || "",    
    phone: (params.phone as string) || "",  
    email: (params.email as string) || "", 
    country: (params.country as string) || "Nigeria",
    title: "",
    customerType: "", // Will hold "private" or "cooperate"
    gender: "",       // Will hold "Male" or "Female"
    address: "",
    password: ""
  });

  useEffect(() => {
    const formalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
    
    if (params.bvn || params.firstname) {
      setFormData(prev => ({
        ...prev,
        bvn: (params.bvn as string) || prev.bvn,
        firstname: formalize((params.firstname as string) || (params.firstName as string) || prev.firstname),
        lastname: formalize((params.lastname as string) || (params.lastName as string) || prev.lastname),
        dob: (params.dob as string) || prev.dob,
        phone: (params.phone as string) || prev.phone,
        email: (params.email as string) || prev.email,
      }));
    }
  }, [params.bvn, params.firstname]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      const response = await fetch('https://inv-backend-1.onrender.com/api/auth/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userType: isNonNigerian ? 'International' : 'Nigerian'
        }),
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
                  // DROPDOWN COMPONENT
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
                  // STANDARD TEXT INPUT
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

      {/* --- SELECTION PICKER MODAL --- */}
      <Modal visible={activePicker !== null} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setActivePicker(null)}
        >
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Select Option</Text>
            {activePicker && dropdownOptions[activePicker].map((option) => (
              <TouchableOpacity 
                key={option} 
                style={styles.pickerOption} 
                onPress={() => {
                  updateField(activePicker, option);
                  setActivePicker(null);
                }}
              >
                <Text style={styles.pickerOptionText}>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
                {formData[activePicker as keyof typeof formData] === option && (
                  <Ionicons name="checkmark" size={20} color="#003366" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* SUMMARY MODAL - Remaining unchanged from your code */}
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

      {/* SUCCESS MODAL - Remaining unchanged from your code */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <LottieView
              ref={animationRef}
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }}
              source={{ uri: 'https://assets9.lottiefiles.com/packages/lf20_s2lryxtd.json' }}
            />
            <Text style={styles.successTitle}>Ready!</Text>
            <Text style={styles.successSub}>
              Profile for {formData.firstname} has been successfully created.
            </Text>
            <TouchableOpacity 
              style={styles.successBtn} 
              onPress={() => {
                setShowSuccess(false);
                router.replace('/login');
              }}
            >
              <Text style={styles.successBtnText}>Finish</Text>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center' },
  pickerCard: { backgroundColor: '#FFF', width: '80%', borderRadius: 24, padding: 20 },
  pickerTitle: { fontSize: 18, fontWeight: '800', marginBottom: 15, color: '#0F172A' },
  pickerOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  pickerOptionText: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
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
  successTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A' },
  successSub: { fontSize: 16, color: '#64748B', textAlign: 'center', marginVertical: 20 },
  successBtn: { backgroundColor: '#003366', paddingVertical: 18, borderRadius: 20, width: '100%', alignItems: 'center' },
  successBtnText: { color: '#FFF', fontWeight: '700' }
});


// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   View, Text, TextInput, TouchableOpacity, ScrollView, 
//   StyleSheet, Alert, ActivityIndicator, Modal 
// } from 'react-native';
// import { router, useLocalSearchParams } from 'expo-router';
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from '@expo/vector-icons';
// import LottieView from 'lottie-react-native';
// import Header from './header';

// export default function BvnValidation() {
//   const params = useLocalSearchParams();
//   const animationRef = useRef<LottieView>(null);

//   // Determine user type
//   const isNonNigerian = params.isNonNigerian === 'true';

//   const [loading, setLoading] = useState(false);
//   const [showSummary, setShowSummary] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   // Initial State: Note lowercase keys to match API and Logic
//   const [formData, setFormData] = useState({
//     bvn: (params.bvn as string) || "", 
//     firstname: (params.firstname as string) || "", 
//     lastname: (params.lastname as string) || "",  
//     dob: (params.dob as string) || "",    
//     phone: (params.phone as string) || "",  
//     email: (params.email as string) || "", 
//     country: (params.country as string) || "Nigeria",
//     title: "",
//     customerType: "",
//     gender: "",
//     address: "",
//     password: ""
//   });

//   // EFFECT: Sync data only when params change, avoiding infinite loops
// // This part in bvn_validation.tsx must look like this to match nigerians.tsx
// useEffect(() => {
//   const formalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  
//   if (params.bvn || params.firstname) {
//     setFormData(prev => ({
//       ...prev,
//       bvn: (params.bvn as string) || prev.bvn,
//       // We check both casing just in case, but prioritize the lowercase 'firstname'
//       firstname: formalize((params.firstname as string) || (params.firstName as string) || prev.firstname),
//       lastname: formalize((params.lastname as string) || (params.lastName as string) || prev.lastname),
//       dob: (params.dob as string) || prev.dob,
//       phone: (params.phone as string) || prev.phone,
//       email: (params.email as string) || prev.email,
//     }));
//   }
// }, [params.bvn, params.firstname]); // Dependency array prevents the infinite loop
//   const updateField = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const canEdit = (key: string) => {
//     // Fields always open
//     if (['title', 'customerType', 'gender', 'address', 'password', 'phone', 'email'].includes(key)) return true;
//     // Foreigners can edit identity fields
//     if (isNonNigerian && ['firstname', 'lastname', 'dob', 'bvn'].includes(key)) return true;
//     return false;
//   };

//   const isOfficial = (key: string) => {
//     // Locked fields for Nigerians
//     return !isNonNigerian && ['bvn', 'firstname', 'lastname', 'dob'].includes(key);
//   };

//   const handleSubmitFinal = async () => {
//     setShowSummary(false);
//     setLoading(true);
    
//     try {
//       const response = await fetch('https://inv-backend-1.onrender.com/api/auth/v1/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...formData,
//           userType: isNonNigerian ? 'International' : 'Nigerian'
//         }),
//       });

//       if (response.ok) {
//         setShowSuccess(true);
//       } else {
//         const errData = await response.json();
//         Alert.alert("Error", errData.message || "Failed to save profile.");
//       }
//     } catch (err) {
//       Alert.alert("Network Error", "Unable to reach the server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header />
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         <View style={styles.headerBox}>
//           <Text style={styles.title}>{isNonNigerian ? "Profile Setup" : "Confirm Details"}</Text>
//           <Text style={styles.subTitle}>
//             {isNonNigerian 
//               ? `Fill in details for client from ${formData.country}`
//               : `Verified data for ${formData.firstname} ${formData.lastname} is locked.`}
//           </Text>
//         </View>

//         <View style={styles.card}>
//           {Object.entries(formData).map(([key, value]) => {
//             // Hide country field for Nigerians to keep form short
//             if (key === 'country' && !isNonNigerian) return null;

//             const editable = canEdit(key);
//             const official = isOfficial(key);
            
//             let label = key.toUpperCase().replace(/([A-Z])/g, ' $1');
//             if (isNonNigerian && key === 'bvn') label = "PASSPORT / ID NUMBER";

//             return (
//               <View key={key} style={styles.inputGroup}>
//                 <Text style={styles.label}>{label}</Text>
//                 <View style={[styles.inputWrapper, official && styles.officialLocked]}>
//                   <TextInput
//                     value={value}
//                     onChangeText={(txt) => updateField(key, txt)}
//                     editable={editable}
//                     secureTextEntry={key === 'password'}
//                     style={[styles.textInput, official && styles.officialText]}
//                     placeholder={official ? "Verified via BVN" : `Enter ${key}`}
//                     placeholderTextColor="#94A3B8"
//                   />
//                   {official && <Ionicons name="checkmark-circle" size={16} color="#10B981" />}
//                 </View>
//               </View>
//             );
//           })}
//         </View>

//         <TouchableOpacity style={styles.btn} onPress={() => {
//           if(!formData.password || !formData.address) {
//             Alert.alert("Incomplete", "Please fill in all empty fields (Password & Address).");
//             return;
//           }
//           setShowSummary(true);
//         }}>
//           <Text style={styles.btnText}>Review Summary</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* --- SUMMARY MODAL --- */}
//       <Modal visible={showSummary} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryTitle}>Review Profile</Text>
//             <ScrollView style={{ marginBottom: 20 }}>
//               {Object.entries(formData).map(([key, val]) => (
//                 <View key={key} style={styles.summaryRow}>
//                   <Text style={styles.summaryKey}>{key === 'bvn' && isNonNigerian ? 'ID NUMBER' : key.toUpperCase()}</Text>
//                   <Text style={styles.summaryVal}>{key === 'password' ? '••••••••' : val || 'N/A'}</Text>
//                 </View>
//               ))}
//             </ScrollView>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={styles.editBtn} onPress={() => setShowSummary(false)}>
//                 <Text style={styles.editBtnText}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.confirmBtn} onPress={handleSubmitFinal}>
//                 {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmText}>Confirm & Save</Text>}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* SUCCESS MODAL */}
//       <Modal visible={showSuccess} transparent animationType="fade">
//         <View style={styles.successOverlay}>
//           <View style={styles.successCard}>
//             <LottieView
//               ref={animationRef}
//               autoPlay
//               loop={false}
//               style={{ width: 200, height: 200 }}
//               source={{ uri: 'https://assets9.lottiefiles.com/packages/lf20_s2lryxtd.json' }}
//             />
//             <Text style={styles.successTitle}>Ready!</Text>
//             <Text style={styles.successSub}>
//               Profile for {formData.firstname} has been successfully created.
//             </Text>
//             <TouchableOpacity 
//               style={styles.successBtn} 
//               onPress={() => {
//                 setShowSuccess(false);
//                 router.replace('/');
//               }}
//             >
//               <Text style={styles.successBtnText}>Finish</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8FAFC' },
//   scrollContent: { padding: 20 },
//   headerBox: { marginBottom: 20 },
//   title: { fontSize: 26, fontWeight: '800', color: '#0F172A' },
//   subTitle: { fontSize: 14, color: '#64748B', marginTop: 5 },
//   card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
//   inputGroup: { marginBottom: 18 },
//   label: { fontSize: 10, fontWeight: '800', color: '#94A3B8', marginBottom: 6, letterSpacing: 1 },
//   inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingVertical: 8 },
//   officialLocked: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, borderRadius: 8, borderBottomWidth: 0 },
//   textInput: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
//   officialText: { color: '#64748B' },
//   btn: { backgroundColor: '#003366', padding: 18, borderRadius: 16, marginTop: 25, alignItems: 'center' },
//   btnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'flex-end' },
//   summaryCard: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '80%' },
//   summaryTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#0F172A' },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
//   summaryKey: { fontSize: 11, color: '#94A3B8', fontWeight: '700' },
//   summaryVal: { fontSize: 14, color: '#1E293B', fontWeight: '600' },
//   modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
//   editBtn: { flex: 1, padding: 18, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center' },
//   editBtnText: { color: '#475569', fontWeight: '700' },
//   confirmBtn: { flex: 2, backgroundColor: '#003366', padding: 18, borderRadius: 16, alignItems: 'center' },
//   confirmText: { color: '#FFF', fontWeight: '700' },
//   successOverlay: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 30 },
//   successCard: { width: '100%', alignItems: 'center' },
//   successTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A' },
//   successSub: { fontSize: 16, color: '#64748B', textAlign: 'center', marginVertical: 20 },
//   successBtn: { backgroundColor: '#003366', paddingVertical: 18, borderRadius: 20, width: '100%', alignItems: 'center' },
//   successBtnText: { color: '#FFF', fontWeight: '700' }
// });
