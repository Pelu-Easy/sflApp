import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ImageBackground 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LearnScreen() {
  const lessons = [
    { id: 1, title: 'Investing 101', duration: '5 mins', level: 'Beginner', color: '#312E81' },
    { id: 2, title: 'Understanding Stocks', duration: '8 mins', level: 'Intermediate', color: '#064E3B' },
    { id: 3, title: 'Diversification', duration: '6 mins', level: 'Beginner', color: '#431407' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Learn</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        <Text style={styles.sectionTitle}>Featured Masterclass</Text>
        
        {/* BIG FEATURED CARD */}
        <TouchableOpacity style={styles.featuredCard}>
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredTag}>NEW COURSE</Text>
            <Text style={styles.featuredTitle}>How to build wealth in a volatile market</Text>
            <View style={styles.playRow}>
              <Ionicons name="play-circle" size={24} color="#FFF" />
              <Text style={styles.playText}>Watch Now</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Lesson Library</Text>
        
        {lessons.map((lesson) => (
          <TouchableOpacity key={lesson.id} style={styles.lessonTile}>
            <View style={[styles.lessonIcon, { backgroundColor: lesson.color }]}>
              <Ionicons name="book-outline" size={20} color="#FFF" />
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonSub}>{lesson.level} • {lesson.duration}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#334155" />
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
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: '700', marginBottom: 15, marginTop: 10 },
  featuredCard: { backgroundColor: '#1E1B4B', height: 200, borderRadius: 24, overflow: 'hidden', marginBottom: 25 },
  featuredOverlay: { flex: 1, padding: 20, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  featuredTag: { color: '#10B981', fontWeight: '800', fontSize: 10, marginBottom: 5 },
  featuredTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', marginBottom: 15 },
  playRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  playText: { color: '#FFF', fontWeight: '600' },
  lessonTile: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 16, borderRadius: 20, marginBottom: 12 },
  lessonIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  lessonInfo: { flex: 1 },
  lessonTitle: { color: '#FFF', fontWeight: '600', fontSize: 15 },
  lessonSub: { color: '#8E8E93', fontSize: 12, marginTop: 2 }
});