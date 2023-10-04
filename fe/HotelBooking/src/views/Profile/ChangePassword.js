import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
const bcrypt = require('bcryptjs');
import {APIChangePassword} from '../../../middlewares/auth';
import CustomHeader from '../../components/CustomHeader';

const ChangePassword = ({navigation}) => {
  const count = useRef(0);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const [error, setError] = useState('');
  const [errornew, setErrornew] = useState('');
  const [errorconfirm, setErrorconfirm] = useState('');

  const {userData} = useSelector(state => state.global);

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [TrueOldPass, setTrueOldPass] = useState(false);
  const [TrueNewPass, setTrueNewPass] = useState(false);
  const [TrueConfirmPass, setTrueConfirmPass] = useState(false);

  const handleCheck = async () => {
    if (password.length > 0) {
      const result = await bcrypt.compare(password, userData.password);
      if (!result) {
        setError(t('current-password-not-correct'));
        setTrueOldPass(false);
      } else {
        setError('');
        setTrueOldPass(true);
      }
    } else {
      setError(t('please-enter-current-password'));
      setTrueOldPass(false);
    }
  };
  const handleEnterPassword = value => {
    setError('');
    setTrueOldPass(false);
    setPassword(value);
  };
  const handleEnterNewPassword = value => {
    setErrornew('');
    setTrueNewPass(false);
    setNewPassword(value);
  };
  const handleEnterConfirmPassword = value => {
    setErrorconfirm('');
    setTrueConfirmPass(false);
    setConfirmPassword(value);
    count.current = count.current + 1;
  };
  useEffect(() => {
    if (count.current != 0 && password.length > 0 && newPassword.length > 0) {
      if (newPassword.length > 0) {
        if (newPassword.length < 6) {
          setErrornew(t('password-at-least-6-characters'));
          setTrueNewPass(false);
        } else {
          setErrornew('');
          setTrueNewPass(true);
        }
      } else {
        setErrornew(t('please-enter-new-password'));
        setTrueNewPass(false);
      }
      if (confirmPassword.length > 0) {
        if (confirmPassword != newPassword) {
          setErrorconfirm(t('confirm-password-not-correct'));
          setTrueConfirmPass(false);
        } else {
          setErrorconfirm('');
          setTrueConfirmPass(true);
        }
      } else {
        setErrorconfirm(t('please-enter-confirm-password'));
        setTrueConfirmPass(false);
      }
    }
  }, [newPassword, confirmPassword]);

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <CustomHeader title={'change-password'} />
      <Pressable style={{marginTop: 20}} onPress={() => Keyboard.dismiss()}>
        <Text style={{marginLeft: 22, color: colors.icon}}>
          {t('current-password')}
        </Text>
        <View>
          <TextInput
            placeholder={t('current-password')}
            placeholderTextColor={colors.icon}
            style={{
              borderWidth: 1,
              borderRadius: 5,
              borderColor: error == '' ? '#d0d0d0' : 'red',
              width: 350,
              height: 55,
              alignSelf: 'center',
              marginTop: 15,
              paddingLeft: 10,
              color: colors.text,
            }}
            onChangeText={value => handleEnterPassword(value)}
            selectTextOnFocus={true}
            showSoftInputOnFocus={true}
            onEndEditing={() => {
              handleCheck();
            }}
            on
            secureTextEntry={true}
          />
          <Icon
            name="done"
            size={error == '' && TrueOldPass ? 25 : 0}
            color="green"
            style={{position: 'absolute', top: 30, right: 35}}
          />
        </View>
        <Text
          style={{
            color: 'red',
            marginLeft: 22,
            marginTop: 5,
            height: error == '' ? 0 : 'auto',
          }}>
          {error}
        </Text>
        <Text style={{marginLeft: 22, marginTop: 20, color: colors.icon}}>
          {t('new-password')}
        </Text>
        <View>
          <TextInput
            placeholder={t('new-password')}
            placeholderTextColor={colors.icon}
            style={{
              borderWidth: 1,
              borderRadius: 5,
              borderColor: errornew == '' ? '#d0d0d0' : 'red',
              width: 350,
              height: 55,
              alignSelf: 'center',
              marginTop: 2,
              paddingLeft: 10,
              color: colors.text,
              marginTop: 15,
            }}
            onChangeText={value => handleEnterNewPassword(value)}
            onEndEditing={() => {
              if (newPassword.length < 6) {
                setErrornew(t('password-at-least-6-characters'));
                setTrueNewPass(false);
              } else {
                setErrornew('');
                setTrueNewPass(true);
              }
            }}
            secureTextEntry={true}
          />
          <Icon
            name="done"
            size={errornew == '' && TrueNewPass ? 25 : 0}
            color="green"
            style={{position: 'absolute', top: 30, right: 35}}
          />
        </View>
        <Text
          style={{
            color: 'red',
            marginLeft: 22,
            marginTop: 5,
            height: errornew == '' ? 0 : 'auto',
          }}>
          {errornew}
        </Text>
        <View>
          <TextInput
            placeholder={t('confirm-password')}
            placeholderTextColor={colors.icon}
            style={{
              borderWidth: 1,
              borderRadius: 5,
              width: 350,
              height: 55,
              marginTop: 20,
              alignSelf: 'center',
              borderColor: errorconfirm == '' ? '#d0d0d0' : 'red',
              paddingLeft: 10,
              color: colors.text,
            }}
            onChangeText={value => handleEnterConfirmPassword(value)}
            secureTextEntry={true}
          />
        </View>
        <Text
          style={{
            color: 'red',
            marginLeft: 22,
            marginTop: 5,
            height: errorconfirm == '' ? 0 : 'auto',
          }}>
          {errorconfirm}
        </Text>
      </Pressable>
      <TouchableOpacity
        onPress={() => {
          //   onChangePassword();
        }}
        style={
          TrueOldPass && TrueNewPass && confirmPassword != ''
            ? styles.button
            : styles.buttonDisable
        }>
        <Text style={styles.text}>{t('complete')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    height: 45,
    width: 370,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#52c0b4',
    marginTop: 25,
  },
  buttonDisable: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    height: 45,
    width: 370,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'gray',
    marginTop: 25,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
});
