import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { loginAPI } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginAPI(email, password);
      if (response?.token) {
        await login(response.token);
        Alert.alert('Login Successful', 'Welcome back!');
        router.replace('/(tabs)');
      } else {
        throw new Error('Invalid response');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error) || 'Something went wrong';
      Alert.alert('Login Failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#A3A3A3"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        placeholderTextColor="#A3A3A3"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => router.push('/(auth)/signup')}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 10 },
  link: { marginTop: 20, textAlign: 'center', color: 'blue' },
});
