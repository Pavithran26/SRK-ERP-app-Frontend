import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type HeaderProps = {
  title: string;
};

export default function AppHeader({ title }: HeaderProps) {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => navigation.openDrawer()}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>{title}</Text>
        
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>P</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0F172A',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    color: '#F8FAFC',
    fontSize: 24,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
