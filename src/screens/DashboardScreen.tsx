import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import apiClient from '../api/client';
import { AppCard } from '../components/Common';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const [data, setData] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [lands, setLands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, empRes, landRes] = await Promise.all([
        apiClient.get('/dashboard/summary'),
        apiClient.get('/reports/employee-work'),
        apiClient.get('/reports/land-production')
      ]);
      
      setData(summaryRes.data);
      setEmployees(empRes.data.slice(0, 5)); // Top 5
      setLands(landRes.data.slice(0, 5)); // Top 5
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
        <Text style={styles.greeting}>Good Morning,</Text>
        <Text style={styles.title}>Operational Overview</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="leaf-outline" size={20} color="#10B981" />
          <Text style={styles.statValue}>{data?.totalLands || 0}</Text>
          <Text style={styles.statLabel}>Total Lands</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={20} color="#38BDF8" />
          <Text style={styles.statValue}>{data?.activeWorkers || 0}</Text>
          <Text style={styles.statLabel}>Active Staff</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="calendar-outline" size={20} color="#F59E0B" />
          <Text style={styles.statValue}>{data?.dailyHarvest || 0}</Text>
          <Text style={styles.statLabel}>Today's Harvest</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash-outline" size={20} color="#EC4899" />
          <Text style={styles.statValue}>₹{data?.totalRevenue || 0}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AddWorklog')}>
          <View style={[styles.actionIcon, { backgroundColor: '#065F46' }]}>
            <Ionicons name="add-circle" size={24} color="#F8FAFC" />
          </View>
          <Text style={styles.actionText}>Add Worklog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AddSale')}>
          <View style={[styles.actionIcon, { backgroundColor: '#1E40AF' }]}>
            <Ionicons name="cart" size={24} color="#F8FAFC" />
          </View>
          <Text style={styles.actionText}>Record Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('CreateGrn')}>
          <View style={[styles.actionIcon, { backgroundColor: '#92400E' }]}>
            <Ionicons name="receipt" size={24} color="#F8FAFC" />
          </View>
          <Text style={styles.actionText}>Create GRN</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Top Employees List (Leaderboard) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Employees</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Employees')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <AppCard style={styles.listCard}>
        {employees.map((emp, index) => (
          <View key={emp.id} style={[styles.listItem, index === employees.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{emp.name}</Text>
              <Text style={styles.itemSub}>{emp.role}</Text>
            </View>
            <Text style={styles.itemMetric}>{emp.assignmentCount} Logs</Text>
          </View>
        ))}
      </AppCard>

      {/* Land Production Insights */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Land Production</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Lands')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <AppCard style={styles.listCard}>
        {lands.map((land, index) => (
          <View key={land.id} style={[styles.listItem, index === lands.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{land.name}</Text>
              <Text style={styles.itemSub}>{land.village}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.itemMetric}>{land.totalCoconuts}</Text>
              <Text style={styles.itemSub}>Coconuts</Text>
            </View>
          </View>
        ))}
      </AppCard>

      <View style={{ height: 40 }} />
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
    paddingTop: 30,
  },
  greeting: {
    color: '#94A3B8',
    fontSize: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    backgroundColor: '#1E293B',
    width: (width - 40) / 2,
    margin: 5,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  viewAll: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  actionBtn: {
    alignItems: 'center',
    marginRight: 20,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '500',
  },
  listCard: {
    marginHorizontal: 20,
    padding: 0,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  rankBadge: {
    backgroundColor: '#334155',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  itemSub: {
    color: '#94A3B8',
    fontSize: 12,
  },
  itemMetric: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
