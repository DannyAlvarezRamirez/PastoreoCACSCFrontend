import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import { Picker } from "@react-native-picker/picker"; // For dropdowns
import { Dialog, Portal, Provider } from "react-native-paper"; // Import Paper Dialog components
import request from "./src/objects/request";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import for storing the token and user data

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
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    idNumber: '',
    accountStatus: '',
    rolId: 0,
    password: '',
    confirmPassword: '',
  });
  const [filters, setFilters] = useState({ ...form }); // State to handle the filter inputs
  const [roles, setRoles] = useState([]); // State for rol options
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility (form)
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false); // State for search result modal visibility
  const [isDialogVisible, setIsDialogVisible] = useState(false); // State for dialog visibility
  const [dialogMessage, setDialogMessage] = useState(""); // State for the dialog message

  const clearForm = () => {
    setCurrentUsuario(null);
    setForm({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      idNumber: '',
      accountStatus: '',
      rolId: 0,
      password: '',
      confirmPassword: '',
    });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,10}$/;
    return passwordRegex.test(password);
  };

  const handleSave = async () => {
    // Validate email format
    if (!isValidEmail(form.email)) {
        setDialogMessage("El correo electrónico debe estar en el formato correcto y pertenecer al dominio @pastoreo.com.");
        return;
    }

    //// Validate password length and characters
    //if (!validatePassword(form.password)) {
    //    setDialogMessage("La contraseña debe tener entre 8 y 10 caracteres, solo letras y números, y no debe contener espacios.");
    //    return;
    //}

    //// Check if the passwords match
    //if (form.password !== form.confirmPassword) {
    //    setDialogMessage("Las contraseñas no coinciden.");
    //    return;
    //}

      try {
          // Retrieve the username from AsyncStorage
          const username = await AsyncStorage.getItem('user');

          if (currentUsuario === null) {
              //// Create a new Ganado (Guardar)
              //// Add the username to the form data before making the request
              //const formDataWithUsername = {
              //    ...form,
              //    creadoPor: username, // Add the username retrieved from AsyncStorage
              //};

              //request.setConfig({
              //    method: "post",
              //    withCredentials: true,
              //    url: "http://localhost:5075/api/User/create", // Replace with your API endpoint for creating User
              //    data: formDataWithUsername, // Send the form data with username
              //});
              //const response = await request.sendRequest();

              //if (response.success) {
              //    setDialogMessage("Usuario creado exitosamente.");
              //    setUsuarios([...usuarios, response.data]); // Add the new user to the list
              //} else {
              //    setDialogMessage("Error al crear el ganado.");
              //}
              setDialogMessage("Registro de usuarios nuevos al momento son restringidos. Contacte a soporte técnico.");
          }
          else {
              // Update an existing User (Editar)
              // Add the username to the form data before making the request
              const formDataWithUsername = {
                  ...form,
                  modificadoPor: username, // Add the username retrieved from AsyncStorage 
              };
              request.setConfig({
                  method: "put",
                  withCredentials: true,
                  url: `http://localhost:5075/api/User/update/${currentUsuario.id}`, // Replace with API endpoint for updating User
                  data: formDataWithUsername, // Send the form data with username
              });
              const response = await request.sendRequest();

              if (response.success) {
                  setDialogMessage("Usuario actualizado exitosamente.");
                  setUsuarios(
                      usuarios.map((item) =>
                          item.id === currentUsuario.id ? { ...response.data } : item
                      )
                  );
              } else {
                  setDialogMessage("Error al actualizar el usuario.");
              }
          }

          setIsModalVisible(false); // Close modal after saving
          clearForm();
      } catch (error) {
          setDialogMessage(
              "Ha ocurrido un problema. Inténtelo de nuevo más tarde."
          );
          console.error("Error:", error);
      }

      setIsDialogVisible(true); // Show dialog with the result
  };

  const handleEdit = (item) => {
      setCurrentUsuario(item);
      // Set the form with the selected item details
      setForm({
          fullName: item.fullName || '',
          username: item.username || '',
          email: item.email || '',
          phone: item.phone || '',
          idNumber: item.idNumber || '',
          accountStatus: item.accountStatus || '',
          rolId: item.rolId || 0,
          password: item.password || '',
          confirmPassword: item.confirmPassword || '',
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
              url: `http://localhost:5075/api/User/delete/${id}`, // Replace with your API endpoint for deleting User
          });
          const response = await request.sendRequest();

          if (response.success) {
              setIsSearchModalVisible(false);
              setDialogMessage("Usuario eliminado exitosamente.");
              setUsuarios(usuarios.filter((item) => item.id !== id)); // Remove the deleted user from the list
          }
          else {
              setDialogMessage("Error al eliminar el usuario.");
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
        // Validate rol format
        //if (filters.rolId == 0) {
        //    setDialogMessage("Debe seleccionar un rol.");
        //    return;
        //}

        try {
            // Set up the API request to search ganado with the filter criteria
            request.setConfig({
                method: "post",
                withCredentials: true,
                url: "http://localhost:5075/api/User/search", // Replace with your API endpoint
                data: filters, // Send the filters in the request body
            });

            // Send the request
            const response = await request.sendRequest();

            if (response.success && response.data.length > 0) {
                setUsuarios(response.data); // Set the user data from the API response
                setIsSearchModalVisible(true); // Open the modal with search results
            }
            else {
                setDialogMessage("No se encontraron resultados.");
                setIsDialogVisible(true); // Show dialog if no results are found
            }
        }
        catch (error) {
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
                url: "http://localhost:5075/api/User/dropdownsUser", // Replace with your API endpoint for dropdown Ganado options
            });

            const response = await request.sendRequest();

            if (response.success) {
                setRoles(response.data[0].roles || []);
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
                    <Text style={styles.title}>Buscar Usuarios</Text>

                    <Text>Nombre Completo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre Completo"
                        value={filters.fullName}
                        onChangeText={(text) => setFilters({ ...filters, fullName: text })}
                    />

                    <Text>Correo Electrónico</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Correo Electrónico"
                        value={filters.email}
                        onChangeText={(text) => setFilters({ ...filters, email: text })}
                        keyboardType="email-address"
                    />

                    <Text>Estado de la Cuenta</Text>
                    <Picker
                        selectedValue={filters.accountStatus}
                        onValueChange={(value) => setFilters({ ...filters, accountStatus: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione el Estado" value="" />
                        <Picker.Item label="Activo" value="Activo" />
                        <Picker.Item label="Inactivo" value="Inactivo" />
                    </Picker>

                    <Text>Rol</Text>
                    <Picker
                        selectedValue={filters.rolId}
                        onValueChange={(value) => setFilters({ ...filters, rolId: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione el Rol" value="" />
                        {roles.map((rol) => (
                            <Picker.Item key={rol.id} label={rol.descripcion} value={rol.id} />
                        ))}
                    </Picker>

                    <Button title="Buscar" onPress={handleSearch} />
                </ScrollView>

                {/* Button to open modal for creating new Usuario */}
                <Button title="Crear Nuevo Usuario" onPress={handleCreate} />

                {/* Modal for creating/updating Usuario */}
                <Modal visible={isModalVisible} animationType="slide" onRequestClose={handleClose}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.title}>
                            {currentUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
                        </Text>

                        <Text>Nombre Completo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre Completo"
                            value={form.fullName}
                            onChangeText={(text) => setForm({ ...form, fullName: text })}
                        />

                        <Text>Correo Electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo Electrónico"
                            value={form.email}
                            onChangeText={(text) => setForm({ ...form, email: text })}
                            keyboardType="email-address"
                        />

                        <Text>Rol</Text>
                        <Picker
                            selectedValue={form.rolId}
                            onValueChange={(value) => setForm({ ...form, rolId: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione el Rol" value="" />
                            {roles.map((rol) => (
                                <Picker.Item key={rol.id} label={rol.descripcion} value={rol.id} />
                            ))}
                        </Picker>

                        <Button
                            title={currentUsuario ? "Actualizar" : "Guardar"}
                            onPress={handleSave}
                        />
                        <Button title="Cerrar" onPress={handleClose} color="gray" />
                    </ScrollView>
                </Modal>

                {/* Modal to display the search results */}
                <Modal visible={isSearchModalVisible} animationType="slide" onRequestClose={handleResultClose}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.title}>Resultados de la Búsqueda</Text>

                        {/* Table of Usuarios */}
                        <FlatList
                            data={usuarios}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem={({ item }) => (
                                <View style={styles.listItem}>
                                    <Text>
                                        Nombre: {item.fullName} - Correo: {item.email} - Rol: {item.rolId}
                                    </Text>
                                    <View style={styles.buttons}>
                                        <TouchableOpacity onPress={() => handleEdit(item)}>
                                            <Text style={styles.editText}>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDelete(item.id)} disabled>
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
      opacity: 0.5, 
  },
});
