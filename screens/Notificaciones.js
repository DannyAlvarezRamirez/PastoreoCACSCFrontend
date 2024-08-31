import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Notificaciones() {
  const [notifications, setNotifications] = useState([
    // Sample data
    { id: '1', from: 'Admin', subject: 'Meeting', message: 'Remember the meeting scheduled for tomorrow...', date: '2024-08-10', alertConfig: 'day', priority: 'alta', subscription: 'encender' },
    { id: '2', from: 'Support', subject: 'Update', message: 'System update will take place at midnight...', date: '2024-08-09', alertConfig: 'week', priority: 'media', subscription: 'apagar' },
  ]);

  const [selectedNotification, setSelectedNotification] = useState(null); // For storing the selected notification
  const [modalVisible, setModalVisible] = useState(false); // For controlling the modal visibility

  const handleAlertConfigChange = (value, id) => {
    setNotifications(notifications.map(item =>
      item.id === id ? { ...item, alertConfig: value } : item
    ));
  };

  const handlePriorityChange = (value, id) => {
    setNotifications(notifications.map(item =>
      item.id === id ? { ...item, priority: value } : item
    ));
  };

  const handleSubscriptionChange = (value, id) => {
    setNotifications(notifications.map(item =>
      item.id === id ? { ...item, subscription: value } : item
    ));
  };

  const viewFromTable = (notification) => {
    setSelectedNotification(notification); // Set the selected notification
    setModalVisible(true); // Show the modal
  };

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationHeader}>
        <Text style={styles.fromText}>{item.from}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <Text style={styles.subjectText}>{item.subject}</Text>
      <Text style={styles.messageText}>{item.message.substring(0, 10)}...</Text>

      <View style={styles.configSection}>
        <Text>Configuración de Alertas</Text>
        <Picker
          selectedValue={item.alertConfig}
          style={styles.picker}
          onValueChange={(value) => handleAlertConfigChange(value, item.id)}
        >
          <Picker.Item label="Diario" value="day" />
          <Picker.Item label="Semanal" value="week" />
          <Picker.Item label="Mensual" value="month" />
        </Picker>
      </View>

      <View style={styles.configSection}>
        <Text>Seleccionar la Prioridad</Text>
        <Picker
          selectedValue={item.priority}
          style={styles.picker}
          onValueChange={(value) => handlePriorityChange(value, item.id)}
        >
          <Picker.Item label="Alta" value="alta" />
          <Picker.Item label="Media" value="media" />
          <Picker.Item label="Baja" value="baja" />
        </Picker>
      </View>

      <View style={styles.configSection}>
        <Text>Gestión de Suscripciones</Text>
        <Picker
          selectedValue={item.subscription}
          style={styles.picker}
          onValueChange={(value) => handleSubscriptionChange(value, item.id)}
        >
          <Picker.Item label="Apagar" value="apagar" />
          <Picker.Item label="Encender" value="encender" />
        </Picker>
      </View>

      <TouchableOpacity onPress={() => viewFromTable(item)} style={styles.viewTableButton}>
        <Text style={styles.viewTableButtonText}>Ver mensajes de {item.from}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.container}
      />

      {/* Modal for viewing the full message */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedNotification && (
              <>
                <Text style={styles.modalTitle}>De: {selectedNotification.from}</Text>
                <Text style={styles.modalText}>Asunto: {selectedNotification.subject}</Text>
                <Text style={styles.modalText}>Mensaje: {selectedNotification.message}</Text>
                <Text style={styles.modalText}>Fecha: {selectedNotification.date}</Text>
              </>
            )}
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  configSection: {
    marginTop: 15,
  },
  picker: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
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
    width: '80%',
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
});
