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

export default function SalesScreen({ navigation }: any) {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/sales');
      const data = response.data.results || response.data;
      setSales(data);
    } catch (error) {
      console.error('Failed to fetch sales', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSales();
    });
    return unsubscribe;
  }, [navigation]);

  const renderSale = ({ item }: { item: any }) => (
    <AppCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.buyerName}>{item.buyer?.name || 'Unknown Buyer'}</Text>
          <Text style={styles.date}>{item.sale_date}</Text>
        </View>
        <Text style={styles.amount}>₹{item.gross_amount}</Text>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Quantity</Text>
          <Text style={styles.statValue}>{item.quantity}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Unit Price</Text>
          <Text style={styles.statValue}>₹{item.unit_price}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Transport</Text>
          <Text style={styles.statValue}>₹{item.transport_cost}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Ionicons name="location-outline" size={14} color="#94A3B8" />
        <Text style={styles.landText}>{item.land?.name || 'Direct Sale'}</Text>
      </View>
    </AppCard>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={sales}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSale}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState 
              title="No sales recorded" 
              description="Track your revenue by recording sales entries here." 
            />
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddSale')}
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
  buyerName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 15,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  landText: {
    color: '#94A3B8',
    fontSize: 13,
    marginLeft: 6,
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
