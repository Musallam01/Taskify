//React Imports
import { StyleSheet, Text, View, Image } from 'react-native'
import React, {useState, useEffect} from 'react'

//Constants
import { baseURL, COLORS } from '../constants'

//Axios
import axios from 'axios'


const InformationDashboard = () => {
    const [tasksRemaining, setTasksRemaining] = useState(0);
    const [unassignedTasks, setUnassignedTasks] = useState(0);
    const [activeEmployees, setActiveEmployees] = useState(0);
    const [tasksInProgress, setTasksInProgress] = useState(0);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const tasksRemainingResponse = await axios.get(`${baseURL}/tasks`);
        const unassignedTasksResponse = await axios.get(`${baseURL}/unassigned-tasks`);
        const activeEmployeesResponse = await axios.get(`${baseURL}/active-employees`);
        const tasksInProgressResponse = await axios.get(`${baseURL}/tasks-in-progress`);
  
        setTasksRemaining(tasksRemainingResponse.data.length);
        setUnassignedTasks(unassignedTasksResponse.data.length);
        setActiveEmployees(activeEmployeesResponse.data.length);
        setTasksInProgress(tasksInProgressResponse.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    return (
      <View style={styles.infoDashboardView}>
        <View style={styles.infoDashboardViews}>
          <Image source={require('../assets/icons/iconRemainingTasks.png')} />
          <Text style={styles.infoDashboardTexts}> {tasksRemaining} Tasks remaining</Text>
        </View>
        <View style={styles.infoDashboardViews}>
          <Image source={require('../assets/icons/iconUnassignedTasks.png')} />
          <Text style={styles.infoDashboardTexts}> {unassignedTasks} Unassigned Tasks</Text>
        </View>
        <View style={styles.infoDashboardViews}>
          <Image source={require('../assets/icons/iconActiveEmployees.png')} />
          <Text style={styles.infoDashboardTexts}> {activeEmployees} Active Employees</Text>
        </View>
        <View style={styles.infoDashboardViews}>
          <Image source={require('../assets/icons/iconActiveTasks.png')} />
          <Text style={styles.infoDashboardTexts}> {tasksInProgress} Tasks in Progress</Text>
        </View>
      </View>
    );
  };
  
  export default InformationDashboard;
  
  const styles = StyleSheet.create({
    infoDashboardView: {
      width: '100%',
      borderColor: COLORS.PRIMARY_COLOR_2,
      borderWidth: 3,
      paddingVertical: 15,
      borderRadius: 15,
      backgroundColor: COLORS.SECONDARY_COLOR_2,
      paddingLeft: 25,
    },
    infoDashboardViews: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoDashboardTexts: {
      fontSize: 15,
    },
  });