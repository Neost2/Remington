import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import Screen from '@/components/Screen';
import TextField from '@/components/TextField';
import Button from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { createRideRequestApi } from '@/api/rides';
import { useAuth } from '@/auth/AuthContext';

const isoNowPlusDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export default function RequestRideScreen() {
  const { user } = useAuth();

  // Minimal fields required by controller
  const [appointmentType, setAppointmentType] = useState('Specialist appointment');
  const [clinicName, setClinicName] = useState('Care Clinic');
  const [clinicCity, setClinicCity] = useState('');
  const [clinicState, setClinicState] = useState('AR');
  const [appointmentDate, setAppointmentDate] = useState(isoNowPlusDays(7));
  const [estimatedMiles, setEstimatedMiles] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupTime, setPickupTime] = useState(isoNowPlusDays(7));
  const [appointmentNotes, setAppointmentNotes] = useState('');

  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(clinicCity && clinicState && pickupAddress);
  }, [clinicCity, clinicState, pickupAddress]);

  const onSubmit = async () => {
    if (user?.role !== 'PATIENT') {
      Alert.alert('Not allowed', 'Only PATIENT accounts can request rides.');
      return;
    }

    try {
      setLoading(true);
      const miles = estimatedMiles.trim() ? Number(estimatedMiles) : null;

      const body = {
        appointmentType,
        clinicName,
        clinicCity,
        clinicState,
        appointmentDate, // must be parseable by new Date(...)
        estimatedMiles: miles,
        isRecurring: false,
        recurrenceNote: null,
        appointmentNotes: appointmentNotes.trim() || null,
        pickupAddress,
        pickupTime,
        creditId: null,
        urgencyLevel: 'NORMAL' as const,
        needsSameDayFallback: false,
        allowsCommunityVolunteer: false,
        requestedAdvanceWindowHours: null,
      };

      const created = await createRideRequestApi(body);
      Alert.alert('Ride request submitted', `Ride id: ${created?.id ?? 'created'}`);
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Request failed';
      Alert.alert('Request failed', String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Text style={styles.title}>Ride request</Text>
      <Text style={styles.subtitle}>All fields below are sent to your API on port 3001.</Text>

      <View style={{ height: spacing.lg }} />

      <TextField label="Appointment type" value={appointmentType} onChangeText={setAppointmentType} />
      <TextField label="Clinic name" value={clinicName} onChangeText={setClinicName} />
      <TextField label="Clinic city" value={clinicCity} onChangeText={setClinicCity} />
      <TextField label="Clinic state (2-letter)" value={clinicState} onChangeText={setClinicState} autoCapitalize="characters" />
      <TextField label="Appointment date (ISO)" value={appointmentDate} onChangeText={setAppointmentDate} />
      <TextField label="Estimated miles (optional)" value={estimatedMiles} onChangeText={setEstimatedMiles} keyboardType="numeric" />
      <TextField label="Pickup address" value={pickupAddress} onChangeText={setPickupAddress} />
      <TextField label="Pickup time (ISO)" value={pickupTime} onChangeText={setPickupTime} />
      <TextField label="Notes (optional)" value={appointmentNotes} onChangeText={setAppointmentNotes} />

      <View style={{ height: spacing.md }} />

      <Button title="Submit ride request" onPress={onSubmit} loading={loading} disabled={!canSubmit} />

      <View style={{ height: spacing.lg }} />

      <Text style={styles.noteTitle}>Common backend error</Text>
      <Text style={styles.note}>
        If you see: "Patient profile required before requesting a ride" — your backend expects a Patient profile row for this user.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: typography.h2, fontWeight: '800' },
  subtitle: { color: colors.muted, marginTop: spacing.xs },
  noteTitle: { color: colors.text, fontWeight: '800' },
  note: { color: colors.muted, marginTop: spacing.xs, lineHeight: 20 },
});
