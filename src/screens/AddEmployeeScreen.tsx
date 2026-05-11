import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import apiClient from '../api/client';
import { AppButton, AppInput } from '../components/Common';
import { Ionicons } from '@expo/vector-icons';

export default function AddEmployeeScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    employee_code: '',
    department: '',
    role: 'worker',
    designation: '',
    phone_number: '',
    email: '',
    daily_wage: '',
    notes: '',
  });

  const handleSave = async () => {
    if (!form.full_name || !form.employee_code) {
      Alert.alert('Error', 'Please fill in the required fields (Name and Code).');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/employees', {
        ...form,
        daily_wage: parseFloat(form.daily_wage) || 0,
        joined_on: new Date().toISOString().split('T')[0], // Default to today
        is_active: true
      });
      Alert.alert('Success', 'Employee added successfully!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to save employee', error);
      const message = error.response?.data?.detail || 'Something went wrong. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="person-add-outline" size={32} color="#38BDF8" />
          <Text style={styles.title}>New Employee</Text>
          <Text style={styles.subtitle}>Fill in the details to register a new field worker.</Text>
        </View>

        <AppInput
          label="Full Name *"
          placeholder="e.g. John Doe"
          value={form.full_name}
          onChangeText={(text: string) => setForm({ ...form, full_name: text })}
        />

        <AppInput
          label="Employee Code *"
          placeholder="e.g. EMP001"
          value={form.employee_code}
          onChangeText={(text: string) => setForm({ ...form, employee_code: text })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <AppInput
              label="Department"
              placeholder="e.g. Harvesting"
              value={form.department}
              onChangeText={(text: string) => setForm({ ...form, department: text })}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <AppInput
              label="Designation"
              placeholder="e.g. Supervisor"
              value={form.designation}
              onChangeText={(text: string) => setForm({ ...form, designation: text })}
            />
          </View>
        </View>

        <AppInput
          label="Phone Number"
          placeholder="e.g. +91 9876543210"
          keyboardType="phone-pad"
          value={form.phone_number}
          onChangeText={(text: string) => setForm({ ...form, phone_number: text })}
        />

        <AppInput
          label="Daily Wage (₹)"
          placeholder="e.g. 500"
          keyboardType="numeric"
          value={form.daily_wage}
          onChangeText={(text: string) => setForm({ ...form, daily_wage: text })}
        />

        <AppInput
          label="Notes"
          placeholder="Additional information..."
          value={form.notes}
          onChangeText={(text: string) => setForm({ ...form, notes: text })}
        />

        <View style={styles.buttonContainer}>
          <AppButton 
            title="Register Employee" 
            onPress={handleSave} 
            loading={loading}
          />
          <AppButton 
            title="Cancel" 
            variant="secondary" 
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
