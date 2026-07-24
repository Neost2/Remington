import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import RequestRideScreen from '@/screens/RequestRideScreen';
import { colors } from '@/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'CarePath' }} />
      <Stack.Screen name="RequestRide" component={RequestRideScreen} options={{ title: 'Request a ride' }} />
    </Stack.Navigator>
  );
}
