import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dialog, Portal, Provider } from "react-native-paper"; // Import Paper Dialog components
import request from "./src/objects/request";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import for storing the token and user data

export default function Suministros() {
  const [suministros, setSuministros] = useState([]);
  const [currentSuministro, setCurrentSuministro] = useState(null);
  const [form, setForm] = useState({
    cantidad: 0,
    descripcion: '',
    tipoSuministroId: 0,
  });
  const [filters, setFilters] = useState({ ...form }); // State to handle the filter inputs
  const [tiposSuministro, setTiposSuministro] = useState([]); // State for tipoSuministro options
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility (form)
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false); // State for search result modal visibility
  const [isDialogVisible, setIsDialogVisible] = useState(false); // State for dialog visibility
  const [dialogMessage, setDialogMessage] = useState(""); // State for the dialog message

  const clearForm = () => {
    setCurrentSuministro(null);
    setForm({
      cantidad: 0,
      descripcion: '',
      tipoSuministroId: 0,
    });
  };

    const handleSave = async () => {
        try {
            // Retrieve the username from AsyncStorage
            const username = await AsyncStorage.getItem('user');

            if (currentSuministro === null) {
                // Create a new Suministro (Guardar)
                // Add the username to the form data before making the request
                const formDataWithUsername = {
                    ...form,
                    creadoPor: username, // Add the username retrieved from AsyncStorage 
                };

                request.setConfig({
                    method: "post",
                    withCredentials: true,
                    url: "http://localhost:5075/api/Suministros/create", // Replace with your API endpoint for creating Suministros
                    data: formDataWithUsername, // Send the form data with username 
                });
                const response = await request.sendRequest();

                if (response.success) {
                    setDialogMessage("Suministro creado exitosamente.");
                    setSuministros([...suministros, response.data]); // Add the new suministro to the list
                }
                else {
                    setDialogMessage("Error al crear el suministro.");
                }
            }
            else {
                // Update an existing Suministro (Editar)
                // Add the username to the form data before making the request
                const formDataWithUsername = {
                    ...form,
                    modificadoPor: username, // Add the username retrieved from AsyncStorage 
                };
                request.setConfig({
                    method: "put",
                    withCredentials: true,
                    url: `http://localhost:5075/api/Suministros/update/${currentSuministro.id}`, // Replace with API endpoint for updating Suministro
                    data: formDataWithUsername, // Send the form data with username
                });
                const response = await request.sendRequest();

                if (response.success) {
                    setDialogMessage("Suministro actualizado exitosamente.");
                    setSuministros(
                        suministros.map((item) =>
                            item.id === currentSuministro.id ? { ...response.data } : item
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
        setCurrentSuministro(item);
        // Set the form with the selected item details
        setForm({
            cantidad: item.cantidad || 0,
            descripcion: item.descripcion || '',
            tipoSuministroId: item.tipoSuministroId || 0,
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
                url: `http://localhost:5075/api/Suministros/delete/${id}`, // Replace with your API endpoint for deleting Suministro
            });
            const response = await request.sendRequest();

            if (response.success) {
                setIsSearchModalVisible(false);
                setDialogMessage("Suministro eliminado exitosamente.");
                setSuministros(suministros.filter((item) => item.id !== id)); // Remove the deleted suministro from the list
            }
            else {
                setDialogMessage("Error al eliminar el suministro.");
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
            // Set up the API request to search suministros with the filter criteria
            request.setConfig({
                method: "post",
                withCredentials: true,
                url: "http://localhost:5075/api/Suministros/search", // Replace with your API endpoint
                data: filters, // Send the filters in the request body
            });

            // Send the request
            const response = await request.sendRequest();

            if (response.success && response.data.length > 0) {
                setSuministros(response.data); // Set the suministros data from the API response
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
                url: "http://localhost:5075/api/Suministros/dropdownsSuministros", // Replace with your API endpoint for dropdown Suministros options
            });

            const response = await request.sendRequest();

            if (response.success) {
                setTiposSuministro(response.data[0].tiposSuministro || []);
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
                    <Text style={styles.title}>Buscar Suministro</Text>

                    <Text>Descripción</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Descripción"
                        value={filters.descripcion}
                        onChangeText={(text) => setFilters({ ...filters, descripcion: text })}
                    />

                    <Text>Cantidad</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Cantidad"
                        value={filters.cantidad.toString()}
                        onChangeText={(text) => setFilters({ ...filters, cantidad: text })}
                        keyboardType="numeric"
                    />

                    <Text>Tipo de Suministro</Text>
                    <Picker
                        selectedValue={filters.tipoSuministroId}
                        onValueChange={(value) => setFilters({ ...filters, tipoSuministroId: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione el Tipo de Suministro" value="" />
                        {tiposSuministro.map((tipo) => (
                            <Picker.Item key={tipo.id} label={tipo.descripcion} value={tipo.id} />
                        ))}
                    </Picker>

                    <Button title="Buscar" onPress={handleSearch} />
                </ScrollView>

                {/* Button to open modal for creating new Suministro */}
                <Button title="Crear Nuevo Suministro" onPress={handleCreate} />

                {/* Modal for creating/updating Suministro */}
                <Modal visible={isModalVisible} animationType="slide" onRequestClose={handleClose}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.title}>{currentSuministro ? "Editar Suministro" : "Crear Nuevo Suministro"}</Text>

                        <Text>Descripción</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Descripción"
                            value={form.descripcion}
                            onChangeText={(text) => setForm({ ...form, descripcion: text })}
                        />

                        <Text>Cantidad</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Cantidad"
                            value={form.cantidad.toString()}
                            onChangeText={(text) => setForm({ ...form, cantidad: text })}
                            keyboardType="numeric"
                        />

                        <Text>Tipo de Suministro</Text>
                        <Picker
                            selectedValue={form.tipoSuministroId}
                            onValueChange={(value) => setForm({ ...form, tipoSuministroId: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione el Tipo de Suministro" value="" />
                            {tiposSuministro.map((tipo) => (
                                <Picker.Item key={tipo.id} label={tipo.descripcion} value={tipo.id} />
                            ))}
                        </Picker>

                        <Button title={currentSuministro ? "Actualizar" : "Guardar"} onPress={handleSave} />
                        <Button title="Cerrar" onPress={handleClose} color="gray" />
                    </ScrollView>
                </Modal>

                {/* Modal to display the search results */}
                <Modal visible={isSearchModalVisible} animationType="slide" onRequestClose={handleResultClose}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.title}>Resultados de la Búsqueda</Text>

                        {/* Table of Suministros */}
                        <FlatList
                            data={suministros}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem={({ item }) => (
                                <View style={styles.listItem}>
                                    <Text>
                                        Descripción: {item.descripcion} - Cantidad: {item.cantidad} - Tipo: {item.tipoSuministroId}
                                    </Text>
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
