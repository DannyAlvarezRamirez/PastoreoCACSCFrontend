import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ImageBackground, Keyboard } from 'react-native';
import { Dialog, Portal, Provider, Button as PaperButton } from 'react-native-paper';  // Import Paper Dialog components
import request from '../objects/request';
import backgroundImage from '../assets/bg3.jpg';

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false); // State to control dialog visibility
  const [dialogMessage, setDialogMessage] = useState(''); // State for the dialog message
  const [shouldNavigate, setShouldNavigate] = useState(false); // Control navigation after closing dialog

  // Email validation logic
  const isValidEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9]{1,8}@pastoreo\.com$/; // Maximum of 8 characters before @, only letters and numbers
    return emailRegex.test(email);
  };

  // Function to handle closing the dialog
  const handleDialogOk = () => {
    setIsDialogVisible(false); // Close the dialog
    if (shouldNavigate) {
      navigation.navigate('RecoverPassword'); // Navigate only if the flag is true
    }
  };

  // Function to handle registration
  const handleRegister = async () => {
    Keyboard.dismiss();  // Hide keyboard when the button is pressed

    // If email is invalid, show the validation dialog and return early
    if (!isValidEmail(email)) {
      setDialogMessage('El correo electrónico no es válido. Debe tener un máximo de 8 caracteres antes del @, sin espacios, y usar el dominio @pastoreo.com.');
      setIsDialogVisible(true); // Show dialog
      return; // Stop execution if email is not valid
    }

    try {
      // Configure the request
      request.setConfig({
        method: 'post',
        withCredentials: true,
        url: 'http://localhost:5075/api/Auth/checkEmail',
        data: { email },
      });

      // Send the request
      const response = await request.sendRequest();

      // Handle the response
      if (response.exitCode === 0) {
        // If the email exists and the user is active
        setDialogMessage(`Su nombre de usuario es ${response.data[0].username}. Redirigiendo a la recuperación de contraseña.`);
        setShouldNavigate(true); // Set navigation flag to true
        setIsDialogVisible(true); // Show dialog
      } else if (response.exitCode === 2) {
        setDialogMessage('El correo electrónico no existe en el sistema. Por favor, contacte a soporte.');
        setShouldNavigate(false); // Do not navigate
        setIsDialogVisible(true); // Show dialog
      } else if (response.exitCode === 3) {
        setDialogMessage(`El usuario está inactivo. Nombre de usuario: ${response.data[0].username.value}. Contacte a soporte.`);
        setShouldNavigate(false); // Do not navigate
        setIsDialogVisible(true); // Show dialog
      }
    } catch (error) {
      setDialogMessage('Ha ocurrido un problema. Inténtelo de nuevo más tarde.');
      setShouldNavigate(false); // Do not navigate
      setIsDialogVisible(true); // Show dialog
      console.error('Error:', error);
    }
  };

  return (
    <Provider>
      <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Registrarse</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico institucional"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Button title="Registrar" onPress={handleRegister} />
        </View>

        {/* Dialog to display the message */}
        <Portal>
          <Dialog visible={isDialogVisible} onDismiss={handleDialogOk}>
            <Dialog.Title>Información</Dialog.Title>
            <Dialog.Content>
              <Text>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <PaperButton onPress={handleDialogOk}>OK</PaperButton> {/* When OK is pressed, close the dialog */}
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ImageBackground>
    </Provider>
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
    color: 'white',
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
  background: {
    flex: 1,
    justifyContent: 'center',
  },
});
