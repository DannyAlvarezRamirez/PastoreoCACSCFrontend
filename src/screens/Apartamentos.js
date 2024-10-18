import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dialog, Portal, Provider } from "react-native-paper"; // Import Paper Dialog components
import request from "./src/objects/request";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import for storing the token and user data

export default function Apartamentos() {
  const [apartamentos, setApartamentos] = useState([]);
  const [currentApartamento, setCurrentApartamento] = useState(null);
  const [form, setForm] = useState({
    tamanoArea: 0,
    descripcion: '',
    tipoPastoId: 0,
    tipoTierraId: 0,
    drenajeId: 0,
    expoSolarId: 0,
    capaCargaId: 0,
    frecuenciaUsoId: 0,
  });
  const [filters, setFilters] = useState({ ...form }); // State to handle the filter inputs
  const [tiposPasto, setTiposPasto] = useState([]); // State for tipoPasto options
  const [tiposTierra, setTiposTierra] = useState([]); // State for tipoTierra options
  const [drenajes, setDrenajes] = useState([]); // State for drenajes options
  const [exposSolar, setExposSolar] = useState([]); // State for expoSolar options
  const [capasCarga, setCapasCarga] = useState([]); // State for capaCarga options
  const [frecuenciasUso, setFrecuenciasUso] = useState([]); // State for frecuenciaUso options
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility (form)
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false); // State for search result modal visibility
  const [isDialogVisible, setIsDialogVisible] = useState(false); // State for dialog visibility
  const [dialogMessage, setDialogMessage] = useState(""); // State for the dialog message

  const clearForm = () => {
    setCurrentApartamento(null);
    setForm({
      tamanoArea: 0,
      descripcion: '',
      tipoPastoId: 0,
      tipoTierraId: 0,
      drenajeId: 0,
      expoSolarId: 0,
      capaCargaId: 0,
      frecuenciaUsoId: 0,
    });
  };

  const handleSave = async () => {
    try {
        // Retrieve the username from AsyncStorage
        const username = await AsyncStorage.getItem('user');

      if (currentApartamento === null) {
        // Create a new Apartamento (Guardar)
        // Add the username to the form data before making the request
        const formDataWithUsername = {
            ...form,
            creadoPor: username, // Add the username retrieved from AsyncStorage 
        };

        request.setConfig({
          method: "post",
          withCredentials: true,
          url: "http://localhost:5075/api/Apartamentos/create", // Replace with your API endpoint for creating Apartamentos
          data: formDataWithUsername, // Send the form data with username 
        });
        const response = await request.sendRequest();

        if (response.success) {
          setDialogMessage("Apartamento creado exitosamente.");
          setApartamentos([...apartamentos, response.data]); // Add the new apartamento to the list
        }
        else {
          setDialogMessage("Error al crear el apartamento.");
        }
      }
      else {
        // Update an existing Apartamento (Editar)
        // Add the username to the form data before making the request
        const formDataWithUsername = {
            ...form,
            modificadoPor: username, // Add the username retrieved from AsyncStorage 
        };
        request.setConfig({
          method: "put",
          withCredentials: true,
          url: `http://localhost:5075/api/Apartamentos/update/${currentApartamento.id}`, // Replace with API endpoint for updating Apartamento
          data: formDataWithUsername, // Send the form data with username
        });
        const response = await request.sendRequest();

        if (response.success) {
          setDialogMessage("Apartamento actualizado exitosamente.");
          setApartamentos(
            apartamentos.map((item) =>
              item.id === currentApartamento.id ? { ...response.data } : item
            )
          );
        } else {
          setDialogMessage("Error al actualizar el ganado.");
        }
      }

      setIsModalVisible(false); // Close modal after saving
      clearForm();
    }
    catch (error) {
      setDialogMessage(
        "Ha ocurrido un problema. Inténtelo de nuevo más tarde."
      );
      console.error("Error:", error);
    }

    setIsDialogVisible(true); // Show dialog with the result
  };

  const handleEdit = (item) => {
    setCurrentApartamento(item);
    // Set the form with the selected item details
    setForm({
      tamanoArea: item.tamanoArea || 0,
      descripcion: item.descripcion || '',
      tipoPastoId: item.tipoPastoId || 0,
      tipoTierraId: item.tipoTierraId || 0,
      drenajeId: item.drenajeId || 0,
      expoSolarId: item.expoSolarId || new Date(),
      capaCargaId: item.capaCargaId || 0,
      frecuenciaUsoId: item.frecuenciaUsoId || 0,
    });
    setIsSearchModalVisible(false); // Close search modal for editing
    setIsModalVisible(true); // Open modal for editing
  };

    const handleClose = () => {
        clearForm();
        setIsModalVisible(false);
    };

    const handleResultClose = () => {
        clearForm();
        setIsSearchModalVisible(false);
    };

    const handleCreate = () => {
        clearForm();
        setIsModalVisible(true);
    };

  const handleDelete = async (id) => {
    try {
      request.setConfig({
        method: "delete",
        withCredentials: true,
        url: `http://localhost:5075/api/Apartamentos/delete/${id}`, // Replace with your API endpoint for deleting Apartamento
      });
      const response = await request.sendRequest();

        if (response.success) {
            setIsSearchModalVisible(false);
            setDialogMessage("Apartamento eliminado exitosamente.");
            setApartamentos(apartamentos.filter((item) => item.id !== id)); // Remove the deleted apartamento from the list
        }
        else {
            setDialogMessage("Error al eliminar el apartamento.");
        }
    } catch (error) {
      setDialogMessage(
        "Ha ocurrido un problema. Inténtelo de nuevo más tarde."
      );
      console.error("Error:", error);
    }

    setIsDialogVisible(true); // Show dialog with the result
    };

    // Function to handle the search based on filters
    const handleSearch = async () => {
        try {
            // Set up the API request to search ganado with the filter criteria
            request.setConfig({
                method: "post",
                withCredentials: true,
                url: "http://localhost:5075/api/Apartamentos/search", // Replace with your API endpoint
                data: filters, // Send the filters in the request body
            });

            // Send the request
            const response = await request.sendRequest();

            if (response.success && response.data.length > 0) {
                setApartamentos(response.data); // Set the apartamentos data from the API response
                setIsSearchModalVisible(true); // Open the modal with search results
            } else {
                setDialogMessage("No se encontraron resultados.");
                setIsDialogVisible(true); // Show dialog if no results are found
            }
        } catch (error) {
            setDialogMessage(
                "Ha ocurrido un problema. Inténtelo de nuevo más tarde."
            );
            setIsDialogVisible(true); // Show dialog if there is an error
            console.error("Error:", error);
        }
    };

    // Function to fetch dropdown options from the API
    const fetchDropdownOptions = async () => {
        try {
            request.setConfig({
                method: "get",
                withCredentials: true,
                url: "http://localhost:5075/api/Apartamentos/dropdownsApartamentos", // Replace with your API endpoint for dropdown Apartamentos options
            });

            const response = await request.sendRequest();

            if (response.success) {
                setTiposPasto(response.data[0].tiposPasto || []);
                setTiposTierra(response.data[0].tiposTierra || []);
                setDrenajes(response.data[0].drenajes || []);
                setExposSolar(response.data[0].exposSolar || []);
                setCapasCarga(response.data[0].capasCarga || []);
                setFrecuenciasUso(response.data[0].frecuenciasUso || []);
            }
            else {
                setDialogMessage("No se pudieron cargar las opciones de los filtros.");
                setIsDialogVisible(true);
            }
        }
        catch (error) {
            setDialogMessage(
                "Ha ocurrido un problema al cargar las opciones de los filtros. Inténtelo de nuevo más tarde."
            );
            setIsDialogVisible(true);
            console.error("Error:", error);
        }
    };

    // Fetch the dropdown options when the component mounts
    useEffect(() => {
        fetchDropdownOptions();
    }, []);

    return (
        <Provider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* Filters section */}
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Buscar Apartamento</Text>

                    <Text>Tamaño del Área</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tamaño del Área"
                        value={filters.tamanoArea.toString()}
                        onChangeText={(text) => setFilters({ ...filters, tamanoArea: text })}
                        keyboardType="numeric"
                    />

                    <Text>Descripción</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Descripción"
                        value={filters.descripcion}
                        onChangeText={(text) => setFilters({ ...filters, descripcion: text })}
                    />

                    <Text>Tipo de Pasto</Text>
                    <Picker
                        selectedValue={filters.tipoPastoId}
                        onValueChange={(value) => setFilters({ ...filters, tipoPastoId: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione el Tipo de Pasto" value="" />
                        {tiposPasto.map((pasto) => (
                            <Picker.Item key={pasto.tipoPastoId} label={pasto.descripcion} value={pasto.tipoPastoId} />
                        ))}
                    </Picker>

                    <Text>Tipo de Tierra</Text>
                    <Picker
                        selectedValue={filters.tipoTierraId}
                        onValueChange={(value) => setFilters({ ...filters, tipoTierraId: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione el Tipo de Tierra" value="" />
                        {tiposTierra.map((tierra) => (
                            <Picker.Item key={tierra.tipoTierraId} label={tierra.descripcion} value={tierra.tipoTierraId} />
                        ))}
                    </Picker>

                    <Text>Drenaje</Text>
                    <Picker
                        selectedValue={filters.drenajeId}
                        onValueChange={(value) => setFilters({ ...filters, drenajeId: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione el Drenaje" value="" />
                        {drenajes.map((drenaje) => (
                            <Picker.Item key={drenaje.drenajeId} label={drenaje.descripcion} value={drenaje.drenajeId} />
                        ))}
                    </Picker>

                    <Text>Exposición Solar</Text>
                    <Picker
                        selectedValue={filters.expoSolarId}
                        onValueChange={(value) => setFilters({ ...filters, expoSolarId: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione la Exposición Solar" value="" />
                        {exposSolar.map((solar) => (
                            <Picker.Item key={solar.expoSolarId} label={solar.descripcion} value={solar.expoSolarId} />
                        ))}
                    </Picker>

                    <Text>Capa de Carga</Text>
                    <Picker
                        selectedValue={filters.capaCargaId}
                        onValueChange={(value) => setFilters({ ...filters, capaCargaId: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione la Capa de Carga" value="" />
                        {capasCarga.map((capa) => (
                            <Picker.Item key={capa.capaCargaId} label={capa.descripcion} value={capa.capaCargaId} />
                        ))}
                    </Picker>

                    <Text>Frecuencia de Uso</Text>
                    <Picker
                        selectedValue={filters.frecuenciaUsoId}
                        onValueChange={(value) => setFilters({ ...filters, frecuenciaUsoId: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione la Frecuencia de Uso" value="" />
                        {frecuenciasUso.map((frecuencia) => (
                            <Picker.Item key={frecuencia.frecuenciaUsoId} label={frecuencia.descripcion} value={frecuencia.frecuenciaUsoId} />
                        ))}
                    </Picker>

                    <Button title="Buscar" onPress={handleSearch} />
                </ScrollView>

                {/* Button to open modal for creating new Apartamento */}
                <Button title="Crear Nuevo Apartamento" onPress={handleCreate} />

                {/* Modal for creating/updating Apartamento */}
                <Modal visible={isModalVisible} animationType="slide" onRequestClose={handleClose}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.title}>{currentApartamento ? "Editar Apartamento" : "Crear Nuevo Apartamento"}</Text>

                        <Text>Tamaño del Área</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tamaño del Área"
                            value={form.tamanoArea.toString()}
                            onChangeText={(text) => setForm({ ...form, tamanoArea: text })}
                            keyboardType="numeric"
                        />

                        <Text>Descripción</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Descripción"
                            value={form.descripcion}
                            onChangeText={(text) => setForm({ ...form, descripcion: text })}
                        />

                        <Text>Tipo de Pasto</Text>
                        <Picker selectedValue={form.tipoPastoId} onValueChange={(value) => setForm({ ...form, tipoPastoId: value })} style={styles.picker}>
                            <Picker.Item label="Seleccione el Tipo de Pasto" value="" />
                            {tiposPasto.map((pasto) => (
                                <Picker.Item key={pasto.tipoPastoId} label={pasto.descripcion} value={pasto.tipoPastoId} />
                            ))}
                        </Picker>

                        <Text>Tipo de Tierra</Text>
                        <Picker selectedValue={form.tipoTierraId} onValueChange={(value) => setForm({ ...form, tipoTierraId: value })} style={styles.picker}>
                            <Picker.Item label="Seleccione el Tipo de Tierra" value="" />
                            {tiposTierra.map((tierra) => (
                                <Picker.Item key={tierra.tipoTierraId} label={tierra.descripcion} value={tierra.tipoTierraId} />
                            ))}
                        </Picker>

                        <Text>Drenaje</Text>
                        <Picker selectedValue={form.drenajeId} onValueChange={(value) => setForm({ ...form, drenajeId: value })} style={styles.picker}>
                            <Picker.Item label="Seleccione el Drenaje" value="" />
                            {drenajes.map((drenaje) => (
                                <Picker.Item key={drenaje.drenajeId} label={drenaje.descripcion} value={drenaje.drenajeId} />
                            ))}
                        </Picker>

                        <Text>Exposición Solar</Text>
                        <Picker selectedValue={form.expoSolarId} onValueChange={(value) => setForm({ ...form, expoSolarId: value })} style={styles.picker}>
                            <Picker.Item label="Seleccione la Exposición Solar" value="" />
                            {exposSolar.map((solar) => (
                                <Picker.Item key={solar.expoSolarId} label={solar.descripcion} value={solar.expoSolarId} />
                            ))}
                        </Picker>

                        <Text>Capa de Carga</Text>
                        <Picker selectedValue={form.capaCargaId} onValueChange={(value) => setForm({ ...form, capaCargaId: value })} style={styles.picker}>
                            <Picker.Item label="Seleccione la Capa de Carga" value="" />
                            {capasCarga.map((capa) => (
                                <Picker.Item key={capa.capaCargaId} label={capa.descripcion} value={capa.capaCargaId} />
                            ))}
                        </Picker>

                        <Text>Frecuencia de Uso</Text>
                        <Picker selectedValue={form.frecuenciaUsoId} onValueChange={(value) => setForm({ ...form, frecuenciaUsoId: value })} style={styles.picker}>
                            <Picker.Item label="Seleccione la Frecuencia de Uso" value="" />
                            {frecuenciasUso.map((frecuencia) => (
                                <Picker.Item key={frecuencia.frecuenciaUsoId} label={frecuencia.descripcion} value={frecuencia.frecuenciaUsoId} />
                            ))}
                        </Picker>

                        <Button title={currentApartamento ? "Actualizar" : "Guardar"} onPress={handleSave} />
                        <Button title="Cerrar" onPress={handleClose} color="gray" />
                    </ScrollView>
                </Modal>

                {/* Modal to display the search results */}
                <Modal visible={isSearchModalVisible} animationType="slide" onRequestClose={handleResultClose}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.title}>Resultados de la Búsqueda</Text>

                        {/* Table of Apartamentos */}
                        <FlatList
                            data={apartamentos}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem={({ item }) => (
                                <View style={styles.listItem}>
                                    <Text>Tamaño del Área: {item.tamanoArea} - Descripción: {item.descripcion} - Tipo de Pasto: {item.tipoPastoId}</Text>
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

                        <Button title="Cerrar" onPress={handleResultClose} color="gray" />
                    </ScrollView>
                </Modal>

                {/* Dialog to display messages */}
                <Portal>
                    <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
                        <Dialog.Title>Información</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button title="OK" onPress={() => setIsDialogVisible(false)} />
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </SafeAreaView>
        </Provider>
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
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  picker: {
    width: '100%',
    height: 40,
    marginBottom: 10,
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
