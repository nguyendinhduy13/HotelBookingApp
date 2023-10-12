import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from 'react-native-paper';
import IconMark from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { saveInfoVehicle } from '../../../redux/VehicleReducer';

const width = Dimensions.get('window').width;
const DetailVehicle = ({ navigation, route }) => {
    const colors = useTheme().colors;
    const {t} = useTranslation();
    const field = ['max_Power', 'Fuel', 'speed_4s', 'max_Speed'];
    const today = new Date();
    const { booking_date } = useSelector(state => state.global);
    const gettoday =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
    const { item } = route.params;
    const dispatch = useDispatch();
    const iconDetail = [
        {
            id: 1,
            name: 'Max Power',
            source: require('../../assets/ChargingBattery.png'),
        },
        {
            id: 2,
            name: 'Fuel',
            source: require('../../assets/Petrol.png'),
        },
        {
            id: 3,
            name: '0-60km/h',
            source: require('../../assets/Speed.png'),
        },
        {
            id: 4,
            name: 'Max Speed',
            source: require('../../assets/WindSpeed.png'),
        },
    ];

    const [start, setStart] = React.useState(booking_date.check_in);
    const [end, setEnd] = React.useState(booking_date.check_out);
    const [dateArray, setDateArray] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);

    useEffect(() => {
        let arr = [];
        arr.push(booking_date.check_in);
        arr.push(booking_date.check_out);
        setDateArray(arr);
    }, []);

    const Format = number => {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    };
    const handleChooseDay = day => {
        let endday = '';
        if (start !== '' && end !== '') {
            setStart(day.dateString);
            setEnd('');
            setDateArray([]);
        }
        if (start === '') {
            setStart(day.dateString);
        } else if (end === '' && day.dateString > start) {
            endday = day.dateString;
            const startDate = new Date(start);
            const endDate = new Date(endday);
            const dateArray = [];
            let currentDate = startDate;
            while (currentDate <= endDate) {
                const dateString = currentDate.toISOString().split('T')[0];
                dateArray.push(dateString);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            setDateArray(dateArray);
            setEnd(day.dateString);
        } else if (day.dateString < start) {
            setStart(day.dateString);
        }
    };
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}>
            <TouchableOpacity
                style={{
                    width: 35,
                    height: 35,
                    marginLeft: 10,
                    marginTop: 10,
                }}
                onPress={() => navigation.goBack()}>
                <Icon name="chevron-back" color={'black'} size={35} />
            </TouchableOpacity>
            <ScrollView
                style={{
                    marginTop: 30,
                    marginHorizontal: 20,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <View>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 24,
                                fontWeight: '500',
                            }}>
                            {item.name}
                        </Text>
                        <Text
                            style={{
                                color: '#596474',
                                fontWeight: '500',
                                marginVertical: 5,
                            }}>
                            {item.brand}
                        </Text>
                    </View>
                    <IconMark name="bookmark-o" size={25} color={'black'} />
                </View>
                <Image
                    source={{
                        uri: item.image[0],
                    }}
                    style={{
                        width: 200,
                        height: 150,
                        marginTop: 20,
                        alignSelf: 'center',
                    }}
                />
                <Text
                    style={{
                        color: 'black',
                        fontWeight: '700',
                        fontSize: 18,
                        marginTop: 30,
                    }}>
                    {t('Specifications')}
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        width: width - 40,
                        justifyContent: 'space-between',
                    }}>
                    {iconDetail.map((itemsc, index) => (
                        <View
                            style={{
                                height: 76,
                                width: 76,
                                paddingVertical: 7,
                                marginTop: 20,
                                borderWidth: 2,
                                borderColor: '#94A1B2',
                                borderRadius: 10,
                                justifyContent: 'space-between',
                            }}>
                            <Image
                                source={itemsc.source}
                                style={{
                                    width: 16,
                                    height: 16,
                                    marginLeft: 7,
                                }}
                            />
                            <View
                                style={{
                                    marginLeft: 7,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color: '#596474',
                                        fontWeight: '700',
                                    }}>
                                    {itemsc.name}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        fontWeight: '500',
                                        color: 'black',
                                    }}>
                                    {item.specification[0][field[index]]}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
                <Text
                    style={{
                        color: 'black',
                        fontWeight: '700',
                        fontSize: 18,
                        marginTop: 30,
                    }}>
                    {t('Descriptions')}
                </Text>
                <Text
                    style={{
                        color: 'black',
                    }}>
                    {item.description}
                </Text>
                <TouchableOpacity
                    style={{
                        height: 40,
                        width: 150,
                        backgroundColor: colors.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        marginHorizontal: 10,
                        marginTop: 15,
                        alignSelf: 'flex-end',
                    }}
                    onPress={() => {
                        setModalVisible(true);
                    }}>
                    <Text
                        style={{
                            color: 'white',
                            fontWeight: '600',
                        }}>
                       {t('Choose-Date')}
                    </Text>
                </TouchableOpacity>
                <Modal
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }}>
                        <Calendar
                            // Customize the appearance of the calendar
                            markingType={'period'}
                            // Callback that gets called when the user selects a day
                            markedDates={{
                                [start]: {
                                    startingDay: true,
                                    color: '#50cebb',
                                    textColor: 'white',
                                },
                                [end]: {
                                    endingDay: true,
                                    color: '#50cebb',
                                    textColor: 'white',
                                },
                                ...dateArray.reduce((acc, cur) => {
                                    acc[cur] = {
                                        startingDay:
                                            cur === start ? true : false,
                                        endingDay: cur === end ? true : false,
                                        color: '#70d7c7',
                                        textColor: 'white',
                                    };
                                    return acc;
                                }, {}),
                            }}
                            onDayPress={day => handleChooseDay(day)}
                            hideExtraDays={true}
                            minDate={gettoday}
                            theme={{
                                backgroundColor: colors.box,
                                calendarBackground: colors.box,
                                textSectionTitleColor: colors.text,
                                dayTextColor: colors.text,
                                monthTextColor: colors.text,
                                textDisabledColor: '#d9e1e8',
                            }}
                        />
                        <TouchableOpacity
                            style={{
                                height: 40,
                                width: 150,
                                backgroundColor: colors.primary,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                                marginHorizontal: 10,
                                marginTop: 15,
                                alignSelf: 'center',
                            }}
                            onPress={() => {
                                setModalVisible(false);
                            }}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: '600',
                                }}>
                                {t('close')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
            <View
                style={{
                    borderWidth: 1,
                    borderColor: '#94A1B2',
                    height: 100,
                    bottom: 0,
                    width: width,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    paddingHorizontal: 30,
                    justifyContent: 'space-between',
                    paddingTop: 25,
                    flexDirection: 'row',
                }}>
                <View>
                    <Text
                        style={{
                            color: '#596474',
                            fontSize: 14,
                            fontWeight: '500',
                        }}>
                        {t('Price')}
                    </Text>
                    <Text
                        style={{
                            color: 'black',
                            fontSize: 18,
                            fontWeight: '700',
                        }}>
                        {Format(item.price)} VNĐ
                    </Text>
                </View>
                <TouchableOpacity
                    style={{
                        height: 50,
                        width: 150,
                        backgroundColor: colors.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                    }}
                    onPress={() => {
                        navigation.pop(2);
                        let data = {
                            ...item,
                            start_date: start,
                            end_date: end,
                            total_vehicle: item.price * (dateArray.length - 1),
                        };
                        dispatch(saveInfoVehicle(data));
                    }}>
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 15,
                            fontWeight: '500',
                        }}>
                        {t('book-now')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DetailVehicle;
