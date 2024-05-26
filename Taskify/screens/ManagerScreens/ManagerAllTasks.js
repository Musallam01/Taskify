import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { getTasks } from '../../api/api';
import { useNavigation } from '@react-navigation/native';
import InformationDashboard from '../../components/InformationDashboard';

// AsyncStorage
import { getUserInfo } from '../../utils/storageUtils';

// Constants
import { COLORS, baseURL } from '../../constants';

const ManagerAllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [employees, setEmployees] = useState({});
  const [managers, setManagers] = useState({});

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = await getUserInfo();
      setUserInfo(user);
    };
    fetchUserInfo();

    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data.reverse()); // Reverse the tasks array
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${baseURL}/employees`);
        const employeesMap = response.data.reduce((acc, user) => {
          acc[user._id] = user;
          return acc;
        }, {});
        setEmployees(employeesMap);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchTasks();
    fetchEmployees();
  }, []);

  if (!userInfo) {
    return <Text>Loading...</Text>;
  }

  const Header = () => (
    <View style={{ padding: 10 }}>
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Image source={require('../../assets/logoOnly.png')} style={styles.logo} />
        <View>
          <Text style={{ fontSize: 27, fontWeight: "bold" }}>{userInfo.firstName}</Text>
        </View>
      </View>
      <InformationDashboard />
      <Text style={styles.allTasksTitleText}>All Tasks</Text>
    </View>
  );

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric' });
    } catch (error) {
      console.error('Invalid date format', error);
      return 'Invalid date';
    }
  };

  const renderItem = ({ item }) => {
    const assignedUser = employees[item.assignedUser];

    return (
      <TouchableOpacity style={styles.itemView}>
        <View style={styles.lineView}>
          <View style={styles.circle} />
          <View style={styles.line} />
        </View>
        <View style={styles.cardView}>
          <View style={styles.cardTopView}>
            <Text style={styles.titleText}>{item.title}</Text>
            <View style={styles.dueDateView}>
              <Text style={styles.dueDateText}>{formatDate(item.dueDate)}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
          <View>
            {assignedUser ? (
              <Text style={styles.assignedUserText}>{`Assigned to: ${assignedUser.firstName} ${assignedUser.lastName}`}</Text>
            ) : (
              <Text style={styles.assignedUserText}>User not assigned</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={item => item._id ? item._id.toString() : ""}
      ListHeaderComponent={Header}
      style={styles.flatList}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default ManagerAllTasks;

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 65,
    width: "100%",
    alignSelf: "center",
    paddingBottom: 10,
    alignItems: "center",
    marginBottom: 20
  },
  logo: {
    height: 50,
    width: 50,
    resizeMode: 'center',
  },
  flatList: {
    width: "90%",
    alignSelf: "center",
  },
  allTasksTitleText: {
    marginTop: 50,
    fontSize: 26,
    fontWeight: "bold"
  },
  itemView: {
    padding: 10,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    borderRadius: 20,
  },
  cardView: {
    backgroundColor: `${COLORS.PRIMARY_COLOR_1}60`,
    width: "90%",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_1,
    padding: 10
  },
  lineView: {
    alignItems: "center"
  },
  line: {
    width: 4,
    height: 125,
    backgroundColor: COLORS.PRIMARY_COLOR_1,
    marginRight: 10,
    borderRadius: 15
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_1,
    marginRight: 10,
    marginBottom: 3,
  },
  cardTopView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dueDateView: {
    backgroundColor: COLORS.PRIMARY_COLOR,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15
  },
  titleText:{
    fontSize: 15,
    fontWeight: "600"
  },
  descriptionText:{
    fontSize: 15,
    marginVertical: 20
  },
  assignedUserText:{
    fontSize: 15
  },
});