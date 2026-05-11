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

export default function GrnsScreen({ navigation }: any) {
  const [grns, setGrns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGrns = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/grns');
      const data = response.data.results || response.data;
      setGrns(data);
    } catch (error) {
      console.error('Failed to fetch GRNs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchGrns();
    });
    return unsubscribe;
  }, [navigation]);

  const renderGrn = ({ item }: { item: any }) => (
    <AppCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.storeName}>{item.store?.name || 'Unknown Store'}</Text>
          <Text style={styles.date}>{item.receipt_date}</Text>
        </View>
        <Ionicons name="receipt-outline" size={24} color="#38BDF8" />
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Coconuts</Text>
          <Text style={styles.statValue}>{item.coconut_count}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Bags</Text>
          <Text style={styles.statValue}>{item.bag_count}</Text>
        </View>
        {item.vehicle && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Vehicle</Text>
            <Text style={styles.statValue} numberOfLines={1}>{item.vehicle.registration_number}</Text>
          </View>
        )}
      </View>

      {item.notes ? (
        <View style={styles.notesContainer}>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      ) : null}
    </AppCard>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={grns}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGrn}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState 
              title="No GRNs found" 
              description="Inventory receipts will appear here once they are created." 
            />
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateGrn')}
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
  date: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  notesText: {
    color: '#94A3B8',
    fontSize: 13,
    fontStyle: 'italic',
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
