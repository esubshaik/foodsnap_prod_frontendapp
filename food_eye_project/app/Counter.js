import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ProgressBarAndroid, StyleSheet,Button } from 'react-native';
import {t} from 'react-native-tailwindcss' ;
import AsyncStorage from '@react-native-async-storage/async-storage';


const CounterApp = ({closeModal,data}) => {
  const [counter, setCounter] = useState(1);

  const multiplyValues = async (dataString, multiplier) => {
    try {
      // Parse the data string into a JavaScript object
      const {data} = dataString;
    console.log(dataString);
      // Ensure data and multiplier are provided
      if (!data || typeof data !== 'object' || typeof multiplier !== 'number') {
        return [];
      }
  
      // Multiply each valid numeric value by the multiplier
      const multipliedData = {};
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const originalValue = data[key];
          // Check if the original value is a valid number
          if (typeof originalValue === 'number' && !isNaN(originalValue)) {
            multipliedData[key] = (originalValue * multiplier).toFixed(2);
          } else {
            // Handle non-numeric values (e.g., strings, objects, etc.)
            multipliedData[key] = originalValue;
          }
        }
      }
  
      // Convert the result to an array
      const resultArray = Object.values(multipliedData);
      console.log(resultArray);
      await AsyncStorage.setItem('nutridata', JSON.stringify(resultArray));
      // await AsyncStorage.setItem('reqnutridata', JSON.stringify([2500,300,70,56]));
      // return resultArray;
    } catch (error) {
      console.error('Error parsing data string:', error);
      return [];
    }
  };

  const getStatus = () => {
    switch (counter) {
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      case 4:
        return 'Very High';
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
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{getStatus()}</Text>
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
      <View style={[t.absolute,t.bottom0,t.selfCenter, t.mB4,t.textBase, t.flex, t.flexRow]}>
            <View style={[t.mR10]} >
            <Button title="Close" onPress={closeModal} />
            </View>
          <View style={[t.mL10]}>
          <Button title="Record My DIET" onPress={(Event)=>multiplyValues(data,counter)} />
          </View>
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressBar: {
    width: 250,
    height: 40,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    
    // margin:10,
    // alignItems: 'center',
    // justifyContent:'flex-end'
  },
  button: {
    backgroundColor: '#0C7078',
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent:'space-evenly'
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color:'white'
  },
  counter: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CounterApp;
