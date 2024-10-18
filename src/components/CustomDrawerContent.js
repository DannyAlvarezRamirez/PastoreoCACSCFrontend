import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { DrawerItemList } from '@react-navigation/drawer';
import { colors, typography } from '../styles/theme'; // Import theme

export default function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1 }}>
      <DrawerItemList {...props} />
      {/* Add the Logout Button at the bottom */}
      <View style={styles.logoutButtonContainer}>
        <Button
          title="Cerrar Sesión"
          color={colors.secondary1} // Use theme color for the button
          onPress={() => {
            // Call the logout function passed from App.js
            props.logout();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButtonContainer: {
    padding: 20,
    position: 'sticky',
    bottom: 0,
    width: '100%',
    borderRadius: '100',
  },
});
