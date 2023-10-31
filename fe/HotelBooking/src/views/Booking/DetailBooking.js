import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import Icon5 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AddNewComment } from '../../../middlewares/comments';
import {
    GetOrder,
    UpdateReview,
    UpdateStatus,
} from '../../../middlewares/orders';
import { addComment, updateStatusOrder } from '../../../redux/Globalreducer';
import CustomHeader from '../../components/CustomHeader';

const DetailBooking = ({ navigate, route }) => {
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState();
    const [hotel, setHotel] = useState();
    const { id_hotel, id_booking } = route.params;
    const { hotels } = useSelector(state => state.global);

    useEffect(() => {
        const test = async () => {
            setLoading(true);
            await GetOrder(id_booking).then(res => {
                console.log(res.data.data.id_vehicle);
                const temp = hotels.filter(item => item.id === id_hotel);
                setItem(res.data.data);
                setHotel(temp[0]);
                setLoading(false);
            });
        };
        test();
    }, []);

    const { colors } = useTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const { t } = useTranslation();
    const { userData } = useSelector(state => state.global);
    let temp = useRef(0);

    const filterStatus = () => {
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

    const formatDate = date => {
        try {
            const dateArr = date?.split('-');
            const year = dateArr[0];
            const month = dateArr[1];
            const day = dateArr[2];
            return `${day}/${month}/${year}`;
        } catch (error) {
            return '';
        }
    };

    const formatAddress = address => {
        if (address.length > 64) {
            return `${address.substring(0, 64)}...`;
        }
    };

    const FormatAddress = address => {
        try {
            if (address.length > 45) {
                return address.slice(0, 45) + '...';
            }
            return address;
        } catch (error) {
            return '';
        }
    };

    const handleRating = async () => {
        if (ratecontent === '' || starhotel === 0) {
            ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
        } else {
            if (item?.reviewed === false && temp.current === 0) {
                const comment = {
                    content: ratecontent,
                    rating: starhotel,
                    id_user: {
                        name: userData.name,
                    },
                    id_room: {
                        _id: item?.id_room._id,
                        name: item?.id_room.name,
                    },
                    time_stamp: new Date(),
                };
                AddNewComment(
                    userData._id,
                    hotel?.id,
                    item?.id_room._id,
                    ratecontent,
                    starhotel,
                ).then(res => {
                    if (res.status === 200) {
                        ToastAndroid.show(
                            'Comment success',
                            ToastAndroid.SHORT,
                        );
                        temp.current = 1;
                        dispatch(
                            addComment({
                                id: hotel?.id,
                                comment: comment,
                            }),
                        );
                    } else {
                        ToastAndroid.show(
                            'You have not booked this hotel yet',
                            ToastAndroid.SHORT,
                        );
                    }
                });
                UpdateReview(item?._id);
            } else {
                ToastAndroid.show(
                    'Bạn đã đánh giá khách sạn này rồi',
                    ToastAndroid.SHORT,
                );
            }
            setModalVisible1(false);
            setRatecontent('');
            setStarhotel(0);
        }
    };

    const [ratecontent, setRatecontent] = useState('');
    const [starhotel, setStarhotel] = useState(0);
    const starTemp = [1, 2, 3, 4, 5];
    const star = [1, 2, 3, 4, 5];
    const TotalStar = () => {
        let rating = 0;
        if (hotel?.comments?.length === 0) return 5;
        hotel?.comments?.map(item1 => {
            rating += item1.rating;
        });
        return starTemp.includes(rating / hotel?.comments.length)
            ? rating / hotel?.comments.length
            : (rating / hotel?.comments.length).toFixed(1);
    };

    const handleCopyAddress = string => {
        Clipboard.setString(string);
        ToastAndroid.show('Đã copy địa chỉ', ToastAndroid.SHORT);
    };

    const starTotal = () => {
        if (hotel?.comments?.length === 0) return 5;
        let star = 0;
        hotel?.comments?.forEach(comment => {
            star += comment.rating;
        });
        return (star / hotel?.comments?.length).toFixed(1);
    };

    const CancelBooking = async idroom => {
        await UpdateStatus(idroom, 'Cancelled').then(res => {
            if (res.status === 200) {
                setModalVisible(false);
                dispatch(
                    updateStatusOrder({
                        _id: idroom,
                        status: 'Cancelled',
                    }),
                );
                ToastAndroid.show('Cancel booking success', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Cancel booking failed', ToastAndroid.SHORT);
            }
        });
        navigation.goBack();
    };

    const formatPrice = price => {
        try {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } catch (error) {
            return '';
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <CustomHeader title="Detail Booking" />
            {!loading ? (
                <>
                    <View style={styles.container}>
                        <View style={styles.rowStatus}>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: colors.primary,
                                }}>
                                {filterStatus()}
                            </Text>
                            {item?.status === 'Pending' && (
                                <Pressable
                                    onPress={() => {
                                        setModalVisible(true);
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            color: 'red',
                                        }}>
                                        {t('cancel')}
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                        <Text
                            style={{
                                fontSize: 25,
                                fontWeight: 'bold',
                                color: colors.text,
                            }}>
                            Đặt phòng của bạn
                        </Text>
                        <View style={styles.QRCode}>
                            <QRCode
                                value={JSON.stringify({
                                    customer_from: 'HotelBooking',
                                    id: item?._id,
                                    id_user: item?.id_user?._id,
                                    name: item?.id_user?.name,
                                    email: item?.id_user?.email,
                                    phone: item?.id_user?.phone,
                                })}
                                size={150}
                            />
                            <Text
                                style={{
                                    marginTop: 10,
                                    fontSize: 15,
                                    color: colors.text,
                                    textAlign: 'center',
                                }}>
                                Hãy đưa mã QR này cho nhân viên để xác nhận đặt
                                phòng của bạn
                            </Text>
                        </View>
                        {item?.status === 'Completed' ||
                        item?.status === 'Cancelled' ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 20,
                                }}>
                                <Icon
                                    name="hotel"
                                    size={20}
                                    color={colors.text}
                                />
                                <Text
                                    style={{
                                        marginLeft: 10,
                                        fontSize: 15,
                                        color: colors.text,
                                    }}>
                                    Đặt lại
                                </Text>
                            </View>
                        ) : null}
                        {item?.status === 'Completed' && (
                            <Pressable
                                onPress={() => {
                                    setModalVisible1(true);
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 20,
                                    marginBottom: 10,
                                }}>
                                <Icon
                                    name="smile-wink"
                                    size={22}
                                    color={colors.text}
                                />
                                <Text
                                    style={{
                                        marginLeft: 10,
                                        fontSize: 15,
                                        color: colors.text,
                                    }}>
                                    Đánh giá chuyến đi của bạn
                                </Text>
                            </Pressable>
                        )}
                        <View
                            style={{
                                width: '100%',
                                height: 1,
                                backgroundColor: colors.blurprimary,
                                marginVertical: 10,
                            }}
                        />
                        <View style={styles.detailBooking}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 25,
                                        fontWeight: 'bold',
                                        color: colors.text,
                                    }}>
                                    {hotel?.name}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginLeft: 10,
                                    }}>
                                    <Text
                                        style={{
                                            color: colors.text,
                                            fontSize: 15,
                                            fontWeight: 'bold',
                                        }}>
                                        {starTotal()}
                                    </Text>
                                    <Icon4
                                        name="star"
                                        size={20}
                                        color={'orange'}
                                    />
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                }}>
                                <Icon1
                                    name="calendar-o"
                                    size={20}
                                    color={colors.text}
                                />
                                <View style={{ marginLeft: 15 }}>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            color: colors.text,
                                            fontWeight: 'bold',
                                        }}>
                                        {formatDate(item?.check_in)} -{' '}
                                        {formatDate(item?.check_out)}
                                    </Text>
                                    <Text
                                        style={{
                                            color: colors.text,
                                            fontSize: 14,
                                        }}>
                                        {t('check-in')} {t('at')} :14:00 PM
                                    </Text>
                                    <Text
                                        style={{
                                            color: colors.text,
                                            fontSize: 14,
                                        }}>
                                        {t('check-out')} {t('at')} :12:00 PM
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                }}>
                                <Icon2
                                    name="md-location-outline"
                                    size={20}
                                    color={colors.text}
                                />
                                <View style={{ marginLeft: 15 }}>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            color: colors.text,
                                            fontWeight: 'bold',
                                        }}>
                                        {t('address-of-accommodation')}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                        }}>
                                        <Text
                                            style={{
                                                color: colors.text,
                                                fontSize: 14,
                                                width: '90%',
                                            }}>
                                            {hotel?.address}
                                        </Text>
                                        <Icon3
                                            name="copy"
                                            size={20}
                                            color={colors.primary}
                                            onPress={() => {
                                                handleCopyAddress(
                                                    hotel?.address,
                                                );
                                            }}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate('Map', hotel);
                                        }}>
                                        <Text
                                            style={{
                                                color: colors.primary,
                                                fontSize: 14,
                                                marginTop: 5,
                                            }}>
                                            Xem đường đi
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {item?.id_vehicle && (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: 10,
                                    }}>
                                    <Icon5
                                        name="car"
                                        size={20}
                                        color={colors.text}
                                    />
                                    <View style={{ marginLeft: 15 }}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                color: colors.text,
                                                fontWeight: 'bold',
                                            }}>
                                            {item?.id_vehicle?.name} -{' '}
                                            {item?.id_vehicle?.brand}
                                        </Text>
                                        <Text
                                            style={{
                                                color: colors.text,
                                                fontSize: 14,
                                            }}>
                                            {t('time')} :{' '}
                                            {formatDate(item?.start_date)} -{' '}
                                            {formatDate(item?.end_date)}
                                        </Text>
                                        <Text
                                            style={{
                                                color: colors.text,
                                                fontSize: 14,
                                            }}>
                                            {t('price')} :{' '}
                                            {formatPrice(
                                                item?.id_vehicle?.price,
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
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
                                <Text
                                    style={{
                                        color: colors.text,
                                        marginTop: 10,
                                    }}>
                                    {t(
                                        'are-you-sure-you-want-to-cancel-your-hotel-booking',
                                    )}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        marginTop: 20,
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
                                            {t('close')}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            CancelBooking(item?._id);
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

                    <Modal
                        animationType="fade"
                        transparent
                        visible={modalVisible1}
                        onRequestClose={() => {
                            setModalVisible1(!modalVisible1);
                        }}>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={
                                Platform.OS === 'ios' ? 'padding' : 'height'
                            }>
                            <Pressable
                                style={{
                                    justifyContent: 'flex-end',
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                }}
                                onPress={() => {
                                    setModalVisible1(false);
                                }}>
                                <View
                                    style={{
                                        height: '70%',
                                        backgroundColor: colors.box,
                                        borderTopLeftRadius: 30,
                                        borderTopRightRadius: 30,
                                        alignItems: 'center',
                                        paddingTop: 5,
                                    }}>
                                    <View
                                        style={{
                                            width: '15%',
                                            borderRadius: 20,
                                            backgroundColor: colors.icon,
                                            height: 5,
                                            marginTop: 5,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            marginVertical: 10,
                                            fontSize: 21,
                                            fontWeight: 'bold',
                                            color: colors.text,
                                        }}>
                                        {t('rate-this-hotel')}
                                    </Text>
                                    <View
                                        style={{
                                            width: '90%',
                                            borderRadius: 20,
                                            backgroundColor: '#eeeeee',
                                            height: 1,
                                        }}
                                    />
                                    <View
                                        style={{ padding: 20, width: '100%' }}>
                                        <View
                                            style={{
                                                height: 100,
                                                backgroundColor: colors.special,
                                                borderRadius: 15,
                                                elevation: 5,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: 10,
                                            }}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    width: '100%',
                                                    height: 100,
                                                    alignItems: 'center',
                                                }}>
                                                <Image
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        borderRadius: 10,
                                                    }}
                                                    source={{
                                                        uri: hotel?.image[0],
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        marginLeft: 15,
                                                        height: 80,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 17,
                                                            fontWeight: 'bold',
                                                            color: colors.text,
                                                        }}>
                                                        {hotel?.name}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            width: 200,
                                                            color: colors.icon,
                                                        }}>
                                                        {FormatAddress(
                                                            hotel?.address,
                                                        )}
                                                    </Text>
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                'row',
                                                            alignItems:
                                                                'center',
                                                        }}>
                                                        <Icon5
                                                            name="star"
                                                            size={15}
                                                            color={'orange'}
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize: 15,
                                                                color: colors.primary,
                                                                marginLeft: 5,
                                                                fontWeight:
                                                                    'bold',
                                                            }}>
                                                            {TotalStar()}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 15,
                                                                color: colors.icon,
                                                                marginLeft: 10,
                                                            }}>
                                                            {'('}
                                                            {
                                                                hotel?.comments
                                                                    .length
                                                            }{' '}
                                                            {t('review')}
                                                            {')'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            color: colors.text,
                                        }}>
                                        {t('please-give-your-rate-&-review')}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: 10,
                                            justifyContent: 'space-between',
                                            width: '55%',
                                            marginVertical: 5,
                                        }}>
                                        {star.map((item, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    setStarhotel(item);
                                                }}
                                                style={{
                                                    elevation: 15,
                                                }}>
                                                <Icon5
                                                    name="star"
                                                    size={30}
                                                    color={
                                                        index + 1 <= starhotel
                                                            ? 'orange'
                                                            : 'grey'
                                                    }
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    <TextInput
                                        style={{
                                            width: '90%',
                                            borderWidth: 1,
                                            borderColor: '#f3f6f4',
                                            height: 80,
                                            textAlignVertical: 'top',
                                            backgroundColor: colors.special,
                                            borderRadius: 15,
                                            marginVertical: 10,
                                            padding: 10,
                                            color: colors.text,
                                        }}
                                        multiline={true}
                                        onChangeText={text =>
                                            setRatecontent(text)
                                        }
                                        value={ratecontent}
                                    />
                                    <TouchableOpacity
                                        style={{
                                            width: '90%',
                                            height: 50,
                                            backgroundColor: colors.primary,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 15,
                                            marginTop: 10,
                                        }}
                                        onPress={() => {
                                            handleRating();
                                        }}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: 16,
                                                fontWeight: '700',
                                            }}>
                                            {t('rate-now')}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            width: '90%',
                                            height: 50,
                                            backgroundColor: colors.primary,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 15,
                                            marginTop: 20,
                                        }}
                                        onPress={() => {
                                            setModalVisible(false);
                                            setRatecontent('');
                                            setStarhotel(0);
                                        }}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: 16,
                                                fontWeight: '700',
                                            }}>
                                            {t('later')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        </KeyboardAvoidingView>
                    </Modal>
                </>
            ) : (
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
};

export default DetailBooking;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    rowStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    QRCode: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    detailBooking: {
        width: '100%',
    },
});
