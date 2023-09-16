import slugify from '@sindresorhus/slugify';
import Lottie from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from 'react-native-paper';
import Icon5 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingDate } from '../../../redux/Globalreducer';
import { saveIdHotel } from '../../../redux/VehicleReducer';
import { GetHotelByID } from './apidetailhotel';

const width = Dimensions.get('screen').width;
const WINDOW_HEIGHT = Dimensions.get('screen').height;
const SHEET_MAX_HEIGHT = WINDOW_HEIGHT * 0.8;
const SHEET_MIN_HEIGHT = WINDOW_HEIGHT * 0.09;
const MAX_UPWARD_TRANSLATE_Y = -SHEET_MIN_HEIGHT - SHEET_MAX_HEIGHT; // negative number
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 50;
const DetailHotel = ({navigation, route}) => {
  const _id = route.params.id;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const {height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.009;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [isloading, setIsloading] = useState(true);
  const [hotelData, setHotelData] = useState({});
  const {user_position, booking_date} = useSelector(state => state.global);
  const today = new Date();
  const gettoday =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
  const fetchData = async () => {
    const response = await GetHotelByID(_id);
    if (response.status === 200) {
      const data = response.data;
      setHotelData(data);
      dispatch(saveIdHotel(data.id))
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Format = number => {
    var price = number * booking_date.total_night;
    return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const calculateDistance = () => {
    const lat1 = user_position.latitude;
    const lon1 = user_position.longitude;
    const lat2 = Number(hotelData.position[0]);
    const lon2 = Number(hotelData.position[1]);
    const R = 6371; // radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // distance in km

    return d.toFixed(2);
  };

  const FormatTimeStamp = date => {
    //format time stamp like 12:46 3/3/2023
    const today = new Date(date);
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const time = day + '/' + month + '/' + year;
    return time;
  };

  const FormatRoomNameInComment = name => {
    if (name?.length > 30) {
      return name.slice(0, 30) + '...';
    }
    return name;
  };

  const starTemp = [1, 2, 3, 4, 5];
  const TotalStar = () => {
    let rating = 0;
    if (hotelData.comments?.length === 0) return 5;
    hotelData.comments?.map(item1 => {
      rating += item1.rating;
    });
    return starTemp.includes(rating / hotelData.comments.length)
      ? rating / hotelData.comments.length
      : (rating / hotelData.comments.length).toFixed(1);
  };

  const formatDayShow = day => {
    if (day != '') {
      return day.split('-')[2] + '/' + day.split('-')[1];
    }
    return '';
  };

  const AnimatedView = Animated.createAnimatedComponent(View);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const HeaderAnimated = {
    opacity: animatedValue.interpolate({
      inputRange: [150, 300],
      outputRange: [0, 1],
    }),
  };
  const HeaderAnimatedScroll = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 300],
      outputRange: [1, 0],
    }),
  };
  //Bottom Sheet
  const animatedValueBottom = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animatedValueBottom.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (e, gesture) => {
        animatedValueBottom.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        animatedValueBottom.flattenOffset();
        if (gesture.dy > 0) {
          // is dragging down
          if (lastGestureDy.current !== 0 && gesture.dy <= DRAG_THRESHOLD) {
            springAnimation('up');
          } else {
            springAnimation('down');
          }
        } else {
          // is dragging up
          if (gesture.dy >= -DRAG_THRESHOLD) {
            springAnimation('down');
          } else {
            springAnimation('up');
          }
        }
      },
    }),
  ).current;
  const springAnimation = direction => {
    lastGestureDy.current =
      direction === 'down' ? MAX_DOWNWARD_TRANSLATE_Y : MAX_UPWARD_TRANSLATE_Y;
    Animated.spring(animatedValueBottom, {
      toValue: lastGestureDy.current,
      useNativeDriver: true,
    }).start();
  };
  const bottomSheetAnimation = {
    transform: [
      {
        translateY: animatedValueBottom.interpolate({
          inputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          outputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  //Calendar
  const minday = new Date();
  const [start, setStart] = useState(booking_date.check_in);
  const [middle, setMiddle] = useState([]);
  const [end, setEnd] = useState(booking_date.check_out);

  
  useEffect(() => {
    let arr=[];
    arr.push(booking_date.check_in);
    arr.push(booking_date.check_out);
    setMiddle(arr);
}, []);

  const handleOpenCalendar = () => {
    springAnimation('up');
  };

  const handleChooseDay = day => {
    let endday = '';
    if (start !== '' && end !== '') {
        setStart(day.dateString);
        setEnd('');
        setMiddle([]);
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
        setMiddle(dateArray);
        setEnd(day.dateString);
    } else if (day.dateString < start) {
        setStart(day.dateString);
    }
};
  const handleConfirm = () => {
    springAnimation('down');
    dispatch(
      setBookingDate({
        check_in: start,
        check_out: end,
        total_night: middle.length + 1,
      }),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
      {isloading ? (
        <>
          <Lottie
            style={{}}
            source={require('../../assets/animations/140846-vertical-animation.json')}
            autoPlay
            loop
          />
        </>
      ) : (
        <>
          <AnimatedView
            style={[
              styles.HeaderBack,
              {backgroundColor: colors.bg},
              HeaderAnimated,
            ]}>
            <Icon
              name="arrow-back-ios"
              size={28}
              color={colors.text}
              onPress={navigation.goBack}
            />
            <View style={{alignItems: 'center', paddingRight: 20}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: 'orange',
                }}>
                {hotelData.name}
              </Text>
              <Text style={{textAlign: 'center', color: colors.icon}}>
                {hotelData.address}
              </Text>
            </View>
            <Icon2 name="heart-outline" size={0} color="black" style={{}} />
          </AnimatedView>
          <AnimatedView style={[styles.HeaderTitle, HeaderAnimatedScroll]}>
            <Icon
              name="arrow-back-ios"
              size={28}
              color="white"
              onPress={navigation.goBack}
            />
          </AnimatedView>
          <ScrollView
            onScroll={e => {
              const currentOffset = e.nativeEvent.contentOffset.y;
              animatedValue.setValue(currentOffset);
            }}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}>
            <View>
              <ScrollView
                pagingEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{width: width, height: 300}}>
                {hotelData.image.map((item, index) => (
                  <Image
                    key={index}
                    source={{uri: item}}
                    style={{
                      width: width,
                      height: 300,
                      resizeMode: 'cover',
                    }}
                  />
                ))}
              </ScrollView>
            </View>
            <View style={{marginHorizontal:15,paddingBottom: 100}}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: colors.text,
                    paddingVertical: 10,
                  }}>
                  {hotelData.name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon5
                    name="star"
                    size={20}
                    color={'orange'}
                    style={{marginLeft: 2}}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: 'bold',
                      paddingHorizontal: 5,
                      color: colors.text,
                    }}>
                    {TotalStar()}
                    <Text style={{color: colors.icon}}>
                      {' (' + hotelData.comments.length + ` ${t('review')})`}
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                  }}>
                  <Icon2 style={{
                    top:5
                  }} name="md-location-sharp" size={25} color="orange" />
                  <View
                    style={{
                      paddingRight: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: colors.text, fontSize: 14,width:width-40}}>
                      <Text style={{color: 'orange'}}>
                        ~{calculateDistance()} km
                      </Text>{' '}
                      | {hotelData.address} |{' '}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:colors.primary,
                      height:40,
                      borderRadius:15,
                    }}
                        onPress={() => {
                          navigation.navigate('Map', hotelData);
                        }}>
                        <Text
                          style={{
                            color: "white",
                            fontWeight:"bold"
                          }}>
                          {t('viewmap')}
                        </Text>
                      </TouchableOpacity>
              {/* <View
            style={{
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.text,
                }}>
                {t('map')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Map', hotelData);
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: colors.primary,
                    marginRight: 5,
                  }}>
                  {t('viewmap')}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '99%',
                height: 150,
                marginTop: 10,
              }}>
              <MapView
                ref={mapRef}
                zoomEnabled={false}
                scrollEnabled={false}
                style={{flex: 1}}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                region={{
                  latitude: Number(hotelData.position[0]),
                  longitude: Number(hotelData.position[1]),
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}>
                <Marker
                  coordinate={{
                    latitude: Number(hotelData?.position[0]),
                    longitude: Number(hotelData?.position[1]),
                  }}
                />
              </MapView>
            </View>
          </View> */}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.text,
                  paddingVertical: 15,
                }}>
                {t('list-rooms')}
              </Text>
              {hotelData.rooms.map((items, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.RecentlyBox, {backgroundColor: colors.box}]}
                  onPress={() => {
                    navigation.navigate('DetailRoom', {
                      room: items,
                      hotel: hotelData,
                    });
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: 150,
                      alignSelf: 'center',
                    }}>
                    <Image
                      style={styles.IMGRecent}
                      source={{uri: items.image[0]}}
                    />
                  </View>
                  <View>
                    <View style={{paddingHorizontal: 15, paddingVertical: 5}}>
                      <Text
                        style={{
                          fontSize: 20,
                          height: 25,
                          color: colors.text,
                        }}>
                        {items.name}
                      </Text>
                      <View style={{flexDirection: 'row', paddingVertical: 5}}>
                        {items.utility.map((item, index) =>
                          index < 2 ? (
                            <View
                              key={index}
                              style={{
                                alignContent: 'center',
                                justifyContent: 'flex-start',
                                marginRight: 10,
                              }}>
                              <Text style={{color: colors.icon, fontSize: 14}}>
                                {item.split(' ')[1] === 'm²'
                                  ? item + ' '
                                  : t(`${slugify(item)}`)}
                                <Text style={{color: colors.text}}>
                                  {index == 0 ? ' |' : ''}
                                </Text>
                              </Text>
                            </View>
                          ) : (
                            <View key={index}></View>
                          ),
                        )}
                      </View>
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: 14,
                          marginTop: 5,
                          fontWeight: '500',
                        }}>
                        {booking_date.total_night} {t('day')}
                        {booking_date.total_night > 1 && t('day') === 'day'
                          ? 's'
                          : ''}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            paddingVertical: 10,
                            fontWeight: 'bold',
                            color: colors.text,
                          }}>
                          {Format(items.price)}{' '}
                          <Text
                            style={{
                              fontSize: 13,
                              color: colors.text,
                            }}>
                            đ
                          </Text>
                        </Text>
                        <View
                          style={{
                            width: 100,
                            height: 35,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                            backgroundColor: colors.primary,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 15,
                              fontWeight: 'bold',
                            }}>
                            {t('choose-room')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.primary,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: colors.text,
                    }}>
                    {t('description')}
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 15,
                    paddingVertical: 10,
                  }}>
                  {hotelData.description}
                </Text>
              </View>
              <View style={{marginTop: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: colors.text,
                    }}>
                    {t('review')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AllComments', hotelData.comments);
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: colors.text,
                      }}>
                      {t('see-all')}
                    </Text>
                  </TouchableOpacity>
                </View>
                {hotelData.comments.length > 0 ? (
                  hotelData.comments
                    .map(
                      (item1, index) =>
                        hotelData.comments.length - index <= 3 && (
                          <View
                            key={index}
                            style={{
                              marginTop: 10,
                              width: '100%',
                              backgroundColor: colors.box,
                              borderRadius: 10,
                              elevation: 5,
                              shadowColor: 'black',
                              alignSelf: 'center',
                              borderWidth: 1,
                              borderColor: '#eeeeee',
                              paddingVertical: 10,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: 10,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={require('../../assets/avatars.jpg')}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                  }}
                                />
                                <View style={{marginLeft: 10}}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        fontWeight: '700',
                                        fontSize: 16,
                                        color: colors.text,
                                      }}>
                                      {item1.id_user.name}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: 13,
                                        fontWeight: '400',
                                        marginLeft: 10,
                                      }}>
                                      {FormatTimeStamp(item1.time_stamp)}
                                    </Text>
                                  </View>
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      color: colors.text,
                                      fontWeight: 'bold',
                                    }}>
                                    {FormatRoomNameInComment(
                                      item1.id_room?.name,
                                    )}
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={{
                                  backgroundColor: colors.primary,
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  borderRadius: 15,
                                  flexDirection: 'row',
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                }}>
                                <Icon5 name="star" size={15} color={'yellow'} />
                                <Text style={{color: 'white', marginLeft: 5}}>
                                  {item1.rating}
                                </Text>
                              </View>
                            </View>
                            <Text
                              style={{
                                paddingHorizontal: 20,
                                fontWeight: '400',
                                fontSize: 14,
                                color: colors.text,
                              }}>
                              {item1.content}
                            </Text>
                          </View>
                        ),
                    )
                    .reverse()
                ) : (
                  <>
                    <Image
                      source={require('../../assets/empty.png')}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        marginTop: 10,
                        alignSelf: 'center',
                      }}
                    />
                  </>
                )}
              </View>
            </View>
          </ScrollView>
          <Animated.View
            style={[
              styles.bottomSheet,
              {backgroundColor: colors.box},
              bottomSheetAnimation,
            ]}>
            <View style={styles.draggableArea} {...panResponder.panHandlers}>
              <Text
                style={{
                  color: 'orange',
                  fontSize: 18,
                  fontWeight: 'bold',
                  paddingBottom: 15,
                }}>
                {t('choice-the-date')}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    width: '95%',
                    height: 60,
                    backgroundColor: colors.special,
                    borderRadius: 10,
                  }}>
                  <View style={{width: '33%'}}>
                    <Text style={{fontSize: 14, color: colors.icon}}>
                      {t('check-in')}
                    </Text>
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}>
                      12:00, {formatDayShow(start)}
                    </Text>
                  </View>
                  <Icon4 name="long-arrow-alt-right" size={25} color="orange" />
                  <View style={{width: '33%'}}>
                    <Text style={{fontSize: 14, color: colors.icon}}>
                      {t('check-out')}
                    </Text>
                    {end ? (
                      <Text
                        style={{
                          color: colors.text,
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        12:00, {formatDayShow(end)}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: colors.text,
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}></Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View style={{marginTop: 10}}>
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
                                ...middle.reduce((acc, cur) => {
                                    acc[cur] = {
                                        startingDay: cur===start?true:false,
                                        endingDay: cur===end?true:false,
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
            </View>
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                bottom: 15,
                borderTopWidth: 1,
                borderTopColor: 'gray',
                width: '100%',
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  handleConfirm();
                }}
                disabled={end == '' ? true : false}
                style={{
                  width: '90%',
                  height: 40,
                  backgroundColor: end == '' ? '#d1bebd' : '#f44336',
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{color: 'white', fontSize: 17, fontWeight: 'bold'}}>
                  {t('confirm')}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Pressable
            style={[styles.bottomSheet1, {backgroundColor: colors.box}]}
            onPress={() => {
              handleOpenCalendar();
            }}>
            <View style={{padding: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: colors.text,
                    }}>
                    {t('time-booking')}
                  </Text>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Text
                      style={{
                        color: colors.text,
                        textDecorationStyle: 'dashed',
                        textDecorationLine: 'underline',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      12:00,{' '}
                      {formatDayShow(start) +
                        ' - 12:00, ' +
                        formatDayShow(end)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.box,
                    borderWidth: 1,
                    borderColor: 'red',
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                  }}>
                  <Text
                    style={{fontSize: 15, fontWeight: 'bold', color: 'red'}}>
                    {t('change-day')}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Chat', {
                hotelData: hotelData,
              });
            }}
            style={{
              position: 'absolute',
              bottom: 90,
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              right: 10,
              zIndex: 1,
              backgroundColor: colors.box,
              borderRadius: 25,
              elevation: 10,
            }}>
            <Lottie
              source={require('../../assets/animations/61735-message.json')}
              autoPlay
              loop
            />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  RecentlyBox: {
    width: '100%',
    height: 280,
    marginBottom: 15,
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 15,
    shadowColor: 'black',
    marginBottom: 20,
  },
  IMGRecent: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
  },
  HeaderBack: {
    width: width,
    height: 70,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: 'white',
    elevation: 10,
    shadowColor: 'black',

    justifyContent: 'space-between',
  },
  HeaderTitle: {
    width: width,
    height: 50,
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 1,
    top: 20,
  },
  ViewInfo: {
    position: 'absolute',
    zIndex: 1,
    top: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    shadowColor: 'black',
    alignItems: 'center',
    alignSelf: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    position: 'absolute',
    width: '100%',
    height: SHEET_MAX_HEIGHT,
    bottom: -SHEET_MAX_HEIGHT - SHEET_MIN_HEIGHT - 15,
    ...Platform.select({
      android: {elevation: 3},
      ios: {
        shadowColor: '#a8bed2',
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: {
          width: 2,
          height: 2,
        },
      },
    }),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 2,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  bottomSheet1: {
    position: 'absolute',
    width: '100%',
    height: SHEET_MAX_HEIGHT,
    bottom: -SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT,
    ...Platform.select({
      android: {elevation: 3},
      ios: {
        shadowColor: '#a8bed2',
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: {
          width: 2,
          height: 2,
        },
      },
    }),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 1,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  draggableArea: {
    width: '100%',
    height: 120,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  dragHandle: {
    width: 100,
    height: 6,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
  },
});

export default DetailHotel;
