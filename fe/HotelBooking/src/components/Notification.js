import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const Notification = () => {
  const {notification} = useSelector(state => state.global);

  const formatLongText = text => {
    if (text?.length > 110) {
      return text.slice(0, 110) + '...';
    }
    return text;
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 5,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        zIndex: 100,
      }}>
      {notification?.length > 0 && (
        
      )}
    </View>
  );
};

export default Notification;
