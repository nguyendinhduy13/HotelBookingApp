import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  NativeModules,
  NativeEventEmitter,
  Button,
  DeviceEventEmitter,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import Swiper from 'react-native-swiper';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon5 from 'react-native-vector-icons/EvilIcons';
import Icon4 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import NotifyIcon from './components/NotifyIcon';
import {
  getAsyncStorage,
  setAsyncStorage,
} from '../../../functions/asyncStorageFunctions';
import {setHotelData} from '../../../redux/Globalreducer';
import {NewNotifyContext} from '../../contexts/index';
import CryptoJS from 'crypto-js';
const {width} = Dimensions.get('screen');
const cardWidth = width / 1.8;
export default function HomeScreen({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {hotels, userData} = useSelector(state => state.global);
  const ranHotel = [1, 2, 4];
  const image_default =
    'https://img1.ak.crunchyroll.com/i/spire3/d23bea1cbe84833135f94695d900f0651651339079_main.png';
  const dataExplore = [
    {
      id: 1,
      index: 43,
      title: 'Đà Lạt',
      img: 'https://q-xx.bstatic.com/xdata/images/city/250x250/688831.jpg?k=7b999c7babe3487598fc4dd89365db2c4778827eac8cb2a47d48505c97959a78&o=',
    },
    {
      id: 2,
      index: 49,
      title: 'Hồ Chí Minh',
      img: 'https://q-xx.bstatic.com/xdata/images/city/250x250/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o=',
    },
    {
      id: 3,
      index: 48,
      title: 'Vũng Tàu',
      img: 'https://q-xx.bstatic.com/xdata/images/city/250x250/688956.jpg?k=fc88c6ab5434042ebe73d94991e011866b18ee486476e475a9ac596c79dce818&o=',
    },
  ];

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const SearchShow = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 70],
      outputRange: [0, 1],
    }),
  };

  const textInput = useRef(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const handleSearch = text => {
    if (text) {
      const newData = hotels.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setData(newData);
      setSearch(text);
    } else {
      setData([]);
      setSearch('');
    }
  };

  const [historySearch, setHistorySearch] = useState([]);
  const readItemFromStorage = async () => {
    const value = await getAsyncStorage('historyHotel');
    if (value !== null) {
      setHistorySearch(JSON.parse(value));
    }
  };

  const addItemToSearchHistory = async item => {
    const value = await getAsyncStorage('historyHotel');
    if (value === null) {
      setAsyncStorage('historyHotel', JSON.stringify([item]));
      setHistorySearch([item]);
    } else {
      //clear old data
      const temp = JSON.parse(value);
      const index = temp.findIndex(x => x.id === item.id);
      if (index !== -1) {
        temp.splice(index, 1);
      }
      temp.push(item);
      setAsyncStorage('historyHotel', JSON.stringify(temp));
      setHistorySearch(temp);
    }
    readItemFromStorage();
  };

  const removeItemFromSearchHistory = async item => {
    const value = await getAsyncStorage('historyHotel');
    if (value === null) {
      setAsyncStorage('historyHotel', JSON.stringify([]));
      setHistorySearch([]);
    } else {
      const temp = JSON.parse(value);
      const index = temp.findIndex(x => x.id === item.id);
      temp.splice(index, 1);
      setAsyncStorage('historyHotel', JSON.stringify(temp));
      setHistorySearch(temp);
    }
  };

  const navigateTo = item => {
    dispatch(setHotelData(item));
    navigation.navigate('DetailHotel', {id: item._id});
    setModalVisible(false);
    addItemToSearchHistory(item);
  };

  const formatAddress = name => {
    //regex the name if it has more than 12 words
    const temp = name.split(' ');
    if (temp.length > 9) {
      return temp.slice(0, 8).join(' ') + '...';
    }
    return name;
  };

  const ShowModal = async () => {
    setModalVisible(true);
    readItemFromStorage();
  };
  const starTemp = [1, 2, 3, 4, 5];
  const TotalStar = data => {
    if (data && data.length > 0) {
      let total = 0;
      data.forEach(item => {
        total += item.rating;
      });
      return {
        star: starTemp.includes(total / data.length)
          ? total / data.length
          : (total / data.length).toFixed(1),
        count: data.length,
      };
    }
    return {
      star: 5,
      count: 0,
    };
  };

  const [newNotify, setNewNotify] = useState(false);
  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      const getNotify = async () => {
        let notify = await getAsyncStorage('notify');
        const isNew = JSON.parse(notify)?.some(
          item => item.data?.id_user === userData._id && item.isRead === false,
        );
        setNewNotify(isNew);
      };
      getNotify();
    });

    return subscribe;
  }, []);

  const Card = ({hotel, index}) => {
    const inputRange = [
      (index - 1) * cardWidth,
      index * cardWidth,
      (index + 1) * cardWidth,
    ];
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 0, 0.7],
    });
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });
    return (
      <View>
        <TouchableOpacity
          disabled={activeCardIndex != index}
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('DetailHotel', {id: hotel._id});
            dispatch(setHotelData(hotel));
          }}>
          <Animated.View
            style={{
              ...styles.card,
              transform: [
                {
                  scale,
                },
              ],
            }}>
            <Animated.View
              style={{
                ...styles.cardOverplay,
                opacity,
              }}
            />
            <View style={styles.priceTag}>
              <Icon name="star" size={15} color={'orange'} />
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  paddingLeft: 5,
                }}>
                {TotalStar(hotel.comments).star}
              </Text>
            </View>
            <Image
              source={{
                uri: hotel.image[0] || image_default,
              }}
              style={styles.cardImage}
            />
            <View style={styles.cardDetails}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <View>
                  <View
                    style={{
                      height: 20,
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 17,
                        color: 'white',
                      }}>
                      {hotel.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'white',
                      }}>
                      {formatAddress(hotel.address)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
      }}>
      <View
        style={{
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Header name={'Hotel Booking'} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Animated.View style={[{}, SearchShow]}>
                <Pressable
                  onPress={() => {
                    ShowModal();
                  }}>
                  <Icon4 name="search" size={26} color={colors.text} />
                </Pressable>
              </Animated.View>
              <NewNotifyContext.Provider value={{newNotify}}>
                <NotifyIcon navigation={navigation} colors={colors} />
              </NewNotifyContext.Provider>
            </View>
          </View>
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={{height: '100%'}}
        onScroll={e => {
          const currentOffset = e.nativeEvent.contentOffset.y;
          animatedValue.setValue(currentOffset);
        }}
        scrollEventThrottle={16}>
        <TouchableOpacity
          onPress={() => {
            ShowModal();
          }}>
          <View
            style={[styles.searchInputContainer, {backgroundColor: colors.bg}]}>
            <Icon5
              name="search"
              size={30}
              style={{
                marginLeft: 10,
              }}
              color="#FF6347"
            />
            <Text
              style={{
                fontSize: 17,
                paddingLeft: 10,
                color: colors.text,
              }}>
              {t('search')}
            </Text>
          </View>
        </TouchableOpacity>
        <View>
          <Pressable
            onPress={() => {
              navigation.navigate('ListPlace');
            }}
            style={{
              marginTop: 10,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon4 name="md-location-sharp" size={23} color="orange" />
            <TouchableOpacity onPress={() => {}}>
              <Text
                style={{
                  fontSize: 24,
                  color: 'orange',
                  fontWeight: '700',
                }}>
                Hồ Chí Minh
              </Text>
            </TouchableOpacity>
            <Icon3
              name="caretdown"
              size={15}
              color="orange"
              style={{
                marginLeft: 10,
              }}
            />
          </Pressable>

          <View style={{marginTop: 10}}>
            <Swiper
              activeDot={
                <View
                  style={{
                    backgroundColor: '#FF6347',
                    width: 10,
                    height: 10,
                    borderRadius: 7,
                    marginLeft: 7,
                    marginRight: 7,
                  }}
                />
              }
              dot={
                <View
                  style={{
                    backgroundColor: colors.icon,
                    width: 10,
                    height: 10,
                    borderRadius: 7,
                    marginLeft: 7,
                    marginRight: 7,
                    marginTop: 3,
                  }}
                />
              }
              autoplay={true}
              style={{
                paddingHorizontal: 20,
                height: 220,
                alignSelf: 'center',
              }}>
              <Image
                source={{
                  uri: 'https://www.vietnambooking.com/wp-content/uploads/2019/12/website-dat-phong-khach-san-1.png',
                }}
                style={{
                  height: 170,
                  width: '90%',
                  borderRadius: 10,
                  resizeMode: 'stretch',
                }}
              />
              <Image
                source={{
                  uri: 'https://go2joy.s3.ap-southeast-1.amazonaws.com/blog/wp-content/uploads/2022/12/30143402/sansale-t1-2023-55-sidebar-banner.jpg',
                }}
                style={{
                  height: 170,
                  width: '90%',
                  borderRadius: 10,
                  resizeMode: 'stretch',
                }}
              />

              <Image
                source={{
                  uri: 'https://media.vietteltelecom.vn/upload/ckfinder/images/142.jpg',
                }}
                style={{
                  height: 170,
                  width: '90%',
                  borderRadius: 10,
                  resizeMode: 'stretch',
                }}
              />
            </Swiper>
          </View>

          <View>
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.text,
                fontSize: 18,
                paddingHorizontal: 20,
              }}>
              {t('top-hotels')}
            </Text>
          </View>
          <Animated.FlatList
            onMomentumScrollEnd={e => {
              setActiveCardIndex(
                Math.round(e.nativeEvent.contentOffset.x / cardWidth),
              );
            }}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: scrollX,
                    },
                  },
                },
              ],
              {
                useNativeDriver: true,
              },
            )}
            data={hotels}
            horizontal
            contentContainerStyle={{
              paddingVertical: 20,
              paddingLeft: 20,
              paddingRight: cardWidth / 2 - 40,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => <Card hotel={item} index={index} />}
            snapToInterval={cardWidth}
          />
        </View>
        <Text
          style={{
            fontWeight: 'bold',
            color: colors.text,
            fontSize: 18,
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}>
          {t('suggest-for-you')}
        </Text>
        {ranHotel.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                paddingHorizontal: 20,
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Pressable
                onPress={() => {
                  dispatch(setHotelData(hotels[item]));
                  navigation.navigate('DetailHotel', {id: hotels[item]._id});
                }}>
                <ImageBackground
                  source={{uri: hotels[item]?.image[0] || image_default}}
                  style={{
                    width: '100%',
                    height: 150,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                  <View
                    style={{
                      padding: 10,
                      position: 'absolute',
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      width: '100%',
                    }}>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          {hotels[item]?.name}
                        </Text>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 13,
                            }}>
                            {hotels[item]?.tag.split(',')[0]}
                          </Text>
                          <Icon4
                            name="md-location-sharp"
                            size={15}
                            color="orange"
                            style={{}}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 5,
                        }}>
                        <Text style={{color: 'white'}}>
                          {hotels[item]?.advantage}
                        </Text>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text
                            style={{
                              color: 'white',
                              fontWeight: 'bold',
                            }}>
                            {TotalStar(hotels[item]?.comments).star}
                            {' ('}
                            {TotalStar(hotels[item]?.comments).count}
                            {')'}
                          </Text>
                          <Icon name="star" size={15} color={'orange'} />
                        </View>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <Pressable
            style={[styles.modalView, {backgroundColor: colors.bg}]}
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <View style={[styles.generalView, {backgroundColor: colors.bg}]}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Icon4
                    name="chevron-back-outline"
                    size={30}
                    style={{
                      marginLeft: 10,
                    }}
                    color="#FF6347"
                  />
                </TouchableOpacity>
                <View
                  style={[
                    styles.searchInputContainer1,
                    {backgroundColor: colors.bg},
                  ]}>
                  <Icon5
                    name="search"
                    size={30}
                    style={{
                      marginLeft: 10,
                    }}
                    color="#FF6347"
                  />
                  <TextInput
                    style={{
                      fontSize: 17,
                      paddingLeft: 10,
                    }}
                    placeholder={t('search')}
                    placeholderTextColor={colors.icon}
                    autoFocus={true}
                    ref={textInput}
                    value={search}
                    onChangeText={text => {
                      handleSearch(text);
                    }}
                    color={colors.text}
                  />
                </View>
              </View>

              {data.length > 0 ? (
                <></>
              ) : (
                <View>
                  {historySearch?.length > 0 ? (
                    <Text
                      style={{
                        marginLeft: 20,
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: colors.text,
                      }}>
                      {t('recently-viewed')}
                    </Text>
                  ) : (
                    <></>
                  )}
                  {historySearch
                    ?.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          flexDirection: 'row',
                          height: 50,
                          borderBottomWidth: 1,
                          borderBottomColor: '#C8D8C3',
                          alignItems: 'center',
                          width: '90%',
                          alignSelf: 'center',
                          marginBottom: 12,
                        }}
                        onPress={() => {
                          navigateTo(item);
                        }}>
                        <Image
                          source={{
                            uri: item.image[0] || image_default,
                          }}
                          style={{
                            width: 30,
                            height: 30,
                            resizeMode: 'cover',
                          }}
                        />
                        <View
                          style={{
                            width: '85%',
                          }}>
                          <Text
                            style={{
                              marginLeft: 10,
                              fontSize: 17,
                              height: 22,
                              color: colors.text,
                              fontWeight: 'bold',
                            }}>
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              marginLeft: 10,
                              fontSize: 15,
                              height: 20,
                              color: colors.icon,
                            }}>
                            {item.address}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{
                            position: 'absolute',
                            right: 0,
                          }}
                          onPress={() => {
                            removeItemFromSearchHistory(item);
                          }}>
                          <Icon5
                            name="close"
                            size={22}
                            style={{
                              color: colors.icon,
                            }}
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))
                    .reverse()}
                </View>
              )}

              {data.length > 0 ? (
                <ScrollView>
                  <Text
                    style={{
                      marginLeft: 20,
                      marginTop: 10,
                      marginBottom: 10,
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: colors.text,
                    }}>
                    {t('hotel')}
                  </Text>
                  {data.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        paddingBottom: 20,
                      }}
                      onPress={() => navigateTo(item)}>
                      <View
                        style={[
                          styles.ModalBoxes,
                          {backgroundColor: colors.bg},
                        ]}>
                        <Image
                          source={{
                            uri: item.image[0] || image_default,
                          }}
                          style={{
                            width: 75,
                            height: 75,
                            marginLeft: 7.5,
                            borderRadius: 10,
                          }}
                        />
                        <View
                          style={{
                            height: 70,
                            paddingHorizontal: 7,
                            width: '79%',
                          }}>
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: 'bold',
                              color: colors.text,
                            }}>
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              height: 40,
                              lineHeight: 20,
                              marginTop: 10,
                              color: colors.icon,
                            }}>
                            {item.address}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <></>
              )}
            </View>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    margintop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    height: 45,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  searchInputContainer1: {
    width: '83%',
    height: 45,
    marginLeft: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  card: {
    height: 280,
    width: cardWidth,
    elevation: 5,
    marginRight: 20,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  cardImage: {
    height: '100%',
    width: '100%',
    borderRadius: 25,
  },
  priceTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    backgroundColor: '#52c0b4',
    position: 'absolute',
    zIndex: 1,
    right: 20,
    top: 25,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cardDetails: {
    height: 100,
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,
    zIndex: 100,
    alignSelf: 'center',
    width: '80%',
  },
  cardOverplay: {
    height: 280,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 100,
    width: cardWidth,
    borderRadius: 25,
  },
  topHotelCard: {
    height: 180,
    width: 200,
    backgroundColor: 'white',
    elevation: 10,
    marginHorizontal: 10,
    borderRadius: 15,
  },
  topHotelCardImage: {
    height: 100,
    width: '100%',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  RecentlyBox: {
    width: '90%',
    height: 120,
    color: 'black',
    backgroundColor: 'white',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 20,
    elevation: 15,
    flexDirection: 'row',
  },
  IMGRecent: {
    height: 95,
    width: 95,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 12,
  },
  PriceShow: {
    flexDirection: 'row',
    position: 'absolute',
    top: cardWidth + 15,
    left: cardWidth / 2 - 90,
    justifyContent: 'space-between',
    marginTop: 5,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
    height: '100%',
  },
  generalView: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  ModalBoxes: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: 'white',
    height: 90,
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.25,
    borderColor: '#dddddd',
  },
});
