import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserInfo = async () => {
  try {
    const userInfo = await AsyncStorage.getItem('user');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error retrieving user info:', error);
    return null;
  }
};