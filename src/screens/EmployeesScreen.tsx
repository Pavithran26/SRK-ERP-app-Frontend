import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmployeesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Employees Directory</Text>
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
