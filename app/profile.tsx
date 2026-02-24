import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useNigeriaSignUp from './bvn_input'; // Adjust path if necessary

export default function ProfileScreen() {
  const router = useRouter();
  
  // Pulling the modern store data and actions
  const { userNigeriaData, setUserData, clearUserData } = useNigeriaSignUp();
  
  // Local state for the "Edit" mode, initialized with store data
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState(userNigeriaData.phone);
  const [editEmail, setEditEmail] = useState(userNigeriaData.email);

  const handleSave = () => {
    // Basic validation
    if (!editEmail.includes('@')) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Update the Zustand store with new values
    setUserData({ 
      phone: editPhone, 
      email: editEmail 
    });
    
    setIsEditing(false);
    Alert.alert("Success", "Profile details updated.");
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out of sflApp?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => {
            clearUserData();
            router.replace('/login');
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADERBAR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity 
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          style={styles.editAction}
        >
          <Text style={[styles.editBtnText, isEditing && { color: '#3B82F6' }]}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        {/* PROFILE IDENTIFIER */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {userNigeriaData.firstname ? userNigeriaData.firstname[0].toUpperCase() : 'S'}
            </Text>
          </View>
          <Text style={styles.userName}>{userNigeriaData.firstname} {userNigeriaData.lastname}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.verifiedText}>Verified Investor</Text>
          </View>
        </View>

        {/* PERSONAL INFORMATION SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CONTACT INFORMATION</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Email Address</Text>
              {isEditing ? (
                <TextInput 
                  style={styles.inputActive} 
                  value={editEmail} 
                  onChangeText={setEditEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.infoVal}>{userNigeriaData.email || 'Not set'}</Text>
              )}
            </View>
            
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoKey}>Phone Number</Text>
              {isEditing ? (
                <TextInput 
                  style={styles.inputActive} 
                  value={editPhone} 
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoVal}>{userNigeriaData.phone || 'Not set'}</Text>
              )}
            </View>
          </View>
        </View>

        {/* LEGAL IDENTITY SECTION (Read Only) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LEGAL IDENTITY</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Bank Verification Number (BVN)</Text>
              <Text style={styles.infoVal}>
                {userNigeriaData.bvn ? `*******${userNigeriaData.bvn.slice(-4)}` : 'Verified'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Account Type</Text>
              <Text style={styles.typeBadge}>PRIVATE</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoKey}>Country</Text>
              <Text style={styles.infoVal}>Nigeria 🇳🇬</Text>
            </View>
          </View>
        </View>

        {/* DANGER ZONE */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Sign Out of sflApp</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>v1.0.24-stable</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  editAction: { width: 60, alignItems: 'flex-end' },
  editBtnText: { color: '#10B981', fontWeight: '700', fontSize: 15 },
  scrollBody: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 35 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  avatarLetter: { color: '#FFF', fontSize: 36, fontWeight: 'bold' },
  userName: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6, backgroundColor: '#062010', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  verifiedText: { color: '#10B981', fontSize: 12, fontWeight: '700' },
  section: { marginBottom: 28 },
  sectionLabel: { color: '#475569', fontSize: 11, fontWeight: '800', marginBottom: 12, marginLeft: 4, letterSpacing: 1 },
  infoCard: { backgroundColor: '#1C1C1E', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#2C2C2E' },
  infoKey: { color: '#8E8E93', fontSize: 14, fontWeight: '500' },
  infoVal: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  inputActive: { color: '#10B981', fontSize: 14, fontWeight: '600', textAlign: 'right', minWidth: 160, padding: 0 },
  typeBadge: { color: '#3B82F6', fontSize: 12, fontWeight: '800', backgroundColor: '#1D2D44', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10, backgroundColor: '#1C1C1E', padding: 18, borderRadius: 20 },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
  versionText: { color: '#334155', textAlign: 'center', fontSize: 11, marginTop: 30, marginBottom: 20 }
});