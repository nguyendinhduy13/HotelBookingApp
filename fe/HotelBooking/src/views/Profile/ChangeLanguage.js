import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View,ToastAndroid } from 'react-native';
import { useTheme } from 'react-native-paper';
import { setAsyncStorage } from '../../../functions/asyncStorageFunctions';
import '../../i18n/18n';
import CustomHeader from '../../components/CustomHeader';
const ChangeLanguage = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const handleChangeLang = (id) => {
    setAsyncStorage('language', id);
    i18n.changeLanguage(id);
    console.log('languauge: ' + id);
    ToastAndroid.show(t('change-language-success'), ToastAndroid.SHORT);
    navigation.goBack();
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View>
        <CustomHeader title={'change-language'} />
        <View style={{ paddingHorizontal: 20, height: '100%', width: '100%' }}>
          <TouchableOpacity
            onPress={() => {
              handleChangeLang('vi');
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}
            >
              <Image
                source={{
                  uri: 'https://investone-law.com/wp-content/uploads/2019/06/quoc-ky-viet-nam.jpg',
                }}
                style={{ width: 50, height: 50, borderRadius: 10 }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  paddingHorizontal: 30,
                  color: 'orange',
                }}
              >
                {t('vietnamese')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleChangeLang('en');
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}
            >
              <Image
                source={{
                  uri: 'https://cacnuoc.vn/wp-content/uploads/2016/04/UnionFlag-300x180.png',
                }}
                style={{ width: 50, height: 50, borderRadius: 10 }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  paddingHorizontal: 30,
                  color: 'orange',
                }}
              >
                {t('english')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChangeLanguage;

const styles = StyleSheet.create({});
