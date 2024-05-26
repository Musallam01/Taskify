// React imports
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Axios imports
import axios from 'axios';

// Constants imports
import { baseURL, COLORS } from '../constants';

// Toast imports
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation, handleUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('manager');

  const showErrorToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Wrong ID or Password, please try again',
      position: 'bottom'
    });
  }

  const showSuccessToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Logged in successfully',
      position: 'bottom',
    });
  }

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleManagerPress = () => {
    setUserRole('manager');
  };

  const handleEmployeePress = () => {
    setUserRole('employee');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSignInPress = async () => {
    try {
      const lowerCaseUsername = username.toLowerCase(); // Convert username to lowercase
      console.log('Attempting to login with:', { username: lowerCaseUsername, password });
  
      const response = await axios.post(`${baseURL}/login`, { username: lowerCaseUsername, password });
      const { token, role, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      handleUserRole(role);
      showSuccessToast();
    } catch (error) {
      console.error('Login error:', error);
      showErrorToast();
    }
  };

  return (
    <KeyboardAwareScrollView 
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={-30}
      canCancelContentTouches={false}
    >
      <StatusBar barStyle="dark-content" />

      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.containerView}>
          <Image source={require('../assets/logoFullRow.png')} style={styles.logo} />
          <View style={styles.mainTextView}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.mainTextSecondPart}>
              <Text style={styles.signInText}>Sign In</Text> Please
            </Text>
          </View>
          <View style={styles.bottomHalfView}>
            <View style={styles.areYouView}>
              <Text style={styles.areYouText}>Are you</Text>
            </View>
            <View style={styles.chooseUserView}>
              <TouchableOpacity
                style={[styles.button, userRole === 'manager' ? styles.selectedButton : null]}
                onPress={handleManagerPress}
              >
                <Text style={styles.buttonText}>Manager</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, userRole === 'employee' ? styles.selectedButton : null]}
                onPress={handleEmployeePress}
              >
                <Text style={styles.buttonText}>Employee</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.employeeIDView}>
              <TextInput
                style={styles.textInputID}
                placeholder='Username'
                onChangeText={handleUsernameChange}
                value={username}
              />
            </View>
            <View style={styles.passwordView}>
              <TextInput
                style={styles.textInputPassword}
                placeholder='Password'
                onChangeText={handlePasswordChange}
                value={password}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.signInButton} onPress={handleSignInPress}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
  containerView: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 65,
    backgroundColor: COLORS.SECONDARY_COLOR_1,
  },
  button: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: 150,
    alignItems: "center"
  },
  selectedButton: {
    backgroundColor: COLORS.PRIMARY_COLOR_2,
    borderRadius: 20,
    width: 150,
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 25,
    fontWeight: "400",
    color: COLORS.SECONDARY_COLOR_1
  },
  logo: {
    height: 100,
    width: 200,
    marginBottom: 75,
    resizeMode: 'center'
  },
  mainTextView: {
    alignItems: 'flex-start',
    width: "85%",
    marginBottom: 35,
  },
  welcomeText: {
    fontSize: 40, 
    fontWeight: 'bold',
  },
  mainTextSecondPart: {
    fontSize: 30,
    fontWeight: '600',
  },
  signInText: {
    color: COLORS.PRIMARY_COLOR_2,
  },
  bottomHalfView: {
    backgroundColor: COLORS.PRIMARY_COLOR_1,
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: "100%",
  },
  chooseUserView: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  areYouView: {
    marginTop: 50,
    width: "85%",
    alignSelf: "center",
  },
  areYouText: {
    fontSize: 25,
    fontWeight: "500",
    color: COLORS.SECONDARY_COLOR_1
  },
  employeeIDView: {
    backgroundColor: COLORS.SECONDARY_COLOR_1,
    width: "85%",
    height: 55,
    borderRadius: 25,
    marginBottom: 35,
    marginTop: 35,
    alignSelf: "center",
    justifyContent: "center",
    paddingLeft: "5%",
  },
  passwordView: {
    backgroundColor: COLORS.SECONDARY_COLOR_1,
    width: "85%",
    height: 55,
    borderRadius: 25,
    alignSelf: "center",
    justifyContent: "center",
    paddingLeft: "5%",
  },
  textInputID: {
    fontSize: 23,
  },
  textInputPassword: {
    fontSize: 23,
  },
  signInButton: {
    alignSelf: "center",
    width: "60%",
    backgroundColor: COLORS.PRIMARY_COLOR_2,
    height: 60,
    borderRadius: 25,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_COLOR_1
  },
});

export default LoginScreen;