import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth Screen Imports
import LoginScreen from './screens/LoginScreen';

// Manager Screens Imports
import ManagerHomeScreen from "./screens/ManagerScreens/ManagerHomeScreen"
import ManagerCalendar from './screens/ManagerScreens/ManagerCalendarScreen';
import AddTaskScreen from './screens/ManagerScreens/ManagerAddTaskScreen';
import ManagerStack from './screens/ManagerScreens/ManagerStack'

// Employee Screens Imports
import EmployeeHomeScreen from './screens/EmployeeScreens/EmployeeHomeScreen';
import EmployeeStack from './screens/EmployeeScreens/EmployeeStack';

const Stack = createStackNavigator();

const Navigation = () => {

  const [userRole, setUserRole] = useState(null);

  const handleUserRole = (role) => {
    setUserRole(role);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {userRole ? (
          userRole === 'manager' ? (
            <>
              {/* The Manager's Stack */}
              <Stack.Screen name="ManagerStack" component={ManagerStack} />
              <Stack.Screen name="ManagerHomeScreen" component={ManagerHomeScreen} />
              <Stack.Screen name="ManagerCalendar" component={ManagerCalendar} />
              <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ presentation: 'modal' }} />
            </>
          ) : (
            <>
              {/* The Employee's Stack */}
              <Stack.Screen name="EmployeeStack" component={EmployeeStack} />
              <Stack.Screen name="EmployeeHomeScreen" component={EmployeeHomeScreen} />
            </>
          )
        ) : (
          <Stack.Screen name="Login">
            {/* The Log In Screen that is displayed when the application is first launched */}
            {(props) => <LoginScreen {...props} handleUserRole={handleUserRole} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;