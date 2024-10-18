import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Tooltip } from 'react-native-elements';

export default function Perfil() {
  const [profile, setProfile] = useState({
    nombre: 'John Doe',
    correoElectronico: 'john.doe@example.com',
    numeroIdentificacion: '123456789',
    telefono: '555-1234',
    estadoCuenta: 'Activo',
    rol: 'Admin', // This field will be hidden
    usuario: 'johndoe', // Username (non-editable)
    avatar: null, // Profile picture
  });

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const fileType = result.uri.split('.').pop().toLowerCase();
      if (['png', 'jpg', 'jpeg'].includes(fileType)) {
        setProfile({ ...profile, avatar: result.uri });
      } else {
        Alert.alert('Formato no permitido', 'Por favor, seleccione un archivo PNG, JPG, o JPEG.');
      }
    }
  };

  const handleSave = () => {
    Alert.alert('Perfil actualizado', 'Los cambios se han guardado exitosamente.');
    // Here you would typically send the profile data to your backend for updating
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Mi Perfil</Text>

        {/* Profile Picture Section */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleImagePicker}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>Subir Foto</Text>
              </View>
            )}
          </TouchableOpacity>
          <Tooltip popover={<Text style={styles.tooltipText}>Una foto con fondo blanco, tamaño pasaporte, de frente, expresión normal, solo la cara, formatos permitidos (PNG, JPG, JPEG)</Text>}
            height={120}
            width={250}
            backgroundColor="#000"
            withOverlay={false}
            containerStyle={{ justifyContent: 'center' }}
          >
            <Text style={styles.tooltipIcon}>ℹ️</Text>
          </Tooltip>
        </View>

        {/* Name Field */}
        <Text>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre Completo"
          value={profile.nombre}
          onChangeText={text => setProfile({ ...profile, nombre: text })}
        />

        {/* Email Field */}
        <Text>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          value={profile.correoElectronico}
          onChangeText={text => setProfile({ ...profile, correoElectronico: text })}
          keyboardType="email-address"
        />

        {/* Phone Field */}
        <Text>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={profile.telefono}
          onChangeText={text => setProfile({ ...profile, telefono: text })}
          keyboardType="phone-pad"
        />

        {/* Non-editable Fields */}
        <Text>Numero de Identificación</Text>
        <TextInput
          style={styles.input}
          placeholder="Numero de Identificación"
          value={profile.numeroIdentificacion}
          editable={false}
        />

        <Text>Estado de la Cuenta</Text>
        <TextInput
          style={styles.input}
          placeholder="Estado de la Cuenta"
          value={profile.estadoCuenta}
          editable={false}
        />

        <Text>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={profile.usuario}
          editable={false}
        />

        {/* Save Button */}
        <Button title="Guardar Cambios" onPress={handleSave} />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
  },
  tooltipIcon: {
    marginLeft: 5,
    color: '#666',
  },
  tooltipText: {
    color: '#fff',
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
});
