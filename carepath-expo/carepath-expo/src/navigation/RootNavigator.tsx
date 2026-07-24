import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@/auth/AuthContext';
import IntroScreen from '@/screens/IntroScreen';
import AuthNavigator from './auth/AuthNavigator';
import AppNavigator from './app/AppNavigator';
import { colors } from '@/theme';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { bootstrapping, token } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="Intro" component={IntroScreen} />

      {bootstrapping ? (
        // While bootstrapping, keep Intro on screen.
        // Intro has a built-in loading indicator.
        <></>
      ) : token ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
