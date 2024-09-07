import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Apartamentos() {
  const [apartamentos, setApartamentos] = useState([]);
  const [currentApartamento, setCurrentApartamento] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  const [form, setForm] = useState({
    name: '',
    tamano: '',
    tipoPasto: '',
    tipoTierra: '',
    condicionesDrenaje: '',
    exposicionSolar: '',
    historialUso: '',
    capacidadCarga: '',
    distanciaRecursos: '',
    proximidadInstalaciones: '',
    frecuenciaUso: '',
  });

  const handleSave = () => {
    if (currentApartamento === null) {
      setApartamentos([...apartamentos, { ...form, id: Date.now().toString() }]);
    } else {
      setApartamentos(
        apartamentos.map(item =>
          item.id === currentApartamento.id ? { ...form, id: currentApartamento.id } : item
        )
      );
    }
    setIsModalVisible(false); // Close modal after saving
    clearForm();
  };

  const handleEdit = item => {
    setCurrentApartamento(item);
    setForm(item);
    setIsModalVisible(true); // Open modal for editing
  };

  const handleDelete = id => {
    setApartamentos(apartamentos.filter(item => item.id !== id));
  };

  const clearForm = () => {
    setCurrentApartamento(null);
    setForm({
      name: '',
      tamano: '',
      tipoPasto: '',
      tipoTierra: '',
      condicionesDrenaje: '',
      exposicionSolar: '',
      historialUso: '',
      capacidadCarga: '',
      distanciaRecursos: '',
      proximidadInstalaciones: '',
      frecuenciaUso: '',
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Lista de Apartamentos</Text>

      {/* Button to open modal for creating new Apartamento */}
      <Button title="Crear Nuevo Apartamento" onPress={() => setIsModalVisible(true)} />

      {/* Modal for creating/updating Apartamento */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{currentApartamento ? 'Editar Apartamento' : 'Crear Nuevo Apartamento'}</Text>

          {/* Name Field */}
          <Text>Nombre del Apartamento</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={form.name}
            onChangeText={text => setForm({ ...form, name: text })}
          />

          {/* Form for creating/updating an entry */}
          <TextInput
            style={styles.input}
            placeholder="Tamaño del Área (hectáreas)"
            value={form.tamano}
            onChangeText={text => setForm({ ...form, tamano: text })}
            keyboardType="numeric"
          />

          <Text>Tipo de Pasto</Text>
          <Picker
            selectedValue={form.tipoPasto}
            onValueChange={value => setForm({ ...form, tipoPasto: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Tipo de Pasto" value="" />
            <Picker.Item label="Pasto 1" value="pasto1" />
            <Picker.Item label="Pasto 2" value="pasto2" />
          </Picker>

          <Text>Tipo de Tierra</Text>
          <Picker
            selectedValue={form.tipoTierra}
            onValueChange={value => setForm({ ...form, tipoTierra: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Tipo de Tierra" value="" />
            <Picker.Item label="Tierra 1" value="tierra1" />
            <Picker.Item label="Tierra 2" value="tierra2" />
          </Picker>

          <Text>Condiciones de Drenaje</Text>
          <Picker
            selectedValue={form.condicionesDrenaje}
            onValueChange={value => setForm({ ...form, condicionesDrenaje: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione las Condiciones de Drenaje" value="" />
            <Picker.Item label="Buena" value="buena" />
            <Picker.Item label="Mala" value="mala" />
          </Picker>

          <Text>Exposición Solar</Text>
          <Picker
            selectedValue={form.exposicionSolar}
            onValueChange={value => setForm({ ...form, exposicionSolar: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione la Exposición Solar" value="" />
            <Picker.Item label="Alta" value="alta" />
            <Picker.Item label="Media" value="media" />
            <Picker.Item label="Baja" value="baja" />
          </Picker>

          <Text>Historial de Uso</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Historial de Uso"
            value={form.historialUso}
            onChangeText={text => setForm({ ...form, historialUso: text })}
            multiline
          />

          <Text>Capacidad de Carga</Text>
          <Picker
            selectedValue={form.capacidadCarga}
            onValueChange={value => setForm({ ...form, capacidadCarga: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione la Capacidad de Carga" value="" />
            <Picker.Item label="Alta" value="alta" />
            <Picker.Item label="Media" value="media" />
            <Picker.Item label="Baja" value="baja" />
          </Picker>

          <Text>Frecuencia de Uso</Text>
          <Picker
            selectedValue={form.frecuenciaUso}
            onValueChange={value => setForm({ ...form, frecuenciaUso: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione la Frecuencia de Uso" value="" />
            <Picker.Item label="Alta" value="alta" />
            <Picker.Item label="Media" value="media" />
            <Picker.Item label="Baja" value="baja" />
          </Picker>

          <Button title={currentApartamento ? 'Actualizar' : 'Guardar'} onPress={handleSave} />
          <Button title="Cerrar" onPress={() => setIsModalVisible(false)} color="gray" />
        </ScrollView>
      </Modal>

      {/* List of Apartamentos */}
      <FlatList
        data={apartamentos}
        keyExtractor={(item, index) => `key-${index}`}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name} - {item.tamano} hectáreas - {item.tipoPasto}</Text>
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
  textArea: {
    height: 80,
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
