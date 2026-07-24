import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '@/components/Screen';
import TextField from '@/components/TextField';
import Button from '@/components/Button';
import { useAuth } from '@/auth/AuthContext';
import { colors, spacing } from '@/theme';
import type { Role } from '@/types/api';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // For your request: default to PATIENT, because only PATIENT can create ride requests.
  const role: Role = 'PATIENT';

  const onSubmit = async () => {
    try {
      setLoading(true);
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role,
      });
      // RootNavigator will switch to App stack automatically.
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Registration failed';
      Alert.alert('Registration failed', String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>You’ll need an account before requesting a ride.</Text>

      <View style={{ marginTop: spacing.lg }}>
        <TextField label="First name" value={firstName} onChangeText={setFirstName} placeholder="Remington" autoCapitalize="words" />
        <TextField label="Last name" value={lastName} onChangeText={setLastName} placeholder="Smith" autoCapitalize="words" />
        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" />
        <TextField label="Phone" value={phone} onChangeText={setPhone} placeholder="555-555-5555" keyboardType="phone-pad" />
        <TextField label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry />

        <Button
          title="Create account"
          onPress={onSubmit}
          loading={loading}
          disabled={!firstName || !lastName || !email || !phone || !password}
        />

        <View style={{ height: spacing.lg }} />

        <Button title="Back to login" onPress={() => navigation.navigate('Login')} variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: colors.muted, marginTop: spacing.xs },
});
