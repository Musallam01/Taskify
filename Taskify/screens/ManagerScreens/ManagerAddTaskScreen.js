//React Native Imports
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'


const AddTaskScreen = () => {
  return (
    <View style={styles.mainView}>
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Image source={require('../../assets/logoOnly.png')} style={styles.topLogo}/>
                <Text style={styles.userNameText}>Fadi</Text>
            </View>
            <TouchableOpacity style={styles.headerRight}>
                <Image source={require('../../assets/icons/iconNotification.png')} style={styles.notIcon} />
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default AddTaskScreen

const styles = StyleSheet.create({
    mainView:{
        flex: 1,
        paddingTop: 65,
        width: "90%",
        alignSelf: "center"
    },
    header:{
        flexDirection: "row",
        justifyContent: "space-between"
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
    }
})