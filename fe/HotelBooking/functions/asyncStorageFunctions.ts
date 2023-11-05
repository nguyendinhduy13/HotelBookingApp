import AsyncStorage from '@react-native-async-storage/async-storage';

const setAsyncStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('Set async storage error', error);
  }
};

const getAsyncStorage = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log('Get async storage error', error);
  }
};

export {setAsyncStorage, getAsyncStorage};
