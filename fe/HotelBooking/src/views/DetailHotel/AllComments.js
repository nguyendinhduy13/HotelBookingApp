import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/AntDesign';
import CustomHeader from '../../components/CustomHeader';
const AllComments = ({navigation, route}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dataComment = route.params;
  const star = [1, 2, 3, 4, 5];
  const TotalStar = () => {
    let total = 0;
    if (dataComment.length === 0) return 5;
    dataComment.map(item => {
      total += item.rating;
    });
    return star.includes(total / dataComment.length)
      ? total / dataComment.length
      : (total / dataComment.length).toFixed(1);
  };

  const StarPercent = star => {
    let total = 0;
    if (dataComment.length === 0)
      return {
        total: 0,
        percent: 0,
      };
    dataComment.map(item => {
      if (item.rating === star) {
        total += 1;
      }
    });
    return {total: total, percent: (total / dataComment.length) * 100};
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

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <CustomHeader title="review" />
      <View style={{padding: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon1 name="star" size={28} color={'orange'} />
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              marginLeft: 5,
              color: colors.text,
            }}>
            {TotalStar()}
          </Text>
          <Text style={{color: colors.text, marginLeft: 20}}>
            {dataComment.length} người đã đánh giá
          </Text>
        </View>
        {star
          .map((item, index) => {
            return (
              <View key={index} style={{marginTop: 5}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginLeft: 5,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon1 name="star" size={18} color={'orange'} />
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: 'bold',
                        fontSize: 15,
                        marginLeft: 5,
                      }}>
                      {item}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: `75%`,
                      height: 10,
                      backgroundColor: '#d2d0d0',
                      borderRadius: 5,
                    }}>
                    <View
                      style={{
                        width: `${StarPercent(item).percent}%`,
                        height: 10,
                        backgroundColor: 'orange',
                        borderRadius: 5,
                      }}
                    />
                  </View>
                  <Text style={{color: colors.text}}>
                    {StarPercent(item).total}
                  </Text>
                </View>
              </View>
            );
          })
          .reverse()}
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#d2d0d0',
            marginTop: 15,
          }}
        />
      </View>
      {dataComment.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.bg,
          }}>
          <Image
            source={require('../../assets/empty.png')}
            style={{
              width: 100,
              height: 100,
              borderRadius: 25,
              alignSelf: 'center',
            }}
          />
        </View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          paddingHorizontal: 10,
          marginBottom: 10,
        }}>
        {dataComment.map((item, index) => {
          return (
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/avatars.jpg')}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                    }}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 16,
                        color: colors.text,
                      }}>
                      {item.id_user.name}
                    </Text>
                    <Text style={{fontSize: 13, fontWeight: '400'}}>
                      {FormatTimeStamp(item.time_stamp)}
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
                  <Icon1 name="star" size={15} color={'yellow'} />
                  <Text style={{color: 'white', marginLeft: 5}}>
                    {item.rating}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  paddingHorizontal: 20,
                  fontWeight: '400',
                  fontSize: 14,
                }}>
                {item.content}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default AllComments;

const styles = StyleSheet.create({
  HeadrView1: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
