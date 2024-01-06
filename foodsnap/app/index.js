import React, {useState, useEffect} from 'react';
import { View, Text, Image,Button, TouchableOpacity,ScrollView , StatusBar,BackHandler} from 'react-native';
import { t } from 'react-native-tailwindcss';
import {useRouter} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const navigation = useRouter() ;
  const [username,setUsername] = useState("empty") ;
  async function checkLoginStatus() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Token exists, navigate to the home page
        navigation.push('/Home'); // Change 'Home' to your actual home page route name
      }
      else{
        navigation.push('/Start');
      }
    } catch (error) {
    }
  }
  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp(); // This will exit the app
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
   <View>

   </View>
  )
}

export default App;
