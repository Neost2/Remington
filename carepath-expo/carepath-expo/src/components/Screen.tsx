import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, spacing } from '@/theme';

export default function Screen(props: {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
}) {
  if (props.scroll) {
    return (
      <ScrollView style={styles.root} contentContainerStyle={[styles.scrollContent, props.contentStyle]}>
        {props.children}
      </ScrollView>
    );
  }

  return <View style={[styles.root, styles.content, props.contentStyle]}>{props.children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.xl,
  },
  scrollContent: {
    padding: spacing.xl,
  },
});
