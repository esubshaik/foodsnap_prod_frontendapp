import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DateNavigator = ({reload}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatCurrentDate = () => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return currentDate.toLocaleDateString(undefined, options).replace(/\//g, '-');;
  };

  const navigateDate = async(direction) => {
    const newDate = new Date(currentDate);
    direction === 'next' ? newDate.setDate(currentDate.getDate() + 1) : newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
    await AsyncStorage.setItem('curr_date', newDate.toDateString());
    await reload()
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigateDate('prev')}>
        <Text style={styles.currentDate}>{'<'}</Text>
      </TouchableOpacity>

      <View style={styles.dateContainer}>
        <Text style={styles.currentDate}>{formatCurrentDate()}</Text>
      </View>

      <TouchableOpacity onPress={() => navigateDate('next')}>
        <Text style={styles.currentDate}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 1, 
  },
  arrow: {
    fontSize: 32,
    color:'white',
    backgroundColor:'#294D61',
    paddingEnd:15,
  },
  dateContainer: {
    alignItems: 'center',
    
  },
  currentDate: {
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 20,
    borderWidth: 1,
    paddingRight:20,
    paddingBottom:10,
    paddingTop:10,
    paddingLeft:20,
    // padding: 10,
    alignItems:'center',
    color:'#294D61',
    // backgroundColor:''
    backgroundColor:'white',borderRadius:15,flexDirection:'row',height:'fit',shadowColor: '#05161A',shadowOpacity: 0.4,
    shadowRadius: 4,elevation: 5
  },
});

export default DateNavigator;
