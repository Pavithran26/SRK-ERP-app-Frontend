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

export default function AddVehicleScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    registration_number: '',
    vehicle_type: '',
    capacity: '',
    driver_name: '',
    driver_phone: '',
    notes: '',
  });

  const handleSave = async () => {
    if (!form.registration_number || !form.vehicle_type) {
      Alert.alert('Error', 'Registration Number and Vehicle Type are required.');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/vehicles', {
        ...form,
        capacity: parseFloat(form.capacity) || 0,
        is_active: true
      });
      Alert.alert('Success', 'Vehicle added successfully!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to add vehicle', error);
      const message = error.response?.data?.detail || 'Something went wrong.';
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
          <Ionicons name="bus-outline" size={32} color="#38BDF8" />
          <Text style={styles.title}>New Vehicle</Text>
          <Text style={styles.subtitle}>Register a new vehicle in your fleet.</Text>
        </View>

        <AppInput
          label="Registration Number *"
          placeholder="e.g. TN 38 BU 1234"
          value={form.registration_number}
          onChangeText={(text: string) => setForm({ ...form, registration_number: text })}
        />

        <AppInput
          label="Vehicle Type *"
          placeholder="e.g. Truck, Tractor, Lorry"
          value={form.vehicle_type}
          onChangeText={(text: string) => setForm({ ...form, vehicle_type: text })}
        />

        <AppInput
          label="Capacity (kg)"
          placeholder="e.g. 2000"
          keyboardType="numeric"
          value={form.capacity}
          onChangeText={(text: string) => setForm({ ...form, capacity: text })}
        />

        <AppInput
          label="Driver Name"
          placeholder="Enter driver name"
          value={form.driver_name}
          onChangeText={(text: string) => setForm({ ...form, driver_name: text })}
        />

        <AppInput
          label="Driver Phone"
          placeholder="e.g. +91 9876543210"
          keyboardType="phone-pad"
          value={form.driver_phone}
          onChangeText={(text: string) => setForm({ ...form, driver_phone: text })}
        />

        <AppInput
          label="Notes"
          placeholder="Maintenance or other details..."
          value={form.notes}
          onChangeText={(text: string) => setForm({ ...form, notes: text })}
        />

        <View style={styles.buttonContainer}>
          <AppButton 
            title="Register Vehicle" 
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
  buttonContainer: {
    marginTop: 20,
  },
});
