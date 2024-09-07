import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Function to validate the email format
const isValidEmail = (email) => {
  // Regular expression for a valid email format with domain '@pastoreo.com'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Standard email format
  const domain = '@pastoreo.com';  // Company domain

  // Check if the email matches the standard format and contains the domain
  return emailRegex.test(email) && email.endsWith(domain);
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  const [form, setForm] = useState({
    nombreCompleto: '',
    usuario: '', // New Usuario field
    rol: '',
    correoElectronico: '',
    telefonoContacto: '',
    fechaInicio: new Date(),
    numeroIdentificacion: '',
    // accesosAutorizados: '', // Hidden for now
    ultimoAcceso: new Date(),
    estadoCuenta: '',
    password: '', // New password field
    confirmPassword: '' // Confirm password field
  });

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,10}$/;
    return passwordRegex.test(password);
  };

  const handleSave = () => {
    // Validate email format
      if (!isValidEmail(form.correoElectronico)) {
        Alert.alert('Error', 'El correo electrónico debe estar en el formato correcto y pertenecer al dominio @pastoreo.com.');
      return;
    }

    // Validate password length and characters
    if (!validatePassword(form.password)) {
      Alert.alert('Error', 'La contraseña debe tener entre 8 y 10 caracteres, solo letras y números, y no debe contener espacios.');
      return;
    }

    // Check if the passwords match
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (currentUsuario === null) {
      setUsuarios([...usuarios, { ...form, id: Date.now().toString() }]);
    } else {
      setUsuarios(
        usuarios.map(item =>
          item.id === currentUsuario.id ? { ...form, id: currentUsuario.id } : item
        )
      );
    }
    setIsModalVisible(false); // Close modal after saving
    clearForm();
  };

  const handleEdit = item => {
    setCurrentUsuario(item);
    setForm(item);
    setIsModalVisible(true); // Open modal for editing
  };

  const handleDelete = id => {
    setUsuarios(usuarios.filter(item => item.id !== id));
  };

  const clearForm = () => {
    setCurrentUsuario(null);
    setForm({
      nombreCompleto: '',
      usuario: '',
      rol: '',
      correoElectronico: '',
      telefonoContacto: '',
      fechaInicio: new Date(),
      numeroIdentificacion: '',
      // accesosAutorizados: '', // Hidden for now
      ultimoAcceso: new Date(),
      estadoCuenta: '',
      password: '', // Reset password field
      confirmPassword: '' // Reset confirm password field
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Lista de Usuarios</Text>

      {/* Button to open modal for creating new Usuario */}
      <Button title="Crear Nuevo Usuario" onPress={() => setIsModalVisible(true)} />

      {/* Modal for creating/updating Usuario */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{currentUsuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</Text>

          <Text>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            value={form.nombreCompleto}
            onChangeText={text => setForm({ ...form, nombreCompleto: text })}
          />

          <Text>Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            value={form.usuario}
            onChangeText={text => setForm({ ...form, usuario: text })}
          />

          <Text>Rol</Text>
          <Picker
            selectedValue={form.rol}
            onValueChange={value => setForm({ ...form, rol: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Rol" value="" />
            <Picker.Item label="Administrador" value="Administrador" />
            <Picker.Item label="Técnico" value="Tecnico" />
            <Picker.Item label="Analista" value="Analista" />
          </Picker>

          <Text>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            value={form.correoElectronico}
            onChangeText={text => setForm({ ...form, correoElectronico: text })}
            keyboardType="email-address"
          />

          <Text>Teléfono de Contacto</Text>
          <TextInput
            style={styles.input}
            placeholder="Teléfono de Contacto"
            value={form.telefonoContacto}
            onChangeText={text => setForm({ ...form, telefonoContacto: text })}
            keyboardType="phone-pad"
          />

          <Text>Número de Identificación</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de Identificación"
            value={form.numeroIdentificacion}
            onChangeText={text => setForm({ ...form, numeroIdentificacion: text })}
            keyboardType="numeric"
          />

          <Text>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña (8-10 caracteres)"
            value={form.password}
            onChangeText={text => setForm({ ...form, password: text })}
            secureTextEntry
          />

          <Text>Confirmar Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmar Contraseña"
            value={form.confirmPassword}
            onChangeText={text => setForm({ ...form, confirmPassword: text })}
            secureTextEntry
          />

          <Text>Estado de la Cuenta</Text>
          <Picker
            selectedValue={form.estadoCuenta}
            onValueChange={value => setForm({ ...form, estadoCuenta: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Estado de la Cuenta" value="" />
            <Picker.Item label="Activo" value="activo" />
            <Picker.Item label="Inactivo" value="inactivo" />
          </Picker>

          <Button title={currentUsuario ? 'Actualizar' : 'Guardar'} onPress={handleSave} />
          <Button title="Cerrar" onPress={() => setIsModalVisible(false)} color="gray" />
        </ScrollView>
      </Modal>

      {/* List of Usuarios */}
      <FlatList
        data={usuarios}
        keyExtractor={(item, index) => `key-${index}`}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.nombreCompleto} - {item.rol}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <View>
            <Text></Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 75,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editText: {
    color: 'blue',
  },
  deleteText: {
    color: 'red',
  },
});
