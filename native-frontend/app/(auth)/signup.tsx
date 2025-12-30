import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signupAPI } from '../../api/auth';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSignup = async () => {
    try {
      const response = await signupAPI(email, password, name, phone, address);
      Alert.alert('Signup successful', 'Please log in with your new account.');
      router.push('./login');
    } catch (error) {
      Alert.alert('Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" style={styles.input} value={password} secureTextEntry onChangeText={setPassword} />
      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Phone" style={styles.input} value={phone} onChangeText={setPhone} />
      <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
      <Button title="Sign Up" onPress={handleSignup} />
      <Text style={styles.link} onPress={() => router.push('/(auth)/login')}>
        Already have an account? Log in
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
