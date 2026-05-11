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

export default function AddLandScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  const [form, setForm] = useState({
    owner_id: '',
    name: '',
    village: '',
    area_acres: '',
    lease_start_date: '',
    lease_end_date: '',
    lease_amount: '',
    tree_count: '',
    lease_notes: '',
  });

  const fetchData = async () => {
    try {
      const response = await apiClient.get('/land-owners');
      setOwners(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch owners', error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!form.owner_id || !form.name || !form.village) {
      Alert.alert('Error', 'Owner, Land Name, and Village are required.');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/lands', {
        ...form,
        area_acres: parseFloat(form.area_acres) || 0,
        lease_amount: parseFloat(form.lease_amount) || 0,
        tree_count: parseInt(form.tree_count) || 0,
        is_active: true
      });
      Alert.alert('Success', 'Land registered successfully!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to register land', error);
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
          <Ionicons name="leaf-outline" size={32} color="#10B981" />
          <Text style={styles.title}>New Land</Text>
          <Text style={styles.subtitle}>Register a new coconut grove or lease.</Text>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Owner *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.owner_id}
              onValueChange={(value) => setForm({ ...form, owner_id: value })}
              style={styles.picker}
              dropdownIconColor="#F8FAFC"
            >
              <Picker.Item label="Choose an owner..." value="" color="#94A3B8" />
              {owners.map(o => (
                <Picker.Item key={o.id} label={o.name} value={o.id} color="#F8FAFC" />
              ))}
            </Picker>
          </View>
        </View>

        <AppInput
          label="Land Name *"
          placeholder="e.g. North Grove"
          value={form.name}
          onChangeText={(text: string) => setForm({ ...form, name: text })}
        />

        <AppInput
          label="Village *"
          placeholder="e.g. Coimbatore"
          value={form.village}
          onChangeText={(text: string) => setForm({ ...form, village: text })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <AppInput
              label="Area (Acres)"
              placeholder="e.g. 5.5"
              keyboardType="numeric"
              value={form.area_acres}
              onChangeText={(text: string) => setForm({ ...form, area_acres: text })}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <AppInput
              label="Tree Count"
              placeholder="e.g. 400"
              keyboardType="numeric"
              value={form.tree_count}
              onChangeText={(text: string) => setForm({ ...form, tree_count: text })}
            />
          </View>
        </View>

        <AppInput
          label="Lease Amount (₹)"
          placeholder="e.g. 50000"
          keyboardType="numeric"
          value={form.lease_amount}
          onChangeText={(text: string) => setForm({ ...form, lease_amount: text })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <AppInput
              label="Lease Start"
              placeholder="YYYY-MM-DD"
              value={form.lease_start_date}
              onChangeText={(text: string) => setForm({ ...form, lease_start_date: text })}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <AppInput
              label="Lease End"
              placeholder="YYYY-MM-DD"
              value={form.lease_end_date}
              onChangeText={(text: string) => setForm({ ...form, lease_end_date: text })}
            />
          </View>
        </View>

        <AppInput
          label="Lease Notes"
          placeholder="Terms and conditions..."
          value={form.lease_notes}
          onChangeText={(text: string) => setForm({ ...form, lease_notes: text })}
        />

        <View style={styles.buttonContainer}>
          <AppButton 
            title="Register Land" 
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
