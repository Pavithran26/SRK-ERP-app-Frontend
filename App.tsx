import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';

// Keep splash screen visible while app loads
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Hide splash screen as soon as the component mounts
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <View style={styles.content}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </View>

          {/* Global App Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              This Software is Developed and Managed by{' '}
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Pavithran26')}>
              <Text style={styles.linkText}>Pavithran S</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#0F172A',
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
  },
  linkText: {
    fontSize: 12,
    color: '#38BDF8',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
