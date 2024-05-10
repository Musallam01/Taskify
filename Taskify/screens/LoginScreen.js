import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { COLORS } from '../constants';

const LoginScreen = ({ navigation }) => {
  const [text, onChangeText] = useState('');
  const [isManager, setIsManager] = useState(false);

  const handleManagerPress = () => {
    setIsManager(true);
  };

  const handleEmployeePress = () => {
    setIsManager(false);
  };

  const handleSignInPress = () => {
    if (isManager) {
      navigation.replace('ManagerStack');
    } else {
      navigation.replace('EmployeeStack');
    }
  };

  return (
    <View style={styles.container}>

      <Image source={require('../assets/logoFullRow.png')} style={styles.logo} />

      <View style={styles.mainTextView}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.mainTextSecondPart}><Text style={styles.signInText}>Sign In</Text> Please</Text>
      </View>

      <View style={styles.bottomHalfView}>
        <View style={styles.areYouView}>
          <Text style={styles.areYouText}>Are you</Text>
        </View>

        <View style={styles.chooseUserView}>
          <TouchableOpacity
            style={[styles.button, isManager ? styles.selectedButton : null]}
            onPress={handleManagerPress}
          >
            <Text style={styles.buttonText}>Manager</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, !isManager ? styles.selectedButton : null]}
            onPress={handleEmployeePress}
          >
            <Text style={styles.buttonText}>Employee</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.employeeIDView}>
          <TextInput
            style={styles.textInputID}
            placeholder='Employee ID'
            onChangeText={onChangeText}
          />
        </View>

        <View style={styles.passwordView}>
          <TextInput
            style={styles.textInputPassword}
            placeholder='Password'
            onChangeText={onChangeText}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleSignInPress}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 65,
    backgroundColor: COLORS.SECONDARY_COLOR_1,
  },
  button: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  selectedButton:{
    backgroundColor: COLORS.PRIMARY_COLOR_2,
    borderRadius: 20
  },
  buttonText: {
    color: '#000',
    fontSize: 25,
    fontWeight: "400"
  },
  logo:{
    height: 120,
    width: 240,
    marginBottom: 75
  },
  mainTextView:{
    alignItems: 'flex-start',
    width: "85%",
    marginBottom: 35
  },
  welcomeText:{
    fontSize: 40, 
    fontWeight: 'bold',
  },
  mainTextSecondPart:{
    fontSize: 30,
    fontWeight: '600'
  },
  signInText: {
    color: COLORS.PRIMARY_COLOR_2
  },
  bottomHalfView:{
    backgroundColor: COLORS.PRIMARY_COLOR_1,
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: "100%",
  },
  chooseUserView:{
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  areYouView:{
    marginTop: 50,
    width: "85%",
    alignSelf: "center"
  },
  areYouText:{
    fontSize: 25,
    fontWeight: "500",
  },
  employeeIDView:{
    backgroundColor: COLORS.SECONDARY_COLOR_1,
    width: "85%",
    height: 55,
    borderRadius: 25,
    marginBottom: 35,
    marginTop: 35,
    alignSelf: "center",
    justifyContent: "center",
    paddingLeft: "5%"
  },
  passwordView:{
    backgroundColor: COLORS.SECONDARY_COLOR_1,
    width: "85%",
    height: 55,
    borderRadius: 25,
    alignSelf: "center",
    justifyContent: "center",
    paddingLeft: "5%"
  },
  textInputID: {
    fontSize: 23 
  },
  textInputPassword: {
    fontSize: 23 
  },
  signInButton:{
    alignSelf: "center",
    width: "60%",
    backgroundColor: COLORS.PRIMARY_COLOR_2,
    height: 60,
    borderRadius: 25,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  signInButtonText:{
    fontSize: 22,
    fontWeight: 'bold',
  }
});

export default LoginScreen;