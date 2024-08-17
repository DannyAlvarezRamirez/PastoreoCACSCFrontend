import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, ImageBackground  } from 'react-native';

// Import the background image
import backgroundImage from '../assets/bg.jpg';

export default function Login({ navigation, setIsAuthenticated  }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

    // Hardcoded test credentials
    const testUsername = 'admin';
    const testPassword = 'password123';
    const hardcodedUsername = 'newuser';
    const hardcodedPassword = '12';

  const handleLogin = () => {
    // Add login logic here (authentication)
    //console.log('Logging in with', username, password);
    //navigation.navigate('Dashboard'); // Navigate to Dashboard on successful login

    // Check if username and password match the hardcoded values
        if (username === testUsername && password === testPassword ||
        username === hardcodedUsername && password === hardcodedPassword) {
          setIsAuthenticated(true);  // Set authentication to true, which will navigate to the dashboard
          navigation.navigate('Dashboard');  // Navigate to the Dashboard
        }
        else {
          // Show an alert if the login fails
          Alert.alert('Error', 'Usuario o contraseña incorrectos.');
        }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
          <View style={styles.container}>
            {/* Add the logo */}
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/person-male.png' }} // Placeholder person icon
              style={styles.logo}
            />
            <Text style={styles.title}>Iniciar Sesión</Text>
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
            <Button title="Iniciar Sesión" onPress={handleLogin} />
            <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
              Registrarse
            </Text>
            <Text style={styles.link} onPress={() => navigation.navigate('RecoverPassword')}>
              Recuperar Contraseña
            </Text>
          </View>
        </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
      flex: 1,
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',  // Center the content vertically
      alignItems: 'center',       // Center the content horizontally
      padding: 20,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,  // Space between logo and title
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: 'white',
    },
    input: {
      width: '80%',
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      backgroundColor: '#fff', // White background for inputs
      borderRadius: 5,
    },
    link: {
      color: 'white',
      marginTop: 10,
      textAlign: 'center',
    },
});
