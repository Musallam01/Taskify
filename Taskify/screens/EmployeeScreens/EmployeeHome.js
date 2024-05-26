import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import axios from 'axios';
import { getUserInfo } from '../../utils/storageUtils';
import { COLORS, baseURL } from '../../constants';
import EmployeeInformationDashboard from '../../components/EmployeeInformationDashboard';
import { useNavigation } from '@react-navigation/native';

const EmployeeHomeScreen = () => {
  const [userInfo, setUserInfo] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const filteredTasks = tasks.filter(task => task.assignedUser === currentUserID);

    const handleTaskPress=(task)=>{
      navigation.navigate("EmployeeCurrentTask", {task});
    }

    const renderItem = ({ item, index }) => {

      const itemStyle = index % 2 === 0 ? styles.cardView : styles.cardViewGreen;
      const dateStyle = index % 2 === 0 ? styles.dueDateView : styles.dueDateViewGreen
      return (
        <TouchableOpacity style={itemStyle} onPress={()=>handleTaskPress(item)}>
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

  const ItemSeparator = () => <View style={{ width: 10 }} />;

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft}>
          <Image source={require('../../assets/logoOnly.png')} style={styles.topLogo} />
          <Text style={styles.userNameText}>{userInfo.firstName}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerRight}>
          <Image source={require('../../assets/icons/iconNotification.png')} style={styles.notIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.mainView}>
        <EmployeeInformationDashboard/>
        <View style={styles.flatListMainView}>
          <Text style={styles.yourTasksText}>Your Tasks</Text>
          <FlatList
            data={filteredTasks}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            ItemSeparatorComponent={ItemSeparator}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.lastTasksView}>
          <Image source={require('../../assets/icons/iconTasks.png')} />
          <Text style={styles.lastTasksText}> Your Last Tasks</Text>
        </View>
      </ScrollView>
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
    marginTop: 35
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
  dueDateViewGreen:{
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
  lastTasksView:{
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30
  },
  lastTasksText:{
    fontSize: 24,
    fontWeight:"600"
  }
});