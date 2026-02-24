import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PulseScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Pulse</Text>
      <ScrollView contentContainerStyle={styles.scrollBody}>
        <View style={styles.emptyState}>
          <Ionicons name="stats-chart" size={60} color="#1C1C1E" />
          <Text style={styles.emptyTitle}>Stay Tuned</Text>
          <Text style={styles.emptySub}>We are bringing you real-time market insights and trends very soon.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', textAlign: 'center', marginVertical: 15 },
  scrollBody: { flexGrow: 1, justifyContent: 'center', padding: 40 },
  emptyState: { alignItems: 'center' },
  emptyTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', marginTop: 20 },
  emptySub: { color: '#8E8E93', textAlign: 'center', marginTop: 10, lineHeight: 20 }
});