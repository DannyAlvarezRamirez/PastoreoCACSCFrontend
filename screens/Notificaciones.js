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
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dialog, Portal, Provider } from 'react-native-paper';
import request from '../objects/request';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For retrieving user info

export default function Notificaciones() {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // For viewing modal
    const [isDialogVisible, setIsDialogVisible] = useState(false); // For controlling dialog visibility
    const [dialogMessage, setDialogMessage] = useState(''); // Dialog message
    const [form, setForm] = useState({
        from: '',
        subject: '',
        message: '',
        date: new Date(),
        alertConfig: 'day',
        priority: 'alta',
        subscription: 'encender',
    });
    const [userRole, setUserRole] = useState(0); // To store user role (will be retrieved from AsyncStorage)

    // Fetch notifications by user when component loads
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Retrieve the user ID and role from AsyncStorage
                const userId = await AsyncStorage.getItem('userId');
                const userRole = await AsyncStorage.getItem('userRolId');
                setUserRole(parseInt(userRole, 10)); // Set user role

                // Fetch notifications for the current user
                request.setConfig({
                    method: 'get',
                    url: `http://localhost:5075/api/Notificacion/getByUser/${userId}`,
                    withCredentials: true,
                });
                const response = await request.sendRequest();

                if (response.success) {
                    setNotifications(response.data);
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

        fetchNotifications();
    }, []);

    // Role-based condition for creating, updating, and deleting
    const canEdit = userRole === 1;

    const handleSave = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const requestData = { ...form, creadoPor: userId };

            // If selectedNotification is null, create new notification, otherwise update existing
            if (selectedNotification === null) {
                // Create new notification
                request.setConfig({
                    method: 'post',
                    url: 'http://localhost:5075/api/Notificacion/create',
                    withCredentials: true,
                    data: requestData,
                });
                const response = await request.sendRequest();

                if (response.success) {
                    setDialogMessage('Notificación creada exitosamente.');
                    setNotifications([...notifications, response.data]);
                } else {
                    setDialogMessage('Error creating notification');
                }
            } else {
                // Update existing notification
                request.setConfig({
                    method: 'put',
                    url: `http://localhost:5075/api/Notificacion/update/${selectedNotification.id}`,
                    withCredentials: true,
                    data: requestData,
                });
                const response = await request.sendRequest();

                if (response.success) {
                    setDialogMessage('Notificación actualizada exitosamente.');
                    setNotifications(notifications.map((item) =>
                        item.id === selectedNotification.id ? { ...response.data } : item
                    ));
                } else {
                    setDialogMessage('Error updating notification');
                }
            }

            setModalVisible(false); // Close modal after saving
            setIsDialogVisible(true); // Show dialog
        } catch (error) {
            setDialogMessage('Error saving notification');
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
            } else {
                setDialogMessage('Error deleting notification');
            }

            setIsDialogVisible(true);
        } catch (error) {
            setDialogMessage('Error deleting notification');
            setIsDialogVisible(true);
            console.error(error);
        }
    };

    const handleEdit = (item) => {
        setSelectedNotification(item);
        setForm({
            from: item.from,
            subject: item.subject,
            message: item.message,
            date: item.date,
            alertConfig: item.alertConfig,
            priority: item.priority,
            subscription: item.subscription,
        });
        setModalVisible(true); // Open modal for editing
    };

    const renderNotificationItem = ({ item }) => (
        <View style={styles.notificationItem}>
            <View style={styles.notificationHeader}>
                <Text style={styles.fromText}>{item.from}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <Text style={styles.subjectText}>{item.subject}</Text>
            <Text style={styles.messageText}>{item.message.substring(0, 10)}...</Text>
             
            <TouchableOpacity onPress={() => setSelectedNotification(item)} style={styles.viewTableButton}>
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
                                value={form.from}
                                onChangeText={(text) => setForm({ ...form, from: text })}
                            />
                            <Text>Asunto:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Asunto"
                                value={form.subject}
                                onChangeText={(text) => setForm({ ...form, subject: text })}
                            />
                            <Text>Mensaje:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mensaje"
                                value={form.message}
                                onChangeText={(text) => setForm({ ...form, message: text })}
                            />
                            <Text>Prioridad:</Text>
                            <Picker
                                selectedValue={form.priority}
                                onValueChange={(value) => setForm({ ...form, priority: value })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Alta" value="alta" />
                                <Picker.Item label="Media" value="media" />
                                <Picker.Item label="Baja" value="baja" />
                            </Picker>

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
    modalContent: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
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
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
});
