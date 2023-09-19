import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { LogBox, PermissionsAndroid, View } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  getAsyncStorage,
  setAsyncStorage,
} from './functions/asyncStorageFunctions';
import { CheckLogin } from './middlewares/auth';
import { GetAllHotels } from './middlewares/hotels';
import {
  setHotels,
  setTheme,
  setUserData,
  setUserPosition,
} from './redux/Globalreducer';
import i18n from './src/i18n/18n';
import RootNavigation from './src/navigation/root';
import {
  NotificationService,
  requestUserPermission,
} from './src/utils/PushNotification';

//logbox ignore all
LogBox.ignoreAllLogs();
const App = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [wait, setWait] = useState(true);

  useEffect(() => {
    getAsyncStorage('userData').then(token => {
      if (token) {
        CheckLogin(token).then(res => {
          if (res.status === 200) {
            console.log('User logged in');
            dispatch(setUserData(res.data.data.user));
            setAsyncStorage('currentUser', res.data.data.user._id);
          } else {
            console.log('Token expired');
            dispatch(setUserData(''));
          }
        });
      } else {
        console.log('User not logged in');
        dispatch(setUserData(''));
      }
    });
  }, []);

  useEffect(() => {
    GetAllHotels().then(res => {
      if (res.status === 200) {
        console.log('Data hotels geted');
        res.data = res.data.filter(
          (item: { isactive: boolean }) => item.isactive === true,
        );
        dispatch(setHotels(res.data));
        setWait(false);
      }
    });
  }, []);

  useEffect(() => {
    getAsyncStorage('language').then(lang => {
      console.log('Languauge: ' + lang);
      if (lang) {
        i18n.changeLanguage(lang);
      } else {
        console.log('Languauge: en');
        i18n.changeLanguage('en');
        setAsyncStorage('language', 'en');
      }
    });
  }, []);

  useEffect(() => {
    getAsyncStorage('theme').then(theme => {
      if (theme) {
        console.log('Theme: ' + theme);
        dispatch(setTheme(theme));
      } else {
        console.log('No theme');
        setAsyncStorage('theme', 'light');
      }
    });
  }, []);

  const componentDidMount = () => {
    Geolocation.getCurrentPosition(
      position => {
        dispatch(
          setUserPosition({
            // latitude: position.coords.latitude,
            // longitude: position.coords.longitude,
            latitude: 10.8702,
            longitude: 106.8028,
          }),
        );
      },
      error => {
        console.log(error.message);
        dispatch(
          setUserPosition({
            latitude: 10.8702,
            longitude: 106.8028,
          }),
        );
      },
      { enableHighAccuracy: true },
    );
  };
  const requestLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'Hotel Booking App needs access to your location ' +
            'so you can see your current location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestLocation();
    componentDidMount();
    requestUserPermission();
    NotificationService(navigation);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {wait ? (
        <View
          style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
          <Lottie
            source={require('./src/assets/animations/140846-vertical-animation.json')}
            autoPlay
            loop
          />
        </View>
      ) : (
        <RootNavigation />
      )}
    </View>
  );
};

export default App;
