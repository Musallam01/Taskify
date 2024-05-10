import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Taskify/screens/LoginScreen';
import ManagerHomeScreen from '../Taskify/screens/ManagerHomeScreen';
import EmployeeHomeScreen from '../Taskify/screens/EmployeeHomeScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ManagerStack" component={ManagerStackScreen} />
        <Stack.Screen name="EmployeeStack" component={EmployeeStackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const ManagerStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ManagerHome" component={ManagerHomeScreen} />
      {/* Add more screens for manager navigation */}
    </Stack.Navigator>
  );
};

const EmployeeStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EmployeeHome" component={EmployeeHomeScreen} />
      {/* Add more screens for employee navigation */}
    </Stack.Navigator>
  );
};

export default Navigation;