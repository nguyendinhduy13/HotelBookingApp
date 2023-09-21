import CryptoJS from 'crypto-js';
import Lottie from 'lottie-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  ImageBackground,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { AddNewOrder } from '../../../middlewares/orders';
import { addOrder } from '../../../redux/Globalreducer';
import { clearInfoVehicle } from '../../../redux/VehicleReducer';
import CustomHeader from '../../components/CustomHeader';
const {width} = Dimensions.get('window');
const OrderRoom = ({navigation, route}) => {
  const dataRoom = route.params.room;
  const dataHotel = route.params.hotel;
  const {userData, booking_date} = useSelector(
    state => state.global,
  );

  const {payment_method,infoVehicle} = useSelector(state => state.VehicleReducer);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [isBooking, setIsBooking] = React.useState(false);
  const totalOrder = () => {
    const day = booking_date.total_night;
    const sum = Math.floor(
      dataRoom.price * (day === 1 ? day : day * (day / (day + 0.5)))+(infoVehicle?infoVehicle.total_vehicle:0),
    );
    return sum;
  };
  const image_default =
    'https://img1.ak.crunchyroll.com/i/spire3/d23bea1cbe84833135f94695d900f0651651339079_main.png';

  const FormatNameRoom = name => {
    if (name.length > 25) {
      return name.substring(0, 25) + '...';
    }
    return name;
  };

  const FormatDayMonthYear = date => {
    const arr = date.split('-');
    const day = arr[2];
    const month = arr[1];
    const year = arr[0];
    return `${day}/${month}/${year}`;
  };

  const CheckTimeCheckIn = () => {
    if (
      FormatDayMonthYear(booking_date.check_in) ===
        FormatDayMonthYear(new Date().toISOString().slice(0, 10)) &&
      FormatDayMonthYear(booking_date.check_out) ===
        FormatDayMonthYear(
          new Date(new Date().setDate(new Date().getDate() + 1))
            .toISOString()
            .slice(0, 10),
        )
    ) {
      const now = new Date().getHours();
      return now < 12 ? '12:00' : '14:00';
    }
    return '12:00';
  };
  const FormatPrice = price => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  function getCurrentDateYYMMDD() {
    var todayDate = new Date().toISOString().slice(2, 10);
    return todayDate.split('-').join('');
  }

  // zalopay
  const createOrder = async money => {
    let apptransid = getCurrentDateYYMMDD() + '_' + new Date().getTime();

    let appid = 2554;
    let amount = parseInt(money);
    let appuser = 'ZaloPayDemo';
    let apptime = new Date().getTime();
    let embeddata = '{}';
    let item = '[]';
    let description = 'Merchant description for order #' + apptransid;
    let hmacInput =
      appid +
      '|' +
      apptransid +
      '|' +
      appuser +
      '|' +
      amount +
      '|' +
      apptime +
      '|' +
      embeddata +
      '|' +
      item;
    let mac = CryptoJS.HmacSHA256(
      hmacInput,
      'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
    );
    var order = {
      app_id: appid,
      app_user: appuser,
      app_time: apptime,
      amount: amount,
      app_trans_id: apptransid,
      embed_data: embeddata,
      item: item,
      description: description,
      mac: mac,
    };

    let formBody = [];
    for (let i in order) {
      var encodedKey = encodeURIComponent(i);
      var encodedValue = encodeURIComponent(order[i]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    await fetch('https://sb-openapi.zalopay.vn/v2/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    })
      .then(response => response.json())
      .then(resJson => {
        var payZP = NativeModules.PayZaloBridge;
        payZP.payOrder(resJson.zp_trans_token);
      })
      .catch(error => {
        console.log('error ', error);
      });
  };

  const handleBooking = () => {
    setIsBooking(true);
    if (payment_method.id === 'payment-zalopay') {
      createOrder(totalOrder());
    }
    const dataOrder = {
      id_user: userData._id,
      id_hotel: dataHotel.id,
      id_room: dataRoom._id,
      id_vehicle: infoVehicle?._id,
      start_date: infoVehicle?.start_date,
      end_date: infoVehicle?.end_date,
      check_in: booking_date.check_in,
      check_out: booking_date.check_out,
      total: totalOrder(),
      payment_method: payment_method.id,
      paymented: payment_method.id === 'payment-zalopay' ? true : false,
    };
    AddNewOrder(dataOrder).then(res => {
      if (res.status === 200) {
        var data = res.data.data;
        data.id_room = {
          _id: dataRoom._id,
          name: dataRoom.name,
        };
        dispatch(addOrder(data));
        if (payment_method.id === 'payment-zalopay') {
          setTimeout(() => {
            navigation.navigate('TabNavigator', {screen: 'Booking'});
          }, 2000);
        } else {
          navigation.navigate('TabNavigator', {screen: 'Booking'});
        }
        setIsBooking(false);
        dispatch(clearInfoVehicle());
      }
    });
  };
  const formatDate=(date)=>{
    const arr = date.split('-');
    const day = arr[2];
    const month = arr[1];
    return `${day}/${month}`;
  }
  return (
    <View style={{flex: 1}}>
      <CustomHeader title={'information-booking'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: colors.special,
          marginBottom: 65,
        }}>
        <View style={{marginTop: 10, backgroundColor: colors.bg, padding: 10}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.text}}>
            {t('information-booking')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
              width: width - 120,
            }}>
            <View>
              <Image
                style={{
                  width: 120,
                  height: 80,
                  borderRadius: 10,
                }}
                source={{uri: image_default}}
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={{fontSize: 14, color: colors.text}}>
                {dataHotel.name}
              </Text>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', color: colors.text}}>
                {FormatNameRoom(dataRoom.name)}
              </Text>
              <Text style={{fontSize: 14, color: colors.text}}>
                {dataHotel.address}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: colors.primary,
              marginTop: 10,
            }}
          />
          <View style={{marginTop: 10, flexDirection: 'row'}}>
            <ImageBackground
              style={{
                width: 120,
                height: 130,
                overflow: 'hidden',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              source={
                booking_date.total_night == 1
                  ? require('../../assets/purple_bg.jpg')
                  : require('../../assets/blue_bg.jpeg')
              }>
              <Icon
                name={booking_date.total_night == 1 ? 'moon' : 'calendar'}
                size={25}
                color="white"
                style={{marginTop: 5}}
              />
              <Text
                style={{
                  color: 'white',
                  marginTop: 5,
                  fontWeight: 'bold',
                  fontSize: 15,
                }}>
                {booking_date.total_night}{' '}
                {booking_date.total_night == 1
                  ? t('night')
                  : t('day') === 'day'
                  ? 'days'
                  : 'day'}
              </Text>
            </ImageBackground>
            <View
              style={{
                marginLeft: 10,
                width: width - 150,
                height: 130,
                backgroundColor: colors.special,
                borderRadius: 10,
                padding: 10,
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={{color: colors.icon}}>{t('check-in')}</Text>
                <Text style={{color: colors.text, fontWeight: 'bold'}}>
                  {CheckTimeCheckIn()}
                  {'  -  '}
                  {FormatDayMonthYear(booking_date.check_in)}
                </Text>
              </View>
              <View>
                <Text style={{color: colors.icon}}>{t('check-out')}</Text>
                <Text style={{color: colors.text, fontWeight: 'bold'}}>
                  12:00 - {FormatDayMonthYear(booking_date.check_out)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{marginTop: 10, backgroundColor: colors.bg, padding: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 20, fontWeight: 'bold', color: colors.text}}>
              {t('booker-information')}
            </Text>
            <TouchableOpacity>
              <Text style={{fontSize: 17, fontWeight: 'bold', color: 'orange'}}>
                {t('edit')}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, color: colors.icon, fontWeight: '500'}}>
              {t('name')}
            </Text>
            <Text
              style={{fontSize: 16, color: colors.text, fontWeight: 'bold'}}>
              {userData.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, color: colors.icon, fontWeight: '500'}}>
              {t('phone')}
            </Text>
            <Text
              style={{fontSize: 16, color: colors.text, fontWeight: 'bold'}}>
              {userData.phone_number}
            </Text>
          </View>
        </View>
        <View style={{
                      marginTop: 10,
                      backgroundColor: colors.bg,
                      padding: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{fontSize: 20, fontWeight: 'bold', color: colors.text}}>
              Hire vehicle
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('HireVehicle');
            }}>
            <Text style={{fontSize: 17, fontWeight: 'bold', color: 'orange'}}>
              Hire
            </Text>
          </TouchableOpacity>
        </View>
        {infoVehicle && (
          <>
          <View style={{
            justifyContent:"space-between",
            marginTop:10,
            flexDirection:"row",
          }}>
            <Text style={{fontSize: 16, color: colors.icon, fontWeight: '500'}}>
              {t('name')}
            </Text>
            <Text
              style={{fontSize: 16, color: colors.text, fontWeight: 'bold'}}>
              {infoVehicle.name}
            </Text>
          </View>
          <View style={{
            justifyContent:"space-between",
            marginTop:10,
            flexDirection:"row",
          }}>
            <Text style={{fontSize: 16, color: colors.icon, fontWeight: '500'}}>
              Brand
            </Text>
            <Text
              style={{fontSize: 16, color: colors.text, fontWeight: 'bold'}}>
              {infoVehicle.brand}
            </Text>
          </View>
          <View style={{
            justifyContent:"space-between",
            marginTop:10,
            flexDirection:"row",
          }}>
            <Text style={{fontSize: 16, color: colors.icon, fontWeight: '500'}}>
              Date
            </Text>
            <Text
              style={{fontSize: 16, color: colors.text, fontWeight: 'bold'}}>
              {formatDate(infoVehicle.start_date)} - {formatDate(infoVehicle.end_date)}
            </Text>
          </View>
          <View style={{
            justifyContent:"space-between",
            marginTop:10,
            flexDirection:"row",
          }}>
            <Text style={{fontSize: 16, color: colors.icon, fontWeight: '500'}}>
              Price
            </Text>
            <Text
              style={{fontSize: 16, color: colors.text, fontWeight: 'bold'}}>
              {FormatPrice(infoVehicle.total_vehicle)}
            </Text>
          </View>
          </>
        )}
        </View>

        <View style={{marginTop: 10, backgroundColor: colors.bg, padding: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 20, fontWeight: 'bold', color: colors.text}}>
              {t('payment')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PaymentMethod');
              }}>
              <Text style={{fontSize: 17, fontWeight: 'bold', color: 'orange'}}>
                {t('change-payment-method')}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Image
                source={{uri: payment_method?.image}}
                style={{width: 25, height: 25, borderRadius: 5}}
              />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 15,
                  color: colors.text,
                  fontWeight: 'bold',
                }}>
                {payment_method?.name}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: colors.bg,
            padding: 10,
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.text}}>
            {t('payment-details')}
          </Text>
          <View style={{marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTopWidth: 1,
                borderTopColor: colors.special,
                borderBottomWidth: 1,
                borderBottomColor: colors.special,
                paddingVertical: 10,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../assets/cash.png')}
                  style={{width: 25, height: 25, borderRadius: 5}}
                />
                <Text
                  style={{fontSize: 16, color: colors.text, marginLeft: 10}}>
                  {t('room-price')}
                </Text>
              </View>
              <Text
                style={{fontSize: 16, color: colors.text, fontWeight: 'bold'}}>
                {FormatPrice(dataRoom.price * booking_date.total_night)}
              </Text>
            </View>
            {booking_date.total_night > 1 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTopWidth: 1,
                  borderTopColor: colors.special,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.special,
                  paddingVertical: 10,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/discount.png')}
                    style={{width: 25, height: 25, borderRadius: 5}}
                  />
                  <Text
                    style={{fontSize: 16, color: colors.text, marginLeft: 10}}>
                    {t('discount')}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.text,
                    fontWeight: 'bold',
                  }}>
                  -{' '}
                  {FormatPrice(
                    dataRoom.price * booking_date.total_night - totalOrder(),
                  )}
                </Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 19, color: colors.text}}>
                {t('total')}
              </Text>
              <Text
                style={{fontSize: 20, color: colors.text, fontWeight: 'bold'}}>
                {FormatPrice(totalOrder())}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
            handleBooking();
          }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: 'white',
            }}>
            {t('book-now')}
          </Text>
        </TouchableOpacity>
      </View>
      {isBooking ? (
        <View
          style={{
            backgroundColor: 'black',
            position: 'absolute',
            opacity: 0.7,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            zIndex: 999,
          }}>
          <Lottie
            source={require('../../assets/animations/loading.json')}
            autoPlay
            loop
          />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default OrderRoom;

const styles = StyleSheet.create({});
