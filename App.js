import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the FontAwesome icons
import Dashboard from './src/screens/Dashboard';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import RecoverPassword from './src/screens/RecoverPassword';
import Registro from './src/screens/Registro'; // Add this screen for data entry
import Reportes from './src/screens/Reportes'; // Add this screen for reports
import Administracion from './src/screens/Administracion'; // Add this screen for admin
import Notificaciones from './src/screens/Notificaciones'; // Add this screen for notifications
import Ganado from './src/screens/Ganado'; // // Add this screen for livestock
import Suministros from './src/screens/Suministros'; // Add this screen for suppliers
import Apartamentos from './src/screens/Apartamentos'; // Add this screen for apartments
import Usuarios from './src/screens/Usuarios'; // Add this screen for users
import PastoreoRotacion from './src/screens/PastoreoRotacion'; // Add this screen for rotation of apartments
import Perfil from './src/screens/Perfil'; // Add this screen for profile
import CustomDrawerContent from './src/components/CustomDrawerContent'; // Import Custom Drawer Content
import { StatusBar } from 'react-native';
import request from './src/objects/request'; // Import request object to fetch notifications
import { colors, typography, commonStyles } from './src/styles/theme'; // Import theme

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
    const [notificationCount, setNotificationCount] = useState(0); // State to store unread notifications count

    // Function to fetch the notification count
    const fetchNotificationCount = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId'); // Get the logged-in user ID
            request.setConfig({
                method: 'get',
                url: `http://localhost:5075/api/Notificacion/getByUser/${userId}`, // Adjust to your API
                withCredentials: true,
            });
            const response = await request.sendRequest();

            if (response.success) {
                const unreadCount = response.data.filter((notification) => !notification.read).length; // Assuming "read" is a property
                setNotificationCount(unreadCount); // Set the count of unread notifications
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Fetch notifications count when component mounts
    useEffect(() => {
        fetchNotificationCount();
    }, []);

    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} logout={logout} />}>
            <Drawer.Screen name="Dashboard" component={Dashboard} />
            <Drawer.Screen name="Registro" component={RegistroStack} />
            <Drawer.Screen name="Reportes" component={Reportes} />
            <Drawer.Screen name="Administracion" component={AdministracionStack} />

            {/* Add the Notificaciones button with bell icon and badge */}
            <Drawer.Screen
                name="Notificaciones"
                component={Notificaciones}
                options={{
                    drawerLabel: () => (
                        <View style={styles.drawerLabelContainer}>
                            <Icon name="bell" size={20} color={colors.secondary3} />
                            <Text style={[styles.drawerLabelText, typography.main]}>Notificaciones</Text>
                            {notificationCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{notificationCount}</Text> 
                                </View>
                            )}
                        </View>
                    ),
                }}
            />

            <Drawer.Screen name="Perfil" component={Perfil} />
        </Drawer.Navigator>
    );
}

// Main App component
export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const handleLogout = () => {
        setIsAuthenticated(false); // Set to false on logout
    };

    return (
        <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor={colors.main1} />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="AppDrawer">
                        {(props) => <AppDrawer {...props} logout={handleLogout} />}
                    </Stack.Screen>
                ) : (
                    <>
                        <Stack.Screen name="Login">
                            {(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}
                        </Stack.Screen>
                        <Stack.Screen name="Register" component={Register} />
                        <Stack.Screen name="RecoverPassword" component={RecoverPassword} /> 
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Styles for the badge
const styles = {
    badge: {
        backgroundColor: colors.secondary4, // Use theme color
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    drawerLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    drawerLabelText: {
        marginLeft: 10,
        fontSize: 16,
    },
};
