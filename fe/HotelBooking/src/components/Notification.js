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
        <Pressable
          onPress={() => {
            console.log('aaa');
          }}
          style={{
            width: '95%',
            backgroundColor: 'white',
            borderRadius: 10,
            alignSelf: 'center',
            elevation: 5,
          }}>
          <View style={{padding: 10}}>
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
                <Image
                  source={require('../assets/logo_mini.png')}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'cover',
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: 'black',
                  marginLeft: 10,
                }}>
                {notification[0]?.title}
              </Text>
            </View>
            <View style={{marginTop: 5}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontWeight: '400',
                  lineHeight: 20,
                  textAlign: 'justify',
                  overflow: 'hidden',
                  height: notification[0]?.body.length > 110 ? 40 : null,
                }}>
                {formatLongText(notification[0]?.body)}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default Notification;
