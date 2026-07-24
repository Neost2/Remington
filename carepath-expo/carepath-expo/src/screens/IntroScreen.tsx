import React, { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '@/components/Screen';
import Button from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { useAuth } from '@/auth/AuthContext';

export default function IntroScreen() {
  const navigation = useNavigation<any>();
  const { bootstrapping, token } = useAuth();
  const [pressed, setPressed] = useState(false);

  const canContinue = useMemo(() => !bootstrapping, [bootstrapping]);

  const onGetStarted = () => {
    setPressed(true);
    if (token) navigation.navigate('App');
    else navigation.navigate('Auth');
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>CarePath</Text>
        <Text style={styles.subtitle}>
          A transportation coordination tool that helps patients arrange reliable rides to medical appointments.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How it works</Text>
          <Text style={styles.cardBody}>1) Create an account (or log in)</Text>
          <Text style={styles.cardBody}>2) Submit a ride request</Text>
          <Text style={styles.cardBody}>3) A coordinator matches a driver</Text>
          <Text style={styles.cardBody}>4) You receive ride updates</Text>
        </View>

        {bootstrapping ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.text} />
            <Text style={styles.loadingText}>Checking session…</Text>
          </View>
        ) : null}

        <Button
          title={pressed ? 'Opening…' : 'Get started'}
          onPress={onGetStarted}
          disabled={!canContinue}
          style={{ marginTop: spacing.lg }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  cardBody: {
    color: colors.muted,
    fontSize: typography.body,
    marginBottom: spacing.xs,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loadingText: {
    color: colors.muted,
    marginLeft: spacing.sm,
  },
});
