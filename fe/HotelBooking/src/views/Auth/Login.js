import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Lottie from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
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
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import {
    getAsyncStorage,
    setAsyncStorage,
} from '../../../functions/asyncStorageFunctions';
import {
    APIUpdateTokenNotification,
    CreateAccount,
    SignIn,
} from '../../../middlewares/auth';
import { setUserData } from '../../../redux/Globalreducer';

const Login = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [email, setEmail] = useState('huihui@gmail.com');
    const [password, setPassword] = useState('1234567');
    const [getVisible, setVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const { colors } = useTheme();

    // login with google
    useEffect(() => {
        GoogleSignin.configure();
    }, []);

    const UpdateToken = async email => {
        const fcmToken = await getAsyncStorage('fcmToken');
        await APIUpdateTokenNotification(fcmToken, email).then(res => {
            console.log('Update token notification: ', res);
        });
    };

    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const { user } = userInfo;
            SignIn(user.email, user.id).then(res => {
                if (res.status == 200) {
                    ToastAndroid.show('Login successfully', ToastAndroid.SHORT);
                    setAsyncStorage('userData', res.data.token);
                    setAsyncStorage('currentUser', res.data._id);
                    dispatch(setUserData(res.data));
                    UpdateToken(user.email);
                } else if (res.status == 400) {
                    ToastAndroid.show(
                        'Invalid Credentials',
                        ToastAndroid.SHORT,
                    );
                } else {
                    CreateAccount(
                        user.name,
                        '',
                        user.email,
                        user.id,
                        'google',
                    ).then(res => {
                        if (res.status == 200) {
                            ToastAndroid.show(
                                'Login successfully',
                                ToastAndroid.SHORT,
                            );
                            setAsyncStorage('userData', res.data.token);
                            setAsyncStorage('currentUser', res.data._id);
                            dispatch(setUserData(res.data));
                        } else if (res.status == 400) {
                            ToastAndroid.show(
                                'Invalid Credentials',
                                ToastAndroid.SHORT,
                            );
                        } else {
                            ToastAndroid.show(
                                res.data.message,
                                ToastAndroid.SHORT,
                            );
                        }
                    });
                }
            });
        } catch (error) {
            throw error;
        }
    };

    const SignInWithEmailPassword = () => {
        if (email == '' || password == '') {
            ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
        } else {
            setLoading(true);
            SignIn(email, password).then(res => {
                if (res.status == 200) {
                    ToastAndroid.show('Login successfully', ToastAndroid.SHORT);
                    setAsyncStorage('userData', res.data.token);
                    setAsyncStorage('currentUser', res.data._id);
                    dispatch(setUserData(res.data));
                    UpdateToken(email);
                } else if (res.status == 400) {
                    ToastAndroid.show(
                        'Invalid Credentials',
                        ToastAndroid.SHORT,
                    );
                } else {
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                }
                setLoading(false);
            });
        }
    };

    return (
        <Pressable
            onPress={() => {
                Keyboard.dismiss();
            }}
            style={{ flex: 1, backgroundColor: colors.bg }}>
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
            <View style={{ paddingHorizontal: 25, paddingTop: 10 }}>
                <Text
                    style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: colors.text,
                    }}>
                    {t('sign-in')}
                </Text>
                <View style={{ marginTop: 20 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            alignItems: 'center',
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
                                color: colors.text,
                            }}>
                            <TextInput
                                placeholder={t('password')}
                                placeholderTextColor={colors.icon}
                                style={{
                                    width: '90%',
                                    color: colors.text,
                                    fontSize: 16,
                                }}
                                secureTextEntry={getVisible ? false : true}
                                onChangeText={text => setPassword(text)}
                                value={password}
                            />
                            <Icon
                                name={
                                    getVisible ? 'visibility' : 'visibility-off'
                                }
                                iconStyle={{
                                    color: 'grey',
                                }}
                                type="material"
                                onPress={() => setVisible(!getVisible)}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ForgotPassword');
                        }}>
                        <Text
                            style={{
                                color: '#37a2f2',
                                fontSize: 16,
                                marginTop: 10,
                                alignSelf: 'flex-end',
                                fontWeight: 'bold',
                            }}>
                            {t('forgot-password')}{' '}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            SignInWithEmailPassword();
                        }}>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}>
                            {t('log-in')}
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 20,
                        }}>
                        <View
                            style={{
                                height: 1,
                                backgroundColor: '#86939e',
                                width: '44%',
                            }}
                        />
                        <Text
                            style={{
                                color: colors.icon,
                                fontSize: 16,
                                marginHorizontal: '3%',
                            }}>
                            {t('or')}
                        </Text>
                        <View
                            style={{
                                height: 1,
                                backgroundColor: '#86939e',
                                width: '44%',
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        style={{
                            height: 50,
                            width: '100%',
                            marginTop: 20,
                            borderRadius: 12,
                            alignItems: 'center',
                            alignSelf: 'center',
                            alignContent: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.special,
                        }}
                        onPress={() => {
                            handleGoogleLogin();
                        }}>
                        <Image
                            source={require('../../assets/logo_gg.png')}
                            style={{
                                width: 35,
                                height: 35,
                                alignSelf: 'center',
                                position: 'absolute',
                                left: 20,
                            }}
                        />
                        <Text
                            style={{
                                color: colors.text,
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}>
                            {t('sign-in-with-google')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginTop: 30,
                }}>
                <Text
                    style={{
                        color: colors.icon,
                        fontSize: 16,
                    }}>
                    {t('dont-have-an-account')}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}
                    style={{ marginLeft: 5 }}>
                    <Text
                        style={{
                            color: '#37a2f2',
                            fontSize: 16,
                            fontWeight: 'bold',
                        }}>
                        {t('sign-up')}
                    </Text>
                </TouchableOpacity>
            </View>
            {isLoading ? (
                <View
                    style={{
                        position: 'absolute',
                        opacity: 0.7,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'white',
                    }}>
                    <Lottie
                        source={require('../../assets/animations/92803-loading.json')}
                        autoPlay
                        loop
                    />
                </View>
            ) : (
                <></>
            )}
        </Pressable>
    );
};

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
        width: '100%',
        marginTop: 30,
        borderRadius: 12,
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#37a2f2',
    },
});

export default Login;
