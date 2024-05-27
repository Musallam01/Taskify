//React Native Imports
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, TouchableWithoutFeedback, Modal, FlatList, Keyboard, Touchable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

//AsyncStorage
import { getUserInfo } from '../../utils/storageUtils';

//Constants
import { COLORS } from '../../constants';
import { baseURL } from '../../constants';

//Components
import InformationDashboard from '../../components/InformationDashboard';
import DateTimePicker from '@react-native-community/datetimepicker';

//Axios
import axios from 'axios';

// Toast imports
import Toast from 'react-native-toast-message';

const AddTaskScreen = ({route}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [employee, setEmployee] = useState('Specify Later');
  const [employeeList, setEmployeeList] = useState([]);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeButtonText, setEmployeeButtonText] = useState('Choose Employee');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [taskTitle, setTaskTitle] = useState('');
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [taskType, setTaskType] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [requiredFees, setRequiredFees] = useState('');

  const { handleLogout } = route.params;

  const navigation = useNavigation();

  const showErrorToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Please check all inputs',
      position: 'bottom'
    });
  }
  const showSuccessToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Task Created Successfully',
      position: 'bottom',
    });
  }


  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`${baseURL}/employees`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee data:', error);
      throw new Error('Error fetching employee data');
    }
  };

  const fetchEmployeeList = async () => {
    try {
      const employees = await fetchEmployeeData();
      setEmployeeList(employees);
    } catch (error) {
      console.error('Error fetching employee list:', error);
    }
  };

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setEmployee(`${employee.firstName} ${employee.lastName}`);
    setShowEmployeeList(false);
    setEmployeeButtonText(`${employee.firstName} ${employee.lastName}`);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = await getUserInfo();
      setUserInfo(user);
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <Text>Loading...</Text>;
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setShowEmployeeList(false);
  };

  const renderEmployeeItem = ({ item }) => (
    <TouchableOpacity style={styles.flatListEmployeeView} onPress={() => handleEmployeeSelect(item)}>
      <Text style={styles.flatListEmployeeText}>{`${item.firstName} ${item.lastName}`}</Text>
    </TouchableOpacity>
  );

  const handleSpecifyLater = () => {
    setSelectedEmployee(null);
    setEmployee('Specify Later');
    setEmployeeButtonText('Choose Employee');
  };

  const createTask = async () => {
    try {
      const taskData = {
        title: taskTitle,
        customerPhoneNumber,
        customerAddress,
        taskType,
        assignedUser: selectedEmployee ? selectedEmployee._id : null,
        assignedBy: userInfo._id,
        dueDate: selectedDate,
        description: taskDescription,
        requiredFees: Number(requiredFees), // Convert to number if needed
      };

      const response = await axios.post(`${baseURL}/tasks`, taskData);
      if (response.status === 201) {
        showSuccessToast();
        setRequiredFees('');
        setTaskDescription('');
        setTaskType('');
        setCustomerAddress('');
        setCustomerPhoneNumber('');
        setTaskTitle('');
        setSelectedDate('');
        navigation.navigate("ManagerAllTasks")
        
      } else {
        console.error('Error creating task:', response.data);
        showErrorToast();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      showErrorToast();
    }
  };
  
  const handleDateChange = (event, date) => {
    if (event.type === 'set') {
      setSelectedDate(date || new Date());
    }
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft}>
          <Image source={require('../../assets/logoOnly.png')} style={styles.topLogo} onPress={handleLogout}/>
          <Text style={styles.userNameText}>{userInfo.firstName}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerRight}>
          <Image source={require('../../assets/icons/iconNotification.png')} style={styles.notIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ alignItems: "center", width: "90%", alignSelf: "center" }} showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          extraScrollHeight={100}
          canCancelContentTouches={false}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <>
              <InformationDashboard />
              <TextInput
                style={styles.textInput1}
                placeholder='Task Title'
                value={taskTitle}
                onChangeText={(text) => setTaskTitle(text)}
              />
              <TextInput
                style={styles.textInput2}
                placeholder='Customer Phone Number'
                value={customerPhoneNumber}
                onChangeText={(text) => setCustomerPhoneNumber(text)}
              />
              <TextInput
                style={styles.textInput1}
                placeholder='Customer Address'
                value={customerAddress}
                onChangeText={(text) => setCustomerAddress(text)}
              />
              <TextInput
                style={styles.textInput2}
                placeholder='Task Type'
                value={taskType}
                onChangeText={(text) => setTaskType(text)}
              />
              <View style={styles.empSelectView}>
                <TouchableOpacity 
                  style={[styles.empSelect, selectedEmployee && styles.empSelected]} 
                  onPress={() => setShowEmployeeList(true)}>
                  <Text style={styles.empSelectText}>{employeeButtonText}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.empSelect, !selectedEmployee && styles.empSelected]} 
                  onPress={handleSpecifyLater}>
                  <Text style={styles.empSelectText}>Specify Later</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.textInputDate} onPress={() => setOpenDatePicker(true)}>
                  <Text style={styles.dateText}>Choose Due Date</Text>
                  
                  <DateTimePicker
                    value={selectedDate || new Date()}
                    mode='date'
                    display='default'
                    onChange={handleDateChange}
                  />
               
              </TouchableOpacity>
              <TextInput
                style={styles.textInput1}
                placeholder='Task Description'
                value={taskDescription}
                onChangeText={(text) => setTaskDescription(text)}
              />
              <TextInput
                style={[styles.textInputFees, { marginBottom: 20 }]}
                placeholder='Required Fees'
                value={requiredFees}
                onChangeText={(text) => setRequiredFees(text)}
              />  
              <TouchableOpacity style={styles.addTaskButton} onPress={async () => await createTask()}>
                <Text style={styles.addTaskText}>Create new Task</Text>
              </TouchableOpacity>



              <Modal
                animationType="slide"
                transparent={true}
                visible={showEmployeeList}
                onRequestClose={() => {
                  setShowEmployeeList(!showEmployeeList);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <FlatList
                      data={employeeList}
                      keyExtractor={item => item._id}
                      renderItem={renderEmployeeItem}
                      ListFooterComponent={
                        <TouchableOpacity
                          style={[styles.button, styles.buttonClose]}
                          onPress={() => setShowEmployeeList(!showEmployeeList)}>
                          <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>}
                    />
                  </View>
                </View>
              </Modal>
            </>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </ScrollView>
    </>
  )
}

