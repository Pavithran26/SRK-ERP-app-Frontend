import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import apiClient from '../api/client';
import { AppButton, AppInput } from '../components/Common';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function AddWorklogScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [lands, setLands] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);

  const [form, setForm] = useState({
    work_date: new Date().toISOString().split('T')[0],
    land_id: '',
    supervisor_id: '',
    vehicle_id: '',
    coconut_count: '',
    bag_count: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [landsRes, empRes, vehRes] = await Promise.all([
        apiClient.get('/lands'),
        apiClient.get('/employees'),
        apiClient.get('/vehicles')
      ]);
      setLands(landsRes.data.results || landsRes.data);
      setEmployees(empRes.data.results || empRes.data);
      setVehicles(vehRes.data.results || vehRes.data);
    } catch (error) {
      console.error('Failed to fetch support data', error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleWorker = (id: string) => {
    if (selectedWorkers.includes(id)) {
      setSelectedWorkers(selectedWorkers.filter(wId => wId !== id));
    } else {
      setSelectedWorkers([...selectedWorkers, id]);
    }
  };

  const handleSave = async () => {
    if (!form.land_id || !form.coconut_count || selectedWorkers.length === 0) {
      Alert.alert('Error', 'Land, Coconut Count, and at least one worker are required.');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/worklogs', {
        ...form,
        coconut_count: parseInt(form.coconut_count),
        bag_count: parseInt(form.bag_count) || 0,
        worker_ids: selectedWorkers.map(id => parseInt(id)),
        supervisor_id: form.supervisor_id || null,
        vehicle_id: form.vehicle_id || null,
      });
      Alert.alert('Success', 'Work log saved successfully!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to save worklog', error);
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
          <Ionicons name="calendar-outline" size={32} color="#38BDF8" />
          <Text style={styles.title}>Daily Work Log</Text>
          <Text style={styles.subtitle}>Record harvests and worker assignments.</Text>
        </View>

        <AppInput
          label="Work Date *"
          placeholder="YYYY-MM-DD"
          value={form.work_date}
          onChangeText={(text: string) => setForm({ ...form, work_date: text })}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Land *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.land_id}
              onValueChange={(value) => setForm({ ...form, land_id: value })}
              style={styles.picker}
              dropdownIconColor="#F8FAFC"
            >
              <Picker.Item label="Choose a grove..." value="" color="#94A3B8" />
              {lands.map(l => (
                <Picker.Item key={l.id} label={l.name} value={l.id} color="#F8FAFC" />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <AppInput
              label="Coconuts *"
              placeholder="Total count"
              keyboardType="numeric"
              value={form.coconut_count}
              onChangeText={(text: string) => setForm({ ...form, coconut_count: text })}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <AppInput
              label="Bags"
              placeholder="Bag count"
              keyboardType="numeric"
              value={form.bag_count}
              onChangeText={(text: string) => setForm({ ...form, bag_count: text })}
            />
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Supervisor (Optional)</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.supervisor_id}
              onValueChange={(value) => setForm({ ...form, supervisor_id: value })}
              style={styles.picker}
              dropdownIconColor="#F8FAFC"
            >
              <Picker.Item label="Select supervisor..." value="" color="#94A3B8" />
              {employees.filter(e => e.role === 'supervisor').map(e => (
                <Picker.Item key={e.id} label={e.full_name} value={e.id} color="#F8FAFC" />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.label}>Assign Workers * ({selectedWorkers.length} selected)</Text>
        <View style={styles.workersList}>
          {employees.map(emp => (
            <TouchableOpacity 
              key={emp.id} 
              style={[
                styles.workerTag, 
                selectedWorkers.includes(emp.id.toString()) && styles.workerTagSelected
              ]}
              onPress={() => toggleWorker(emp.id.toString())}
            >
              <Text style={[
                styles.workerTagText,
                selectedWorkers.includes(emp.id.toString()) && styles.workerTagTextSelected
              ]}>
                {emp.full_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <AppInput
          label="Notes"
          placeholder="Shift details, weather, etc..."
          value={form.notes}
          onChangeText={(text: string) => setForm({ ...form, notes: text })}
        />

        <View style={styles.buttonContainer}>
          <AppButton 
            title="Save Work Log" 
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
  workersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  workerTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  workerTagSelected: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  workerTagText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  workerTagTextSelected: {
    color: '#0F172A',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
