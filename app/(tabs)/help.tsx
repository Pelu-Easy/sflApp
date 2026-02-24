import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpScreen() {
  const supportActions = [
    { id: 1, name: 'Live Chat', icon: 'chatbubbles-outline', color: '#10B981' },
    { id: 2, name: 'Email Us', icon: 'mail-outline', color: '#6366F1' },
    { id: 3, name: 'Call Support', icon: 'call-outline', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Help & Support</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748B" />
          <TextInput 
            placeholder="Search for help..." 
            placeholderTextColor="#64748B" 
            style={styles.searchInput} 
          />
        </View>

        <Text style={styles.sectionTitle}>Contact Channels</Text>
        <View style={styles.actionRow}>
          {supportActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.actionBox}>
              <View style={[styles.iconCircle, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.actionText}>{action.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {['How do I withdraw?', 'How long does deposit take?', 'Is my data secure?', 'What are the fees?'].map((faq, index) => (
          <TouchableOpacity key={index} style={styles.faqTile}>
            <Text style={styles.faqText}>{faq}</Text>
            <Ionicons name="add" size={20} color="#64748B" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', textAlign: 'center', marginVertical: 15 },
  scrollBody: { paddingHorizontal: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', paddingHorizontal: 15, height: 50, borderRadius: 15, marginBottom: 25 },
  searchInput: { flex: 1, marginLeft: 10, color: '#FFF' },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: '700', marginBottom: 15 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  actionBox: { flex: 1, backgroundColor: '#1C1C1E', paddingVertical: 20, borderRadius: 20, alignItems: 'center' },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  faqTile: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#1C1C1E' },
  faqText: { color: '#E2E8F0', fontSize: 14 }
});