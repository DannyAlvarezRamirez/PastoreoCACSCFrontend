import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, ImageBackground  } from 'react-native';
import { Dialog, Portal, Provider } from 'react-native-paper';  // Import Paper Dialog components
// Import the background image
import backgroundImage from '../assets/bg2.jpg';
import userIcon from '../assets/usuario(1)-modified.png'
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import for storing the token

// Import the request service
import request from '../objects/request';  // Adjust the path as per your project structure

export default function Login({ navigation, setIsAuthenticated  }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const showDialog = (message) => {
    setDialogMessage(message);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const handleLogin = async () => {
    //Keyboard.dismiss();  // Hide keyboard when the button is pressed

    try {
          // Set up the API request configuration
          request.setConfig({
            method: 'post', // Use POST method
            withCredentials: true,
            url: 'http://localhost:5075/api/Auth/login',  // Replace with your API login endpoint
            data: { username, password }  // Send the username and password in the request body
          });

          // Send the login request
          const response = await request.sendRequest();

          if (response.exitCode === 0) {
            // Store the token in AsyncStorage for future API calls
            await AsyncStorage.setItem('token', response.Token);
            setIsAuthenticated(true);  // Set authentication to true
            navigation.navigate('Dashboard');  // Navigate to Dashboard on successful login
          } else {
            // If login fails, show an alert
            showDialog('Usuario o contraseña incorrectos, o el usuario esta inactivo.');
          }
        } catch (error) {
          // Show an alert if there is an error in the API call
          showDialog('Ha ocurrido un problema en el inicio de sesión. Inténtelo de nuevo.');
          console.error('Login error:', error);
        }
  };

  return (
    <Provider>
      <ImageBackground source={backgroundImage} resizeMode="cover"  style={styles.background}>
          <View style={styles.container}>
            {/* Add the logo */}
            <Image
              source={userIcon} // Placeholder person icon
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

          {/* Dialog to show messages */}
                  <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                      <Dialog.Title>Atención</Dialog.Title>
                      <Dialog.Content>
                        <Text>{dialogMessage}</Text>
                      </Dialog.Content>
                      <Dialog.Actions>
                        <Button onPress={hideDialog} title="OK" />
                      </Dialog.Actions>
                    </Dialog>
                  </Portal>
      </ImageBackground>
    </Provider>
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
