import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Tooltip } from 'react-native-elements';

export default function Suministros() {
  const [suministros, setSuministros] = useState([]);
  const [currentSuministro, setCurrentSuministro] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // For showing/hiding modal

  const [form, setForm] = useState({
    name: '',
    tipoSuministro: '',
    notas: '',
    cantidad: '',
  });

  const handleSave = () => {
    if (currentSuministro === null) {
      setSuministros([...suministros, { ...form, id: Date.now().toString() }]);
    } else {
      setSuministros(
        suministros.map(item =>
          item.id === currentSuministro.id ? { ...form, id: currentSuministro.id } : item
        )
      );
    }
    setIsModalVisible(false); // Close the modal after saving
    clearForm();
  };

  const handleEdit = item => {
    setCurrentSuministro(item);
    setForm(item);
    setIsModalVisible(true); // Open modal for editing
  };

  const handleDelete = id => {
    setSuministros(suministros.filter(item => item.id !== id));
  };

  const clearForm = () => {
    setCurrentSuministro(null);
    setForm({
      name: '',
      tipoSuministro: '',
      notas: '',
      cantidad: '',
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Lista de Suministros</Text>

      {/* Button to open modal for creating new Suministro */}
      <Button title="Crear Nuevo Suministro" onPress={() => setIsModalVisible(true)} />

      {/* Modal for creating/updating Suministro */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{currentSuministro ? 'Editar Suministro' : 'Crear Nuevo Suministro'}</Text>

          {/* Name Field */}
          <Text>Nombre del Suministro</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={form.name}
            onChangeText={text => setForm({ ...form, name: text })}
          />

          {/* Tipo de Suministro */}
          <Text>Tipo de Suministro</Text>
          <Picker
            selectedValue={form.tipoSuministro}
            onValueChange={value => setForm({ ...form, tipoSuministro: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Tipo de Suministro" value="" />
            <Picker.Item label="Pasto" value="pasto" />
            <Picker.Item label="Fertilizante" value="fertilizante" />
            <Picker.Item label="Herbicida-Pesticida" value="herbicida-pesticida" />
            <Picker.Item label="Alimento" value="alimento" />
            <Picker.Item label="Equipo de Manejo" value="equipo-de-manejo" />
            <Picker.Item label="Medicamento" value="medicamento" />
            <Picker.Item label="Vacuna" value="vacuna" />
            <Picker.Item label="Herramienta de Mantenimiento" value="herramienta-de-mantenimiento" />
            <Picker.Item label="Otro Tipo" value="otro-tipo" />
            <Picker.Item label="Agua" value="agua" />
            <Picker.Item label="Energía" value="energia" />
          </Picker>

          {/* Notas */}
          <Text>Notas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notas adicionales"
            value={form.notas}
            onChangeText={text => setForm({ ...form, notas: text })}
            multiline
          />

          {/* Cantidad */}
          <Text>Cantidad</Text>
          <View style={styles.inputWithTooltip}>
            <TextInput
              style={styles.input}
              placeholder={form.tipoSuministro === 'agua' ? "Litros" : form.tipoSuministro === 'energia' ? "Watts" : "Cantidad"}
              value={form.cantidad}
              onChangeText={text => setForm({ ...form, cantidad: text })}
              keyboardType="numeric"
            />
            {(form.tipoSuministro === 'agua' || form.tipoSuministro === 'energia') && (
              <Tooltip
                popover={
                  <Text style={styles.tooltipText}>
                    Este campo puede estar vacío, si desea manejarlo de otra manera, por favor, contactar a soporte técnico.
                  </Text>
                }
                height={100}
                width={200}
                backgroundColor="#000"
                withOverlay={false}
                containerStyle={{ justifyContent: 'center' }}
              >
                <Text style={styles.tooltipIcon}>ℹ️</Text>
              </Tooltip>
            )}
          </View>

          <Button title={currentSuministro ? 'Actualizar' : 'Guardar'} onPress={handleSave} />
          <Button title="Cerrar" onPress={() => setIsModalVisible(false)} color="gray" />
        </ScrollView>
      </Modal>

      {/* Table of Suministros */}
      <FlatList
        data={suministros}
        keyExtractor={(item, index) => `key-${index}`}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name} - {item.tipoSuministro} - {item.cantidad}</Text>
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
  inputWithTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tooltipIcon: {
    marginLeft: 5,
    color: '#666',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
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
