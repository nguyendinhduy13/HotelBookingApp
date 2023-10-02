import messaging from '@react-native-firebase/messaging';
import {
  setAsyncStorage,
  getAsyncStorage,
} from '../../functions/asyncStorageFunctions';
import Toast from 'react-native-toast-message';
import {useState} from 'react';
import {NewNotifyFCM} from '../contexts/index';
