import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Register from './screens/Register';
import RecoverPassword from './screens/RecoverPassword';
import Registro from './screens/Registro'; // Add this screen for data entry
import Reportes from './screens/Reportes'; // Add this screen for reports
import Administracion from './screens/Administracion'; // Add this screen for admin
import Notificaciones from './screens/Notificaciones'; // Add this screen for notifications
import Ganado from './screens/Ganado'; // // Add this screen for livestock
import Suministros from './screens/Suministros'; // Add this screen for suppliers
import Apartamentos from './screens/Apartamentos'; // Add this screen for apartments
import Usuarios from './screens/Usuarios'; // Add this screen for users
import PastoreoRotacion from './screens/PastoreoRotacion'; // Add this screen for rotation of apartments
import Perfil from './screens/Perfil'; // Add this screen for profile
import CustomDrawerContent from './components/CustomDrawerContent'; // Import Custom Drawer Content
//import { StatusBar } from 'expo-status-bar';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Create a stack for Registro and its related screens
function RegistroStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Registro" component={Registro} />
      <Stack.Screen name="Ganado" component={Ganado} />
      <Stack.Screen name="Suministros" component={Suministros} />
      <Stack.Screen name="Apartamentos" component={Apartamentos} />
    </Stack.Navigator>
  );
}

// Create a stack for Administracion and its related screens
function AdministracionStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Administracion" component={Administracion} />
      <Stack.Screen name="Usuarios" component={Usuarios} />
      <Stack.Screen name="PastoreoRotacion" component={PastoreoRotacion} />
    </Stack.Navigator>
  );
}

function AppDrawer({ logout }) {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} logout={logout} />}>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Registro" component={RegistroStack} />
      <Drawer.Screen name="Reportes" component={Reportes} />
      <Drawer.Screen name="Administracion" component={AdministracionStack} />
      <Drawer.Screen name="Notificaciones" component={Notificaciones} />
      <Drawer.Screen name="Perfil" component={Perfil} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogout = () => {
      setIsAuthenticated(false); // Set to false on logout
  };

  return (
    <NavigationContainer>
    <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
            <Stack.Screen name="AppDrawer">
                {(props) => <AppDrawer {...props} logout={handleLogout} />} 
            </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login">
              {props => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="RecoverPassword" component={RecoverPassword} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
