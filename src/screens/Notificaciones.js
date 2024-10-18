import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Button,
    TextInput,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dialog, Portal, Provider, Checkbox } from 'react-native-paper'; // Added Checkbox for user selection
import request from './src/objects/request';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For retrieving user info

export default function Notificaciones() {
    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]); // List of users for sending notifications
    const [selectedUsers, setSelectedUsers] = useState([]); // Selected users for the notification
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // For viewing and editing modal
    const [viewMessageModalVisible, setViewMessageModalVisible] = useState(false); // For viewing notification modal
    const [isDialogVisible, setIsDialogVisible] = useState(false); // For controlling dialog visibility
    const [dialogMessage, setDialogMessage] = useState(''); // Dialog message
    const [form, setForm] = useState({
        de: '',
        asunto: '',
        mensaje: '', // This will be larger with the textarea-style input
        fecha: new Date(),
        alertConfig: 'diario',
        prioridad: 'alta',
        suscripcion: 'encender',
        usuarioId: 0, // Add to track selected user when editing
        usuarioNombre: '', // Add to track selected username when editing
    });
    const [userRolId, setUserRolId] = useState(0); // To store user role (retrieved from AsyncStorage)
    const [userId, setUserId] = useState(null); // To store current user's ID from AsyncStorage

    // Fetch notifications and users when component loads
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve the user ID and role from AsyncStorage
                const storedUserId = await AsyncStorage.getItem('userId');
                const storedUserRolId = await AsyncStorage.getItem('userRolId');
                setUserRolId(parseInt(storedUserRolId, 10)); // Set user role
                setUserId(storedUserId); // Store current user ID

                // Fetch notifications for the current user
                request.setConfig({
                    method: 'get',
                    url: `http://localhost:5075/api/Notificacion/getByUser/${storedUserId}`,
                    withCredentials: true,
                });
                const notificationResponse = await request.sendRequest();

                if (notificationResponse.success) {
                    setNotifications(notificationResponse.data);
                } else {
                    setDialogMessage('Error fetching notifications');
                    setIsDialogVisible(true);
                }

                // Fetch all users for selection (for admins)
                if (parseInt(storedUserRolId, 10) === 1) {
                    request.setConfig({
                        method: 'get',
                        url: `http://localhost:5075/api/Notificacion/userDropdown`,
                        withCredentials: true,
                    });
                    const usersResponse = await request.sendRequest();

                    if (usersResponse.success) {
                        setUsers(usersResponse.data[0].usuarios || []);
                    } else {
                        setDialogMessage('Error fetching users');
                        setIsDialogVisible(true);
                    }
                }
            } catch (error) {
                setDialogMessage('Error fetching data');
                setIsDialogVisible(true);
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // Role-based condition for creating, updating, and deleting
    const canEdit = userRolId === 1;

    const handleSave = async () => {
        try {
            const username = await AsyncStorage.getItem('user');

            // Convert selected users to the expected format
            const usuarioIds = selectedUsers.map((userId) => ({
                usuarioId: userId
            }));

            // If selectedNotification is null, create new notification, otherwise update existing
            if (selectedNotification === null) {
                // Create new notification
                const requestData = {
                    ...form,
                    creadoPor: username,
                    usuarioIds // Pass the selected users in the expected format
                };

                request.setConfig({
                    method: 'post',
                    url: 'http://localhost:5075/api/Notificacion/create',
                    withCredentials: true,
                    data: requestData,
                });
                const response = await request.sendRequest();

                if (response.success) {
                    setDialogMessage('Notificación creada exitosamente.');
                    // Add delay before refreshing
                    setTimeout(() => {
                        refreshNotifications(); // Call refresh function after 1 second
                    }, 1000);
                } else {
                    setDialogMessage('Error creating notification');
                }
            }
            else {
                // Update existing notification
                const requestData = {
                    ...form,
                    modificadoPor: username,
                    usuarioIds // Pass the selected users in the expected format
                };

                request.setConfig({
                    method: 'put',
                    url: `http://localhost:5075/api/Notificacion/update/${selectedNotification.id}`,
                    withCredentials: true,
                    data: requestData,
                });
                const response = await request.sendRequest();

                if (response.success) {
                    setDialogMessage('Notificación actualizada exitosamente.');
                    // Add delay before refreshing
                    setTimeout(() => {
                        refreshNotifications(); // Call refresh function after 1 second
                    }, 1000);
                } else {
                    setDialogMessage('Error updating notification');
                }
            }

            setModalVisible(false); // Close modal after saving
            setIsDialogVisible(true); // Show dialog
        }
        catch (error) {
            setDialogMessage('Error saving notification');
            setIsDialogVisible(true);
            console.error(error);
        }
    };

    const refreshNotifications = async () => {
        try {
            // Fetch notifications for the current user
            request.setConfig({
                method: 'get',
                url: `http://localhost:5075/api/Notificacion/getByUser/${userId}`,
                withCredentials: true,
            });
            const notificationResponse = await request.sendRequest();

            if (notificationResponse.success) {
                setNotifications(notificationResponse.data); // Update notifications state with latest data
            } else {
                setDialogMessage('Error fetching notifications');
                setIsDialogVisible(true);
            }
        } catch (error) {
            setDialogMessage('Error fetching notifications');
            setIsDialogVisible(true);
            console.error(error);
        }
    };


    const handleDelete = async (id) => {
        try {
            request.setConfig({
                method: 'delete',
                url: `http://localhost:5075/api/Notificacion/delete/${id}`,
                withCredentials: true,
            });
            const response = await request.sendRequest();

            if (response.success) {
                setDialogMessage('Notificación eliminada exitosamente.');
                setNotifications(notifications.filter((item) => item.id !== id));
            }
            else {
                setDialogMessage('Error deleting notification');
            }

            setIsDialogVisible(true);
        }
        catch (error) {
            setDialogMessage('Error deleting notification');
            setIsDialogVisible(true);
            console.error(error);
        }
    };

    const handleEdit = (item) => {
        setSelectedNotification(item);
        setForm({
            de: item.de,
            asunto: item.asunto,
            mensaje: item.mensaje,
            fecha: item.fecha,
            alertConfig: item.alertConfig,
            prioridad: item.prioridad,
            suscripcion: item.suscripcion,
            usuarioId: item.usuarioId, // Correctly bind the user ID
            usuarioNombre: item.usuarioNombre, // Bind the user name from the response
        });
        setSelectedUsers([item.usuarioId]); // Preselect the user based on the notification data
        setModalVisible(true); // Open modal for editing
    };

    const handleCreate = () => {
        setSelectedNotification(null); // Reset the form for creating a new notification
        setForm({
            de: '',
            asunto: '',
            mensaje: '',
            fecha: new Date(),
            alertConfig: 'diario',
            prioridad: 'alta',
            suscripcion: 'encender',
            usuarioId: 0, // Reset the user ID
            usuarioNombre: '', // Reset the username
        });
        setSelectedUsers([]); // Reset selected users
        setModalVisible(true); // Open modal for creating a new notification
    };

    const toggleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const viewFromTable = (item) => {
        setSelectedNotification(item);
        setViewMessageModalVisible(true); // Open modal for viewing the full message
    };

    const renderNotificationItem = ({ item }) => (
        <View style={styles.notificationItem}>
            <View style={styles.notificationHeader}>
                <Text style={styles.fromText}>{item.de}</Text>
                <Text style={styles.dateText}>{item.fecha}</Text>
            </View>
            <Text style={styles.subjectText}>{item.asunto}</Text>
            <Text style={styles.messageText}>
                {item.mensaje ? `${item.mensaje.substring(0, 10)}...` : 'Sin mensaje'}
                {/* Fallback to 'Sin mensaje' if item.mensaje is undefined */}
            </Text>

            <TouchableOpacity onPress={() => viewFromTable(item)} style={styles.viewTableButton}>
                <Text style={styles.viewTableButtonText}>Ver mensaje</Text>
            </TouchableOpacity>

            {canEdit && (
                <>
                    <Button title="Editar" onPress={() => handleEdit(item)} />
                    <Button title="Eliminar" onPress={() => handleDelete(item.id)} />
                </>
            )}
        </View>
    );

    return (
        <Provider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderNotificationItem}
                    contentContainerStyle={styles.container}
                />

                {canEdit && (
                    <Button title="Crear Nueva Notificación" onPress={handleCreate} />
                )}

                {/* Modal for viewing full notification */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={viewMessageModalVisible}
                    onRequestClose={() => setViewMessageModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {selectedNotification && (
                                <>
                                    <Text style={styles.modalTitle}>De: {selectedNotification.de}</Text>
                                    <Text style={styles.modalText}>Asunto: {selectedNotification.asunto}</Text>
                                    <Text style={styles.modalText}>Mensaje: {selectedNotification.mensaje}</Text>
                                    <Text style={styles.modalText}>Fecha: {selectedNotification.fecha}</Text>
                                </>
                            )}
                            <Button title="Cerrar" onPress={() => setViewMessageModalVisible(false)} />
                        </View>
                    </View>
                </Modal>

                {/* Modal for creating/updating notification */}
                {canEdit && (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <ScrollView contentContainerStyle={styles.modalContent}>
                            <Text>De:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="De"
                                value={form.de}
                                onChangeText={(text) => setForm({ ...form, de: text })}
                            />
                            <Text>Asunto:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Asunto"
                                value={form.asunto}
                                onChangeText={(text) => setForm({ ...form, asunto: text })}
                            />
                            <Text>Mensaje:</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Mensaje"
                                value={form.mensaje}
                                onChangeText={(text) => setForm({ ...form, mensaje: text })}
                                multiline={true}
                                numberOfLines={6}
                            />
                            <Text>Prioridad:</Text>
                            <Picker
                                selectedValue={form.prioridad}
                                onValueChange={(value) => setForm({ ...form, prioridad: value })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Alta" value="alta" />
                                <Picker.Item label="Media" value="media" />
                                <Picker.Item label="Baja" value="baja" />
                            </Picker>
                            <Text>Alertas:</Text>
                            <Picker
                                selectedValue={form.alertConfig}
                                onValueChange={(value) => setForm({ ...form, alertConfig: value })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Diario" value="diario" />
                                <Picker.Item label="Semanal" value="semanal" />
                                <Picker.Item label="Mensual" value="mensual" />
                            </Picker>
                            <Text>Suscripción:</Text>
                            <Picker
                                selectedValue={form.suscripcion}
                                onValueChange={(value) => setForm({ ...form, suscripcion: value })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Apagar" value="apagar" />
                                <Picker.Item label="Encender" value="encender" />
                            </Picker>

                            {/* User Selection (For admins) */}
                            <Text>Seleccionar Usuarios:</Text>
                            {users.map((user) => (
                                <View key={user.id} style={styles.checkboxContainer}>
                                    <Checkbox
                                        status={selectedUsers.includes(user.id) ? 'checked' : 'unchecked'}
                                        onPress={() => toggleUserSelection(user.id)}
                                    />
                                    <Text>{user.username}</Text>
                                </View>
                            ))}

                            <Button title={selectedNotification ? 'Actualizar' : 'Guardar'} onPress={handleSave} />
                            <Button title="Cerrar" onPress={() => setModalVisible(false)} color="gray" />
                        </ScrollView>
                    </Modal>
                )}

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
    },
    notificationItem: {
        padding: 15,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fromText: {
        fontWeight: 'bold',
    },
    dateText: {
        color: '#666',
    },
    subjectText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    messageText: {
        marginTop: 5,
        color: '#333',
    },
    viewTableButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    viewTableButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
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
        width: '100%',
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        textAlignVertical: 'top', // This aligns text to the top in multiline input
    },
    picker: {
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
});
