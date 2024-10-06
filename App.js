import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the FontAwesome icons
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Register from './screens/Register';
import RecoverPassword from './screens/RecoverPassword';
import Registro from './screens/Registro'; // Add this screen for data entry
import Reportes from './screens/Reportes'; // Add this screen for reports
import Administracion from './screens/Administracion'; // Add this screen for admin
import Notificaciones from './screens/Notificaciones'; // Add this screen for notifications
import Perfil from './screens/Perfil'; // Add this screen for profile
import CustomDrawerContent from './components/CustomDrawerContent'; // Import Custom Drawer Content
import { StatusBar } from 'react-native';
import request from './objects/request'; // Import request object to fetch notifications

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
            <Drawer.Screen name="Registro" component={Registro} />
            <Drawer.Screen name="Reportes" component={Reportes} />
            <Drawer.Screen name="Administracion" component={Administracion} />

            {/* Add the Notificaciones button with bell icon and badge */}
            <Drawer.Screen
                name="Notificaciones"
                component={Notificaciones}
                options={{
                    drawerLabel: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="bell" size={20} color="black" />
                            <Text style={{ marginLeft: 10 }}>Notificaciones</Text>
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
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
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
        backgroundColor: 'red',
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
};
