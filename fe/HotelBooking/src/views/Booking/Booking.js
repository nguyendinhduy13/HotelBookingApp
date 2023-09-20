import { useNavigation } from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { GetOrders, UpdateStatus } from '../../../middlewares/orders';
import { updateStatusOrder } from '../../../redux/Globalreducer';
import Header from '../../components/Header';

export default function Booking() {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [button, setbutton] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const [idroom, setidroom] = useState('');
    const { userData, hotels } = useSelector(state => state.global);
    const navigation = useNavigation();
    const [loading, setloading] = useState(false);
    const [dataBooking, setdataBooking] = useState([]);

    useEffect(() => {
        setloading(true);
        GetOrders(userData._id).then(res => {
            if (res.status === 200) {
                setdataBooking(res.data.data);
            }
            setloading(false);
        });
    }, [userData]);

    const Format = prices => {
        return prices.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    };
    const FormatName = name => {
        //regex if name too long
        if (name.length > 55) {
            return name.substring(0, 55) + '...';
        }
        return name;
    };

    const filterStatus = item => {
        if (item?.status === 'Pending') {
            if (item?.paymented === false) {
                return t('pending');
            }
            return t('ongoing');
        } else if (item?.status === 'Completed') {
            return t('completed');
        } else if (item?.status === 'Cancelled') {
            return t('cancelled');
        }
        return t('unknown');
    };

    const FormatDayMonthYear = date => {
        const arr = date.split('-');
        const day = arr[2];
        const month = arr[1];
        const year = arr[0];
        return `${day}/${month}/${year}`;
    };

    const filterHotel = id_hotel => {
        const hotel = hotels.filter(hotel => hotel.id === id_hotel);
        return hotel[0];
    };

    const CancelBooking = idroom => {
        UpdateStatus(idroom, 'Cancelled').then(res => {
            if (res.status === 200) {
                dispatch(
                    updateStatusOrder({
                        _id: idroom,
                        status: 'Cancelled',
                    }),
                );
                setModalVisible(false);
                ToastAndroid.show('Cancel booking success', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Cancel booking failed', ToastAndroid.SHORT);
            }
        });
    };

    const CardBooking = ({ item, index }) => {
        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    navigation.navigate('DetailBooking', {
                        id_booking: item._id,
                        id_hotel: item.id_hotel,
                    });
                }}
                style={{
                    backgroundColor: colors.box,
                    borderRadius: 15,
                    marginTop: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    width: '93%',
                    alignSelf: 'center',
                }}>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Image
                        source={{ uri: filterHotel(item.id_hotel).image[0] }}
                        style={{ width: 100, height: 100, borderRadius: 10 }}
                    />
                    <View style={{ marginLeft: 10, width: '100%' }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: colors.text,
                                fontWeight: 'bold',
                            }}>
                            {filterHotel(item.id_hotel).name}
                        </Text>
                        <Text
                            style={{
                                marginTop: 5,
                                width: 220,
                                fontSize: 15,
                                color: colors.icon,
                            }}>
                            {FormatName(item.id_room.name)}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 'auto',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: 230,
                            }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: colors.text,
                                }}>
                                {Format(item.total)}{' '}
                                <Text style={{ fontSize: 13 }}>VNĐ</Text>
                            </Text>
                            <View
                                style={{
                                    padding: 5,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: colors.primary,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: colors.primary,
                                    }}>
                                    {filterStatus(item)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        paddingBottom: 10,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <View>
                        <Text style={{ fontSize: 13, color: colors.icon }}>
                            {t('check-in')}:{' '}
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: colors.text,
                                }}>
                                {FormatDayMonthYear(item.check_in)}
                            </Text>
                        </Text>
                        <Text style={{ fontSize: 13, color: colors.icon }}>
                            {t('check-out')}:{' '}
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: colors.text,
                                }}>
                                {FormatDayMonthYear(item.check_out)}
                            </Text>
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.primary,
                                padding: 10,
                                borderRadius: 10,
                                width: 90,
                            }}
                            onPress={() => {
                                setModalVisible(true);
                                setidroom(item._id);
                            }}>
                            <Text
                                style={{ color: 'white', textAlign: 'center' }}>
                                {t('cancel')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const CardCompleted = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('DetailBooking', {
                        id_booking: item._id,
                        id_hotel: item.id_hotel,
                    });
                }}
                key={index}
                style={{
                    backgroundColor: colors.box,
                    borderRadius: 15,
                    marginTop: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    width: '93%',
                    alignSelf: 'center',
                }}>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Image
                        source={{ uri: filterHotel(item.id_hotel).image[0] }}
                        style={{ width: 100, height: 100, borderRadius: 15 }}
                    />
                    <View style={{ marginLeft: 10, width: '100%' }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: colors.text,
                                fontWeight: 'bold',
                            }}>
                            {filterHotel(item.id_hotel).name}
                        </Text>
                        <Text
                            style={{
                                marginTop: 5,
                                width: 220,
                                fontSize: 15,
                                color: colors.icon,
                            }}>
                            {FormatName(item.id_room.name)}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 'auto',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: 230,
                            }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: colors.text,
                                }}>
                                {Format(item.total)}{' '}
                                <Text style={{ fontSize: 13 }}>VNĐ</Text>
                            </Text>
                            <View
                                style={{
                                    padding: 5,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: colors.primary,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: colors.primary,
                                    }}>
                                    {t('completed')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: colors.blurprimary,
                        padding: 10,
                        borderRadius: 15,
                        marginHorizontal: 10,
                        marginBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Icon1 size={20} name="checkbox" color={colors.primary} />
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: colors.primary,
                            marginLeft: 10,
                        }}>
                        {t('great-you-have-completed-your-booking')}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const CardCancelled = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('DetailBooking', {
                        id_booking: item._id,
                        id_hotel: item.id_hotel,
                    });
                }}
                key={index}
                style={{
                    backgroundColor: colors.box,
                    borderRadius: 15,
                    marginTop: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    width: '93%',
                    alignSelf: 'center',
                }}>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Image
                        source={{ uri: filterHotel(item.id_hotel).image[0] }}
                        style={{ width: 100, height: 100, borderRadius: 15 }}
                    />
                    <View style={{ marginLeft: 10, width: '100%' }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: colors.text,
                                fontWeight: 'bold',
                            }}>
                            {filterHotel(item.id_hotel).name}
                        </Text>
                        <Text
                            style={{
                                marginTop: 5,
                                width: 220,
                                fontSize: 15,
                                color: colors.icon,
                            }}>
                            {FormatName(item.id_room.name)}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 'auto',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: 230,
                            }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: colors.text,
                                }}>
                                {Format(item.total)}{' '}
                                <Text style={{ fontSize: 13 }}>VNĐ</Text>
                            </Text>
                            <View
                                style={{
                                    padding: 5,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: '#f76e64',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: '#f76e64',
                                    }}>
                                    {t('cancelled')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: '#fddbdb',
                        padding: 10,
                        borderRadius: 15,
                        marginHorizontal: 10,
                        marginBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Icon2 size={20} name="exclamationcircle" color="#f76e64" />
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#f76e64',
                            marginLeft: 10,
                        }}>
                        {t('sorry-your-booking-has-been-cancelled')}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };
    const dataPending = dataBooking?.filter(item => item.status === 'Pending');
    const [show, setshow] = useState(10);
    const dataCompleted = dataBooking
        ?.filter(item => item.status === 'Completed')
        .slice(0, show);
    const dataCancelled = dataBooking?.filter(
        item => item.status === 'Cancelled',
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <View style={{ paddingHorizontal: 10 }}>
                <Header name={t('my-booking')} />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: 10,
                        paddingHorizontal: 10,
                    }}>
                    <TouchableOpacity
                        style={
                            button === 1
                                ? {
                                      backgroundColor: colors.primary,
                                      borderRadius: 10,
                                      width: '30%',
                                      height: 40,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                  }
                                : {
                                      borderWidth: 2,
                                      borderColor: colors.primary,
                                      borderRadius: 10,
                                      width: '30%',
                                      height: 40,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                  }
                        }
                        onPress={() => setbutton(1)}>
                        <Text
                            style={
                                button === 1
                                    ? {
                                          fontSize: 16,
                                          fontWeight: 'bold',
                                          color: 'white',
                                      }
                                    : {
                                          fontSize: 16,
                                          fontWeight: 'bold',
                                          color: colors.primary,
                                      }
                            }>
                            {t('ongoing')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            button === 2
                                ? {
                                      backgroundColor: colors.primary,
                                      borderRadius: 10,
                                      width: '30%',
                                      height: 40,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                  }
                                : {
                                      borderWidth: 2,
                                      borderColor: colors.primary,
                                      borderRadius: 10,
                                      width: '30%',
                                      height: 40,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                  }
                        }
                        onPress={() => setbutton(2)}>
                        <Text
                            style={
                                button === 2
                                    ? {
                                          fontSize: 16,
                                          fontWeight: 'bold',
                                          color: 'white',
                                      }
                                    : {
                                          fontSize: 16,
                                          fontWeight: 'bold',
                                          color: colors.primary,
                                      }
                            }>
                            {t('completed')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            button === 3
                                ? {
                                      backgroundColor: colors.primary,
                                      borderRadius: 10,
                                      width: '30%',
                                      height: 40,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                  }
                                : {
                                      borderWidth: 2,
                                      borderColor: colors.primary,
                                      borderRadius: 10,
                                      width: '30%',
                                      height: 40,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                  }
                        }
                        onPress={() => setbutton(3)}>
                        <Text
                            style={
                                button === 3
                                    ? {
                                          fontSize: 16,
                                          fontWeight: 'bold',
                                          color: 'white',
                                      }
                                    : {
                                          fontSize: 16,
                                          fontWeight: 'bold',
                                          color: colors.primary,
                                      }
                            }>
                            {t('cancelled')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {button === 1
                    ? dataPending?.map((item, index) => (
                          <View key={index} style={{ paddingVertical: 5 }}>
                              <CardBooking item={item} index={index} />
                          </View>
                      ))
                    : button === 2
                    ? dataCompleted?.map((item, index) => (
                          <View key={index} style={{ paddingVertical: 5 }}>
                              <CardCompleted item={item} index={index} />
                          </View>
                      ))
                    : dataCancelled?.map((item, index) => (
                          <View key={index} style={{ paddingVertical: 5 }}>
                              <CardCancelled item={item} index={index} />
                          </View>
                      ))}
            </ScrollView>
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <Pressable
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <View
                        style={{
                            backgroundColor: colors.box,
                            elevation: 15,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            alignSelf: 'center',
                            padding: 15,
                            borderRadius: 10,
                            width: '80%',
                        }}>
                        <Text
                            style={{
                                color: colors.text,
                                fontSize: 20,
                                fontWeight: '700',
                            }}>
                            {t('Cancel-booking')}
                        </Text>
                        <Text style={{ color: colors.text }}>
                            {t(
                                'are-you-sure-you-want-to-cancel-your-hotel-booking',
                            )}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                            }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '500',
                                        color: colors.primary,
                                        marginRight: 10,
                                    }}>
                                    {t('cancel')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    CancelBooking(idroom);
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '500',
                                        color: 'red',
                                    }}>
                                    {t('confirm')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
            {loading && (
                <View
                    style={{
                        position: 'absolute',
                        opacity: 0.7,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'white',
                    }}>
                    <Lottie
                        source={require('../../assets/animations/92803-loading.json')}
                        autoPlay
                        loop
                    />
                </View>
            )}
        </View>
    );
}
