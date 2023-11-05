import moment from 'moment';
import React, {Component} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
// import TimeDelivery from './TimeDelivery';

const MsgComponent = props => {
  const {msg, checkTime} = props;
  return (
    <Pressable key={msg.time} style={{marginHorizontal: 5}}>
      <View
        style={[
          styles.TriangleShapeCSS,
          msg.fromSelf ? styles.right : [styles.left],
        ]}
      />
      {checkTime && (
        <View style={{alignSelf: 'center', marginVertical: 5}}>
          <Text style={styles.timeText}>
            {moment(msg.time).format('hh:mm A')}
          </Text>
        </View>
      )}
      <View
        style={[
          styles.masBox,
          {
            alignSelf: msg.fromSelf ? 'flex-end' : 'flex-start',
            borderWidth: 1,
            borderColor: msg.fromSelf ? '#20abfd' : 'white',
            backgroundColor: msg.fromSelf ? '#20abfd' : 'white',
            elevation: 5,
          },
        ]}>
        <Text style={{color: msg.fromSelf ? 'white' : 'black', fontSize: 15}}>
          {msg.message.text.trim()}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  masBox: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginVertical: 2,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  timeText: {
    fontFamily: 'AveriaSerifLibre-Light',
    fontSize: 10,
    color:'white',
  },
  dayview: {
    alignSelf: 'center',
    height: 30,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 10,
  },
  iconView: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TriangleShapeCSS: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 5,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  left: {
    borderBottomColor: 'white',
    left: 2,
    bottom: 5,
    transform: [{rotate: '0deg'}],
  },
  right: {
    borderBottomColor: '#10abfd',
    right: 0,
    bottom: 5,
    transform: [{rotate: '90deg'}],
  },
});

export default MsgComponent;
