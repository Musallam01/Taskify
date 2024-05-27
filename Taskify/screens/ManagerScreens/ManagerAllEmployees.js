import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import {COLORS, baseURL} from '../../constants'
//AsyncStorage
import { getUserInfo } from '../../utils/storageUtils';

const ManagerAllEmployees = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
        const user = await getUserInfo();
        setUserInfo(user);
    };
    
    fetchUserInfo();
}, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${baseURL}/employees`);
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const Header = () => (
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/icons/iconGoBack.png')} />
        </TouchableOpacity>
        <Image source={require('../../assets/logoOnly.png')} style={styles.logo} />
        {userInfo && userInfo.firstName && ( 
          <View>
            <Text style={{ fontSize: 27, fontWeight: 'bold' }}>{userInfo.firstName}</Text>
          </View>
        )}
      </View>
  );

  const renderItem = ({item, index})=>{
    const itemStyle = index % 2 === 0 ? styles.employeeItem : styles.employeeItemGreen;
    const statusStyle = item.status == 'Online' ? styles.itemStatusTextOnline : styles.itemStatusText;

    return (
    
      <View style={itemStyle}>
        <View style={styles.itemTopView}>
        <Text style={styles.itemNameText}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.itemRatingText}>{item.rating}</Text>
        </View>
        <View style={styles.itemBotView}>
          <Text style={statusStyle}>{item.status}</Text>
        </View>
      </View>
  )

  if (loading) {
    return <Text>Loading...</Text>;
  }}

  return (
    <View style={styles.mainView}>
      <FlatList
        data={employees}
        renderItem={renderItem}
        keyExtractor={(item) => item._id ? item._id.toString() : ''}
        ListHeaderComponent={Header}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ManagerAllEmployees;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 65
  },
  logo: {
    width: 55,
    height: 55,
    right: 10
  },
  allTasksTitleText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  employeeItem: {
    padding: 10,
    borderWidth: 3,
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    borderRadius: 15,
    marginBottom: 15,
    borderColor: COLORS.PRIMARY_COLOR_1,
    height: 110
  },
  employeeItemGreen: {
    padding: 10,
    borderWidth: 3,
    backgroundColor: COLORS.SECONDARY_COLOR_2,
    borderRadius: 15,
    marginBottom: 15,
    borderColor: COLORS.PRIMARY_COLOR_2,
    height: 100
  },
  itemTopView:{
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  itemNameText:{
    fontSize: 20
  },
  itemRatingText:{
    fontSize: 20
  },
  itemStatusText:{
    fontSize: 20
  },
  itemStatusTextOnline:{
    fontSize: 20,
    color: COLORS.PRIMARY_COLOR_1
  },
  itemBotView:{
    padding: 10,
    alignItems: "center"
  }
});