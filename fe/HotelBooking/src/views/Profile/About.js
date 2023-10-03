import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import CustomHeader from '../../components/CustomHeader';
const About = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.bg, flex: 1 }}>
      <CustomHeader title={t('contact')} />
      <View style={{ padding: 10 }}>
        <View>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              color: 'orange',
            }}
          >
            {t('Hotel-Booking-VIET-NAM-Joint-Stock-Company')}
          </Text>
          <View
            style={{
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 16, color: colors.icon }}>
              Hotline:{' '}
              <Text style={{ color: colors.text, fontWeight: '500' }}>
                1900 636 636
              </Text>
            </Text>
            <Text style={{ fontSize: 16, color: colors.icon }}>
              {t('support-customer')}:{' '}
              <Text style={{ color: colors.text, fontWeight: '500' }}>
                cskh@hotelbooking.vn
              </Text>
            </Text>
            <Text style={{ fontSize: 16, color: colors.icon }}>
              {t('contact-for-cooperation')}:{' '}
              <Text style={{ color: colors.text, fontWeight: '500' }}>
                1900 636 636
              </Text>{' '}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 40 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              color: 'orange',
            }}
          >
            Hồ Chí Minh
          </Text>
          <View
            style={{
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 16, color: colors.icon }}>
              {t('headquarters')}:{' '}
              <Text style={{ color: colors.text, fontWeight: '500' }}>
                5A Đường số 2, Khu phố 6, Phường Linh Trung, Quận Thủ Đức, Tp.
                Hồ Chí Minh
              </Text>
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 40 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              color: 'orange',
            }}
          >
            Hà Nội
          </Text>
          <View
            style={{
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 16, color: colors.icon }}>
              {t('headquarters')}:{' '}
              <Text style={{ color: colors.text, fontWeight: '500' }}>
                19 Ngõ 1, Nguyễn Khang, Cầu Giấy, Hà Nội
              </Text>
            </Text>
          </View>
        </View>
        <Image
          source={{
            uri: 'https://i0.wp.com/online.gov.vn/PublicImages/2015/08/27/11/20150827110756-dadangky.png',
          }}
          style={{
            width: 250,
            height: 100,
            marginTop: 20,
            resizeMode: 'contain',
          }}
        />
      </View>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({});
