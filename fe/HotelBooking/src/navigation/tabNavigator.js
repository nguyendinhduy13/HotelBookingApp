import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Booking from '../views/Booking/Booking';
import HomeScreen from '../views/Home/HomeScreen';
import Profile from '../views/Profile/Profile';
const Tab = createBottomTabNavigator();
export default function TabNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colors.bg,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: t('home'),
          tabBarIcon: ({ size, color }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Booking"
        component={Booking}
        options={{
          tabBarLabel: t('booking'),
          tabBarIcon: ({ size, color }) => (
            <Icon2 name="book" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: t('profile'),
          tabBarIcon: ({ size, color }) => (
            <Icon1 name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
