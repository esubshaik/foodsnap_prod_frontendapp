import { View, Text, TouchableOpacity, Image, BackHandler, ToastAndroid } from "react-native";
import { Octicons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { t } from 'react-native-tailwindcss';
import { useState, useEffect } from "react";
import MainHome from './MainHome';
import UserMgmt from './UserMgmt';
import Empty from "./EmptyPage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DietRecommend from "./DietRecommend";
import { Feather } from '@expo/vector-icons';
import React, { useCallback } from 'react';


export default function TabsLayout() {
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
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };
    const user = await AsyncStorage.getItem('name');
    try {
      // await getusercal();

      await hydraFetch();
      await fetch(
        'https://backend-updated-w7a2.onrender.com/api/user/get-nutridata', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              if (data && data.allentries) {
                const nutridataArray = data.entries.map(entry => entry.nutridata) || [];
                const foodnamesArray = data.entries.map(entry => entry.foodname) || [];
                const allfoodlabels = data.allentries.map(entry => entry.foodname) || [];
                const alldataArray = data.allentries.map(entry => entry.updatedAt) || [];

                // Ensure that nutridataArray[0] is defined before accessing its properties
                const sumArray = nutridataArray[0] && nutridataArray[0].map((_, index) =>
                  nutridataArray.reduce((sum, array) => sum + parseFloat(array[index]), 0)
                ) || [];

                if (sumArray.length > 0) {
                  const avgreqnutri = [2500, 300, 70, 56];
                  const resultArray = avgreqnutri.map((reqValue, index) => {
                    const totValue = sumArray[index];
                    const prog = Number((totValue / reqValue).toFixed(2));
                    return prog >= 1 ? 1 : prog;
                  });

                  setMainTransporter((prevState) => ({
                    ...prevState,
                    labels: foodnamesArray,
                    allfoodlabels: allfoodlabels,
                    daysarr: getPresenceArray(alldataArray),
                    mynutridata: resultArray,
                    bardata: data.entries.map(entry => entry.nutridata[0]) || [],
                    username: user,
                    days: alldataArray,
                    ids: data.allentries.map(entry => entry._id) || [],
                  }));
                } else {
                  // Handle the case where sumArray is not defined
                  // You may want to provide default values or handle it differently
                }
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
      setMainTransporter((prevState) => ({
        ...prevState,
        username: user,
      }));
    }
  }
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
      await fetch(
        'https://backend-updated-w7a2.onrender.com/api/user/get-hydrate', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              if (data) {
                // console.log(data);
                const hydraArray = data.entries.map(entry => entry.hydrate);

                const numericArr = hydraArray.map(value => parseInt(value, 10));
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
      console.log(error);
    }
    finally {
      await AsyncStorage.setItem('hydration', currenthydra.toString());

    }
  }
  const StoreinDB = async (record) => {
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
        'https://backend-updated-w7a2.onrender.com/api/user/store-hydrate', requestOptions)
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

  const defaultFoodNames = [
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
  const [recommendInfo,setRecommendInfo] = useState({
    foodNames: [],
    currentImages: [],
    descriptions: [],
    nutritionInfo: []
  })
  // const [foodNames, setFoodNames] = useState([]);
  // const [currentImages, setCurrentImages] = useState([]);
  // const [descriptions,setdescriptions]= useState([]);
  // const [nutrition,setnutrition] = useState([]);

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
          'https://backend-updated-w7a2.onrender.com/api/user/get_recommendations', requestOptions)
          .then(response => {
            response.json()
              .then(data => {
                if(data.data[0]){
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
      setCurrentFoodIndex(currentFoodIndex+10);
    }
    setCurrentFoodIndex(currentFoodIndex+10);
    setLoading(false);
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
    fetchNutri();
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);

    // fetchImages();
  }, []);



  const renderComponent = (key) => {
    switch (key) {
      case 1:
        return <MainHome fetchNutri={fetchNutri} formdata={mainTransporter} calculateHydra={calculateHydra} />;
      case 2:
        return <DietRecommend fetchImages={fetchImages} currentImages={currentImages} foodNames={foodNames} loading={loading} />;
      case 4:
        return <UserMgmt />;
      // Add more cases for other keys as needed
      default:
        return <Empty />; // Return a default component or null for unknown keys
    }
  };

  return (
    <View style={[t.wFull, t.flex, t.flexCol, t.hFull, t.bg = ['#F5F5F4']]}>
      <View style={[t.flex1]}>
        {view == 1 ? (
          <MainHome fetchNutri={fetchNutri} formdata={mainTransporter} calculateHydra={calculateHydra} />
        ) :
          view == 4 ?
            (
              <UserMgmt />
            ) :
            view == 2 ? (
              <DietRecommend fetchImages={fetchImages} recommendInfo= {recommendInfo} loading={loading} />
              // <Empty/>
            )
              :
              view == 3 ? (

                <Empty />

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