import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {getAsyncStorage} from '../../../../functions/asyncStorageFunctions';
import TopTabNavigator from './TopTabNavigator';
import {ContextNotify} from '../../../contexts/index';

export default function NotificationPage() {
  const [notify, setNotify] = useState([]);
  const [loading, setLoading] = useState(true);
  const {userData} = useSelector(state => state.global);
  useEffect(() => {
    const getNotify = async () => {
      setLoading(true);
      let notify = await getAsyncStorage('notify');
      //filter notify by user
      notify = JSON.parse(notify);
      if (notify) {
        notify = await notify.filter(
          item => item.data?.id_user === userData._id,
        );
        setNotify(notify);
      } else {
        setNotify([]);
      }
      setLoading(false);
    };
    getNotify();
  }, []);

  return (
    <SafeAreaProvider>
      <ContextNotify.Provider value={{notify, loading, setNotify, userData}}>
        <TopTabNavigator />
      </ContextNotify.Provider>
    </SafeAreaProvider>
  );
}
