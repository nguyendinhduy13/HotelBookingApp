import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import CustomHeader from '../../components/CustomHeader';
const Terms = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
      }}
    >
      <CustomHeader title={t('terms-and-conditions')} />
      <View style={{ padding: 10 }}>
        <Image
          source={require('../../assets/pngegg.png')}
          style={{
            width: '100%',
            height: '100%',
            alignSelf: 'center',
            backgroundColor: colors.bg,
            resizeMode: 'contain',
          }}
        />
      </View>
    </View>
  );
};

export default Terms;

const styles = StyleSheet.create({});
