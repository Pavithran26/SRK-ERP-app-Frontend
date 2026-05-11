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

export default function AddStoreScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    notes: '',
  });

  const handleSave = async () => {
    if (!form.name || !form.location) {
      Alert.alert('Error', 'Store Name and Location are required.');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/stores', {
        ...form,
        is_active: true
      });
      Alert.alert('Success', 'Store hub created successfully!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to create store', error);
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
          <Ionicons name="business-outline" size={32} color="#38BDF8" />
          <Text style={styles.title}>New Store Hub</Text>
          <Text style={styles.subtitle}>Define a new storage location or hub.</Text>
        </View>

        <AppInput
          label="Store Name *"
          placeholder="e.g. Main Hub A"
          value={form.name}
          onChangeText={(text: string) => setForm({ ...form, name: text })}
        />

        <AppInput
          label="Location *"
          placeholder="e.g. Coimbatore South"
          value={form.location}
          onChangeText={(text: string) => setForm({ ...form, location: text })}
        />

        <AppInput
          label="Notes"
          placeholder="Security details, capacity, etc..."
          value={form.notes}
          onChangeText={(text: string) => setForm({ ...form, notes: text })}
        />

        <View style={styles.buttonContainer}>
          <AppButton 
            title="Create Store" 
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
