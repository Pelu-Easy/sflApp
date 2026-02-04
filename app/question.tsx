import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import Header from './header';

const { width } = Dimensions.get('window');

export default function Question() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>Welcome to SFL LTD</Text>
          <Text style={styles.subtitle}>Please select your citizenship status to continue with verification.</Text>
        </View>

        {/* Selection Cards */}
        <View style={styles.selectionContainer}>
          
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push('/nigerians')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E1F5FE' }]}>
              <Ionicons name="flag" size={24} color="#003366" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>I am a Nigerian</Text>
              <Text style={styles.cardDesc}>Requires a valid BVN for verification</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push('/non_nigerian')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="globe-outline" size={24} color="#475569" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Non-Nigerian</Text>
              <Text style={styles.cardDesc}>Verification via International Passport</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>

        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure Identity Verification</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' // Clean, professional off-white
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  textSection: {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    textAlign: 'center',
  },
  selectionContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    // Subtle shadow for premium feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#94A3B8',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  }
});