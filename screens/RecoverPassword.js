import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

export default function RecoverPassword({ navigation }) {
  const [email, setEmail] = useState('');

    // Function to validate the email format
      const isValidEmail = (email) => {
        // Regular expression for a valid email format with domain '@pastoreo.com'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Standard email format
        const domain = '@pastoreo.com';  // Company domain

        // Check if the email matches the standard format and contains the domain
        return emailRegex.test(email) && email.endsWith(domain);
      };

  const handleRecoverPassword = () => {
    if (isValidEmail(email)) {
          // Recover password logic if email is valid
          Alert.alert('Revisa tu correo para recuperar la contraseña.');
          navigation.navigate('Login'); // Navigate back to login after recovery process
        } else {
          // Show error if the email is invalid
          Alert.alert('Error', 'El correo debe estar en el formato correcto y pertenecer al dominio @pastoreo.com.');
        }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Recuperar Contraseña" onPress={handleRecoverPassword} />
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
