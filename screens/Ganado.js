import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // For dropdowns
import DateTimePicker from '@react-native-community/datetimepicker'; // For date pickers

export default function Ganado() {
  const [ganado, setGanado] = useState([]);
  const [currentGanado, setCurrentGanado] = useState(null);
  const [form, setForm] = useState({
    name: '',
    raza: '',
    peso: '',
    sexo: '',
    edad: '',
    estadoSalud: '',
    fechaChequeo: new Date(),
    productividad: '',
    tratamientos: '',
    fechaNacimiento: new Date(),
    identificacion: 'Auto-generated', // Blocked field
  });

  const [showChequeoPicker, setShowChequeoPicker] = useState(false);
  const [showNacimientoPicker, setShowNacimientoPicker] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  // Function to save or update Ganado
  const handleSave = () => {
    if (currentGanado === null) {
      setGanado([...ganado, { ...form, id: Date.now().toString() }]);
    } else {
      setGanado(
        ganado.map(item =>
          item.id === currentGanado.id ? { ...form, id: currentGanado.id } : item
        )
      );
    }
    setIsModalVisible(false); // Close modal after saving
    clearForm();
  };

  const handleEdit = item => {
    setCurrentGanado(item);
    setForm(item);
    setIsModalVisible(true); // Open modal for editing
  };

  const handleDelete = id => {
    setGanado(ganado.filter(item => item.id !== id));
  };

  const clearForm = () => {
    setCurrentGanado(null);
    setForm({
      name: '',
      raza: '',
      peso: '',
      sexo: '',
      edad: '',
      estadoSalud: '',
      fechaChequeo: new Date(),
      productividad: '',
      tratamientos: '',
      fechaNacimiento: new Date(),
      identificacion: 'Auto-generated',
    });
  };

  const onChangeChequeo = (event, selectedDate) => {
    setShowChequeoPicker(false);
    if (selectedDate) {
      setForm({ ...form, fechaChequeo: selectedDate });
    }
  };

  const onChangeNacimiento = (event, selectedDate) => {
    setShowNacimientoPicker(false);
    if (selectedDate) {
      setForm({ ...form, fechaNacimiento: selectedDate });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Lista de Ganados</Text>

      {/* Button to open modal for creating new Ganado */}
      <Button title="Crear Nuevo Ganado" onPress={() => setIsModalVisible(true)} />

      {/* Modal for creating/updating Ganado */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{currentGanado ? 'Editar Ganado' : 'Crear Nuevo Ganado'}</Text>

          {/* Name Field */}
          <Text>Nombre del Ganado</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={form.name}
            onChangeText={text => setForm({ ...form, name: text })}
          />

          {/* Dropdowns and Date Pickers */}
          <Text>Raza</Text>
          <Picker
            selectedValue={form.raza}
            onValueChange={value => setForm({ ...form, raza: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione la Raza" value="" />
            <Picker.Item label="Raza 1" value="raza1" />
            <Picker.Item label="Raza 2" value="raza2" />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Peso"
            value={form.peso}
            onChangeText={text => setForm({ ...form, peso: text })}
            keyboardType="numeric"
          />

          <Text>Sexo</Text>
          <Picker
            selectedValue={form.sexo}
            onValueChange={value => setForm({ ...form, sexo: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Sexo" value="" />
            <Picker.Item label="Macho" value="macho" />
            <Picker.Item label="Hembra" value="hembra" />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Edad"
            value={form.edad}
            onChangeText={text => setForm({ ...form, edad: text })}
            keyboardType="numeric"
          />

          <Text>Estado de Salud</Text>
          <Picker
            selectedValue={form.estadoSalud}
            onValueChange={value => setForm({ ...form, estadoSalud: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Estado de Salud" value="" />
            <Picker.Item label="Sano" value="sano" />
            <Picker.Item label="Enfermo" value="enfermo" />
          </Picker>

          <Text>Fecha de Último Chequeo</Text>
          <TouchableOpacity onPress={() => setShowChequeoPicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="Seleccione la fecha"
              value={form.fechaChequeo.toLocaleDateString()}
              editable={false}
            />
          </TouchableOpacity>
          {showChequeoPicker && (
            <DateTimePicker
              value={form.fechaChequeo}
              mode="date"
              display="default"
              onChange={onChangeChequeo}
            />
          )}

          <Text>Productividad</Text>
          <Picker
            selectedValue={form.productividad}
            onValueChange={value => setForm({ ...form, productividad: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione la Productividad" value="" />
            <Picker.Item label="Alta" value="alta" />
            <Picker.Item label="Media" value="media" />
            <Picker.Item label="Baja" value="baja" />
          </Picker>

          <Text>Tratamientos</Text>
          <Picker
            selectedValue={form.tratamientos}
            onValueChange={value => setForm({ ...form, tratamientos: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Tratamiento" value="" />
            <Picker.Item label="Vacunas" value="vacunas" />
            <Picker.Item label="Medicamentos" value="medicamentos" />
          </Picker>

          <Text>Fecha de Nacimiento</Text>
          <TouchableOpacity onPress={() => setShowNacimientoPicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="Seleccione la fecha"
              value={form.fechaNacimiento.toLocaleDateString()}
              editable={false}
            />
          </TouchableOpacity>
          {showNacimientoPicker && (
            <DateTimePicker
              value={form.fechaNacimiento}
              mode="date"
              display="default"
              onChange={onChangeNacimiento}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Identificación Única"
            value={form.identificacion}
            editable={false}
          />

          <Button title={currentGanado ? 'Actualizar' : 'Guardar'} onPress={handleSave} />
          <Button title="Cerrar" onPress={() => setIsModalVisible(false)} color="gray" />
        </ScrollView>
      </Modal>

      {/* Table of Ganado */}
      <FlatList
        data={ganado}
        keyExtractor={(item, index) => `key-${index}`}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name} - {item.raza} - {item.identificacion}</Text>
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
        ListFooterComponent={() => <View><Text></Text></View>}
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
