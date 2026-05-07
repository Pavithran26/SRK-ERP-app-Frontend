import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// We will import screens here once created
import DashboardScreen from '../screens/DashboardScreen';
import LandsScreen from '../screens/LandsScreen';
import EmployeesScreen from '../screens/EmployeesScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import WorklogsScreen from '../screens/WorklogsScreen';
import SalesScreen from '../screens/SalesScreen';
import StoresScreen from '../screens/StoresScreen';
import GrnsScreen from '../screens/GrnsScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#F8FAFC',
        drawerStyle: {
          backgroundColor: '#1E293B',
          width: 280,
        },
        drawerActiveTintColor: '#38BDF8',
        drawerInactiveTintColor: '#94A3B8',
        drawerActiveBackgroundColor: '#0F172A',
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Lands" component={LandsScreen} />
      <Drawer.Screen name="Employees" component={EmployeesScreen} />
      <Drawer.Screen name="Vehicles" component={VehiclesScreen} />
      <Drawer.Screen name="Worklogs" component={WorklogsScreen} />
      <Drawer.Screen name="Sales" component={SalesScreen} />
      <Drawer.Screen name="Stores/Hubs" component={StoresScreen} />
      <Drawer.Screen name="Receipts (GRN)" component={GrnsScreen} />
    </Drawer.Navigator>
  );
}
