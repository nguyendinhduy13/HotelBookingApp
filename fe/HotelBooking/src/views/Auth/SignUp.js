import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useTheme } from 'react-native-paper';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import { CreateAccount } from '../../../middlewares/auth';
export default function SignUpScreen({ navigation }) {
    const [getVisible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone_number, setPhone_number] = useState('');
    const { colors } = useTheme();

    const { t } = useTranslation();

    const CheckEmail = email => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email) ? true : false;
    };

    const CheckPassword = password => {
        var re = /^(?=.*\d).{6,}$/;
        return re.test(password) ? true : false;
    };

    const SignUp = () => {
        if (name == '' || email == '' || password == '') {
            ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
        } else {
            if (!CheckEmail(email)) {
                ToastAndroid.show(
                    'Please enter a valid email',
                    ToastAndroid.SHORT,
                );
            } else {
                if (!CheckPassword(password)) {
                    ToastAndroid.show(
                        'Password must be at least 6 characters long and contain at least one number',
                        ToastAndroid.SHORT,
                    );
                } else {
                    CreateAccount(name, phone_number, email, password).then(
                        res => {
                            if (res.status == 200) {
                                ToastAndroid.show(
                                    'Sign up successfully',
                                    ToastAndroid.SHORT,
                                );
                                navigation.goBack();
                            } else {
                                ToastAndroid.show(
                                    res.data.message,
                                    ToastAndroid.SHORT,
                                );
                            }
                        },
                    );
                }
            }
        }
    };
    return (
        <Pressable
            style={{
                flex: 1,
                backgroundColor: colors.bg,
            }}
            onPress={() => Keyboard.dismiss()}>
            <Icon2
                onPress={() => navigation.goBack()}
                name="arrowleft"
                size={30}
                color={colors.text}
                style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
            />
            <View>
                <Image
                    source={require('../../assets/Logo1.png')}
                    style={{
                        width: 230,
                        height: 230,
                        alignSelf: 'center',
                        marginTop: 30,
                    }}
                />
            </View>
            <View style={{ paddingHorizontal: 25, paddingTop: 20 }}>
                <Text
                    style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: colors.text,
                    }}>
                    {t('sign-up')}
                </Text>
                <View style={{ marginTop: 20 }}>
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                            }}>
                            <Image
                                source={require('../../assets/name_icon.png')}
                                style={{
                                    width: 28,
                                    height: 28,
                                    resizeMode: 'contain',
                                    tintColor: 'grey',
                                }}
                            />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginLeft: 10,
                                    alignItems: 'center',
                                    width: '90%',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#69b9f5',
                                    color: colors.text,
                                }}>
                                <TextInput
                                    placeholder={t('name')}
                                    placeholderTextColor={colors.icon}
                                    style={{ width: '90%', color: colors.text }}
                                    onChangeText={text => setName(text)}
                                    value={name}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                                marginTop: 15,
                            }}>
                            <Icon1 name="email" color={'grey'} size={28} />
                            <TextInput
                                style={{
                                    height: 45,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#69b9f5',
                                    width: '90%',
                                    marginLeft: 10,
                                    fontSize: 16,
                                    color: colors.text,
                                }}
                                placeholder={t('email')}
                                placeholderTextColor={colors.icon}
                                onChangeText={text => setEmail(text)}
                                value={email}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                                marginTop: 15,
                            }}>
                            <Icon1 name="lock" size={28} color={'grey'} />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginLeft: 10,
                                    alignItems: 'center',
                                    width: '90%',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#69b9f5',
                                }}>
                                <TextInput
                                    placeholder={t('password')}
                                    placeholderTextColor={colors.icon}
                                    style={{ width: '90%', color: colors.text }}
                                    secureTextEntry={getVisible ? false : true}
                                    onChangeText={text => setPassword(text)}
                                    value={password}
                                />
                                <Icon
                                    name={
                                        getVisible
                                            ? 'visibility'
                                            : 'visibility-off'
                                    }
                                    iconStyle={{
                                        color: 'grey',
                                    }}
                                    type="material"
                                    onPress={() => setVisible(!getVisible)}
                                />
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 20,
                        }}>
                        <Text style={{ color: colors.icon, marginTop: 10 }}>
                            {t('by-creating-an-account')}
                            <Text
                                style={{
                                    color: '#69b9f5',
                                    fontWeight: 'bold',
                                    marginTop: 5,
                                    lineHeight: 20,
                                }}>
                                {' '}
                                {t('terms-of-service')}{' '}
                                <Text
                                    style={{
                                        color: colors.icon,
                                        marginTop: 5,
                                    }}>
                                    {t('and')}{' '}
                                    <Text
                                        style={{
                                            color: '#69b9f5',
                                            fontWeight: 'bold',
                                            marginTop: 5,
                                        }}>
                                        {t('privacy-policy')}
                                    </Text>
                                </Text>
                            </Text>
                        </Text>
                    </View>
                    <View style={{ marginTop: 35 }}>
                        <TouchableOpacity
                            style={{
                                height: 50,
                                width: '100%',
                                borderRadius: 12,
                                alignItems: 'center',
                                alignContent: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#69b9f5',
                            }}
                            onPress={() => {
                                SignUp();
                            }}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                }}>
                                {t('sign-up')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                }}>
                <Text
                    style={{
                        color: colors.icon,
                        marginTop: 15,
                        alignSelf: 'center',
                        fontSize: 16,
                    }}>
                    {t('already-have-an-account')}
                    <Text
                        style={{
                            color: '#69b9f5',
                            fontWeight: 'bold',
                            marginTop: 5,
                            fontSize: 16,
                        }}
                        onPress={() => {
                            navigation.navigate('SignInScreenTT');
                        }}>
                        {' '}
                        {t('sign-in')}
                    </Text>
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    textinput2: {
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 20,
        borderColor: '#86939e',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        marginBottom: 17,
    },
    button: {
        height: 50,
        width: '90%',
        marginTop: 10,
        borderRadius: 12,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#69b9f5',
    },
});
