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

export default function WorklogsScreen({ navigation }: any) {
  const [worklogs, setWorklogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorklogs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/worklogs');
      const data = response.data.results || response.data;
      setWorklogs(data);
    } catch (error) {
      console.error('Failed to fetch worklogs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchWorklogs();
    });
    return unsubscribe;
  }, [navigation]);

  const renderWorkLog = ({ item }: { item: any }) => (
    <AppCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.landName}>{item.land?.name || 'N/A'}</Text>
          <Text style={styles.date}>{item.work_date}</Text>
        </View>
        <View style={styles.loadBadge}>
          <Text style={styles.loadBadgeText}>{item.load_type || 'Manual'}</Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Harvested</Text>
          <Text style={styles.statValue}>{item.coconut_count} Coconuts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Workers</Text>
          <Text style={styles.statValue}>{item.assignments?.length || 0} People</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="person-outline" size={14} color="#94A3B8" />
          <Text style={styles.footerText}>Sup: {item.supervisor?.full_name || 'N/A'}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="bus-outline" size={14} color="#94A3B8" />
          <Text style={styles.footerText}>{item.vehicle?.registration_number || 'No Vehicle'}</Text>
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
          data={worklogs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderWorkLog}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState 
              title="No work logs found" 
              description="Daily field operations and harvest logs will appear here." 
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddWorklog')}
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  landName: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: 'bold',
  },
  date: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  loadBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  loadBadgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statsRow: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    marginBottom: 8,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 12,
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
