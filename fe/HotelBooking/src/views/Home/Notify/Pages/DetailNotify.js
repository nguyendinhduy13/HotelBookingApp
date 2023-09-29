import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../../../components/CustomHeader';

const DetailNotify = ({navigation, route}) => {
  const {dataNotify} = route.params;
  console.log(dataNotify);
  return (
    <View>
      <CustomHeader title="Chi tiết thông báo" />
    </View>
  );
};

export default DetailNotify;

const styles = StyleSheet.create({});
