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

export default function AddSaleScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [lands, setLands] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  const [form, setForm] = useState({
    buyer_id: '',
    land_id: '',
    sale_date: new Date().toISOString().split('T')[0],
    quantity: '',
    unit_price: '',
    transport_cost: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [buyersRes, landsRes] = await Promise.all([
        apiClient.get('/buyers'),
        apiClient.get('/lands')
      ]);
      setBuyers(buyersRes.data.results || buyersRes.data);
      setLands(landsRes.data.results || landsRes.data);
    } catch (error) {
      console.error('Failed to fetch support data', error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!form.buyer_id || !form.quantity || !form.unit_price) {
      Alert.alert('Error', 'Buyer, Quantity, and Unit Price are required.');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/sales', {
        ...form,
        quantity: parseFloat(form.quantity),
        unit_price: parseFloat(form.unit_price),
        transport_cost: parseFloat(form.transport_cost) || 0,
        land_id: form.land_id || null,
      });
      Alert.alert('Success', 'Sale recorded successfully!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to record sale', error);
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
          <Ionicons name="cart-outline" size={32} color="#38BDF8" />
          <Text style={styles.title}>New Sale</Text>
          <Text style={styles.subtitle}>Record a coconut sale transaction.</Text>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Buyer *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.buyer_id}
              onValueChange={(value) => setForm({ ...form, buyer_id: value })}
              style={styles.picker}
              dropdownIconColor="#F8FAFC"
            >
              <Picker.Item label="Choose a buyer..." value="" color="#94A3B8" />
              {buyers.map(b => (
                <Picker.Item key={b.id} label={b.name} value={b.id} color="#F8FAFC" />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Land (Optional)</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.land_id}
              onValueChange={(value) => setForm({ ...form, land_id: value })}
              style={styles.picker}
              dropdownIconColor="#F8FAFC"
            >
              <Picker.Item label="Direct Sale / Unknown" value="" color="#94A3B8" />
              {lands.map(l => (
                <Picker.Item key={l.id} label={l.name} value={l.id} color="#F8FAFC" />
              ))}
            </Picker>
          </View>
        </View>

        <AppInput
          label="Sale Date *"
          placeholder="YYYY-MM-DD"
          value={form.sale_date}
          onChangeText={(text: string) => setForm({ ...form, sale_date: text })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <AppInput
              label="Quantity *"
              placeholder="e.g. 5000"
              keyboardType="numeric"
              value={form.quantity}
              onChangeText={(text: string) => setForm({ ...form, quantity: text })}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <AppInput
              label="Unit Price (₹) *"
              placeholder="e.g. 15.50"
              keyboardType="numeric"
              value={form.unit_price}
              onChangeText={(text: string) => setForm({ ...form, unit_price: text })}
            />
          </View>
        </View>

        <AppInput
          label="Transport Cost (₹)"
          placeholder="e.g. 1000"
          keyboardType="numeric"
          value={form.transport_cost}
          onChangeText={(text: string) => setForm({ ...form, transport_cost: text })}
        />

        <AppInput
          label="Notes"
          placeholder="Payment details, etc..."
          value={form.notes}
          onChangeText={(text: string) => setForm({ ...form, notes: text })}
        />

        <View style={styles.buttonContainer}>
          <AppButton 
            title="Record Sale" 
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
