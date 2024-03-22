import React, {useState, useEffect} from 'react';
import { View, Text, Image,Button, TouchableOpacity,ScrollView , StatusBar,BackHandler} from 'react-native';
import { t } from 'react-native-tailwindcss';
import {useRouter} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from 'expo-notifications';


// let setStateFn = () => {
//   // console.log("State not yet initialized");
// };

// const notifyarr = [
//   {
//     title: '⏰ 𝗧𝗶𝗺𝗲 𝗳𝗼𝗿 𝗮 𝗙𝗼𝗼𝗱𝗦𝗻𝗮𝗽 𝗨𝗽𝗱𝗮𝘁𝗲! ⏰',
//     body: "🍎 Don't forget to log your latest meal. Your journey to a healthier lifestyle starts with every entry. 🌿",
//   },
//   {
//     title: '⚡ 𝗤𝘂𝗶𝗰𝗸 𝗨𝗽𝗱𝗮𝘁𝗲: 𝗠𝗲𝗮𝗹 𝗧𝗶𝗺𝗲! ⚡',
//     body: "🥗 Don't miss out on recording your latest meal. Each entry counts towards a healthier lifestyle journey. 🥦 ",
//   },
//   {
//     title: '🍇 𝗙𝗼𝗼𝗱𝗦𝗻𝗮𝗽 𝗔𝗹𝗲𝗿𝘁: 𝗧𝗶𝗺𝗲 𝘁𝗼 𝗟𝗼𝗴! 🍇 ',
//     body: "🥑 Your meal log awaits! Make every entry count on your path to a healthier and happier you. 🏋️‍♀️",
//   },
// ];

// const sendLocalNotification = (number) => {
//   const notifyIndex = Math.floor((number - 1) / 6); // Adjust array index based on input number
//   const notificationContent = notifyarr[notifyIndex];

//   Notifications.scheduleNotificationAsync({
//     content: {
//       title: notificationContent.title,
//       body: notificationContent.body,
//     },
//     trigger: null,
//   });
// };

// function myTask() {
//   try {
//     const backendData = "Simulated fetch " + Math.random();
//     // console.log("myTask() is running in the background ", backendData, new Date());
//     sendLocalNotification(1);
    
//   } catch (err) {
//     console.error(err);
//     return BackgroundFetch.Result.Failed;
//   }
// }

// async function initBackgroundFetch(taskName, taskFn, customIntervalMinutes = 25) {
//   try {
//     const customIntervalSeconds = customIntervalMinutes * 60;

//     if (!TaskManager.isTaskDefined(taskName)) {
//       TaskManager.defineTask(taskName, taskFn);
//     }

//     const options = {
//       minimumInterval: 2, // in seconds
//       interval: customIntervalSeconds, // customize the interval in seconds
//     };

//     await BackgroundFetch.registerTaskAsync(taskName, options);
//   } catch (err) {
//     console.error("registerTaskAsync() failed:", err);
//   }
// }

// // Set custom interval in minutes (e.g., 5 minutes)
// const customIntervalMinutes = 10; ///set time esub
// initBackgroundFetch('myTaskName', myTask, customIntervalMinutes);

// // Continuously invoke notifications at the specified interval
// setInterval(() => {
//   initBackgroundFetch('myTaskName', myTask, customIntervalMinutes);
// }, customIntervalMinutes * 60 * 1000);


function App() {
  const navigation = useRouter() ;
  const [username,setUsername] = useState("empty") ;
  async function checkLoginStatus() {
    const today = new Date();
    await AsyncStorage.setItem('curr_date',today.toDateString());
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
      // console.log(error);
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
