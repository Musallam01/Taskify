import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getUserInfo } from '../../utils/storageUtils';
import { COLORS, baseURL } from '../../constants';
import { Calendar } from 'react-native-calendars';
import EmployeeInformationDashboard from '../../components/EmployeeInformationDashboard';
import axios from 'axios'; // Assuming you have axios installed

const EmployeeCalendar = ({ route }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [dateSelected, setDateSelected] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [markedDatesObj, setMarkedDatesObj] = useState({})

  const { handleLogout } = route.params;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserInfo();
        setUserInfo(user);
        const tasksResponse = await axios.get(`${baseURL}/tasks?assignedUser=${user._id}`);
        const tasksData = tasksResponse.data;
        updateMarkedDates(tasksData);
      } catch (error) {
        console.error('Error fetching user info or tasks:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchTasksAndPopulateMarkedDates = async () => {
      try {
        const response = await axios.get(`${baseURL}/tasks`);
        const tasksData = response.data;

        // Filter tasks based on assignedUser matching userInfo._id
        const userTasks = tasksData.filter(task => task.assignedUser === userInfo._id);

        // Transform userTasks into markedDatesObj
        const markedDates = {};
        userTasks.forEach(task => {
          const taskDate = new Date(task.dueDate); // Assuming task.dueDate is your date field
          const formattedDate = taskDate.toISOString().split('T')[0];
          markedDates[formattedDate] = { marked: true };
        });

        // Set markedDatesObj in state
        setMarkedDatesObj(markedDates);
      } catch (error) {
        console.error('Error fetching tasks or populating marked dates:', error);
      }
    };

    if (userInfo) {
      fetchTasksAndPopulateMarkedDates();
    }
  }, [userInfo]);
  

  if (!userInfo) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={handleLogout}>
          <Image source={require('../../assets/logoOnly.png')} style={styles.topLogo} />
          <Text style={styles.userNameText}>{userInfo.firstName}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerRight}>
          <Image source={require('../../assets/icons/iconNotification.png')} style={styles.notIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mainView}>
        <EmployeeInformationDashboard />
        <Calendar
          onDayPress={(day) => {
            setDateSelected(day.dateString);
          }}
          markedDates={markedDatesObj}
          style={{
            borderWidth: 3,
            borderColor: COLORS.PRIMARY_COLOR_1,
            borderRadius: 20,
            height: 370,
            marginTop: 45,
          }}
          theme={{
            selectedDayBackgroundColor: COLORS.PRIMARY_COLOR_2,
          }}
        />
      </ScrollView>
    </>
  );
};

export default EmployeeCalendar;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    paddingTop: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 65,
    width: '90%',
    alignSelf: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topLogo: {
    width: 55,
    height: 55,
    marginRight: 10,
  },
  userNameText: {
    fontSize: 27,
    fontWeight: 'bold',
  },
  headerRight: {
    justifyContent: 'center',
  },
  notIcon: {
    height: 27,
    width: 27,
  },
});