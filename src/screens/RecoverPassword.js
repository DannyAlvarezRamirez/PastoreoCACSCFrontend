import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ImageBackground, Keyboard } from 'react-native';
import { Dialog, Portal, Provider, Button as PaperButton } from 'react-native-paper'; // Import Dialog components from react-native-paper
import request from '.src/objects/request'; // Import request object for API calls
import backgroundImage from '../assets/bg3.jpg';

export default function RecoverPassword({ navigation }) {
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
      navigation.navigate('Login'); // Navigate only if the flag is true
    }
  };

  // Function to handle password recovery
  const handleRecoverPassword = async () => {
    Keyboard.dismiss();  // Hide keyboard when the button is pressed

    if (!isValidEmail(email)) {
      setDialogMessage('El correo debe estar en el formato correcto y pertenecer al dominio @pastoreo.com.');
      setIsDialogVisible(true); // Show dialog
      return; // Stop execution if the email is invalid
    }

    try {
      // Configure the request
      request.setConfig({
        method: 'post',
        withCredentials: true,
        url: 'http://localhost:5075/api/Auth/checkEmail', // Update with your actual API endpoint
        data: { email },
      });

      // Send the request
      const response = await request.sendRequest();

      // Handle the response
      if (response.exitCode === 0) {
        setDialogMessage('Revisa tu correo para recuperar la contraseña.');
        setShouldNavigate(true); // Set navigation flag to true
        setIsDialogVisible(true); // Show dialog and on OK, navigate back to Login
      } else if (response.exitCode === 2) {
        setDialogMessage('El correo electrónico no existe en el sistema. Por favor, contacte a soporte.');
        setShouldNavigate(false); // Do not navigate
        setIsDialogVisible(true); // Show dialog
      } else if (response.exitCode === 3) {
        setDialogMessage('El usuario asociado a este correo está inactivo. Contacte a soporte.');
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
          <Text style={styles.title}>Recuperar Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Button title="Recuperar Contraseña" onPress={handleRecoverPassword} />
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
