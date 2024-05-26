import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const ManagerRewardScreen = () => {
    const [tasks, setTasks] = useState([
      {
        name: 'Ahmad Ali installed a new smart refrigerator',
        dueDate: '28/5',
        finishedDate: '28/5',
      },
      {
        name: 'Odeh Salameh finished fixing LG TV',
        dueDate: '26/5',
        finishedDate: '27/5',
      },
      {
        name: 'Yazan Jameel installed a new dish washer',
        dueDate: '24/5',
        finishedDate: '24/5',
      },
      {
        name: 'Odeh Salameh finished fixing LG TV',
        dueDate: '26/5',
        finishedDate: '27/5',
      },
      {
        name: 'Elias Samarah finished fixing Huawei fan',
        dueDate: '24/5',
        finishedDate: '24/5',
      },
    ]);
  
    const handleReward = (task) => {
      // Implement reward logic here (e.g., send a notification, update task status)
      console.log(`Rewarding ${task.name}`);
    };
  
    return (
      // <View style={styles.container}>
      //   <View style={styles.header}>
      //     <TouchableOpacity style={styles.backButton}>
      //       <Text>Icon</Text>
      //     </TouchableOpacity>
      //     <View style={styles.checkIcon}>
      //       <Text>Icon</Text>
      //     </View>
      //     <Text style={styles.headerText}>Fadi</Text>
      //   </View>
      //   <View style={styles.tasksContainer}>
      //     {tasks.map((task, index) => (
      //       <View style={styles.task} key={index}>
      //         <Text style={styles.taskTitle}>{task.name}</Text>
      //         <Text style={styles.taskInfo}>
      //           Assigned due date: {task.dueDate}
      //         </Text>
      //         <Text style={styles.taskInfo}>
      //           Finished on: {task.finishedDate}
      //         </Text>
      //         <TouchableOpacity
      //           style={styles.rewardButton}
      //           onPress={() => handleReward(task)}
      //         >
      //           <Text style={styles.rewardButtonText}>Reward Ahmad</Text>
      //         </TouchableOpacity>
      //       </View>
      //     ))}
      //   </View>
      // </View>
      <View>
        <Text>Hello</Text>
      </View>
    );
}

export default ManagerRewardScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  checkIcon: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tasksContainer: {
    flex: 1,
  },
  task: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskInfo: {
    fontSize: 14,
    marginBottom: 10,
  },
  rewardButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  rewardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});