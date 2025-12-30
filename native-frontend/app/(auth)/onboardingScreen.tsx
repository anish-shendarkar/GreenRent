import React, { useContext } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function OnboardingScreen() {
  const { completeOnboarding } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <Text style={styles.subtitle}>Swipe through or tap below to get started.</Text>
      <Button title="Finish Onboarding" onPress={completeOnboarding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
});
