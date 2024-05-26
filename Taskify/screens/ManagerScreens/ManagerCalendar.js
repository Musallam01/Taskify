//React Native Imports
import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native'

//AsyncStorage
import { getUserInfo } from '../../utils/storageUtils';

//Constants
import { COLORS } from '../../constants';

//Calendar
import {Calendar, LocalConfig} from 'react-native-calendars';

//Components
import InformationDashboard from '../../components/InformationDashboard'


const ManagerCalendar = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [dateSelected, setDateSelected] = useState(null);
    

    const markedDates = {
        '2024-05-30': { marked: true },
        '2024-05-20': { marked: true },
        '2024-05-25': { marked: true },
      };

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
            <View style={styles.headerLeft}>
                <Image source={require('../../assets/logoOnly.png')} style={styles.topLogo}/>
                <Text style={styles.userNameText}>{userInfo.firstName}</Text>
            </View>
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
            markedDates={{
                '2024-05-30': { marked: true },
                '2024-05-20': { marked: true },
                '2024-05-25': { marked: true },
            }}
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