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
import request from "../objects/request";

// Helper function to format dates to 'YYYY-MM-DD' for web input fields 
const formatDateForInput = (date) => {
    if (date instanceof Date && !isNaN(date)) {
        return date.toISOString().substring(0, 10);
    }
    return ''; // Return an empty string if the date is invalid
};

export default function Ganado() {
  const [ganado, setGanado] = useState([]);
  const [currentGanado, setCurrentGanado] = useState(null);
  const [form, setForm] = useState({
    raza: 0,
    peso: 0,
    sexo: 0,
    edad: 0,
    estadoSalud: 0,
    fechaChequeo: new Date(),
    productividad: 0,
    tratamientos: 0,
    fechaNacimiento: new Date(),
  });
  const [filters, setFilters] = useState({ ...form }); // State to handle the filter inputs
  const [razas, setRazas] = useState([]); // State for raza options
  const [sexos, setSexos] = useState([]); // State for sexo options
  const [estadosSalud, setEstadosSalud] = useState([]); // State for estadoSalud options
  const [productividades, setProductividades] = useState([]); // State for productividad options
  const [tratamientos, setTratamientos] = useState([]); // State for tratamientos options
  const [showChequeoPicker, setShowChequeoPicker] = useState(false);
  const [showNacimientoPicker, setShowNacimientoPicker] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility (form)
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false); // State for search result modal visibility
  const [isDialogVisible, setIsDialogVisible] = useState(false); // State for dialog visibility
  const [dialogMessage, setDialogMessage] = useState(""); // State for the dialog message

  // Function to clear form after saving or canceling
  const clearForm = () => {
    setCurrentGanado(null);
    setForm({
      raza: 0,
      peso: 0,
      sexo: 0,
      edad: 0,
      estadoSalud: 0,
      fechaChequeo: new Date(),
      productividad: 0,
      tratamientos: 0,
      fechaNacimiento: new Date(),
    });
  };

  // Function to save or update Ganado (Create/Update)
  const handleSave = async () => {
    try {
      if (currentGanado === null) {
        // Create a new Ganado (Guardar)
        request.setConfig({
          method: "post",
          withCredentials: true,
          url: "http://localhost:5075/api/Ganado/create", // Replace with your API endpoint for creating Ganado
          data: form, // Send the form data
        });
        const response = await request.sendRequest();

        if (response.success) {
          setDialogMessage("Ganado creado exitosamente.");
          setGanado([...ganado, response.data]); // Add the new ganado to the list
        } else {
          setDialogMessage("Error al crear el ganado.");
        }
      } else {
        // Update an existing Ganado (Editar)
        request.setConfig({
          method: "put",
          withCredentials: true,
          url: `http://localhost:5075/api/Ganado/update/${currentGanado.id}`, // Replace with your API endpoint for updating Ganado
          data: form, // Send the form data
        });
        const response = await request.sendRequest();

        if (response.success) {
          setDialogMessage("Ganado actualizado exitosamente.");
          setGanado(
            ganado.map((item) =>
              item.id === currentGanado.id ? { ...response.data } : item
            )
          );
        } else {
          setDialogMessage("Error al actualizar el ganado.");
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
    setCurrentGanado(item);
    setForm(item);
    setIsModalVisible(true); // Open modal for editing
  };

  // Function to delete Ganado (Eliminar)
  const handleDelete = async (id) => {
    try {
      request.setConfig({
        method: "delete",
        withCredentials: true,
        url: `http://localhost:5075/api/Ganado/delete/${id}`, // Replace with your API endpoint for deleting Ganado
      });
      const response = await request.sendRequest();

      if (response.success) {
        setDialogMessage("Ganado eliminado exitosamente.");
        setGanado(ganado.filter((item) => item.id !== id)); // Remove the deleted ganado from the list
      } else {
        setDialogMessage("Error al eliminar el ganado.");
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
    const handleShowChequeoPicker = () => {
        if (Platform.OS === 'web') return;
        setShowChequeoPicker(true);
    };

    const handleShowNacimientoPicker = () => {
        if (Platform.OS === 'web') return;
        setShowNacimientoPicker(true);
    };

    const handleFechaChequeoChange = (event, selectedDate) => {
        setShowChequeoPicker(false);
        if (selectedDate) setForm({ ...form, fechaChequeo: selectedDate });
    };

    const handleFechaNacimientoChange = (event, selectedDate) => {
        setShowNacimientoPicker(false);
        if (selectedDate) setForm({ ...form, fechaNacimiento: selectedDate });
    };

  // Function to handle the search based on filters
  const handleSearch = async () => {
    try {
      // Set up the API request to search ganado with the filter criteria
      request.setConfig({
        method: "post",
        withCredentials: true,
        url: "http://localhost:5075/api/Ganado/search", // Replace with your API endpoint
        data: filters, // Send the filters in the request body
      });

      // Send the request
      const response = await request.sendRequest();

      if (response.success && response.data.length > 0) {
        setGanado(response.data); // Set the ganado data from the API response
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
        url: "http://localhost:5075/api/Ganado/dropdownsGanado", // Replace with your API endpoint for dropdown Ganado options
      });

      const response = await request.sendRequest();

      if (response.success) {
        setRazas(response.data[0].razas || []);
        setSexos(response.data[0].sexos || []);
        setEstadosSalud(response.data[0].estadosSalud || []);
        setProductividades(response.data[0].productividades || []);
          setTratamientos(response.data[0].tratamientos || []);
          console.log(razas.toString(), '-razas list');
      } else {
        setDialogMessage("No se pudieron cargar las opciones de los filtros.");
        setIsDialogVisible(true);
      }
    } catch (error) {
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
          <Text style={styles.title}>Buscar Ganado</Text>

          <Text>Raza</Text>
          <Picker
            selectedValue={filters.raza}
            onValueChange={(value) => setFilters({ ...filters, raza: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione la Raza" value="" />
            {razas.map((raza) => (
              <Picker.Item key={raza.razaId} label={raza.descripcion} value={raza.razaId} />
            ))}
          </Picker>

          <Text>Peso</Text>
          <TextInput
            style={styles.input}
            placeholder="Peso"
            value={filters.peso}
            onChangeText={(text) => setFilters({ ...filters, peso: text })}
            keyboardType="numeric"
          />

          <Text>Sexo</Text>
          <Picker
            selectedValue={filters.sexo}
            onValueChange={(value) => setFilters({ ...filters, sexo: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Sexo" value="" />
            {sexos.map((sexo) => (
              <Picker.Item key={sexo.sexoId} label={sexo.descripcion} value={sexo.sexoId} />
            ))}
          </Picker>

          <Text>Edad</Text>
          <TextInput
            style={styles.input}
            placeholder="Edad"
            value={filters.edad}
            onChangeText={(text) => setFilters({ ...filters, edad: text })}
            keyboardType="numeric"
          />

          <Text>Estado de Salud</Text>
          <Picker
            selectedValue={filters.estadoSalud}
            onValueChange={(value) =>
              setFilters({ ...filters, estadoSalud: value })
            }
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Estado de Salud" value="" />
            {estadosSalud.map((estado) => (
              <Picker.Item key={estado.estadoId} label={estado.descripcion} value={estado.estadoId} />
            ))}
          </Picker>

          <Text>Productividad</Text>
          <Picker
            selectedValue={filters.productividad}
            onValueChange={(value) =>
              setFilters({ ...filters, productividad: value })
            }
            style={styles.picker}
          >
            <Picker.Item label="Seleccione la Productividad" value="" />
            {productividades.map((prod) => (
              <Picker.Item key={prod.productividadId} label={prod.descripcion} value={prod.productividadId} />
            ))}
          </Picker>

          <Text>Tratamientos</Text>
          <Picker
            selectedValue={filters.tratamientos}
            onValueChange={(value) =>
              setFilters({ ...filters, tratamientos: value })
            }
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el Tratamiento" value="" />
            {tratamientos.map((trat) => (
              <Picker.Item key={trat.tratamientoId} label={trat.descripcion} value={trat.tratamientoId} />
            ))}
          </Picker>

          {/* Fecha de Último Chequeo */}
          {Platform.OS === 'web' ? (
            <>
              <label htmlFor="fechaChequeo">Fecha de Último Chequeo</label>
              <input
                type="date"
                id="fechaChequeo"
                name="fechaChequeo"
                value={formatDateForInput(filters.fechaChequeo)}
                onChange={(e) => setFilters({ ...filters, fechaChequeo: new Date(e.target.value) })}
                style={{ width: '100%', height: '40px', borderColor: '#ccc', borderWidth: '1px', marginBottom: '10px', padding: '0.4rem' }}
              />
            </>
          ) : (
            <TouchableOpacity onPress={handleShowChequeoPicker}>
              <TextInput
                style={styles.input}
                placeholder="Seleccione la fecha"
                value={form.fechaChequeo.toLocaleDateString()}
                editable={false}
              />
            </TouchableOpacity>
          )}
          {showChequeoPicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={form.fechaChequeo}
              mode="date"
              display="default"
              onChange={handleFechaChequeoChange}
            />
          )}

          {/* Fecha de Nacimiento */}
          {Platform.OS === 'web' ? (
            <>
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formatDateForInput(filters.fechaNacimiento)}
                onChange={(e) => setFilters({ ...filters, fechaNacimiento: new Date(e.target.value) })}
                style={{ width: '100%', height: '40px', borderColor: '#ccc', borderWidth: '1px', marginBottom: '10px', padding: '0.4rem' }}
              />
            </>
          ) : (
            <TouchableOpacity onPress={handleShowNacimientoPicker}>
              <TextInput
                style={styles.input}
                placeholder="Seleccione la fecha"
                value={form.fechaNacimiento.toLocaleDateString()}
                editable={false}
              />
            </TouchableOpacity>
          )}
          {showNacimientoPicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={form.fechaNacimiento}
              mode="date"
              display="default"
              onChange={handleFechaNacimientoChange}
            />
          )}

          <Button title="Buscar" onPress={handleSearch} />
        </ScrollView>

        {/* Button to open modal for creating new Ganado */}
        <Button
          title="Crear Nuevo Ganado"
          onPress={() => setIsModalVisible(true)}
        />

        {/* Modal for creating/updating Ganado */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
              {currentGanado ? "Editar Ganado" : "Crear Nuevo Ganado"}
            </Text>

            {/* Ganado Form */}

            <Text>Raza</Text>
            <Picker
              selectedValue={form.raza}
              onValueChange={(value) => setForm({ ...form, raza: value })}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione la Raza" value="" />
              {razas.map((raza) => (
                <Picker.Item key={raza.razaId} label={raza.descripcion} value={raza.razaId} />
              ))}
            </Picker>

            <Text>Peso</Text>
            <TextInput
              style={styles.input}
              placeholder="Peso"
              value={form.peso}
              onChangeText={(text) => setForm({ ...form, peso: text })}
              keyboardType="numeric"
            />

            <Text>Sexo</Text>
            <Picker
              selectedValue={form.sexo}
              onValueChange={(value) => setForm({ ...form, sexo: value })}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione el Sexo" value="" />
              {sexos.map((sexo) => (
                <Picker.Item key={sexo.sexoId} label={sexo.descripcion} value={sexo.sexoId} />
              ))}
            </Picker>

            <Text>Edad</Text>
            <TextInput
              style={styles.input}
              placeholder="Edad"
              value={form.edad}
              onChangeText={(text) => setForm({ ...form, edad: text })}
              keyboardType="numeric"
            />

            <Text>Estado de Salud</Text>
            <Picker
              selectedValue={form.estadoSalud}
              onValueChange={(value) =>
                setForm({ ...form, estadoSalud: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Seleccione el Estado de Salud" value="" />
              {estadosSalud.map((estado) => (
                <Picker.Item key={estado.estadoId} label={estado.descripcion} value={estado.estadoId} />
              ))}
            </Picker>

            <Text>Productividad</Text>
            <Picker
              selectedValue={form.productividad}
              onValueChange={(value) =>
                setForm({ ...form, productividad: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Seleccione la Productividad" value="" />
              {productividades.map((prod) => (
                <Picker.Item key={prod.productividadId} label={prod.descripcion} value={prod.productividadId} />
              ))}
            </Picker>

            <Text>Tratamientos</Text>
            <Picker
              selectedValue={form.tratamientos}
              onValueChange={(value) =>
                setForm({ ...form, tratamientos: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Seleccione el Tratamiento" value="" />
              {tratamientos.map((trat) => (
                <Picker.Item key={trat.tratamientoId} label={trat.descripcion} value={trat.tratamientoId} />
              ))}
            </Picker>

            {/* Fecha de Último Chequeo */}
          {Platform.OS === 'web' ? (
            <>
              <label htmlFor="fechaChequeo">Fecha de Último Chequeo</label>
              <input
                type="date"
                id="fechaChequeo"
                name="fechaChequeo"
                value={formatDateForInput(filters.fechaChequeo)}
                onChange={(e) => setFilters({ ...filters, fechaChequeo: new Date(e.target.value) })}
                style={{ width: '100%', height: '40px', borderColor: '#ccc', borderWidth: '1px', marginBottom: '10px', padding: '0.4rem' }}
              />
            </>
          ) : (
            <TouchableOpacity onPress={handleShowChequeoPicker}>
              <TextInput
                style={styles.input}
                placeholder="Seleccione la fecha"
                value={form.fechaChequeo.toLocaleDateString()}
                editable={false}
              />
            </TouchableOpacity>
          )}
          {showChequeoPicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={form.fechaChequeo}
              mode="date"
              display="default"
              onChange={handleFechaChequeoChange}
            />
          )}

          {/* Fecha de Nacimiento */}
          {Platform.OS === 'web' ? (
            <>
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formatDateForInput(filters.fechaNacimiento)}
                onChange={(e) => setFilters({ ...filters, fechaNacimiento: new Date(e.target.value) })}
                style={{ width: '100%', height: '40px', borderColor: '#ccc', borderWidth: '1px', marginBottom: '10px', padding: '0.4rem' }}
              />
            </>
          ) : (
            <TouchableOpacity onPress={handleShowNacimientoPicker}>
              <TextInput
                style={styles.input}
                placeholder="Seleccione la fecha"
                value={form.fechaNacimiento.toLocaleDateString()}
                editable={false}
              />
            </TouchableOpacity>
          )}
          {showNacimientoPicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={form.fechaNacimiento}
              mode="date"
              display="default"
              onChange={handleFechaNacimientoChange}
            />
          )}

            <Button
              title={currentGanado ? "Actualizar" : "Guardar"}
              onPress={handleSave}
            />
            <Button
              title="Cerrar"
              onPress={() => setIsModalVisible(false)}
              color="gray"
            />
          </ScrollView>
        </Modal>

        {/* Modal to display the search results */}
        <Modal
          visible={isSearchModalVisible}
          animationType="slide"
          onRequestClose={() => setIsSearchModalVisible(false)}
        >
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Resultados de la Búsqueda</Text>

            {/* Table of Ganado */}
            <FlatList
              data={ganado}
              keyExtractor={(item, index) => `key-${index}`}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text>
                    {item.edad} - {item.raza} - {item.identificacion}
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
              ListFooterComponent={() => (
                <View>
                  <Text></Text>
                </View>
              )}
            />

            <Button
              title="Cerrar"
              onPress={() => setIsSearchModalVisible(false)}
              color="gray"
            />
          </ScrollView>
        </Modal>

        {/* Dialog to display messages */}
        <Portal>
          <Dialog
            visible={isDialogVisible}
            onDismiss={() => setIsDialogVisible(false)}
          >
            <Dialog.Title>Información</Dialog.Title>
            <Dialog.Content>
              <Text>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button title="OK" onPress={() => setIsDialogVisible(false)} />{" "}
              {/* Close dialog */}
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
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    width: "100%",
    height: 40,
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editText: {
    color: "blue",
  },
  deleteText: {
    color: "red",
  },
});
