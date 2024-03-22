import { View, Text, TouchableOpacity, Image, BackHandler, ToastAndroid, StatusBar } from "react-native";
import { Octicons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { t } from 'react-native-tailwindcss';
import { useState, useEffect } from "react";
import MainHome from './MainHome';
import UserMgmt from './UserMgmt';
import Empty from "./EmptyPage";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DietRecommend from "./DietRecommend";
import { Feather } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import HOST_URL from "./config";
import { PermissionsAndroid } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import Community from "./Network";
import NetInfo from '@react-native-community/netinfo';

// async function registerForPushNotificationsAsync() {
//   try {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== 'granted') {
//       ToastAndroid.showToast('Permission to receive push notifications denied!',ToastAndroid.SHORT);
//       return;
//     }

//     const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
//     // console.log('Expo Push Token:', expoPushToken);

//     sendPushTokenToBackend(expoPushToken);
//   } catch (error) {
//     console.error('Error getting push token:', error);
//   }
// }

// async function sendPushTokenToBackend(expoPushToken) {
//       const token = await AsyncStorage.getItem('token');
//       const requestOptions = {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ pushtoken: expoPushToken })

//       };
//       try {
//         await fetch(
//           HOST_URL+'/api/user/register-push-notification', requestOptions)
//           .then(response => {
//             response.json()
//               .then(data => { 
//                 // console.log(data);
//               });
//           })
//       }
//       catch (error) {
//         console.error(error); 
//       }
//   };



export default function TabsLayout() {
  const [isConnected, setIsConnected] = useState(false);
  const [user,setuser] = useState("") ;
  const [peek,setpeek] = useState(false);
  const [mainTransporter, setMainTransporter] = useState({
    labels: [],
    allfoodlabels: [],
    daysarr: [],
    mynutridata: [0, 0, 0, 0],
    bardata: [],
    hydra: 0,
    username: '',
    days: [],
    ids: [],
  });
  const setsUser=async()=>{
    const username = await AsyncStorage.getItem('name');
    setMainTransporter((prevState) => ({
      ...prevState,
      username: username,
    }));
    setuser(user);
    checkProfileStatus();
    
    
  }
  const [sploading, setsploading] = useState(false);

  const [view, setview] = useState(1);
  const getPresenceArray = (timestamps) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const presenceArray = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      const formattedDate = `${currentYear}-${currentMonth + 1 < 10 ? '0' : ''}${currentMonth + 1}-${formattedDay}`;

      return timestamps.some(timestamp => timestamp.startsWith(formattedDate)) ? 1 : 0;
    });
    return presenceArray;
  };


  const fetchNutri = async () => {
    setsploading(true);
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };
    await randomizeArray();
    
    try {
      // await getusercal();

      await hydraFetch();
      const today = await AsyncStorage.getItem('curr_date');
      // const selected_date = new Date(today);
      await fetch(
        HOST_URL + '/api/user/get-nutridata', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              // console.log(data)
              if (data && data.allentries) {
                // console.log(new Date(today));
                // const today = new Date();
                // const formattedToday = selected_date.toISOString().split('T')[0]; 
                // console.log(new Date(data.allentries[0].createdAt).toDateString())
                // console.log(new Date(today).toDateString());
                const nutridataArray = data.allentries
                  .filter(entry => entry.createdAt && new Date(entry.createdAt).toDateString() === new Date(today).toDateString())
                  .map(entry => entry.nutridata) || [];
                // console.log(nutridataArray)
                const foodnamesArray = data.entries.map(entry => entry.foodname) || [];
                const allfoodlabels = data.allentries.map(entry => entry.foodname) || [];
                const alldataArray = data.allentries.map(entry => entry.updatedAt) || [];

                // Ensure that nutridataArray[0] is defined before accessing its properties
                const sumArray = nutridataArray[0] && nutridataArray[0].map((_, index) =>
                  nutridataArray.reduce((sum, array) => sum + parseFloat(array[index]), 0)
                ) || [];
                let resultArray = [0, 0, 0, 0]
                if (sumArray.length > 0) {
                  const avgreqnutri = [2500, 300, 70, 56];
                  resultArray = avgreqnutri.map((reqValue, index) => {
                    const totValue = sumArray[index];
                    const prog = Number((totValue / reqValue).toFixed(2));
                    return prog >= 1 ? 1 : prog;
                  });
                }
                else {
                  resultArray = [0, 0, 0, 0];
                }

                setMainTransporter((prevState) => ({
                  ...prevState,
                  labels: foodnamesArray,
                  allfoodlabels: allfoodlabels,
                  daysarr: getPresenceArray(alldataArray),
                  mynutridata: resultArray,
                  bardata: data.entries.map(entry => entry.nutridata[0]) || [],
                  // username: user,
                  days: alldataArray,
                  ids: data.allentries.map(entry => entry._id) || [],
                }));

              } else {
                // Handle the case where data, data.allentries, or data.entries is not defined
                // You may want to provide default values or handle it differently
              }
            });
        })

    }
    catch (error) {
      // console.log(error);
    }
    finally {
      
      setsploading(false);

    }
  }
  // if offline 


  const mhydra = 3700;
  const fhydra = 2700;

  const gethd = async () => {
    const curr_gender = await AsyncStorage.getItem('gender');
    return curr_gender;
  }
  const gender = gethd();
  const dailyHydrationGoal = gender === 'male' ? mhydra : fhydra;
  const [currenthydra, setcurrenthydra] = useState(0);


  const hydraFetch = async () => {
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };
    try {
      const today = await AsyncStorage.getItem('curr_date');
      await fetch(
        HOST_URL + '/api/user/get-hydrate', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              if (data) {
                // console.log(data.entries);

                const hydratedata = data.entries
                  .filter(entry => entry.createdAt && new Date(entry.createdAt).toDateString() === new Date(today).toDateString())
                  .map(entry => entry.hydrate) || [];

                // const hydraArray = data.entries.map(entry => entry.hydrate && new Date(entry.createdAt).toDateString() === new Date(today).toDateString());

                const numericArr = hydratedata.map(value => parseInt(value, 10));
                const validNumbers = numericArr.filter(value => !isNaN(value));
                const sum = validNumbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

                const curr_amt = sum.toString()
                if (curr_amt <= dailyHydrationGoal) {
                  setcurrenthydra(parseInt(curr_amt));
                  const mypercent = (parseInt(curr_amt) / dailyHydrationGoal) * 100

                  setMainTransporter((prevState) => ({
                    ...prevState,
                    hydra: parseInt(mypercent),
                  }));
                }

                else {
                  AsyncStorage.setItem('hydration', dailyHydrationGoal.toString());
                  setMainTransporter((prevState) => ({
                    ...prevState,
                    hydra: 100,
                  }));
                }
              }

            });
        })

    }
    catch (error) {
      // console.log(error);
    }
    finally {
      await AsyncStorage.setItem('hydration', currenthydra.toString());

    }
  }
  const StoreinDB = async (record) => {
    const today = new Date();
    await AsyncStorage.setItem('curr_date', today.toDateString());
    await hydraFetch();
    const hydra = record;
    // console.log(nutri);
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({ hydratedata: hydra })
    };
    try {
      await fetch(
        HOST_URL + '/api/user/store-hydrate', requestOptions)
        .then(response => {
          // console.log(response)
          response.json()
            .then(data => {
              // console.log(data.message);
            });
        })

      ToastAndroid.show('Hydration Status Updated Successfully', ToastAndroid.SHORT);
      // openModal();
    }
    catch (error) {
      // console.error(error); 
    }
  }

  const fetchHydration = async () => {
    const curr_hydrate = await AsyncStorage.getItem('hydration');
    setcurrenthydra(parseInt(curr_hydrate));
    const mypercent = (parseInt(curr_hydrate) / dailyHydrationGoal) * 100

    setMainTransporter((prevState) => ({
      ...prevState,
      hydra: parseInt(mypercent),
    }));

  }

  const calculateHydra = async () => {
    const curr_amt = currenthydra + 237;
    if (curr_amt <= dailyHydrationGoal) {
      setcurrenthydra(curr_amt);
      const mypercent = (parseInt(curr_amt) / dailyHydrationGoal) * 100

      setMainTransporter((prevState) => ({
        ...prevState,
        hydra: parseInt(mypercent),
      }));

      await StoreinDB(237);
      await AsyncStorage.setItem('hydration', curr_amt.toString());
      fetchHydration();
    }
    else {
      await StoreinDB(dailyHydrationGoal);
      await AsyncStorage.setItem('hydration', dailyHydrationGoal.toString());

      setMainTransporter((prevState) => ({
        ...prevState,
        hydra: 100,
      }));
      alert('You have already reached 100% of your daily hydration goal! 🎉');
    }

  };

  const OriginalFoodNames = [
    'Chapati', 'Roti', 'Garlic Herb Chapati', 'Garlic Herb Roti', 'Rumali Roti', 'Masala Chapati',
    'Masala Roti', 'Missi Roti', 'Chicken Korma Naan', 'Garlic Coriander Naan', 'Kuloha Naan',
    'Masala Naan', 'Onion Naan', 'Peshwari Naan', 'Roghani Naan', 'Spicy Tomato Naan', 'Butter Naan',
    'Tandoon Naan', 'Aloo Paratha', 'Lachcha Paratha', 'Vegetable Paratha', 'Onion Paratha',
    'Plain Paratha', 'Chicken Tikka Masala', 'Potato Brinjal Curry', 'Potato Beans Curry', 'Aloo Curry',
    'Mashed Eggplant', 'Ladys Finger', 'Chick Peas', 'Methi Aloo', 'Mutter Paneer', 'Pumpkin',
    'Shahi Paneer', 'Shimla Mirchi Aloo', 'Stuffed Tomato', 'Ridge Gourd', 'Vegetable Kofta Curry',
    'Vegetable Korma', 'Pigeon Peas', 'Split Chick Peas', 'Dal Makhani', 'Moong Dal', 'Masoor Dal',
    'Urad Dal', 'Sambar', 'White Rice', 'Pulao', 'Kichidi', 'Cow Milk', 'Buffalo Milk', 'Curd',
    'Butter Milk', 'Paneer', 'Cheese', 'Lassi', 'Samosa', 'Brinjal Pickle', 'Chilli Pickle',
    'Lime Pickle', 'Mango Pickle', 'Beetroot', 'Bell Pepper', 'Black Olives', 'Broccoli',
    'Brussels Sprouts', 'Cabbage', 'Carrot', 'Cauliflower', 'Celery', 'Cherry Tomato', 'Corn',
    'Cucumber', 'Garlic', 'Green Beans', 'Green Olives', 'Green Onion', 'Lettuce', 'Mushrooms',
    'Onion', 'Peas', 'Potato', 'Pumpkin', 'Radishes', 'Red Cabbage', 'Spinach', 'Sweet Potato',
    'Tomato', 'Apple', 'Avocado', 'Banana', 'Blackberries', 'Blueberries', 'Cherries',
    'Custard Apple', 'Dates', 'Grapes', 'Guava', 'Jackfruit', 'Jujube', 'Kiwi', 'Lemon', 'Mango',
    'Orange', 'Papaya', 'Peach', 'Pear', 'Onion', 'Dal', 'Aloo Gobi', 'Chicken Biryani',
    'Mutton Biryani', 'Egg Biryani', 'Prawns Biryani', 'Vegetable Biryani', 'Boiled Egg',
    'Palak Paneer', 'Mint Chutney', 'Coconut Chutney', 'Egg Noodles', 'Veg Noodles', 'Manchurian',
    'Fried Rice', 'Chicken Fried Rice', 'Chicken Noodles', 'Egg Fried Rice', 'Pani Puri', 'Chaat',
    'Cake', 'Punugulu', 'Dosa', 'Egg Dosa', 'Idly', 'Mirchi Bajji', 'Vada Recipe', 'Aloo Bajji', 'Butter', 'Puri'
  ];
  const [loading, setLoading] = useState(false);
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [recommendInfo, setRecommendInfo] = useState({
    foodNames: [],
    currentImages: [],
    descriptions: [],
    nutritionInfo: []
  })
  // const [foodNames, setFoodNames] = useState([]);
  // const [currentImages, setCurrentImages] = useState([]);
  // const [descriptions,setdescriptions]= useState([]);
  // const [nutrition,setnutrition] = useState([]);
  const [defaultFoodNames, setDefaultFoodnames] = useState(OriginalFoodNames.slice());

  const fetchImages = async () => {
    setLoading(true);
    for (var i = currentFoodIndex; i < currentFoodIndex + 10 && i < defaultFoodNames.length; i++) {
      const currentFoodName = defaultFoodNames[i];

      const token = await AsyncStorage.getItem('token');
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodname: currentFoodName })
      };
      try {
        await fetch(
          HOST_URL + '/api/user/get_recommendations', requestOptions)
          .then(response => {
            response.json()
              .then(data => {
                if (data.data[0]) {
                  setRecommendInfo((prevState) => ({
                    ...prevState,
                    foodNames: [...prevState.foodNames, data.data[0][0]],
                    currentImages: [...prevState.currentImages, data.data[0][2][1]],
                    descriptions: [...prevState.descriptions, data.data[0][3].Description],
                    nutritionInfo: [...prevState.nutritionInfo, data.data[0][1]],
                  }));
                  // console.log(data.data[0][1]);

                  // const oneImg = ;
                  // setCurrentImages((old) => [...old, oneImg]);
                  // setFoodNames((old)=>[...old,]);
                  // setdescriptions((old)=>[...old,])
                  // // console.log(data.data[0][3].Description);
                }

                // findex += 1;
                // console.log(data.data[0][2][1]);
              });
          })

      }
      catch (error) {
        // console.error(error); 
      }
      setCurrentFoodIndex(currentFoodIndex + 10);
    }
    setCurrentFoodIndex(currentFoodIndex + 10);
    setLoading(false);
  };



  const randomizeArray = () => {
    // Function to generate a random number between -0.5 and 0.5
    const randomize = () => Math.random() - 0.5;

    // Use the sort method with the randomize function
    const randomizedArray = defaultFoodNames.slice().sort(randomize);

    setDefaultFoodnames(randomizedArray);
  };

  const getuserPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert("Please grant camera roll permissions inside your system's settings");
    } else {
      // console.log('Media Permissions are granted')
    }
    ReloadProfile();
    
  }
 
  useEffect(() => {
    // getUsers();
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        fetchNutri();
        fetchImages();
      }
     setTimeout(() => {
      NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
      })

     }, 1000);
    },[]);

    cloudCheck();
    unsubscribe();
    
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  },[isConnected]);
  

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsConnected(state.isConnected);
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);



  // const renderComponent = (key) => {
  //   switch (key) {
  //     case 1:
  //       return <MainHome fetchNutri={fetchNutri} formdata={mainTransporter} calculateHydra={calculateHydra} />;
  //     case 2:
  //       return <DietRecommend fetchImages={fetchImages} currentImages={currentImages} foodNames={foodNames} loading={loading} />;
  //     case 4:
  //       return <UserMgmt />;
  //     // Add more cases for other keys as needed
  //     default:
  //       return <Empty />; // Return a default component or null for unknown keys
  //   }
  // };

  const [image, setImage] = useState(null);

  const getStoredImage = async () => {

    try {
      const userdp = await AsyncStorage.getItem('userprofile');
      if (userdp) {
        setImage(userdp);
      }
      else {
        const imageSource = Image.resolveAssetSource(require('./assets/defaultuser.png'));
        setImage(imageSource.uri)
      }
    } catch (error) {
      // console.log(error);
    }
    finally{
    getuserPermission();
   
    }
  }

  const [Profile, setProfile] = useState({
    username: "",
    age: "",
    height: "",
    weight: "",
    bmi: "",
    reqcals: "",
    emailid: "",
  });

  const [userdata, setuserdata] = useState(
    {
      name: '',
      email: '',
      phone: '',
      location: '',
      age: '',
      height: '',
      weight: '',
      currpass: '',
      newpass: '',
      confirmpass: ''
    }
  )


  const ReloadProfile = async () => {
    const _age = await AsyncStorage.getItem('age');
    const _height = await AsyncStorage.getItem('height');
    const _weight = await AsyncStorage.getItem('weight');
    const _bmi = await AsyncStorage.getItem('bmi');
    const calrange = await AsyncStorage.getItem('calrange');
    const mailid = await AsyncStorage.getItem('email');
    const _location = await AsyncStorage.getItem('location');
    const _phone = await AsyncStorage.getItem('phone');
    const user = await AsyncStorage.getItem('name');

    setProfile({
      username: user,
      age: _age,
      height: _height,
      weight: _weight,
      bmi: parseFloat(_bmi).toFixed(2),
      reqcals: calrange,
      emailid: mailid,
    })
    setuserdata({
      name: user,
      email: mailid,
      phone: _phone,
      location: _location,
      age: _age,
      height: _height,
      weight: _weight
    })
    getUsers();
    
  };
  const [statuses, setstatuses] = useState([0, 0, 0, 0, 0]);

  const getstatus = async () => {
    const pstatus = await AsyncStorage.getItem('pstatus');
    const astatus = await AsyncStorage.getItem('astatus');
    const nstatus = await AsyncStorage.getItem('nstatus');
    const fstatus = await AsyncStorage.getItem('fstatus');
    const ostatus = await AsyncStorage.getItem('ostatus');
    // console.log(nstatus)
    setstatuses([parseInt(pstatus), parseInt(astatus), parseInt(nstatus), parseInt(fstatus), parseInt(ostatus)]);
  }
  const [alertstatus, setalertstatus] = useState(false);

  async function checkProfileStatus() {
    try {
      // await AsyncStorage.removeItem('bmi');
      const token = await AsyncStorage.getItem('bmi');
      
      if (!parseInt(token)) {
        setalertstatus(true);
      }
      else {
        setalertstatus(false);
      }
    } catch (error) {
      // console.log(error);
    }
    finally{
      getStoredImage();
    
    }
  }
  const [users, setusers] = useState([]);
  const getUsers = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(
        HOST_URL + '/api/user/allusers',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      setusers(response.data.users);
    } catch (error) {
      console.error(error);
    }
    finally{
      getstatus();
    }
  }
  const getArray = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key); // Retrieve the stored JSON string
      return jsonValue != null ? JSON.parse(jsonValue) : []; // Parse the JSON string back to an array, or return an empty array if it's null
    } catch (e) {
      console.error(`Error retrieving array with key ${key}:`, e);
      return [];
    }
  };
  
  
  const historyRepeat = async() => {
    // Your code here
    // console.log("This function runs every 1 minute");
    const oldcount = await getArray('oldcount');
      const oldnames = await getArray('oldnames');
      for(var i = 0 ; i  < oldnames.length ; i++){
        await analyzeFood(oldnames[i], oldcount[i]);
      }
      await AsyncStorage.removeItem('oldcount');
      await AsyncStorage.removeItem('oldnames');
      await fetchNutri() ;

  };
  

  
  const analyzeFood = async (myInput,count) => {
    const foodid = myInput;
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
  
      },
      body: JSON.stringify({ foodname: foodid })
    };
    try {
      await fetch(
        HOST_URL + '/api/user/analyze-food', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              multiplyValues(data, count,foodid);
            });
        })
  
    }
    catch (error) {
      // console.log(error);
    }
  }
  const StoreFoodInDB = async (record,foodid) => {
    const nutri = record;
    // console.log(nutri);
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nutridata: nutri, food_name: foodid })
  
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

  const multiplyValues = async (dataString, multiplier,foodid) => {
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
      // console.log(resultArray);
      await StoreFoodInDB(resultArray,foodid);
  
      // reloadnutri();
  
      await AsyncStorage.setItem('nutridata', JSON.stringify(resultArray));
  
      // return resultArray;
    } catch (error) {
      console.error('Error parsing data string:', error);
    }
  };

  const cloudCheck=async()=>{
    const oldcount = await getArray('oldcount');
      if(oldcount.length > 0){
        setpeek(true);
      }
      setsUser();
    
  }
  // useEffect(()=>{
    
  // },[isConnected])

  return (
    <View style={[t.wFull, t.flex, t.flexCol, t.hFull, t.bg = ['#F7FCFF']]}>
      <StatusBar
        backgroundColor="#F7FCFF"
        barStyle="dark-content"
      />
      <View style={[t.flex1]}>
        {view == 1 ? (
          <MainHome fetchNutri={fetchNutri} formdata={mainTransporter} calculateHydra={calculateHydra} sploading={sploading} image={image} checkProfileStatus={checkProfileStatus} alertstatus={alertstatus} getStoredImage={getStoredImage} isConnected={isConnected}  foodnames = {OriginalFoodNames} uploadHistory={historyRepeat} peek={peek}/>
        ) :
          view == 4 ?
            (
              <UserMgmt Profile={Profile} userdata={userdata} ReloadProfile={ReloadProfile} getStoredImage={getStoredImage} setuserdata={setuserdata} statuses={statuses} setstatuses={setstatuses} image={image} />
            ) :
            view == 2 ? (
              <DietRecommend fetchImages={fetchImages} recommendInfo={recommendInfo} loading={loading} />
              // <Empty/>
            )
              :
              view == 3 ? (

                <Community users={users} />

              ) : null
        }

        {/* <View>
      {renderComponent(view)}
      </View>
        */}
      </View>
      <View style={[t.wFull, t.h18, t.bgGray100, t.bottom0, t.flex, t.flexRow, t.pT2, t.pB2, t.justifyBetween, t.pL10, t.pR10, t.borderT2, t.borderGray300]}>
        <TouchableOpacity onPress={() => setview(1)} style={[t.mR6, t.flex, t.flexCol, t.itemsCenter, view === 1 ? t.borderB2 : null]}>
          <Octicons name="home" size={25} color="black" style={[t.pT1]} />
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setview(2)} style={[t.mL2, t.flex, t.flexCol, t.itemsCenter, t.mR6, view === 2 ? t.borderB2 : null]}>
          <Entypo name="book" size={25} color="black" style={[t.pT1]} />
          <Text>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setview(3)} style={[t.mL2, t.flex, t.flexCol, t.itemsCenter, t.mR6, t.mT1, view === 3 ? t.borderB2 : null]}>
          <Feather name="globe" size={25} color="black" />
          <Text>Network</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setview(4)} style={[t.flex, t.flexCol, t.itemsCenter, view === 4 ? t.borderB2 : null]}>
          <FontAwesome5 name="user" size={24} color="black" style={[t.pT1]} />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>

    </View>

  );
}
// export default TabsLayout ;