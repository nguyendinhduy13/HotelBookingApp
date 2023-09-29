import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import Lottie from 'lottie-react-native';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

import {getAsyncStorage} from '../../../../../functions/asyncStorageFunctions';
import NotifyItem from './components/NotifyItem';
import {ContextNotify} from '../../../../contexts/index';

const SystemPage = ({navigation}) => {
  const {notify, loading, setNotify, userData} = useContext(ContextNotify);
  const [refreshing, setRefreshing] = useState(false);
  const [isExist, setIsExist] = useState(false);
  const [notifySystem, setNotifySystem] = useState([]);
  const {colors} = useTheme();
  const {t} = useTranslation();

  const handleRefresh = async () => {
    setRefreshing(true);

    let notify = await getAsyncStorage('notify');
    notify = JSON.parse(notify);
    notify = await notify.filter(item => item.data?.id_user === userData._id);
    setNotify(notify);

    setRefreshing(false);
  };

  useEffect(() => {
    const checkSystem = async () => {
      const system = notify.find(item => item.data.type === 'chat');
      setIsExist(system ? true : false);
      const notifySystem = await notify.filter(
        item => item.data.type === 'chat',
      );
      setNotifySystem(notifySystem);
    };
    checkSystem();
  }, [notify]);

  return loading ? (
    <View
      style={{
        position: 'absolute',
        opacity: 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: colors.box,
      }}>
      <Lottie
        source={require('../../../../assets/animations/92803-loading.json')}
        autoPlay
        loop
      />
    </View>
  ) : (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: colors.special,
      }}>
      {!isExist ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <Image
            source={require('../../../../assets/no_notify.png')}
            style={{width: 200, height: 200}}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: '#999',
              marginTop: 20,
            }}>
            {t('no-notification')}
          </Text>
        </View>
      ) : (
        <View
          style={{
            padding: 10,
            backgroundColor: colors.box,
            width: '95%',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginBottom: 10,
            elevation: 5,
          }}>
          {notify
            ?.map((item, index) => {
              return (
                item.data.type === 'chat' && (
                  <View
                    key={index + item.id}
                    style={{
                      backgroundColor: colors.box,
                      borderBottomWidth:
                        notifySystem[0]?.id === item.id ? 0 : 1,
                      borderBottomColor: '#ddd',
                    }}>
                    <NotifyItem id={item.id} navigation={navigation} />
                  </View>
                )
              );
            })
            .reverse()}
        </View>
      )}
    </ScrollView>
  );
};

export default SystemPage;

const styles = StyleSheet.create({});
