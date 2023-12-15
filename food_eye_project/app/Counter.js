import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ProgressBarAndroid,ProgressBar, StyleSheet,Button, ToastAndroid } from 'react-native';
import {t} from 'react-native-tailwindcss' ;
import AsyncStorage from '@react-native-async-storage/async-storage';


const CounterApp = ({data,fooditem}) => {
  
  const [counter, setCounter] = useState(0);

  const StoreinDB=async(record)=>{
  const nutri = record ;
  // console.log(nutri);
  const token = await AsyncStorage.getItem('token');
  const requestOptions = { 
    method: 'POST', 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
  }, 
    body: JSON.stringify({ nutridata: nutri,food_name : fooditem}) 

}; 
    try { 
      
        await fetch( 
            'https://backend-server-lhw8.onrender.com/api/user/store-nutridata', requestOptions) 
            .then(response => { 
              // console.log(response)
                response.json() 
                    .then(data=> { 
                        console.log(data.message); 
                    }); 
            }) 
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
      const {data} = dataString;
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

  const getStatus = () => {
    switch (counter) {
      case 0 :
        return 'None'
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
    if (counter > 0) {
      setCounter(counter - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={[t.absolute,t.mL10,t.selfStart,t.fontSemibold,t.textLg]}>Food Quantity</Text> */}
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
      <View style={[t.bottom0,t.selfCenter, t.mB4,t.textBase, t.flex,t.mT12, t.flexCol]}>
            
          <View >
          <View style={{ width: 130, height: 44,alignSelf:'center'}}>
  <TouchableOpacity
    onPress={(Event)=>multiplyValues(data,counter)}
    style={{
      backgroundColor: '#09BF13',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      // direction:'ltr',
      // padding:10,
      flex: 1,
      flexDirection:'row',
    
    }}
  >
    
    <Text
      style={{
        // #072e33
        color: 'white',
        fontWeight: '600',
        // marginLeft:4,
         // Semibold
        fontSize: 16, // Adjust the font size as needed
      }}
    >
      Record My Diet
    </Text>
  </TouchableOpacity>
</View>
          {/* <Button title="Record My DIET"  /> */}
          </View>
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'flex-start',
    alignItems: 'center',
    marginTop:40
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
