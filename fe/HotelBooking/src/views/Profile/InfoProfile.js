import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
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
import Icon from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from '../../../redux/Globalreducer';
import CustomHeader from '../../components/CustomHeader';
import {APIUpdateProfile} from '../../../middlewares/auth';

const {width, height} = Dimensions.get('screen');
const InfoProfile = ({navigation}) => {
  const {userData} = useSelector(state => state.global);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone_number);

  const isChange = () => {
    if (
      name !== userData.name ||
      email !== userData.email ||
      phone !== userData.phone_number
    ) {
      return true;
    }
    return false;
  };

  const updateInfoUser = () => {
    const phone_number = phone;
    APIUpdateProfile(name, phone_number, email).then(res => {
      if (res.status === 200) {
        const data = {
          name: name,
          phone_number: phone,
        };
        dispatch(updateUser(data));
        Keyboard.dismiss();
        ToastAndroid.show('Update success', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Update fail', ToastAndroid.SHORT);
      }
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <View style={{}}>
        <CustomHeader title={'information-account'} />
        <Pressable
          style={{paddingHorizontal: 20, height: height, width: '100%'}}
          onPress={() => Keyboard.dismiss()}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
              width: '100%',
              height: 60,
              borderBottomWidth: 1,
              borderBottomColor: '#d0d0d0',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                width: '40%',
                color: colors.icon,
              }}>
              {t('user-name')}
            </Text>
            <TextInput
              style={{
                fontSize: 17,
                color: colors.text,
                width: '60%',
              }}
              value={name}
              onChangeText={text => setName(text)}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
              width: '100%',
              height: 60,
              borderBottomWidth: 1,
              borderBottomColor: '#d0d0d0',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                width: '40%',
                color: colors.icon,
              }}>
              {t('email')}
            </Text>
            <TextInput
              style={{
                fontSize: 17,
                color: colors.text,
                width: '60%',
              }}
              value={email}
              onChangeText={text => setEmail(text)}
              editable={false}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
              width: '100%',
              height: 60,
              borderBottomWidth: 1,
              borderBottomColor: '#d0d0d0',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                width: '40%',
                color: colors.icon,
              }}>
              {t('phone')}
            </Text>
            <TextInput
              style={{
                fontSize: 17,
                color: colors.text,
                width: '60%',
              }}
              value={phone}
              onChangeText={text => setPhone(text)}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center',
                width: '100%',
                height: 60,
                borderBottomWidth: 1,
                borderBottomColor: '#d0d0d0',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  width: '40%',
                  color: colors.icon,
                }}>
                {t('password')}
              </Text>
              <Text style={{fontSize: 17, color: colors.text}}>
                {'********'}
              </Text>
            </View>
            <Icon
              name="edit"
              size={userData?.type === 'google' ? 0 : 25}
              style={{
                position: 'absolute',
                right: 15,
                alignSelf: 'center',
                color: 'red',
              }}
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: isChange() ? 'orange' : 'gray',
              width: '100%',
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 15,
              marginTop: 30,
            }}
            disabled={!isChange()}
            onPress={() => {
              updateInfoUser();
            }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: 'white',
              }}>
              {t('update')}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imgAvtInfo: {
    width: 120,
    height: 120,
    borderColor: '#d0d0d0',
    borderWidth: 1,
    borderRadius: 80,
    marginRight: 10,
  },
  wrapIconCamera: {
    alignSelf: 'center',
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 40,
    left: 33,
  },
  wrapLoading: {
    width: 120,
    height: 120,
    borderColor: '#d0d0d0',
    borderWidth: 1,
    borderRadius: 80,
    marginRight: 10,
  },
});

export default InfoProfile;
