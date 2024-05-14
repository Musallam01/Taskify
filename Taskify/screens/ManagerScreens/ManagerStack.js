//React Native Imports
import React from 'react'
import { Image, StyleSheet, Platform } from 'react-native';

//React Navigation Imports
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Screen Imports
import ManagerHome from './ManagerHomeScreen';
import AddTaskScreen from './ManagerAddTaskScreen';
import ManagerCalendar from './ManagerCalendarScreen';

//Constants Imports
import {COLORS} from "../../constants"


const Tab = createBottomTabNavigator();

const ManagerHomeScreen = () => {
  return (
    <Tab.Navigator 
      initialRouteName="Employee Home" 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'Manager Home') {
            iconSource = focused ? require('../../assets/icons/iconHomeSelected.png') : require('../../assets/icons/iconHome.png');
            iconSize = 35;
          } else if (route.name === 'Add Task') {
            iconSource = focused ? require('../../assets/icons/iconTaskSelected.png') : require('../../assets/icons/iconTask.png');
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
          height: Platform.OS == "android" ? "7%" : "12%",
        },
      })}
    >
      <Tab.Screen name="Manager Home" component={ManagerHome} />
      <Tab.Group mode="modal">
        <Tab.Screen name="Add Task" component={AddTaskScreen} options={{ presentation: 'modal' }}/>
      </Tab.Group>
      <Tab.Screen name="Employee Calendar" component={ManagerCalendar} />
    </Tab.Navigator>
  );
};

export default ManagerHomeScreen;