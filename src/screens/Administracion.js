import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Administracion({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Módulo de Administración</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Usuarios')}>
          <Text style={styles.btnText}>Gestionar Usuarios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('PastoreoRotacion')}>
          <Text style={styles.btnText}>Gestionar Pastoreo o Rotación de Apartamentos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  btn: {
    borderColor: 'rgb(187, 204, 0)',
    fontFamily: 'system-ui',
    fontSize: 14,
    color: '#fff',
    padding: 10,
    width: 250,
    margin: 10,
    borderRadius: 50,
    backgroundColor: 'linear-gradient(90deg, rgb(0, 102, 204) 0%, rgb(197, 0, 204) 100%)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
});
