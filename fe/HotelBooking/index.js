import store from './redux/store';
import {Provider as ReduxProvider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {
  getAsyncStorage,
  setAsyncStorage,
} from './functions/asyncStorageFunctions';
import Toast from 'react-native-toast-message';
import {View, Text, Image, Pressable} from 'react-native';
import {PushNotifyToLocalStorage} from './src/utils/PushNotification';

const toastConfig = {
  notifyBasic: ({text1, text2, props}) => (
    <Pressable
      onPress={() => {
        if (props?.data?.data?.type === 'booking') {
          props.navigation.navigate('DetailBooking', {
            id_booking: props.data.data.id_booking,
            id_hotel: props.data.data.id_hotel,
            dataNotify: props.data,
          });
        } else if (props?.data?.type === 'chat') {
          props.navigation.navigate('Chat', {
            hotelData: {
              _id: props.data.data.id_chat,
              name: props.data.title,
            },
          });
        } else if (props?.data?.type === 'other') {
          props.navigation.navigate('DetailNotify', {
            dataNotify: props.data,
          });
        }
        Toast.hide();
      }}
      style={{
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        alignSelf: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      }}>
      <View style={{padding: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={require('./src/assets/logo_mini.png')}
              style={{
                width: 25,
                height: 25,
                resizeMode: 'cover',
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: 'black',
              marginLeft: 10,
            }}>
            {text1}
          </Text>
        </View>
        <View style={{marginTop: 5}}>
          <Text
            style={{
              color: 'black',
              fontSize: 13,
              fontWeight: '400',
              lineHeight: 20,
              textAlign: 'justify',
              overflow: 'hidden',
              height: text2 > 110 ? 40 : null,
            }}>
            {formatLongText(text2)}
          </Text>
        </View>
      </View>
    </Pressable>
  ),
};

const formatLongText = text => {
  if (text?.length > 110) {
    return text.slice(0, 110) + '...';
  }
  return text;
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  const notification = {
    id: remoteMessage.messageId,
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    data: remoteMessage.data,
    type: remoteMessage.data.type,
    time: remoteMessage.sentTime,
    isRead: false,
    id_user: remoteMessage.data.id_user,
  };
  await PushNotifyToLocalStorage(notification);
});
AppRegistry.registerComponent(appName, () => () => (
  <ReduxProvider store={store}>
    <NavigationContainer>
      <App />
    </NavigationContainer>
    <Toast config={toastConfig} />
  </ReduxProvider>
));
