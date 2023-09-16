import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Login from '../views/Auth/Login';
import SignUp from '../views/Auth/SignUp';
export default function AuthStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
