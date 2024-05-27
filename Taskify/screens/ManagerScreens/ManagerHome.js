import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { COLORS, baseURL } from '../../constants';
import { getUserInfo } from '../../utils/storageUtils';

const ManagerHome = ({ route }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [latestTasks, setLatestTasks] = useState([]);
  const [tasks, setTasks] = useState([]);

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
        try {
            const response = await axios.get(`${baseURL}/api/tasks`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };
    fetchTasks();
}, []);

  const finishedTasks = tasks.filter(task => task.status === 'finished');

  if (!userInfo) {
    return <Text>Loading...</Text>;
  }

  const renderLatestTask = ({ item }) => (
    <View style={styles.latestTaskItem}>
      <Text style={styles.latestTaskText}>{item.assignedUser.firstName}{item.assignedUser.lastName} - {item.title}</Text>
    </View>
  );


  return (
    <>
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerLeft} onPress={handleLogout}>
                <Image source={require('../../assets/logoOnly.png')} style={styles.topLogo}/>
                <Text style={styles.userNameText}>{userInfo.firstName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerRight}>
                <Image source={require('../../assets/icons/iconNotification.png')} style={styles.notIcon} />
            </TouchableOpacity>
        </View>
        <ScrollView style={styles.mainView}>
            <View style={styles.quickActionView}>

                <View style={styles.upperButtons}>
                    <TouchableOpacity style={styles.tasksButton} onPress={()=> navigation.navigate("ManagerAllTasks")}>
                        <Image source={require('../../assets/icons/iconTasks.png')} />
                        <Text style={styles.buttonsTexts}>Tasks</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.employeesButton} onPress={()=> navigation.navigate("ManagerAllEmployees")}>
                        <Image source={require('../../assets/icons/iconEmployees.png')}/>
                        <Text style={styles.buttonsTexts}>Employees</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.lowerButtons}>
                    <TouchableOpacity style={styles.rewardsButton} onPress={()=> navigation.navigate("ManagerReward")}>
                        <Image source={require('../../assets/icons/iconRewards.png')} />
                        <Text style={styles.buttonsTexts}>Rewards</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reviewsButton}>
                        <Image source={require('../../assets/icons/iconReviews.png')} />
                        <Text style={styles.buttonsTexts}>Reviews</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.activitesView}>
                <View style={styles.activitiesTitleView}>
                    <Image source={require('../../assets/icons/iconActivities.png')} />
                    <Text style={styles.activitiesTitleText}> Latest Activities</Text>
                </View>
                <FlatList
                    data={finishedTasks.slice(0, 10)}
                    renderItem={renderLatestTask}
                    keyExtractor={(item) => item._id ? item._id.toString() : ''}
                    showsVerticalScrollIndicator={false}
                />
                </View>
            </View>
        </ScrollView>
    </>
  )
}

export default ManagerHome

const styles = StyleSheet.create({
    mainView:{
        flex: 1,
        width: "90%",
        alignSelf: "center",
    },
    header:{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 65,
        width: "90%",
        alignSelf: "center",
        paddingBottom: 10
    },
    headerLeft:{
        flexDirection: "row",
        alignItems: "center"
    },
    topLogo:{
        width: 55,
        height: 55,
        marginRight: 10
    },
    userNameText:{
        fontSize: 27,
        fontWeight: "bold"
    },
    headerRight:{
        justifyContent: "center"
    },
    notIcon:{
        height: 27,
        weight: 27
    },
    quickActionView:{
        alignItems: "center",
        width: "100%",
        marginTop: 40
    },
    upperButtons:{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    lowerButtons:{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 23
    },
    tasksButton:{
        backgroundColor: COLORS.SECONDARY_COLOR_2,
        borderRadius: 15,
        width: 165,
        height: 165,       
        borderLeftColor: COLORS.PRIMARY_COLOR_1,
        borderLeftWidth: 10,
        paddingTop: 10,
        paddingLeft: 10,
        justifyContent: "space-around"
    },
    employeesButton:{
        backgroundColor: COLORS.SECONDARY_COLOR_2,
        borderRadius: 15,
        width: 165,
        height: 165,
        borderLeftColor: COLORS.PRIMARY_COLOR_2,
        borderLeftWidth: 10,
        padding: 20,
        paddingTop: 10,
        paddingLeft: 10,
        justifyContent: "space-around"
    },
    rewardsButton:{
        backgroundColor: COLORS.SECONDARY_COLOR_2,
        borderRadius: 15,
        width: 165,
        height: 165,
        borderLeftColor: COLORS.PRIMARY_COLOR_2,
        borderLeftWidth: 10,
        padding: 20,
        paddingTop: 10,
        paddingLeft: 10,
        justifyContent: "space-around"
    },
    reviewsButton:{
        backgroundColor: COLORS.SECONDARY_COLOR_2,
        borderRadius: 15,
        width: 165,
        height: 165,
        borderLeftColor: COLORS.PRIMARY_COLOR_1,
        borderLeftWidth: 10,
        padding: 20,
        paddingTop: 10,
        paddingLeft: 10,
        justifyContent: "space-around"
    },
    buttonsTexts:{
        fontSize: 20,
        fontWeight: "500",
        left: 5
    },
    activitesView:{
        marginTop: 35
    },
    activitiesTitleView:{
        flexDirection: "row",
        alignItems: "center"
    },
    activitiesTitleText:{
        fontSize: 24,
        fontWeight: "700"
    },
    latestTaskItem:{
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
    latestTaskText:{
        fontSize: 20
    }
})