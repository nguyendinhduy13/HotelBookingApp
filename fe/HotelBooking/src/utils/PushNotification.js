import messaging from '@react-native-firebase/messaging';
import {
  setAsyncStorage,
  getAsyncStorage,
} from '../../functions/asyncStorageFunctions';
import Toast from 'react-native-toast-message';
import {useState} from 'react';
import {NewNotifyFCM} from '../contexts/index';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmToken = await getAsyncStorage('fcmToken');
  console.log('Old fcmToken: ', fcmToken);
  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        await setAsyncStorage('fcmToken', fcmToken);
        console.log('New fcmToken: ', fcmToken);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const PushNotifyToLocalStorage = async remoteMessage => {
  let notify = await getAsyncStorage('notify');
  if (notify) {
    notify = JSON.parse(notify);
    notify.push(remoteMessage);
    await setAsyncStorage('notify', JSON.stringify(notify));
  } else {
    notify = [];
    notify.push(remoteMessage);
    await setAsyncStorage('notify', JSON.stringify(notify));
  }
};

export const NotificationService = async navigation => {
  let currentUserID = await getAsyncStorage('currentUser');
  console.log('currentUserID: ', currentUserID);
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  //Foreground notification
  messaging().onMessage(async remoteMessage => {
    console.log('Notification in Foreground', remoteMessage);
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

    if (remoteMessage.data.id_user === currentUserID) {
      Toast.show({
        type: 'notifyBasic',
        text1: notification.title,
        text2: notification.body,
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 10,
        bottomOffset: 10,
        props: {
          navigation: navigation,
          data: notification,
        },
      });
    }

    await PushNotifyToLocalStorage(notification);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
    });
};

export const NotificationProvider = ({children}) => {
  const [hasNewNotification, setHasNewNotification] = useState(false);

  messaging().onMessage(async remoteMessage => {
    setHasNewNotification(true);
  });

  return (
    <NewNotifyFCM.Provider value={{hasNewNotification, setHasNewNotification}}>
      {children}
    </NewNotifyFCM.Provider>
  );
};
