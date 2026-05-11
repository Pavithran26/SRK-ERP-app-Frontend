import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import apiClient from '../api/client';
import { AppCard, EmptyState } from '../components/Common';
import { Ionicons } from '@expo/vector-icons';

export default function VehiclesScreen({ navigation }: any) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/vehicles');
      const data = response.data.results || response.data;
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchVehicles();
    });
    return unsubscribe;
  }, [navigation]);

  const renderVehicle = ({ item }: { item: any }) => (
    <AppCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.regNumber}>{item.registration_number}</Text>
          <Text style={styles.type}>{item.vehicle_type}</Text>
        </View>
        <Ionicons name="bus-outline" size={24} color="#38BDF8" />
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="person-circle-outline" size={16} color="#94A3B8" />
          <Text style={styles.detailText}>{item.driver_name || 'No Driver'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="speedometer-outline" size={16} color="#94A3B8" />
          <Text style={styles.detailText}>Cap: {item.capacity} kg</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.phoneText}>{item.driver_phone || 'No phone'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.is_active ? '#065F46' : '#991B1B' }]}>
          <Text style={styles.statusText}>{item.is_active ? 'In Service' : 'Out of Service'}</Text>
        </View>
      </View>
    </AppCard>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVehicle}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState 
              title="No vehicles in fleet" 
              description="Add your transport vehicles to track movement and logistics." 
            />
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddVehicle')}
      >
        <Ionicons name="add" size={30} color="#0F172A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  regNumber: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  type: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    color: '#94A3B8',
    fontSize: 14,
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phoneText: {
    color: '#64748B',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#38BDF8',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
