import React from 'react';
import {StatusBar} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import AuthStack from './authStack';
import AppStack from './appStack';
import {useSelector} from 'react-redux';
import {NotificationProvider} from '../utils/PushNotification';

export default function RootNavigation() {
  const {userData, theme} = useSelector(state => state.global);
  // console.log(userData.roll);

  const lightTheme = {
    colors: {
      text: '#000',
      untext: '#fff',
      bg: '#fff',
      icon: '#808080',
      box: '#fff',
      special: '#f5f5f5',
      primary: '#52c0b4',
      blurprimary: '#c8f4ef',
    },
  };

  const darkTheme = {
    colors: {
      text: '#fff',
      untext: '#000',
      bg: '#000',
      icon: '#fff',
      box: '#1a1a1a',
      special: '#666161',
      primary: '#52c0b4',
      blurprimary: '#c8f4ef',
    },
  };

  return (
    <PaperProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <NotificationProvider>
        <StatusBar
          backgroundColor={theme === 'light' ? '#fff' : '#000'}
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
        {userData ? <AppStack /> : <AuthStack />}
      </NotificationProvider>
    </PaperProvider>
  );
}
