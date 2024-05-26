//React Native Imports
import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList} from 'react-native'
import { useNavigation } from '@react-navigation/native';

//AsyncStorage
import { getUserInfo } from '../../utils/storageUtils';

//Constants
import { COLORS } from '../../constants';



const ManagerHome = () => {
    const [userInfo, setUserInfo] = useState(null);

    const navigation = useNavigation();

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

  return (
    <>
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerLeft}>
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
                    <TouchableOpacity style={styles.employeesButton}>
                        <Image source={require('../../assets/icons/iconEmployees.png')} />
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
            </View>
            <View style={styles.activitesView}>
                <View style={styles.activitiesTitleView}>
                    <Image source={require('../../assets/icons/iconActivities.png')} />
                    <Text style={styles.activitiesTitleText}> Latest Activities</Text>
                </View>

                <FlatList />
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
})