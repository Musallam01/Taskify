//React Native Imports
import React from 'react';

//Navigation Imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//Auth Screen Imports
import LoginScreen from './screens/LoginScreen';

//Manager Screens Imports
import ManagerHomeScreen from './screens/ManagerScreens/ManagerStack';
import ManagerHome from './screens/ManagerScreens/ManagerHomeScreen';
import ManagerCalendar from './screens/ManagerScreens/ManagerCalendarScreen';
import AddTaskScreen from './screens/ManagerScreens/ManagerAddTaskScreen';
import ManagerStack from './screens/ManagerScreens/ManagerStack'

//Employee Screens Imports
// import EmployeeHomeScreen from './screens/EmployeeScreens/EmployeeStack';
import EmployeeStack from './screens/EmployeeScreens/EmployeeStack'


const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ManagerHomeScreen" component={ManagerHomeScreen} />
        <Stack.Screen name="ManagerStack" component={ManagerStack} />
        <Stack.Screen name="EmployeeStack" component={EmployeeStack} />
        <Stack.Screen name="ManagerHome" component={ManagerHome} />
        <Stack.Screen name="ManagerCalendar" component={ManagerCalendar} />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="AddTask" component={AddTaskScreen}/>
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};


//This is the proper use, but it's too much hustle and we don't need such organization for the app's purpose
const ManagerStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ManagerHome" component={ManagerHomeScreen} />
    </Stack.Navigator>
  );
};

const EmployeeStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EmployeeHome" component={EmployeeHomeScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;