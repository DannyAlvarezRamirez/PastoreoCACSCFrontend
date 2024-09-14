import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { Dialog, Portal, Provider, Button as PaperButton } from 'react-native-paper'; // Import Dialog components
import request from '../objects/request'; // Import the request object for API calls
import backgroundImage from '../assets/bg2.jpg';

export default function Dashboard({ navigation }) {
  const [ganado, setGanado] = useState(null); // State for Cantidad de Ganado
  const [estadoPastoreo, setEstadoPastoreo] = useState(null); // State for Estado del Pastoreo
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isDialogVisible, setIsDialogVisible] = useState(false); // State to control dialog visibility
  const [dialogMessage, setDialogMessage] = useState(''); // State for the dialog message

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      // Configure the request
      request.setConfig({
        method: 'get',
        withCredentials: true,
        url: 'http://localhost:5075/api/Dashboard/getEstadoGanadoPastoreo', // Replace with your actual API endpoint
      });

      // Send the request
      const response = await request.sendRequest();

      // Handle the response
      if (response.exitCode === 0 && response.data) {
        const { ganado, estadoPastoreo } = response.data[0];
        setGanado(ganado); // Set Cantidad de Ganado
        setEstadoPastoreo(estadoPastoreo); // Set Estado del Pastoreo
      } else {
        // If there is an error in the response, show a dialog
        setDialogMessage('Error al cargar los datos. Inténtelo de nuevo más tarde.');
        setIsDialogVisible(true);
      }
    } catch (error) {
      // Handle any errors in the API call
      setDialogMessage('Ha ocurrido un problema al recuperar los datos. Inténtelo de nuevo más tarde.');
      setIsDialogVisible(true);
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Hide loading spinner after data is fetched
    }
  };

  // Use useEffect to fetch data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle closing the dialog
  const handleDialogOk = () => {
    setIsDialogVisible(false); // Close the dialog
  };

  return (
    <Provider>
      <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Estado del Pastoreo</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" /> // Show spinner while loading
          ) : (
            <>
              <Text style={styles.content}>Cantidad de Ganado: {ganado !== null ? ganado : 'N/A'}</Text>
              <Text style={styles.content}>Estado del Pastoreo: {estadoPastoreo !== null ? estadoPastoreo : 'N/A'}</Text>
            </>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Registro')}>
              <Text style={styles.btnText}>Registro de Datos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Reportes')}>
              <Text style={styles.btnText}>Reportes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Administracion')}>
              <Text style={styles.btnText}>Administración</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Notificaciones')}>
              <Text style={styles.btnText}>Notificaciones</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dialog to display the error message */}
        <Portal>
          <Dialog visible={isDialogVisible} onDismiss={handleDialogOk}>
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              <Text>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <PaperButton onPress={handleDialogOk}>OK</PaperButton> {/* Close dialog on press */}
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
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btn: {
    cursor: 'pointer',
    borderColor: 'rgb(187, 204, 0)',
    fontSize: 14,
    color: '#fff',
    padding: 10,
    width: 160,
    margin: 10,
    borderRadius: 50,
    backgroundColor: 'linear-gradient(90deg, rgb(0, 102, 204) 0%, rgb(197, 0, 204) 100%)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    transition: 'all 0.3s ease-in-out',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
});
