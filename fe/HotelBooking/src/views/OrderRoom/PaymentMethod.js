import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setPaymentMethod } from '../../../redux/VehicleReducer';
import CustomHeader from '../../components/CustomHeader';
const PaymentMethod = ({navigation}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const data = [
    {
      id: 'payment-hotel',
      name: 'Thanh toán tại khách sạn',
      image:
        'https://cdn1.iconfinder.com/data/icons/condominium-juristic-management/64/Common_fee-fee-money-condominium-512.png',
      available: true,
    },
    {
      id: 'payment-momo',
      name: 'Ví MoMo',
      image:
        'https://play-lh.googleusercontent.com/dQbjuW6Jrwzavx7UCwvGzA_sleZe3-Km1KISpMLGVf1Be5N6hN6-tdKxE5RDQvOiGRg=w240-h480-rw',
      available: true,
    },
    {
      id: 'payment-zalopay',
      name: 'Ví ZaloPay',
      image:
        'https://play-lh.googleusercontent.com/NfFBz1Rxk0nQ7RsOk0kXbi1AEp1ZJ3rzJHbwRlmheZEDPPHh7dscqyxyX-ehxTl7tw=w240-h480-rw',
      available: true,
    },
  ];
  const [selected, setSelected] = useState();
  const {payment_method} = useSelector(state => state.VehicleReducer);

  const handleConfirm = () => {
    dispatch(setPaymentMethod(selected));
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.box}}>
      <CustomHeader title={t('payment-method')} />
      <View style={{padding: 10}}>
        {data.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: colors.bg,
                borderRadius: 10,
                marginBottom: 10,
                justifyContent: 'space-between',
                elevation: 5,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item.image}}
                  style={{width: 40, height: 40, borderRadius: 5}}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  {item.name}
                </Text>
              </View>
              <BouncyCheckbox
                size={25}
                fillColor="orange"
                unfillColor="#FFFFFF"
                iconStyle={{borderColor: 'orange'}}
                innerIconStyle={{borderWidth: 2}}
                textStyle={{fontFamily: 'JosefinSans-Regular'}}
                isChecked={
                  selected?.id
                    ? selected.id === item.id
                    : payment_method.id === item.id
                }
                disableBuiltInState
                onPress={() => {
                  selected?.id !== item.id && setSelected(item);
                }}
              />
            </View>
          );
        })}
      </View>
      <View
        style={{
          width: '100%',
          height: 65,
          backgroundColor: colors.box,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
        }}>
        <TouchableOpacity
          style={{
            width: '90%',
            height: 45,
            backgroundColor: colors.primary,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            handleConfirm();
          }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: 'white',
            }}>
            {t('done')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({});
