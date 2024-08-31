import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [currentUsuario, setCurrentUsuario] = useState(null);
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
  });

  // Hardcoded values for validation (can be replaced with actual logic)
  const hardcodedUsername = 'admin';
  const hardcodedPassword = 'password123';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
    } else if (username === hardcodedUsername && password === hardcodedPassword) {
      Alert.alert('Registrado exitosamente');
      if (currentUsuario === null) {
        setUsuarios([...usuarios, { ...form, id: Date.now().toString() }]);
      } else {
        setUsuarios(
          usuarios.map(item =>
            item.id === currentUsuario.id ? { ...form, id: currentUsuario.id } : item
          )
        );
      }
      clearForm();
    } else {
      Alert.alert('Error', 'Las credenciales no son válidas.');
    }
  };

  const handleEdit = item => {
    setCurrentUsuario(item);
    setForm(item);
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
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Gestionar Usuarios</Text>

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

        {/* Hidden for now */}
        {/* <Text>Accesos Autorizados</Text>
        <TextInput
          style={styles.input}
          placeholder="Accesos Autorizados"
          value={form.accesosAutorizados}
          onChangeText={text => setForm({ ...form, accesosAutorizados: text })}
        /> */}

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
        <Button title="Limpiar Formulario" onPress={clearForm} color="gray" />
      </ScrollView>

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
  picker: {
    width: '100%',
    height: 40,
    marginBottom: 10,
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
