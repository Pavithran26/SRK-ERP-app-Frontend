import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import apiClient from '../api/client';
import { AppCard, EmptyState } from '../components/Common';
import { Ionicons } from '@expo/vector-icons';

export default function LandsScreen({ navigation }: any) {
  const [lands, setLands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLands = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/lands');
      const data = response.data.results || response.data;
      setLands(data);
    } catch (error) {
      console.error('Failed to fetch lands', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchLands();
    });
    return unsubscribe;
  }, [navigation]);

  const renderLand = ({ item }: { item: any }) => (
    <AppCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.landName}>{item.name}</Text>
          <Text style={styles.village}>{item.village}</Text>
        </View>
        <Ionicons name="leaf-outline" size={24} color="#10B981" />
      </View>
      
      <View style={styles.detailsGrid}>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Owner</Text>
          <Text style={styles.detailValue}>{item.owner?.name || 'N/A'}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Area</Text>
          <Text style={styles.detailValue}>{item.area_acres} Acres</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Trees</Text>
          <Text style={styles.detailValue}>{item.tree_count}</Text>
        </View>
      </View>

      <View style={styles.leaseInfo}>
        <Text style={styles.leaseText}>
          Lease: ₹{item.lease_amount.toLocaleString()} / year
        </Text>
        <Text style={[styles.status, { color: item.is_active ? '#10B981' : '#EF4444' }]}>
          {item.is_active ? 'Active Lease' : 'Inactive'}
        </Text>
      </View>
    </AppCard>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={lands}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLand}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState 
              title="No lands registered" 
              description="Register your coconut groves and lease agreements here." 
            />
          }
        />
      )}
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
  landName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  village: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailBox: {
    flex: 1,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  leaseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  leaseText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
