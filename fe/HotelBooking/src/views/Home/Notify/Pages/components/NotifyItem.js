import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {ContextNotify} from '../../../../../contexts/index';
import {setAsyncStorage} from '../../../../../../functions/asyncStorageFunctions';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

const NotifyItem = ({id, navigation}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [isShow, setIsShow] = useState(false);
  const {notify, setNotify} = useContext(ContextNotify);

  const {title, body, time, data, isRead} = notify.find(item => item.id === id);

  const formatTime = time => {
    const momentObj = moment(time);

    if (moment().diff(momentObj, 'minutes') < 1) {
      return 'Vừa xong';
    } else if (moment().diff(momentObj, 'minutes') < 60) {
      const minutesAgo = moment().diff(momentObj, 'minutes');
      return `${minutesAgo} phút trước`;
    } else if (moment().diff(momentObj, 'hours') < 24) {
      const hoursAgo = moment().diff(momentObj, 'hours');
      return `${hoursAgo} tiếng trước`;
    } else {
      const formattedDate = momentObj.format('dddd, DD/MM');
      return formattedDate;
    }
  };

  const handleMarkAsRead = id => {
    const index = notify.findIndex(item => item.id === id);
    const newNotify = [...notify];
    newNotify[index].isRead = true;
    setNotify(newNotify);
    setAsyncStorage('notify', JSON.stringify(newNotify));
    setIsShow(false);
  };

  const handleDeleteNotify = id => {
    const index = notify.findIndex(item => item.id === id);
    const newNotify = [...notify];
    newNotify.splice(index, 1);
    setNotify(newNotify);
    setAsyncStorage('notify', JSON.stringify(newNotify));
    setIsShow(false);
  };

  const handleOpenNotify = id => {
    const thisNotify = notify.find(item => item.id === id);
    handleMarkAsRead(id);
    if (thisNotify.data.type === 'booking') {
      navigation.navigate('DetailBooking', {
        dataNotify: thisNotify,
        id_booking: thisNotify.data.id_booking,
        id_hotel: thisNotify.data.id_hotel,
      });
    } else if (thisNotify.data.type === 'chat') {
      navigation.navigate('Chat', {
        hotelData: {
          _id: thisNotify.data.id_chat,
          name: thisNotify.title,
        },
      });
    }
  };

  return (
    <Pressable
      onPress={() => {
        handleOpenNotify(id);
      }}
      style={{
        flexDirection: 'row',
        padding: 10,
      }}>
      <View>
        <Image
          source={require('../../../../../assets/avtvk.jpg')}
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            marginTop: 2,
          }}
        />
        {isRead === false && (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 25,
              backgroundColor: colors.box,
              position: 'absolute',
              right: -2,
              top: -2,
            }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 5,
                backgroundColor: 'red',
                position: 'absolute',
                right: 1,
                top: 1,
              }}
            />
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          marginLeft: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: colors.text,
            }}>
            {title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsShow(true);
            }}>
            <Icon name="dots-three-horizontal" size={20} color={colors.text} />
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isShow}
            onRequestClose={() => {
              setIsShow(false);
            }}>
            <Pressable
              onPress={() => {
                setIsShow(false);
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  backgroundColor: colors.box,
                  width: '100%',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  padding: 10,
                  position: 'absolute',
                  bottom: 0,
                }}>
                <View
                  style={{
                    width: '95%',
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      handleMarkAsRead(id);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ddd',
                    }}>
                    <Icon1 name="check" size={20} color={colors.text} />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: colors.text,
                        marginLeft: 10,
                      }}>
                      {t('markasread')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleDeleteNotify(id);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ddd',
                    }}>
                    <Icon2
                      name="delete-outline"
                      size={20}
                      color={colors.text}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: colors.text,
                        marginLeft: 10,
                      }}>
                      {t('deletenotify')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsShow(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}>
                    <Icon2 name="clear" size={20} color={colors.text} />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: colors.text,
                        marginLeft: 10,
                      }}>
                      {t('cancel')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Modal>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: colors.text,
            textAlign: 'justify',
            marginTop: 5,
          }}>
          {body}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.text,
            textAlign: 'right',
            marginTop: 5,
          }}>
          {formatTime(time)}
        </Text>
      </View>
    </Pressable>
  );
};

export default NotifyItem;

const styles = StyleSheet.create({});
