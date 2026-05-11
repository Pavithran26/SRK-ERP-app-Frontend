import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';
import AddEmployeeScreen from '../screens/AddEmployeeScreen';
import CreateGrnScreen from '../screens/CreateGrnScreen';
import AddVehicleScreen from '../screens/AddVehicleScreen';
import AddSaleScreen from '../screens/AddSaleScreen';
import AddLandScreen from '../screens/AddLandScreen';
import AddWorklogScreen from '../screens/AddWorklogScreen';
import AddStoreScreen from '../screens/AddStoreScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // Mock authentication state for now
  // In a real app, this would be managed by Context/Redux and secure store
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // We will pass this setter to the LoginScreen later
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* If not authenticated, show Login. Otherwise, show main App shell */}
      {!isAuthenticated ? (
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="MainApp">
            {(props) => <DrawerNavigator {...props} onLogout={handleLogout} />}
          </Stack.Screen>
          <Stack.Screen 
            name="AddEmployee" 
            component={AddEmployeeScreen} 
            options={{ 
              headerShown: true, 
              title: 'Add Employee',
              headerStyle: { backgroundColor: '#0F172A' },
              headerTintColor: '#F8FAFC',
            }}
          />
          <Stack.Screen 
            name="CreateGrn" 
            component={CreateGrnScreen} 
            options={{ 
              headerShown: true, 
              title: 'Create GRN',
              headerStyle: { backgroundColor: '#0F172A' },
              headerTintColor: '#F8FAFC',
            }}
          />
          <Stack.Screen 
            name="AddVehicle" 
            component={AddVehicleScreen} 
            options={{ 
              headerShown: true, 
              title: 'Add Vehicle',
              headerStyle: { backgroundColor: '#0F172A' },
              headerTintColor: '#F8FAFC',
            }}
          />
          <Stack.Screen 
            name="AddSale" 
            component={AddSaleScreen} 
            options={{ 
              headerShown: true, 
              title: 'Record Sale',
              headerStyle: { backgroundColor: '#0F172A' },
              headerTintColor: '#F8FAFC',
            }}
          />
          <Stack.Screen 
            name="AddLand" 
            component={AddLandScreen} 
            options={{ 
              headerShown: true, 
              title: 'Register Land',
              headerStyle: { backgroundColor: '#0F172A' },
              headerTintColor: '#F8FAFC',
            }}
          />
          <Stack.Screen 
            name="AddWorklog" 
            component={AddWorklogScreen} 
            options={{ 
              headerShown: true, 
              title: 'Record Work Log',
              headerStyle: { backgroundColor: '#0F172A' },
              headerTintColor: '#F8FAFC',
            }}
          />
          <Stack.Screen 
            name="AddStore" 
            component={AddStoreScreen} 
            options={{ 
              headerShown: true, 
              title: 'Add Store Hub',
              headerStyle: { backgroundColor: '#0F172A' },
              headerTintColor: '#F8FAFC',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
