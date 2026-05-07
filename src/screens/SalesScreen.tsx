import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SalesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sales Records</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#F8FAFC',
    fontSize: 18,
  },
});
