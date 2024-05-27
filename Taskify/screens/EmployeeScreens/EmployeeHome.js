import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList, Modal } from 'react-native';
import axios from 'axios';
import { getUserInfo } from '../../utils/storageUtils';
import { COLORS, baseURL } from '../../constants';
import EmployeeInformationDashboard from '../../components/EmployeeInformationDashboard';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmployeeHomeScreen = ({route}) => {
  const [userInfo, setUserInfo] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [task, setTask] = useState({});

  const { handleLogout } = route.params;
  

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = await getUserInfo();
      setUserInfo(user);
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!userInfo._id) {
        console.error('Assigned user ID is undefined');
        return;
      }

      try {
        const response = await axios.get(`${baseURL}/user/${userInfo._id}/tasks`);
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    if (userInfo._id) {
      fetchTasks();
    }
  }, [userInfo]);

  if (!userInfo._id || loading) {
    return <Text>Loading...</Text>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  const currentUserID = userInfo._id;
  const remainingTasks = tasks.filter(task => task.assignedUser === currentUserID && task.status !== 'finished');
  const finishedTasks = tasks.filter(task => task.assignedUser === currentUserID && task.status === 'finished');

  const updateTaskStatus = (taskId, status) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === taskId ? { ...task, status: status } : task
      )
    );
  };

  const handleTaskPress = (task) => {
    navigation.navigate("EmployeeCurrentTask", { task, updateTaskStatus });
  };

  const handleFinishedPress = (taskInfo) => {
    setModalVisible(true);
    setTask(taskInfo)
  };

  const renderTaskItem = ({ item, index }) => {
    const itemStyle = index % 2 === 0 ? styles.cardView : styles.cardViewGreen;
    const dateStyle = index % 2 === 0 ? styles.dueDateView : styles.dueDateViewGreen;
    return (
      <TouchableOpacity style={itemStyle} onPress={() => handleTaskPress(item)}>
        <View style={styles.cardTopView}>
          <Text style={styles.titleText}>{item.title}</Text>
          <View style={dateStyle}>
            <Text style={styles.dueDateText}>{formatDate(item.dueDate)}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>
        <View>
          <Text style={styles.assignedUserText}>Task Fees: {item.requiredFees}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFinishedItem = ({ item, index }) => {
    const itemStyle = index % 2 === 0 ? styles.cardView : styles.cardViewGreen;
    const dateStyle = index % 2 === 0 ? styles.dueDateView : styles.dueDateViewGreen;
    return (
      <TouchableOpacity style={styles.finishedTaskStyle} onPress={() => handleFinishedPress(item)}>
        <View>
          <Text style={styles.finishedText}>
            {item.title}
          </Text>
          <Text>Due Date: {formatDate(item.dueDate)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparator = () => <View style={{ width: 10 }} />;

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
        <View style={styles.flatListMainView}>
          <Text style={styles.yourTasksText}>Your Tasks</Text>
          <FlatList
            data={remainingTasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item._id.toString()}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            ItemSeparatorComponent={ItemSeparator}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.emptyListText}>No Tasks Remaining</Text>}
          />
        </View>

        <View style={styles.lastTasksView}>
          <Image source={require('../../assets/icons/iconTasks.png')} />
          <Text style={styles.lastTasksText}> Your Last Task</Text>
        </View>
        <FlatList
          data={finishedTasks.reverse()}
          renderItem={renderFinishedItem}
          keyExtractor={(item) => item._id.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparator}
          showsHorizontalScrollIndicator={true}
          style={styles.finishedFlatList}
          ListEmptyComponent={<Text style={styles.emptyListText}>No finished tasks</Text>}
        />
      </ScrollView>
      <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
      >

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{task.title}</Text>
            <Text style={styles.modalContentText}>Assigned Due Date:{formatDate(task.dueDate)}</Text>
            <Text style={styles.modalContentText}>Assigned on: {formatDate(task.creationDate)}</Text>
            <Text style={styles.modalContentText}>Customer's Phone Number: 0{task.CustomerPhoneNumber}</Text>
            <Text style={styles.modalContentText}>Fees Collected: {task.requiredFees}</Text>
            <Text style={[styles.modalContentText, {marginBottom: 30}]}>Location: Amman, Al Rabieh, Jebal Atlas St.</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close Task Record</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Modal>
    </>
  );
};

export default EmployeeHomeScreen;

const styles = StyleSheet.create({
  mainView: {
    paddingTop: 30,
    width: "90%",
    alignSelf: "center"
  },
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
  flatListMainView: {
    marginTop: 50
  },
  yourTasksText: {
    fontSize: 20,
    fontWeight: "600"
  },
  cardView: {
    backgroundColor: `${COLORS.PRIMARY_COLOR_1}60`,
    width: 300,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_1,
    padding: 10,
    marginTop: 20
  },
  cardViewGreen: {
    backgroundColor: `${COLORS.PRIMARY_COLOR_2}60`,
    width: 300,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_2,
    padding: 10,
    marginTop: 20
  },
  cardTopView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dueDateView: {
    backgroundColor: COLORS.PRIMARY_COLOR_1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15
  },
  dueDateViewGreen: {
    backgroundColor: COLORS.PRIMARY_COLOR_2,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15
  },
  titleText: {
    fontSize: 15,
    fontWeight: "600"
  },
  descriptionText: {
    fontSize: 15,
    marginVertical: 20
  },
  assignedUserText: {
    fontSize: 15
  },
  lastTasksView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60
  },
  lastTasksText: {
    fontSize: 24,
    fontWeight: "600"
  },
  finishedFlatList:{
    width: "100%",
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: "#00000070"
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.SECONDARY_COLOR_1,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_1
  },
  buttonClose: {
    backgroundColor: COLORS.PRIMARY_COLOR_2,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  textStyle: {
    fontWeight: '600',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 30
  },
  modalContentText:{
    fontSize: 20,
    marginTop: 20
    }
})