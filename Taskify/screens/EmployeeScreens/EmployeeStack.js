//React Native Imports
import React from 'react'
import { Image, StyleSheet, Platform } from 'react-native';

//React Navigation Imports
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Screen Imports
import EmployeeHome from './EmployeeHome';
import EmployeeEarnings from './EmployeeEarnings';
import EmployeeCalendar from './EmployeeCalendar';

//Constants Imports
import {COLORS} from "../../constants"


const Tab = createBottomTabNavigator();

const EmployeeHomeScreen = () => {
  return (
    <Tab.Navigator 
      initialRouteName="Employee Home" 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'Employee Home') {
            iconSource = focused ? require('../../assets/icons/iconHomeSelected.png') : require('../../assets/icons/iconHome.png');
            iconSize = 35;
          } else if (route.name === 'Employee Earnings') {
            iconSource = focused ? require('../../assets/icons/iconEarningsSelected.png') : require('../../assets/icons/iconEarnings.png');
            iconSize = 45;
          } else if (route.name === 'Employee Calendar') {
            iconSource = focused ? require('../../assets/icons/iconCalendarSelected.png') : require('../../assets/icons/iconCalendar.png');
            iconSize = 35;
          }

          return <Image source={iconSource} style={{ width: iconSize, height: iconSize }} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.SECONDARY_COLOR_2,
          height: Platform.OS == "android" ? "7%" : "11%",
        },
      })}
    >
      <Tab.Screen name="Employee Home" component={EmployeeHome} />
        <Tab.Screen name="Employee Earnings" component={EmployeeEarnings}/>
      <Tab.Screen name="Employee Calendar" component={EmployeeCalendar} />
    </Tab.Navigator>
  );
};

export default EmployeeHomeScreen;