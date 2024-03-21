import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, ToastAndroid, ProgressBarAndroid } from 'react-native';
import { color, t } from 'react-native-tailwindcss';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HOST_URL from "./config";


const CounterApp = ({ data, fooditem, status }) => {
  const getArray = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key); // Retrieve the stored JSON string
      return jsonValue != null ? JSON.parse(jsonValue) : []; // Parse the JSON string back to an array, or return an empty array if it's null
    } catch (e) {
      console.error(`Error retrieving array with key ${key}:`, e);
      return [];
    }
  };
  
  
  const StoreinDB = async (record) => {
    const nutri = record;
    // console.log(nutri);
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nutridata: nutri, food_name: fooditem })
  
    };
    try {
      await fetch(
        HOST_URL + '/api/user/store-nutridata', requestOptions)
        .then(response => {
          // console.log(response)
          response.json()
            .then(data => {
              // console.log(data.message);
            });
        })
      const today = new Date();
      await AsyncStorage.setItem('curr_date', today.toDateString());
      ToastAndroid.show('Diet Recorded Successfully', ToastAndroid.SHORT);
      // openModal();
    }
    catch (error) {
      // console.error(error); 
    }
  }

  const multiplyValues = async (dataString, multiplier) => {
    try {
      // Parse the data string into a JavaScript object
      const { data } = dataString;
      // console.log(dataString);
      // Ensure data and multiplier are provided
      if (!data || typeof data !== 'object' || typeof multiplier !== 'number') {
        return [];
      }
  
      // Multiply each valid numeric value by the multiplier
      const multipliedData = {};
      for (const key in data) {
        // if (Object.hasOwnProperty.call(data, key)) {
        const originalValue = data[key];
        // Check if the original value is a valid number
        if (typeof originalValue === 'number' && !isNaN(originalValue)) {
          multipliedData[key] = (originalValue * multiplier).toFixed(2);
        } else {
          // Handle non-numeric values (e.g., strings, objects, etc.)
          multipliedData[key] = originalValue;
        }
        // }
      }
  
      // Convert the result to an array
      const resultArray = Object.values(multipliedData);
      // console.log(resultArray);
      await StoreinDB(resultArray);
  
      // reloadnutri();
  
      await AsyncStorage.setItem('nutridata', JSON.stringify(resultArray));
  
      // return resultArray;
    } catch (error) {
      // console.error('Error parsing data string:', error);
      return [];
    }
  };


  const [counter, setCounter] = useState(0);
  console.error = (error) => {
    if (!error.toString().includes('ProgressBarAndroid')) {
      console.warn('Suppressed Warning:', error);
    }
  };

  const getStatus = () => {
    switch (counter) {
      case 0:
        return 'None'
      case 1:
        return 'Low (x1)';
      case 2:
        return 'Medium (x2)';
      case 3:
        return 'High (x3)';
      case 4:
        return 'Very High (x4)';
      default:
        return '';
    }
  };

  const handleIncrement = () => {
    if (counter < 4) {
      setCounter(counter + 1);
    }
  };

  const handleDecrement = () => {
    if (counter > 0) {
      setCounter(counter - 1);
    }
  };

  

  const storeForLater=async(fooditem,counter)=>{
    const oldcount = await getArray('oldcount');
    const oldnames = await getArray('oldnames');
    oldcount.push(counter);
    oldnames.push(fooditem);
    await AsyncStorage.setItem('oldcount', JSON.stringify(oldcount));
    await AsyncStorage.setItem('oldnames', JSON.stringify(oldnames));
    // console.log(oldnames);
    ToastAndroid.show('Diet Recorded Offline Successfully', ToastAndroid.SHORT);
  }
  return (
    <View style={styles.container}>
      {/* <Text style={[t.absolute,t.mL10,t.selfStart,t.fontSemibold,t.textLg]}>Food Quantity</Text> */}
      <Text style={[t.mB10, t.text2xl, t.fontSemibold, t.textGray700]}>Quantity: {getStatus()}</Text>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={counter / 4} // Adjust the progress value based on your needs
        style={styles.progressBar}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDecrement}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        {/* <Text style={styles.counter}>{counter}</Text> */}
        <TouchableOpacity style={styles.button} onPress={handleIncrement}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={[, t.selfCenter, t.mB4, t.textBase, t.flex, t.mT12, t.flexCol]}>


        <View style={{ width: '100%', height: 44, alignSelf: 'center' }}>
          <TouchableOpacity
            onPress={(Event) => status? multiplyValues(data, counter) : storeForLater(fooditem,counter)}
            style={{
              backgroundColor: '#09BF13',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
              flex: 1,
              flexDirection: 'row',

            }}
          >
            <Text
              style={{
                // #072e33
                color: 'white',
                fontWeight: '600',
                fontSize: 16,
                width: '100%',
                textAlign: 'center'
              }}
            >
              Record My Diet
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent:'flex-start',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',

  },
  progressBar: {
    width: 250,
    height: 10,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#0C7078',
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'space-evenly'
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white'
  },
  counter: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CounterApp;
