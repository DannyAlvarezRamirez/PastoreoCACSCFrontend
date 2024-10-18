import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    ScrollView,
    Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // For dropdowns
import DateTimePicker from "@react-native-community/datetimepicker"; // For date pickers
import { Dialog, Portal, Provider } from "react-native-paper"; // Import Paper Dialog components
import request from "./src/objects/request";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import for storing the token and user data

// Helper function to format dates to 'YYYY-MM-DD' for web input fields 
const formatDateForInput = (date) => {
    if (date instanceof Date && !isNaN(date)) {
        return date.toISOString().substring(0, 10);
    }
    return ''; // Return an empty string if the date is invalid
};

export default function PastoreoRotacion() {
    const [rotaciones, setRotaciones] = useState([]);
    const [currentRotacion, setCurrentRotacion] = useState(null);
    const [form, setForm] = useState({
        apartamentoId: 0,
        tiempoInicio: new Date(),
        tiempoFin: new Date(),
        temporada: '',
        cantGanadoAct: 0,
        cantMaxRec: 0,
        tipoGanadoId: 0,
        registroEventos: '',
        eficPast: 0,
        observaciones: '',
    });
    const [filters, setFilters] = useState({ ...form }); // State to handle the filter inputs
    const [apartamentos, setApartamentos] = useState([]); // State for apartamentos options
    const [tiposGanado, setTiposGanado] = useState([]); // State for tiposGanado options
    const [showTiempoInicioPicker, setShowTiempoInicioPicker] = useState(false);
    const [showTiempoFinPicker, setShowTiempoFinPicker] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility (form)
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false); // State for search result modal visibility
    const [isDialogVisible, setIsDialogVisible] = useState(false); // State for dialog visibility
    const [dialogMessage, setDialogMessage] = useState(""); // State for the dialog message

    const clearForm = () => {
        setCurrentRotacion(null);
        setForm({
            apartamentoId: 0,
            tiempoInicio: new Date(),
            tiempoFin: new Date(),
            temporada: '',
            cantGanadoAct: 0,
            cantMaxRec: 0,
            tipoGanadoId: 0,
            registroEventos: '',
            eficPast: 0,
            observaciones: '',
        });
    };

    // Function to save or update Rotacion (Create/Update)
    const handleSave = async () => {
        // Validate apartamentoId format
        if (form.apartamentoId == 0) {
            setDialogMessage("Debe selecionar el apartamento.");
            return;
        }

        // Validate tipoGanadoId format
        if (form.tipoGanadoId == 0) {
            setDialogMessage("Debe selecionar el tipo de ganado.");
            return;
        }

        try {
            // Retrieve the username from AsyncStorage
            const username = await AsyncStorage.getItem('user');

            if (currentRotacion === null) {
                // Create a new Rotacion (Guardar)
                // Add the username to the form data before making the request
                const formDataWithUsername = {
                    ...form,
                    creadoPor: username, // Add the username retrieved from AsyncStorage 
                };

                request.setConfig({
                    method: "post",
                    withCredentials: true,
                    url: "http://localhost:5075/api/Rotacion/create", // Replace with your API endpoint for creating Rotacion
                    data: formDataWithUsername, // Send the form data with username 
                });
                const response = await request.sendRequest();

                if (response.success) {
                    setDialogMessage("Rotacion de pastoreo creado exitosamente.");
                    setRotaciones([...rotaciones, response.data]); // Add the new rotaciones to the list
                } else {
                    setDialogMessage("Error al crear el ganado.");
                }
            }
            else {
                // Update an existing Rotacion (Editar)
                // Add the username to the form data before making the request
                const formDataWithUsername = {
                    ...form,
                    modificadoPor: username, // Add the username retrieved from AsyncStorage 
                };
                request.setConfig({
                    method: "put",
                    withCredentials: true,
                    url: `http://localhost:5075/api/Rotacion/update/${currentRotacion.id}`, // Replace with API endpoint for updating Rotacion
                    data: formDataWithUsername, // Send the form data with username
                });
                const response = await request.sendRequest();

                if (response.success) {
                    setDialogMessage("Rotacion de pastoreo actualizado exitosamente.");
                    setRotaciones(
                        rotaciones.map((item) =>
                            item.id === currentRotacion.id ? { ...response.data } : item
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
        setCurrentRotacion(item);
        // Set the form with the selected item details
        setForm({
            apartamentoId: item.apartamentoId || 0,
            tiempoInicio: new Date(item.tiempoInicio) || new Date(),
            tiempoFin: new Date(item.tiempoFin) || new Date(),
            temporada: item.temporada || '',
            cantGanadoAct: item.cantGanadoAct || 0,
            cantMaxRec: item.cantMaxRec || 0,
            tipoGanadoId: item.tipoGanadoId || 0,
            registroEventos: item.registroEventos || '',
            eficPast: item.eficPast || 0,
            observaciones: item.observaciones || '',
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

    // Function to delete Rotacion (Eliminar)
    const handleDelete = async (id) => {
        try {
            request.setConfig({
                method: "delete",
                withCredentials: true,
                url: `http://localhost:5075/api/Rotacion/delete/${id}`, // Replace with your API endpoint for deleting Rotacion
            });
            const response = await request.sendRequest();

            if (response.success) {
                setIsSearchModalVisible(false);
                setDialogMessage("Rotacion de pastoreo eliminado exitosamente.");
                setRotaciones(rotaciones.filter((item) => item.id !== id)); // Remove the deleted rotaciones from the list
            }
            else {
                setDialogMessage("Error al eliminar rotacion de pastoreo.");
            }
        } catch (error) {
            setDialogMessage(
                "Ha ocurrido un problema. Inténtelo de nuevo más tarde."
            );
            console.error("Error:", error);
        }

        setIsDialogVisible(true); // Show dialog with the result
    };

    // Helper functions to show date pickers for web and mobile
    const handleShowTiempoInicioPicker = () => {
        if (Platform.OS === 'web') return;
        setShowTiempoInicioPicker(true);
    };

    const handleTiempoFinPicker = () => {
        if (Platform.OS === 'web') return;
        setShowTiempoFinPicker(true);
    };

    const handleTiempoInicioChange = (event, selectedDate) => {
        setShowTiempoInicioPicker(false);
        if (selectedDate) setForm({ ...form, tiempoInicio: selectedDate });
    };

    const handleTiempoFinChange = (event, selectedDate) => {
        setShowTiempoFinPicker(false);
        if (selectedDate) setForm({ ...form, tiempoFin: selectedDate });
    };

    // Function to handle the search based on filters
    const handleSearch = async () => {
        try {
            // Set up the API request to search rotacion with the filter criteria
            request.setConfig({
                method: "post",
                withCredentials: true,
                url: "http://localhost:5075/api/Rotacion/search", // Replace with your API endpoint
                data: filters, // Send the filters in the request body
            });

            // Send the request
            const response = await request.sendRequest();

            if (response.success && response.data.length > 0) {
                setRotaciones(response.data); // Set the rotacion data from the API response
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
                url: "http://localhost:5075/api/Rotacion/dropdownsRotacion", // Replace with your API endpoint for dropdown Rotacion options
            });

            const response = await request.sendRequest();

            if (response.success) {
                setApartamentos(response.data[0].apartamentos || []);
                setTiposGanado(response.data[0].tiposGanado || []);
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
                    <Text style={styles.title}>Buscar Rotación de Pastoreo</Text>

                    <Text>Apartamento</Text>
                    <Picker
                        selectedValue={filters.apartamentoId}
                        onValueChange={(value) => setFilters({ ...filters, apartamentoId: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione el Apartamento" value="" />
                        {apartamentos.map((apartamento) => (
                            <Picker.Item key={apartamento.id} label={apartamento.descripcion} value={apartamento.id} />
                        ))}
                    </Picker>

                    <Text>Temporada</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Temporada"
                        value={filters.temporada}
                        onChangeText={(text) => setFilters({ ...filters, temporada: text })}
                    />

                    <Text>Tipo de Ganado</Text>
                    <Picker
                        selectedValue={filters.tipoGanadoId}
                        onValueChange={(value) => setFilters({ ...filters, tipoGanadoId: value })}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccione el Tipo de Ganado" value="" />
                        {tiposGanado.map((tipo) => (
                            <Picker.Item key={tipo.id} label={tipo.descripcion} value={tipo.id} />
                        ))}
                    </Picker>

                    <Text>Cantidad Actual de Ganado</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Cantidad Actual de Ganado"
                        value={filters.cantGanadoAct.toString()}
                        onChangeText={(text) => setFilters({ ...filters, cantGanadoAct: parseInt(text) || 0 })}
                        keyboardType="numeric"
                    />

                    <Text>Cantidad Máxima Receptiva</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Cantidad Máxima Receptiva"
                        value={filters.cantMaxRec.toString()}
                        onChangeText={(text) => setFilters({ ...filters, cantMaxRec: parseInt(text) || 0 })}
                        keyboardType="numeric"
                    />

                    {/* Fecha de Inicio */}
                    {Platform.OS === "web" ? (
                        <>
                            <label htmlFor="tiempoInicio">Fecha de Inicio</label>
                            <input
                                type="date"
                                id="tiempoInicio"
                                name="tiempoInicio"
                                value={formatDateForInput(filters.tiempoInicio)}
                                onChange={(e) => setFilters({ ...filters, tiempoInicio: new Date(e.target.value) })}
                                style={{
                                    width: "100%",
                                    height: "40px",
                                    borderColor: "#ccc",
                                    borderWidth: "1px",
                                    marginBottom: "10px",
                                    padding: "0.4rem",
                                }}
                            />
                        </>
                    ) : (
                        <TouchableOpacity onPress={handleShowTiempoInicioPicker}>
                            <TextInput
                                style={styles.input}
                                placeholder="Seleccione la Fecha de Inicio"
                                value={filters.tiempoInicio.toLocaleDateString()}
                                editable={false}
                            />
                        </TouchableOpacity>
                    )}
                    {showTiempoInicioPicker && Platform.OS !== "web" && (
                        <DateTimePicker
                            value={filters.tiempoInicio}
                            mode="date"
                            display="default"
                            onChange={handleTiempoInicioChange}
                        />
                    )}

                    {/* Fecha de Fin */}
                    {Platform.OS === "web" ? (
                        <>
                            <label htmlFor="tiempoFin">Fecha de Fin</label>
                            <input
                                type="date"
                                id="tiempoFin"
                                name="tiempoFin"
                                value={formatDateForInput(filters.tiempoFin)}
                                onChange={(e) => setFilters({ ...filters, tiempoFin: new Date(e.target.value) })}
                                style={{
                                    width: "100%",
                                    height: "40px",
                                    borderColor: "#ccc",
                                    borderWidth: "1px",
                                    marginBottom: "10px",
                                    padding: "0.4rem",
                                }}
                            />
                        </>
                    ) : (
                        <TouchableOpacity onPress={handleTiempoFinPicker}>
                            <TextInput
                                style={styles.input}
                                placeholder="Seleccione la Fecha de Fin"
                                value={filters.tiempoFin.toLocaleDateString()}
                                editable={false}
                            />
                        </TouchableOpacity>
                    )}
                    {showTiempoFinPicker && Platform.OS !== "web" && (
                        <DateTimePicker
                            value={filters.tiempoFin}
                            mode="date"
                            display="default"
                            onChange={handleTiempoFinChange}
                        />
                    )}

                    <Button title="Buscar" onPress={handleSearch} />
                </ScrollView>

                {/* Button to open modal for creating new Rotacion */}
                <Button title="Crear Nueva Rotación de Pastoreo" onPress={handleCreate} />

                {/* Modal for creating/updating Rotacion */}
                <Modal visible={isModalVisible} animationType="slide" onRequestClose={handleClose}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.title}>
                            {currentRotacion ? "Editar Rotación de Pastoreo" : "Crear Nueva Rotación de Pastoreo"}
                        </Text>

                        {/* Form for creating/updating Rotacion */}
                        <Text>Apartamento</Text>
                        <Picker
                            selectedValue={form.apartamentoId}
                            onValueChange={(value) => setForm({ ...form, apartamentoId: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione el Apartamento" value="" />
                            {apartamentos.map((apartamento) => (
                                <Picker.Item key={apartamento.id} label={apartamento.descripcion} value={apartamento.id} />
                            ))}
                        </Picker>

                        <Text>Temporada</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Temporada"
                            value={form.temporada}
                            onChangeText={(text) => setForm({ ...form, temporada: text })}
                        />

                        <Text>Tipo de Ganado</Text>
                        <Picker
                            selectedValue={form.tipoGanadoId}
                            onValueChange={(value) => setForm({ ...form, tipoGanadoId: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione el Tipo de Ganado" value="" />
                            {tiposGanado.map((tipo) => (
                                <Picker.Item key={tipo.id} label={tipo.descripcion} value={tipo.id} />
                            ))}
                        </Picker>

                        <Text>Cantidad Actual de Ganado</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Cantidad Actual de Ganado"
                            value={form.cantGanadoAct.toString()}
                            onChangeText={(text) => setForm({ ...form, cantGanadoAct: parseInt(text) || 0 })}
                            keyboardType="numeric"
                        />

                        <Text>Cantidad Máxima Receptiva</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Cantidad Máxima Receptiva"
                            value={form.cantMaxRec.toString()}
                            onChangeText={(text) => setForm({ ...form, cantMaxRec: parseInt(text) || 0 })}
                            keyboardType="numeric"
                        />

                        {/* Form for selecting start date */}
                        {Platform.OS === "web" ? (
                            <>
                                <label htmlFor="tiempoInicio">Fecha de Inicio</label>
                                <input
                                    type="date"
                                    id="tiempoInicio"
                                    name="tiempoInicio"
                                    value={formatDateForInput(form.tiempoInicio)}
                                    onChange={(e) => setForm({ ...form, tiempoInicio: new Date(e.target.value) })}
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        borderColor: "#ccc",
                                        borderWidth: "1px",
                                        marginBottom: "10px",
                                        padding: "0.4rem",
                                    }}
                                />
                            </>
                        ) : (
                            <TouchableOpacity onPress={handleShowTiempoInicioPicker}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Seleccione la Fecha de Inicio"
                                    value={form.tiempoInicio.toLocaleDateString()}
                                    editable={false}
                                />
                            </TouchableOpacity>
                        )}
                        {showTiempoInicioPicker && Platform.OS !== "web" && (
                            <DateTimePicker
                                value={form.tiempoInicio}
                                mode="date"
                                display="default"
                                onChange={handleTiempoInicioChange}
                            />
                        )}

                        {/* Form for selecting end date */}
                        {Platform.OS === "web" ? (
                            <>
                                <label htmlFor="tiempoFin">Fecha de Fin</label>
                                <input
                                    type="date"
                                    id="tiempoFin"
                                    name="tiempoFin"
                                    value={formatDateForInput(form.tiempoFin)}
                                    onChange={(e) => setForm({ ...form, tiempoFin: new Date(e.target.value) })}
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        borderColor: "#ccc",
                                        borderWidth: "1px",
                                        marginBottom: "10px",
                                        padding: "0.4rem",
                                    }}
                                />
                            </>
                        ) : (
                            <TouchableOpacity onPress={handleTiempoFinPicker}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Seleccione la Fecha de Fin"
                                    value={form.tiempoFin.toLocaleDateString()}
                                    editable={false}
                                />
                            </TouchableOpacity>
                        )}
                        {showTiempoFinPicker && Platform.OS !== "web" && (
                            <DateTimePicker
                                value={form.tiempoFin}
                                mode="date"
                                display="default"
                                onChange={handleTiempoFinChange}
                            />
                        )}

                        {/* Registro de Eventos */}
                        <Text>Registro de Eventos</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Registro de Eventos"
                            value={form.registroEventos}
                            onChangeText={(text) => setForm({ ...form, registroEventos: text })}
                        />

                        {/* Eficiencia de Pastoreo */}
                        <Text>Eficiencia de Pastoreo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Eficiencia de Pastoreo"
                            value={form.eficPast.toString()}
                            onChangeText={(text) => setForm({ ...form, eficPast: parseFloat(text) || 0 })}
                            keyboardType="numeric"
                        />

                        {/* Observaciones */}
                        <Text>Observaciones</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Observaciones"
                            value={form.observaciones}
                            onChangeText={(text) => setForm({ ...form, observaciones: text })}
                            multiline={true}
                            numberOfLines={4}
                        />

                        <Button title={currentRotacion ? "Actualizar" : "Guardar"} onPress={handleSave} />
                        <Button title="Cerrar" onPress={handleClose} color="gray" />
                    </ScrollView>
                </Modal>

                {/* Modal to display the search results */}
                <Modal visible={isSearchModalVisible} animationType="slide" onRequestClose={handleResultClose}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.title}>Resultados de la Búsqueda</Text>

                        {/* Table of Rotaciones */}
                        <FlatList
                            data={rotaciones}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem={({ item }) => (
                                <View style={styles.listItem}>
                                    <Text>
                                        Registro de Eventos: {item.registroEventos} - Temporada: {item.temporada} - Cantidad Actual: {item.cantGanadoAct}
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
