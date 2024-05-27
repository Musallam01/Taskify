import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { getTasks } from '../../api/api';
import { useNavigation } from '@react-navigation/native';

// AsyncStorage
import { getUserInfo } from '../../utils/storageUtils';

// Constants
import { COLORS, baseURL } from '../../constants';
import { TextInput } from 'react-native-paper';

const ManagerRewardScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [employees, setEmployees] = useState({});
  const [managers, setManagers] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

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
        setTasks(data.reverse());
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
          <Image style={{ right: 10 }} source={require('../../assets/icons/iconGoBack.png')} />
        </TouchableOpacity>
        <Image source={require('../../assets/logoOnly.png')} style={styles.logo} />
        {userInfo ? (
          <View>
            <Text style={{ fontSize: 27, fontWeight: "bold" }}>{userInfo.firstName}</Text>
          </View>
        ) : (
          <View><Text>Null</Text></View>
        )}
      </View>
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

  const renderItem = ({ item, index }) => {
    const assignedUser = employees[item.assignedUser];
    const itemStyle = index % 2 === 0 ? styles.cardView : styles.cardViewGreen;
    const dateStyle = index % 2 === 0 ? styles.dueDateView : styles.dueDateViewGreen;

    return (
      <View style={styles.itemView}>
        <View style={itemStyle}>
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
            {assignedUser ? (
              <Text style={styles.assignedUserText}>{`Assigned to: ${assignedUser.firstName} ${assignedUser.lastName}`}</Text>
            ) : (
              <Text style={styles.assignedUserText}>User not assigned</Text>
            )}
          </View>
          <TouchableOpacity style={styles.rewardButton} onPress={()=> setModalVisible(true)}>
            {assignedUser && (
              <Text style={styles.rewardButtonText}>Reward {assignedUser.firstName}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
  <>
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={item => item._id ? item._id.toString() : ""}
      ListHeaderComponent={Header}
      style={styles.flatList}
      showsVerticalScrollIndicator={false}
    />

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
            <View>
              <TextInput
                placeholder='Select Amount'
                keyboardType='numeric'
              />
            </View>
            <View style={styles.modalButtonsView}>
              <TouchableOpacity
                  style={styles.modalButtons}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={[styles.buttonTextStyle, {backgroundColor: "#DA291C"}]}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtons}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={[styles.buttonTextStyle, {backgroundColor: COLORS.PRIMARY_COLOR_1}]}>Reward</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>

      </Modal>
  </>
  );
}

export default ManagerRewardScreen;

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
  cardView: {
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    width: "100%",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_1,
    padding: 10,
    justifyContent: "space-between",
    height: 170,
    marginBottom: 20,
  },
  cardViewGreen: {
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    width: "100%",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_2,
    padding: 10,
    justifyContent: "space-between",
    height: 170,
    marginBottom: 20
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
  lineGreen: {
    width: 4,
    height: 125,
    backgroundColor: COLORS.PRIMARY_COLOR_2,
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
  circleGreen: {
    width: 20,
    height: 20,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_2,
    marginRight: 10,
    marginBottom: 3,
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
    marginVertical: 5
  },
  assignedUserText: {
    fontSize: 15
  },
  rewardButton: {
    alignSelf: "center",
    backgroundColor: COLORS.PRIMARY_COLOR_1,
    padding: 10,
    marginTop: 10,
    borderRadius: 15
  },
  rewardButtonText: {
    fontSize: 18,
    fontWeight: "500"
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
  modalButtonsView:{
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  modalButtons:{
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: "100%",
    borderRadius: 15,
  }
});