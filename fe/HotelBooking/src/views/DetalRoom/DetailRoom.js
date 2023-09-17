import slugify from '@sindresorhus/slugify';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Icons from '../../assets/icons/icons';
export default function DetailRoom({ navigation, route }) {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const dataRoom = route.params.room;
    const { booking_date } = useSelector(state => state.global);
    const image_default =
        'https://img1.ak.crunchyroll.com/i/spire3/d23bea1cbe84833135f94695d900f0651651339079_main.png';
    const DataDetail = [...dataRoom.utility];
    const Format = number => {
        var prices = booking_date.total_night * number;
        return prices.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    };

    const animatedValue = useRef(new Animated.Value(0)).current;
    const HeaderAnimated = {
        opacity: animatedValue.interpolate({
            inputRange: [350, 400],
            outputRange: [0, 1],
        }),
    };
    const HeaderAnimatedScroll = {
        opacity: animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0],
        }),
    };
    const HeaderAnimatedScrollWhite = {
        opacity: animatedValue.interpolate({
            inputRange: [100, 350],
            outputRange: [0, 1],
        }),
    };
    const FormatDayMonthYear = date => {
        const arr = date.split('-');
        const day = arr[2];
        const month = arr[1];
        const year = arr[0];
        return `${day}/${month}/${year}`;
    };
    return (
        <View style={{ position: 'relative' }}>
            <Animated.View style={[styles.HeadrView, HeaderAnimatedScroll]}>
                <View style={styles.header}>
                    <Icon
                        name="arrow-back-ios"
                        size={28}
                        color="white"
                        onPress={navigation.goBack}
                    />
                </View>
            </Animated.View>
            <Animated.View
                style={[
                    styles.HeadrViewWhite,
                    { backgroundColor: colors.box },
                    HeaderAnimatedScrollWhite,
                ]}>
                <View style={styles.header}>
                    <Icon
                        name="arrow-back-ios"
                        size={28}
                        color={colors.text}
                        onPress={navigation.goBack}
                    />
                </View>
            </Animated.View>
            <Animated.View
                style={[
                    styles.HeadrView1,
                    { backgroundColor: colors.box },
                    HeaderAnimated,
                ]}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 10,
                    }}>
                    <Icon
                        name="arrow-back-ios"
                        size={28}
                        color={colors.text}
                        onPress={navigation.goBack}
                    />
                    <Text
                        style={{
                            fontSize: 17,
                            width: '90%',
                            fontWeight: 'bold',
                            color: colors.text,
                            textAlign: 'center',
                        }}>
                        {dataRoom.name}
                    </Text>
                </View>
            </Animated.View>
            <ScrollView
                onScroll={e => {
                    const currentOffset = e.nativeEvent.contentOffset.y;
                    animatedValue.setValue(currentOffset);
                }}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    backgroundColor: colors.bg,
                    paddingBottom: 80,
                }}>
                <ImageBackground
                    style={styles.headerImage}
                    source={{ uri: dataRoom.image[0] || image_default }}
                />
                <View>
                    <View style={{ marginTop: 15, paddingHorizontal: 20 }}>
                        <Text
                            style={{
                                fontSize: 27,
                                fontWeight: 'bold',
                                color: colors.text,
                            }}>
                            {dataRoom.name}
                        </Text>
                        <Text
                            style={{
                                color: 'orange',
                                fontWeight: 'bold',
                                fontSize: 16,
                                paddingTop: '1%',
                            }}>
                            {booking_date.total_night} {t('day')}
                            {booking_date.total_night > 1 && t('day') === 'day'
                                ? 's'
                                : ''}
                        </Text>
                        <Text
                            style={{
                                fontSize: 20,
                                paddingTop: '1%',
                                fontWeight: 'bold',
                                color: colors.text,
                            }}>
                            {Format(dataRoom.price)}{' '}
                            <Text style={{ fontSize: 13, color: colors.text }}>
                                đ
                            </Text>
                        </Text>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                marginTop: 15,
                                height: 90,
                                borderWidth: 0.7,
                                borderColor: 'gray',
                                borderRadius: 10,
                            }}>
                            <View
                                style={{
                                    width: '50%',
                                    height: '100%',
                                    borderRightWidth: 0.7,
                                    justifyContent: 'center',
                                    borderRightColor: 'gray',
                                }}>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            color: colors.icon,
                                        }}>
                                        {t('check-in')}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 'bold',
                                            color: colors.text,
                                        }}>
                                        {FormatDayMonthYear(
                                            booking_date.check_in,
                                        )}
                                    </Text>
                                    <Text
                                        style={{
                                            color: colors.text,
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            marginTop: 5,
                                        }}>
                                        12:00
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: '50%',
                                    height: '100%',
                                    justifyContent: 'center',
                                    borderRightColor: 'gray',
                                }}>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            color: colors.icon,
                                        }}>
                                        {t('check-out')}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 'bold',
                                            color: colors.text,
                                        }}>
                                        {FormatDayMonthYear(
                                            booking_date.check_out,
                                        )}
                                    </Text>
                                    <Text
                                        style={{
                                            color: colors.text,
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            marginTop: 5,
                                        }}>
                                        12:00
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingTop: '4%' }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: colors.text,
                                        fontWeight: 'bold',
                                    }}>
                                    {t('gallery-photos')}
                                </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate(
                                            'ImageRoom',
                                            dataRoom,
                                        )
                                    }>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: colors.primary,
                                        }}>
                                        {t('show')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingTop: '5%' }}>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}>
                                    {dataRoom.image.map((item, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: item }}
                                            style={{
                                                width: 165,
                                                height: 150,
                                                borderRadius: 10,
                                                marginRight: 10,
                                            }}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                        <View style={{ paddingTop: '2%' }}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: colors.text,
                                        fontWeight: 'bold',
                                    }}>
                                    {t('description')}
                                </Text>
                            </View>
                            <View style={{ marginTop: 12 }}>
                                <Text
                                    style={{
                                        lineHeight: 20,
                                        color: colors.text,
                                    }}>
                                    {dataRoom.description}
                                </Text>
                            </View>
                        </View>
                        <View style={{ paddingTop: '5%' }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: colors.text,
                                    fontWeight: 'bold',
                                }}>
                                {t('utilities')}
                            </Text>
                            <Text
                                style={{
                                    color: 'gray',
                                    marginTop: 5,
                                }}>
                                {t(
                                    'different-utilities-depending-on-the-type-of-room',
                                )}
                            </Text>
                            <View style={{ marginTop: 5 }}>
                                {DataDetail.map((item, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingVertical: 5,
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                color: colors.text,
                                            }}>
                                            {item.split(' ')[1] === 'm²'
                                                ? item + ' '
                                                : t(`${slugify(item)}`)}
                                        </Text>
                                        <Image
                                            source={Icons(slugify(item))}
                                            style={{
                                                width: 22,
                                                height: 22,
                                                tintColor: colors.text,
                                            }}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View
                style={{
                    width: '100%',
                    height: 65,
                    backgroundColor: colors.box,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    zIndex: 1,
                    bottom: 0,
                }}>
                <TouchableOpacity
                    style={{
                        width: '90%',
                        height: 45,
                        backgroundColor: colors.primary,
                        borderRadius: 15,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={() => {
                        navigation.navigate('OrderRoom', {
                            room: route.params.room,
                            hotel: route.params.hotel,
                        });
                    }}>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'white',
                        }}>
                        {t('book-now')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        height: 350,
        overflow: 'hidden',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        justifyContent: 'space-between',
    },
    iconContainer: {
        position: 'absolute',
        height: 60,
        width: 60,
        backgroundColor: '#52c0b4',
        top: -30,
        right: 20,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceTag: {
        height: 40,
        alignItems: 'center',
        marginLeft: 40,
        paddingLeft: 20,
        flex: 1,
        backgroundColor: '#52c0b4',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        flexDirection: 'row',
    },
    btn: {
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        backgroundColor: '#52c0b4',
        marginHorizontal: 20,
        borderRadius: 10,
    },
    HeadrView: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        zIndex: 1,
        height: 50,
        width: '100%',
        justifyContent: 'center',
    },
    HeadrViewWhite: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        height: 60,
        width: '100%',
        justifyContent: 'center',
    },
    HeadrView1: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        height: 60,
        width: '100%',
        justifyContent: 'center',
    },
});
