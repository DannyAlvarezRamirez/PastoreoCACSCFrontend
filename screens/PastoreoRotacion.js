import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function PastoreoRotacion() {
  const [rotaciones, setRotaciones] = useState([]);
  const [currentRotacion, setCurrentRotacion] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  const [form, setForm] = useState({
    tiempoInicio: new Date(),
    tiempoFinalizacion: new Date(),
    temporada: '',
    apartamentoUtilizado: '',
    cantidadGanadoActual: '',
    cantidadMaximaRecomendada: '',
    tipoGanado: '',
    registroEventos: '',
    eficienciaPastoreo: '',
    observaciones: '',
  });

  const handleSave = () => {
    if (currentRotacion === null) {
      setRotaciones([...rotaciones, { ...form, id: Date.now().toString() }]);
    } else {
      setRotaciones(
        rotaciones.map(item =>
          item.id === currentRotacion.id ? { ...form, id: currentRotacion.id } : item
        )
      );
    }
    setIsModalVisible(false); // Close modal after saving
    clearForm();
  };

  const handleEdit = item => {
    setCurrentRotacion(item);
    setForm(item);
    setIsModalVisible(true); // Open modal for editing
  };

  const handleDelete = id => {
    setRotaciones(rotaciones.filter(item => item.id !== id));
  };

  const clearForm = () => {
    setCurrentRotacion(null);
    setForm({
      tiempoInicio: new Date(),
      tiempoFinalizacion: new Date(),
      temporada: '',
      apartamentoUtilizado: '',
      cantidadGanadoActual: '',
      cantidadMaximaRecomendada: '',
      tipoGanado: '',
      registroEventos: '',
      eficienciaPastoreo: '',
      observaciones: '',
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Lista de Rotaciones</Text>

      {/* Button to open modal for creating new Rotacion */}
      <Button title="Crear Nueva Rotación" onPress={() => setIsModalVisible(true)} />

      {/* Modal for creating/updating Rotacion */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{currentRotacion ? 'Editar Rotación' : 'Crear Nueva Rotación'}</Text>

          <Text>Tiempo de Inicio</Text>
          <TextInput
            style={styles.input}
            placeholder="Tiempo de Inicio"
            value={form.tiempoInicio.toLocaleDateString()}
            editable={false}
          />

          <Text>Tiempo de Finalización</Text>
          <TextInput
            style={styles.input}
            placeholder="Tiempo de Finalización"
            value={form.tiempoFinalizacion.toLocaleDateString()}
            editable={false}
          />

          <Text>Temporada</Text>
          <TextInput
            style={styles.input}
            placeholder="Temporada"
            value={form.temporada}
            onChangeText={text => setForm({ ...form, temporada: text })}
          />

          <Text>Apartamento Utilizado</Text>
          <TextInput
            style={styles.input}
            placeholder="Apartamento Utilizado"
            value={form.apartamentoUtilizado}
            onChangeText={text => setForm({ ...form, apartamentoUtilizado: text })}
          />

          <Text>Cantidad de Ganado Actual</Text>
          <TextInput
            style={styles.input}
            placeholder="Cantidad de Ganado Actual"
            value={form.cantidadGanadoActual}
            onChangeText={text => setForm({ ...form, cantidadGanadoActual: text })}
            keyboardType="numeric"
          />

          <Text>Cantidad Máxima Recomendada</Text>
          <TextInput
            style={styles.input}
            placeholder="Cantidad Máxima Recomendada"
            value={form.cantidadMaximaRecomendada}
            onChangeText={text => setForm({ ...form, cantidadMaximaRecomendada: text })}
            keyboardType="numeric"
          />

          <Text>Tipo de Ganado</Text>
          <Picker
            selectedValue={form.tipoGanado}
            onValueChange={value => setForm({ ...form, tipoGanado: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Tipo de Ganado" value="" />
            <Picker.Item label="Lechero" value="lechero" />
            <Picker.Item label="Carne" value="carne" />
          </Picker>

          <Text>Registro de Eventos</Text>
          <TextInput
            style={styles.input}
            placeholder="Registro de Eventos"
            value={form.registroEventos}
            onChangeText={text => setForm({ ...form, registroEventos: text })}
          />

          <Text>Eficiencia del Pastoreo</Text>
          <TextInput
            style={styles.input}
            placeholder="Eficiencia del Pastoreo"
            value={form.eficienciaPastoreo}
            onChangeText={text => setForm({ ...form, eficienciaPastoreo: text })}
          />

          <Text>Observaciones</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observaciones"
            value={form.observaciones}
            onChangeText={text => setForm({ ...form, observaciones: text })}
            multiline
          />

          <Button title={currentRotacion ? 'Actualizar' : 'Guardar'} onPress={handleSave} />
          <Button title="Cerrar" onPress={() => setIsModalVisible(false)} color="gray" />
        </ScrollView>
      </Modal>

      {/* List of Rotaciones */}
      <FlatList
        data={rotaciones}
        keyExtractor={(item, index) => `key-${index}`}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.temporada} - {item.apartamentoUtilizado}</Text>
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
  textArea: {
    height: 80,
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
