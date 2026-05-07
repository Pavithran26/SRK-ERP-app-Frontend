import React from 'react';
import { StyleSheet, Text, View, Linking, TouchableOpacity, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Match the premium dark theme
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
