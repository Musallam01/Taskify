import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, baseURL } from '../../constants';
import SwipeButton from 'rn-swipe-button';
import axios from 'axios';

const EmployeeCurrentTask = ({ route, navigation }) => {
  const [taskStarted, setTaskStarted] = useState(false);
  const [swipeEnabled, setSwipeEnabled] = useState(true);
  const [taskStatus, setTaskStatus] = useState('');
  const { task, updateTaskStatus } = route.params;

  useEffect(() => {
    if (task.status === 'in-progress') {
      setTaskStarted(true);
      setSwipeEnabled(false);
    } else {
      setTaskStarted(false);
      setSwipeEnabled(true);
    }
    setTaskStatus(task.status);
  }, [task.status]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    return `${day}/${month}`;
  };

  const handleFinishTask = async () => {
    const url = `${baseURL}/tasks/${task._id}/update-status`;
    console.log('Finishing task at URL:', url);
    try {
      const response = await axios.patch(url, { status: 'finished' });
      if (response.status === 200) {
        setTaskStatus('finished');
        updateTaskStatus(task._id, 'finished');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error finishing task:', error);
    }
  };  

  const startTask = async () => {
    const url = `${baseURL}/tasks/${task._id}/update-status`;
    console.log('Starting task at URL:', url);
    try {
      const response = await axios.patch(url, { status: 'in-progress' });
      if (response.status === 200) {
        setTaskStarted(true);
        setSwipeEnabled(false);
        setTaskStatus('in-progress');
        updateTaskStatus(task._id, 'in-progress');
      }
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };
  

  return (
    <View style={styles.mainView}>
      <View style={styles.topView}>
        <Text style={styles.titleText}>{task.title}</Text>
        <View style={styles.line} />
        <Text style={styles.descriptionText}>{task.description}</Text>
        <View style={styles.line} />
        <Text style={styles.dueOnText}>Due on <Text style={styles.dateText}>{formatDate(task.dueDate)}</Text></Text>
      </View>
      <View style={styles.botView}>
        <Text style={{ alignSelf: "flex-start", marginBottom: 40, fontSize: 22 }}>Assigned by: {task.assignedBy}</Text>
        <Text style={{ alignSelf: "flex-end", marginBottom: 40, fontSize: 22 }}>Fees: JOD {task.requiredFees}</Text>
        <Text style={{ alignSelf: "center", marginBottom: 40, fontSize: 22 }}>{task.customerAddress}</Text>
        <Text style={{ alignSelf: "flex-start", marginBottom: 40, fontSize: 22 }}>0{task.customerPhoneNumber}</Text>
        <View>
          <SwipeButton
            thumbIconBackgroundColor={COLORS.PRIMARY_COLOR_2}
            thumbIconComponent={() => (
              <View style={styles.customThumb}>
                <Image
                  source={require('../../assets/icons/iconSwipeRight.png')}
                />
              </View>
            )}
            railBackgroundColor={COLORS.SECONDARY_COLOR_2}
            railBorderColor={COLORS.SECONDARY_COLOR_1}
            height={70}
            onSwipeSuccess={startTask}
            disabled={!swipeEnabled}
            title="Swipe to start Task"
            titleFontSize={18}
            railStyles={{ backgroundColor: COLORS.PRIMARY_COLOR_2, height: 70 }}
          />
        </View>
        <View style={styles.bottomButtonsView}>
          <TouchableOpacity style={styles.finishTaskView} onPress={handleFinishTask} disabled={!taskStarted}>
            <Text style={styles.finishTaskText}>Finish Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.delayTaskView} onPress={() => navigation.goBack()} disabled={!taskStarted}>
            <Text style={styles.delayTaskText}>Delay Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EmployeeCurrentTask;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: COLORS.PRIMARY_COLOR_1,
    flex: 1,
    justifyContent: "space-between"
  },
  botView: {
    height: "80%",
    backgroundColor: COLORS.SECONDARY_COLOR_1,
    width: "100%",
    borderRadius: 35,
    paddingHorizontal: "10%",
    paddingTop: 35
  },
  topView: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    alignSelf: "center",
    padding: 40
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    color: COLORS.SECONDARY_COLOR_1,
    width: "95%",
  },
  descriptionText: {
    fontSize: 20,
    color: COLORS.SECONDARY_COLOR_1,
    borderTopWidth: 3,
  },
  line: {
    width: 250,
    height: 2,
    backgroundColor: COLORS.SECONDARY_COLOR_1,
    marginRight: 10,
    borderRadius: 15,
    marginVertical: 10
  },
  dueOnText: {
    fontSize: 30,
    color: COLORS.SECONDARY_COLOR_1
  },
  dateText: {
    fontWeight: "800"
  },
  bottomButtonsView: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "space-between"
  },
  finishTaskView: {
    backgroundColor: COLORS.PRIMARY_COLOR_1,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15
  },
  delayTaskView: {
    backgroundColor: "#DA291C",
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15
  },
});