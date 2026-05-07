import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import apiClient from '../api/client';

export default function DashboardScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get('/dashboard/summary');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Overview</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Harvests</Text>
          <Text style={styles.cardValue}>{data?.total_harvests || 0}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Pending GRNs</Text>
          <Text style={styles.cardValue}>{data?.pending_grns || 0}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Active Employees</Text>
          <Text style={styles.cardValue}>{data?.active_employees || 0}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Sales</Text>
          <Text style={styles.cardValue}>₹{data?.total_sales || 0}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#1E293B',
    width: '45%',
    margin: '2.5%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardValue: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
