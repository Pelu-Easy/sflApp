import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Animated, 
  Image, 
  StyleSheet, 
  StatusBar, 
  Dimensions,
  Easing
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance Animation
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      // 2. Continuous Pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // 3. Auto-navigate to Question Screen
    const timer = setTimeout(() => {
      // Changed from './question' to '/question' for absolute path safety
      router.replace('/question'); 
    }, 3500);

    return () => clearTimeout(timer);
  }, [entranceAnim, pulseAnim]);

  const logoScale = Animated.multiply(
    entranceAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.85, 1],
    }),
    pulseAnim
  );

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      <SafeAreaView style={styles.container}>
        
        <View style={styles.centerContent}>
          <Animated.View style={{ 
            opacity: entranceAnim, 
            transform: [{ scale: logoScale }],
            alignItems: 'center',
          }}>
            <Image 
              source={require('../assets/images/LiquidCrest_Logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        <Animated.View style={[styles.footer, { opacity: entranceAnim }]}>
          <Text style={styles.brandText}>SFL LTD</Text>
          
          <View style={styles.loaderLine}>
             <Animated.View style={[styles.loaderFill, { 
               transform: [
                 { 
                   scaleX: entranceAnim.interpolate({
                     inputRange: [0, 1],
                     outputRange: [0.001, 1]
                   }) 
                 },
                 {
                   translateX: entranceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-60, 0] 
                  })
                 }
               ]
             }]} />
          </View>
          
          <Text style={styles.tagline}>Secure · Fast · Reliable</Text>
        </Animated.View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#003366', // Standard LiquidCrest Blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { 
    width: width * 0.45, 
    height: width * 0.45,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '100%',
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 6,
    marginBottom: 12,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
    letterSpacing: 2,
  },
  loaderLine: {
    width: 120,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderFill: {
    width: 120, 
    height: '100%',
    backgroundColor: '#FFFFFF',
  }
});