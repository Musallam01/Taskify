//React Imports
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth Screen Imports
import LoginScreen from './screens/LoginScreen';

// Manager Screens Imports
import ManagerStack from './screens/ManagerScreens/ManagerStack';
import ManagerHomeScreen from "./screens/ManagerScreens/ManagerHome";
import ManagerCalendar from './screens/ManagerScreens/ManagerCalendar';
import AddTaskScreen from './screens/ManagerScreens/ManagerAddTaskScreen';
import ManagerAllEmployees from './screens/ManagerScreens/ManagerAllEmployees';
import ManagerAllTasks from './screens/ManagerScreens/ManagerAllTasks';
import ManagerEmployeeProfile from './screens/ManagerScreens/ManagerEmployeeProfile';
import ManagerReward from './screens/ManagerScreens/ManagerReward';

// Employee Screens Imports
import EmployeeStack from './screens/EmployeeScreens/EmployeeStack';
import EmployeeHome from './screens/EmployeeScreens/EmployeeHome';
import EmployeeEarnings from './screens/EmployeeScreens/EmployeeEarnings';
import EmployeeCalendar from './screens/EmployeeScreens/EmployeeCalendar';
import EmployeeCurrentTask from './screens/EmployeeScreens/EmployeeCurrentTask';

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
              <Stack.Screen name="ManagerAllEmployees" component={ManagerAllEmployees} />
              <Stack.Screen name="ManagerAllTasks" component={ManagerAllTasks} />
              <Stack.Screen name="ManagerEmployeeProfile" component={ManagerEmployeeProfile} />              
              <Stack.Screen name="ManagerReward" component={ManagerReward} />
              <Stack.Screen name="ManagerCalendar" component={ManagerCalendar} />
              <Stack.Group>
                <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ presentation: 'modal' }} />
              </Stack.Group>
            </>
          ) : (
            <>
              {/* The Employee's Stack */}
              <Stack.Screen name="EmployeeStack" component={EmployeeStack} />
              <Stack.Screen name="EmployeeHome" component={EmployeeHome} />
              <Stack.Screen name="EmployeeEarnings" component={EmployeeEarnings} />
              <Stack.Screen name="EmployeeCalendar" component={EmployeeCalendar} />
              <Stack.Screen name="EmployeeCurrentTask" component={EmployeeCurrentTask} />
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