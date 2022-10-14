import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../Screens/Login';
import ChatApp from '../Screens/ChatApp';
import StartPage from '../Screens/StartPage';
import Register from '../Screens/Register';
import ChatRoom from '../Screens/ChatRoom';

const Stack = createNativeStackNavigator();

function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="StartPage"
                    component={StartPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ChatRoom"
                    component={ChatRoom}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ChatApp"
                    component={ChatApp}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Routes;