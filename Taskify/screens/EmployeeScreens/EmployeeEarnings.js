import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList, Modal } from 'react-native';
import { getUserInfo } from '../../utils/storageUtils';
import { COLORS, baseURL } from '../../constants';
import axios from 'axios';
import EmployeeInformationDashboard from '../../components/EmployeeInformationDashboard';

const EmployeeEarnings = ({ route }) => {
  const { handleLogout } = route.params;
  const [userInfo, setUserInfo] = useState({});
  const [tasks, setTasks] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [expectedEarnings, setExpectedEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finishedTasks, setFinishedTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserInfo();
        setUserInfo(user);

        const response = await axios.get(`${baseURL}/tasks`);
        const tasksData = response.data;
        setTasks(tasksData);

        calculateEarnings(tasksData, user._id);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFinishedTasks = async () => {
      try {
        const response = await axios.get(`${baseURL}/tasks?status=finished`);
        const allFinishedTasks = response.data;
        const userFinishedTasks = allFinishedTasks.filter(task => task.assignedUser === userInfo._id);
        setFinishedTasks(userFinishedTasks);
      } catch (error) {
        console.error('Error fetching finished tasks:', error);
      }
    };
  
    fetchFinishedTasks();
  }, [userInfo]);
  
  

  const calculateEarnings = (tasksData, userId) => {
    let totalFinishedEarnings = 0;
    let totalExpectedEarnings = 0;

    tasksData.forEach(task => {
      if (task.status === 'finished' && task.assignedUser === userId) {
        totalFinishedEarnings += task.requiredFees;
      } else if (task.status === 'remaining' && task.assignedUser === userId) {
        totalExpectedEarnings += task.requiredFees;
      }
    });

    setTotalEarnings(totalFinishedEarnings);
    setExpectedEarnings(totalExpectedEarnings);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderTaskItem = ({ item, index }) => {
    const itemStyle = index % 2 === 0 ? styles.cardView : styles.cardViewGreen;
    const dateStyle = index % 2 === 0 ? styles.dueDateView : styles.dueDateViewGreen;
    return (
      <TouchableOpacity style={styles.finishedTaskStyle}>
        <View>
          <Text style={styles.finishedText}>
            {item.title}
          </Text>
          <Text>JOD {item.requiredFees}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparator = () => <View style={{ width: 10 }} />;

  return (
    < >
      <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={handleLogout}>
            <Image source={require('../../assets/logoOnly.png')} style={styles.topLogo} />
            <Text style={styles.userNameText}>{userInfo.firstName}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerRight}>
            <Image source={require('../../assets/icons/iconNotification.png')} style={styles.notIcon} />
          </TouchableOpacity>
        </View>

      <ScrollView style={styles.mainView} showsVerticalScrollIndicator={false}>
        <EmployeeInformationDashboard/>

        <View style={styles.financeDashboardView}>
          <Text style={styles.dashboardItemText}>Total Earnings: JOD {totalEarnings}</Text>
          <Text style={styles.dashboardItemText}>Earnings this month: JOD {totalEarnings}</Text>
          <Text style={styles.dashboardItemText}>Average earnings monthly: JOD {totalEarnings} </Text>
          <Text style={[styles.dashboardItemText, {marginBottom: 10}]}>Expected income from current tasks: JOD {expectedEarnings}</Text>
        </View>

        <View style={styles.flatListMainView}>
          <Text style={styles.yourTasksText}>Earnings from last Tasks</Text>
          <FlatList
            data={finishedTasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item._id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={ItemSeparator}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.emptyListText}>No Tasks Finished</Text>}
          />
        </View>
      </ScrollView>
    </>
  )
}

export default EmployeeEarnings

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 65,
    width: "90%",
    alignSelf: "center",
    paddingBottom: 10
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  topLogo: {
    width: 55,
    height: 55,
    marginRight: 10
  },
  userNameText: {
    fontSize: 27,
    fontWeight: "bold"
  },
  headerRight: {
    justifyContent: "center"
  },
  notIcon: {
    height: 27,
    weight: 27
  },
  mainView:{
    width: "90%",
    alignSelf: "center",
    paddingTop: 30
  },
  financeDashboardView:{
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    padding: 10,
    marginTop: 20,
    borderWidth: 3,
    borderRadius: 20,
    borderColor: COLORS.PRIMARY_COLOR_1,
    alignContent: "center"
  },
  dashboardItemText:{
    fontSize: 18,
    marginTop: 10
  },
  flatListMainView: {
    marginTop: 35
  },
  yourTasksText: {
    fontSize: 24,
    fontWeight: "600"
  },
  finishedTaskStyle:{
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    borderWidth: 2,
    borderRadius: 15,
    height: 65,
    marginTop: 20,
    padding: 20,
    width: 349,
    borderColor: COLORS.PRIMARY_COLOR_1,
    justifyContent: "center"
  },
  finishedText:{
    fontSize: 20,
    fontWeight:"500"
  },
  emptyListText:{
    fontSize: 20,
    alignSelf: "center",
    marginTop: 20,
    fontWeight: "bold"
  }
})