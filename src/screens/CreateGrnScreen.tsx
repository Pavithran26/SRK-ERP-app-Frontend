import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import apiClient from '../api/client';
import { AppButton, AppInput } from '../components/Common';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function CreateGrnScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  const [form, setForm] = useState({
    store_id: '',
    receipt_date: new Date().toISOString().split('T')[0],
    coconut_count: '',
    bag_count: '',
    vehicle_id: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [storesRes, vehiclesRes] = await Promise.all([
        apiClient.get('/stores'),
        apiClient.get('/vehicles')
      ]);
      setStores(storesRes.data.results || storesRes.data);
      setVehicles(vehiclesRes.data.results || vehiclesRes.data);
    } catch (error) {
      console.error('Failed to fetch support data', error);
      Alert.alert('Error', 'Failed to load stores or vehicles.');
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!form.store_id || !form.coconut_count || !form.bag_count) {
      Alert.alert('Error', 'Please fill in Store, Coconut Count, and Bag Count.');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/grns', {
        ...form,
        coconut_count: parseInt(form.coconut_count),
        bag_count: parseInt(form.bag_count),
        vehicle_id: form.vehicle_id || null,
      });
      Alert.alert('Success', 'GRN created successfully!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to create GRN', error);
      const message = error.response?.data?.detail || 'Something went wrong.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="receipt-outline" size={32} color="#38BDF8" />
          <Text style={styles.title}>Create GRN</Text>
          <Text style={styles.subtitle}>Record a new inventory receipt (Goods Received Note).</Text>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Store *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.store_id}
              onValueChange={(value) => setForm({ ...form, store_id: value })}
              style={styles.picker}
              dropdownIconColor="#F8FAFC"
            >
              <Picker.Item label="Choose a store..." value="" color="#94A3B8" />
              {stores.map(store => (
                <Picker.Item key={store.id} label={store.name} value={store.id} color="#F8FAFC" />
              ))}
            </Picker>
          </View>
        </View>

        <AppInput
          label="Receipt Date *"
          placeholder="YYYY-MM-DD"
          value={form.receipt_date}
          onChangeText={(text: string) => setForm({ ...form, receipt_date: text })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <AppInput
              label="Coconut Count *"
              placeholder="e.g. 1000"
              keyboardType="numeric"
              value={form.coconut_count}
              onChangeText={(text: string) => setForm({ ...form, coconut_count: text })}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <AppInput
              label="Bag Count *"
              placeholder="e.g. 50"
              keyboardType="numeric"
              value={form.bag_count}
              onChangeText={(text: string) => setForm({ ...form, bag_count: text })}
            />
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Vehicle (Optional)</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.vehicle_id}
              onValueChange={(value) => setForm({ ...form, vehicle_id: value })}
              style={styles.picker}
              dropdownIconColor="#F8FAFC"
            >
              <Picker.Item label="None" value="" color="#94A3B8" />
              {vehicles.map(v => (
                <Picker.Item key={v.id} label={v.registration_number} value={v.id} color="#F8FAFC" />
              ))}
            </Picker>
          </View>
        </View>

        <AppInput
          label="Notes"
          placeholder="Any additional notes..."
          value={form.notes}
          onChangeText={(text: string) => setForm({ ...form, notes: text })}
        />

        <View style={styles.buttonContainer}>
          <AppButton 
            title="Create GRN" 
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
  center: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
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
  label: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerWrapper: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  picker: {
    color: '#F8FAFC',
    height: 50,
  },
  row: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
