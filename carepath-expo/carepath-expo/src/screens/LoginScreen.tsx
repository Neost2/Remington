import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '@/components/Screen';
import TextField from '@/components/TextField';
import Button from '@/components/Button';
import { useAuth } from '@/auth/AuthContext';
import { colors, spacing } from '@/theme';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await login({ email: email.trim().toLowerCase(), password });
      // RootNavigator will switch to App stack automatically.
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Login failed';
      Alert.alert('Login failed', String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to request a ride.</Text>

      <View style={{ marginTop: spacing.lg }}>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          secureTextEntry
          autoCapitalize="none"
        />

        <Button title="Log in" onPress={onSubmit} loading={loading} disabled={!email || !password} />

        <View style={{ height: spacing.lg }} />

        <Button
          title="Create account"
          onPress={() => navigation.navigate('Register')}
          variant="secondary"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: colors.muted, marginTop: spacing.xs },
});
