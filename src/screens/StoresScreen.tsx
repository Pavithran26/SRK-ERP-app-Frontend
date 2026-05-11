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

export default function StoresScreen({ navigation }: any) {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/stores');
      const data = response.data.results || response.data;
      setStores(data);
    } catch (error) {
      console.error('Failed to fetch stores', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStores();
    });
    return unsubscribe;
  }, [navigation]);

  const renderStore = ({ item }: { item: any }) => (
    <AppCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.storeName}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <Ionicons name="business-outline" size={24} color="#38BDF8" />
      </View>
      
      <View style={styles.inventoryRow}>
        <View style={styles.invItem}>
          <Text style={styles.invLabel}>Coconuts</Text>
          <Text style={styles.invValue}>{item.current_coconuts || 0}</Text>
        </View>
        <View style={styles.invItem}>
          <Text style={styles.invLabel}>Bags</Text>
          <Text style={styles.invValue}>{item.current_bags || 0}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.notes} numberOfLines={1}>{item.notes || 'No notes'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.is_active ? '#065F46' : '#991B1B' }]}>
          <Text style={styles.statusText}>{item.is_active ? 'Active' : 'Inactive'}</Text>
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
          data={stores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderStore}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState 
              title="No stores or hubs" 
              description="Create a storage hub to start tracking inventory receipts." 
            />
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddStore')}
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
    marginBottom: 16,
  },
  storeName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  inventoryRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  invItem: {
    flex: 1,
    alignItems: 'center',
  },
  invLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  invValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notes: {
    color: '#64748B',
    fontSize: 12,
    flex: 1,
    marginRight: 10,
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