export default AddTaskScreen

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 65,
    width: "90%",
    alignSelf: "center",
    paddingBottom: 20
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
  textInput1: {
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_1,
    width: "100%",
    height: 55,
    borderRadius: 25,
    marginVertical: 20,
    fontSize: 18,
    paddingLeft: 20
  },
  empSelectView: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 20
  },
  empSelect: {
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_1,
    borderRadius: 25,
    width: "48%",
    height: 55,
    alignItems: "center",
    justifyContent: "center"
  },
  empSelected: {
    backgroundColor: COLORS.PRIMARY_COLOR_1,
    borderRadius: 25,
    width: "48%",
    height: 55,
    alignItems: "center",
    justifyContent: "center"
  },
  textInput2: {
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_2,
    width: "100%",
    height: 55,
    borderRadius: 25,
    fontSize: 18,
    paddingLeft: 20
  },
  textInputDate: {
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_2,
    width: "100%",
    height: 55,
    borderRadius: 25,
    fontSize: 18,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  textInputFees: {
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_2,
    width: "100%",
    height: 55,
    borderRadius: 25,
    fontSize: 18,
    paddingLeft: 20
  },
  addTaskButton: {
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    height: 60,
    backgroundColor: COLORS.PRIMARY_COLOR_1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30
  },
  addTaskText: {
    fontSize: 25,
    color: COLORS.SECONDARY_COLOR_1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
    top: 100
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset
    : {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "70%",
    width: "100%",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR_1
  },
  button: {
    borderRadius: 25,
    padding: 10,
    elevation: 2,
    backgroundColor: COLORS.PRIMARY_COLOR_2,
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonClose: {
    backgroundColor: COLORS.PRIMARY_COLOR_2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  flatListEmployeeView: {
    borderBottomWidth: 2,
    borderColor: "#00000015",
    paddingBottom: 20,
    marginBottom: 20,
    alignItems: "center"
  },
  flatListEmployeeText: {
    fontSize: 18
  },
  empSelectText:{
    fontSize: 17
  },
  dateText:{
    fontSize: 18
  }
});