//React Native Imports
import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Touchable} from 'react-native'

//AsyncStorage
import { getUserInfo } from '../../utils/storageUtils';

//Constants
import { COLORS, baseURL } from '../../constants';

//Calendar
import {Calendar, LocalConfig} from 'react-native-calendars';

//Components
import InformationDashboard from '../../components/InformationDashboard'

import axios from 'axios'


const ManagerCalendar = ({route}) => {
    const [userInfo, setUserInfo] = useState(null);
    const [dateSelected, setDateSelected] = useState(null);
    const [markedDatesObj, setMarkedDatesObj] = useState({})
    const { handleLogout } = route.params;
    
    

    useEffect(() => {
        const fetchTasksAndPopulateMarkedDates = async () => {
          try {
            const response = await axios.get(`${baseURL}/tasks`);
            const tasksData = response.data;
    
            // Transform tasksData into markedDatesObj
            const markedDates = {};
            tasksData.forEach(task => {
              const taskDate = new Date(task.dueDate); // Assuming task.dueDate is your date field
              const formattedDate = taskDate.toISOString().split('T')[0];
              markedDates[formattedDate] = { marked: true };
            });

            setMarkedDatesObj(markedDates);
          } catch (error) {
            console.error('Error fetching tasks or populating marked dates:', error);
          }
        };
    
        fetchTasksAndPopulateMarkedDates();
      }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const user = await getUserInfo();
            setUserInfo(user);
            console.log(user)
        };

        fetchUserInfo();
    }, []);

    if (!userInfo) {
        return <Text>Loading...</Text>;
    }

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

        <InformationDashboard />
            
        <Calendar
            onDayPress={day => {
                setDateSelected(day.dateString);
            }}
            markedDates={markedDatesObj}
            style={{
                borderWidth: 3,
                borderColor: COLORS.PRIMARY_COLOR_1,
                borderRadius: 20,
                height: 370,
                marginTop: 45
            }}
            theme={{
                selectedDayBackgroundColor: COLORS.PRIMARY_COLOR_2
            }}
        />

        </ScrollView>
    </>
  )
}

export default ManagerCalendar

const styles = StyleSheet.create({
    mainView:{
        flex: 1,
        width: "90%",
        alignSelf: "center",
        paddingTop: 35
    },
    header:{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 65,
        width: "90%",
        alignSelf: "center"
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
    calendarContainer:{
        alignSelf: "center",
    },
});