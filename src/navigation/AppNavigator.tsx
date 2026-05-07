import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';

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
        <Stack.Screen name="MainApp">
          {(props) => <DrawerNavigator {...props} onLogout={handleLogout} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
