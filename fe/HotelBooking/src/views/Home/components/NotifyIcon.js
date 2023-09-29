import {StyleSheet, Pressable, View} from 'react-native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NewNotifyContext, NewNotifyFCM} from '../../../contexts/index';

const NotifyIcon = ({navigation, colors}) => {
  const {newNotify} = useContext(NewNotifyContext);
  const {hasNewNotification, setHasNewNotification} = useContext(NewNotifyFCM);
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('NotiPage');
        setHasNewNotification(false);
      }}>
      <Icon
        name="notifications-none"
        size={28}
        color={colors.text}
        style={{
          marginLeft: 15,
        }}
      />
      {
        (hasNewNotification || newNotify) && (
          <View
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              backgroundColor: 'red',
              width: 8,
              height: 8,
              borderRadius: 5,
            }}
          />
        )
      }
    </Pressable>
  );
};

export default NotifyIcon;

const styles = StyleSheet.create({});
