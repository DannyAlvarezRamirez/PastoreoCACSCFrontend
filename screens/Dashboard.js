import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';

// Import the background image
import backgroundImage from '../assets/bg2.jpg';

export default function Dashboard({ navigation }) {
  return (
  <ImageBackground source={backgroundImage} resizeMode="cover"  style={styles.background}>
    <View style={styles.container}>
      <Text style={styles.title}>Estado del Pastoreo</Text>
      <Text style={styles.content}>Cantidad de Ganado: 50</Text>
      <Text style={styles.content}>Estado del Pastoreo: Bueno</Text>

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
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // Center the content vertically
    alignItems: 'center',       // Center the content horizontally
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
    justifyContent: 'center',   // Align buttons to the center
  },
  btn: {
    cursor: 'pointer',
    borderColor: 'rgb(187, 204, 0)',
    fontFamily: 'system-ui',
    fontSize: 14,
    color: '#fff',
    padding: 10,
    width: 160,               // Adjust button width
    margin: 10,               // Spacing between buttons
    borderRadius: 50,         // Rounded corners
    backgroundColor: 'linear-gradient(90deg, rgb(0, 102, 204) 0%, rgb(197, 0, 204) 100%)',  // Gradient background
    shadowColor: '#000',      // Shadow effect
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
  btnHover: {
    width: 162,  // Width on hover
    backgroundColor: 'rgb(0, 102, 204)',
    borderColor: 'rgb(204, 0, 105)',
    borderWidth: 2,
  },
  background: {
        flex: 1,
        justifyContent: 'center',
  },
});
