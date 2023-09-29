import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

import {getAsyncStorage} from '../../../../../functions/asyncStorageFunctions';
import NotifyItem from './components/NotifyItem';
import {ContextNotify} from '../../../../contexts/index';

const AllPage = ({navigation}) => {
  const {notify, setNotify, userData} = useContext(ContextNotify);
  const [refreshing, setRefreshing] = useState(false);
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
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: colors.special,
      }}>
      {notify.length === 0 ? (
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
              color: colors.icon,
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
                <View
                  key={index + item.id}
                  style={{
                    backgroundColor: colors.box,
                    borderBottomWidth: index === 0 ? 0 : 1,
                    borderBottomColor: '#ddd',
                  }}>
                  <NotifyItem id={item.id} navigation={navigation} />
                </View>
              );
            })
            .reverse()}
        </View>
      )}
    </ScrollView>
  );
};

export default AllPage;

const styles = StyleSheet.create({});
