import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

export default function Register({ navigation }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

    // Hardcoded test credentials for registration
      const hardcodedUsername = 'newuser';
      const hardcodedPassword = '12';

  const handleRegister = () => {
    // Check if the password and confirm password match
        if (password !== confirmPassword) {
          Alert.alert('Error', 'Las contraseñas no coinciden.');
        } else if (username === hardcodedUsername && password === hardcodedPassword) {
          // If credentials match the hardcoded values, proceed with registration
          Alert.alert('Registrado exitosamente');
          navigation.navigate('Login');  // Navigate to Login screen after successful registration
        } else {
          // If the credentials do not match the hardcoded ones, show an error
          Alert.alert('Error', 'Las credenciales no son válidas.');
        }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
});
