import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { COLORS, baseURL } from '../constants';
import { getUserInfo } from '../utils/storageUtils';

const EmployeeInformationDashboard = () => {
  const [userRating, setUserRating] = useState('');
  const [tasksLeft, setTasksLeft] = useState(0);
  const [userStatus, setUserStatus] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = await getUserInfo();
      setUserInfo(user);
      setEmployeeId(user._id);
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchUserData(); // Call fetchUserData when employeeId is valid
      fetchTasks(); // Call fetchTasks to get tasks for the user
    }
  }, [employeeId]); // Make sure to pass employeeId as a dependency

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseURL}/user/${employeeId}`);
      const { rating, status } = response.data;
      setUserRating(rating);
      setUserStatus(status);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${baseURL}/user/${employeeId}/tasks`);
      const tasks = response.data;
      setTasksLeft(tasks.length);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleStatusChange = async () => {
    try {
      const newStatus = userStatus === 'Online' ? 'Offline' : 'Online';
      await axios.put(`${baseURL}/user/${employeeId}/status`, { status: newStatus });
      setUserStatus(newStatus);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.infoDashboardView}>
      <View style={styles.infoDashboardViews}>
        <Text style={styles.infoDashboardTexts}>Your Rating: {userRating}</Text>
      </View>
      <View style={styles.infoDashboardViews}>
        <Text style={styles.infoDashboardTexts}>Tasks Left: {tasksLeft}</Text>
      </View>
      <View style={styles.infoDashboardViews}>
        <Text style={styles.infoDashboardTexts}>Change your status: </Text>
        <TouchableOpacity style={styles.statusView} onPress={handleStatusChange}>
          <Text style={styles.infoDashboardTexts}>{userStatus}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmployeeInformationDashboard;

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
    fontSize: 18,
    marginLeft: 0,
  },
  statusButton: {
    padding: 5,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeStatus: {
    backgroundColor: COLORS.SECONDARY_COLOR_2,
  },
  onLeaveStatus: {
    backgroundColor: COLORS.SECONDARY_COLOR_2,
  },
  inactiveStatus: {
    backgroundColor: COLORS.SECONDARY_COLOR_2,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.SECONDARY_COLOR_2,
  },
  statusView: {
    backgroundColor: COLORS.PRIMARY_COLOR_2,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
});