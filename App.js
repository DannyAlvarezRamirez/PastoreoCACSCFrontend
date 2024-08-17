import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Register from './screens/Register';
import RecoverPassword from './screens/RecoverPassword';
import RegistroDatos from './screens/RegistroDatos'; // Add this screen for data entry
import Reportes from './screens/Reportes'; // Add this screen for reports
import Administracion from './screens/Administracion'; // Add this screen for admin
import Notificaciones from './screens/Notificaciones'; // Add this screen for notifications

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Registro de Datos" component={RegistroDatos} />
      <Drawer.Screen name="Reportes" component={Reportes} />
      <Drawer.Screen name="Administración" component={Administracion} />
      <Drawer.Screen name="Notificaciones" component={Notificaciones} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="AppDrawer" component={AppDrawer} options={{ headerShown: false }} />
          </>
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
