import { View,Text,TouchableOpacity,Image,BackHandler,ToastAndroid } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Octicons,Zocial,Entypo,FontAwesome5 } from '@expo/vector-icons';
import { t } from 'react-native-tailwindcss';
import { useState,useEffect } from "react";
import MainHome from './MainHome' ;
import UserMgmt from './UserMgmt';
import Empty from "./EmptyPage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons,SimpleLineIcons } from '@expo/vector-icons';
import DietRecommend from "./DietRecommend";
import { Tabs } from 'expo-router/tabs';
import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
export default function TabsLayout(){
  const [username, setUsername] = useState("");
  const Tab = createBottomTabNavigator();

  const checkUserSession = async () => {
    const user = await AsyncStorage.getItem('name');
    setUsername(user);
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp(); // This will exit the app
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

 
  const [view,setview] = useState(1);
  const [labels, setlabels] = useState([]);
  const [daysarr, setdaysarr] = useState([]);
  const [days,setdays] = useState([]);
  const [ids,setids] = useState([]);
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
  const [usernutri, setusernutri] = useState({});
  const [mynutridata, setmynutridata] = useState([0, 0, 0, 0]);
  const [bardata, setbardata] = useState([]);
  
  const fetchNutri = async () => {
    // const myhydration = await AsyncStorage.getItem("userhydra");
    // setHydra(parseInt(myhydration));
    // await calculateHydra() ;////////////////////////////////////
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };
    try {
      // await getusercal();
      await fetch(
        'https://backend-server-lhw8.onrender.com/api/user/get-nutridata', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              if (data) {
                const nutridataArray = data.entries.map(entry => entry.nutridata);
                const foodnamesArray = data.entries.map(entry => entry.foodname);
                // console.log(nutridataArray);
                  setlabels(foodnamesArray);
                  setbardata(data.allentries.map(entry => entry.nutridata[0]))
                  const alldataArray = data.allentries.map(entry => entry.updatedAt);
                  setdays(alldataArray)
                  setids(data.allentries.map(entry => entry._id))
                  // console.log();
                setdaysarr(getPresenceArray(alldataArray));
                setusernutri(nutridataArray); 
                
                const sumArray = nutridataArray[0].map((_, index) =>
                  nutridataArray.reduce((sum, array) => sum + parseFloat(array[index]), 0)
                );
                // Need human age specific nutrition info, ex: 20 year old boy

                const avgreqnutri = [2500, 300, 70, 56];
                const resultArray = avgreqnutri.map((reqValue, index) => {
                  const totValue = sumArray[index];
                  const prog = Number((totValue / reqValue).toFixed(2))
                  return prog >= 1 ? 1 : prog;
                  
                });
                if(resultArray){
                  setmynutridata(resultArray);
                }

              }
            });
        })

    }
    catch (error) {
      // console.log(error);
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
  const [hydra, setHydra] = useState(0);

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
        'https://backend-server-lhw8.onrender.com/api/user/get-hydrate', requestOptions)
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
                  setHydra(parseInt(mypercent));
                }
                else {
                  AsyncStorage.setItem('hydration', dailyHydrationGoal.toString());
                  setHydra(parseInt(100));
                  alert('You have already reached 100% of your daily hydration goal! 🎉');
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
        'https://backend-server-lhw8.onrender.com/api/user/store-hydrate', requestOptions)
        .then(response => {
          // console.log(response)
          response.json()
            .then(data => {
              console.log(data.message);
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
    setHydra(parseInt(mypercent));
  }

  const calculateHydra = async () => {
    const curr_amt = currenthydra + 237;
    if (curr_amt <= dailyHydrationGoal) {
      setcurrenthydra(curr_amt);
      const mypercent = (parseInt(curr_amt) / dailyHydrationGoal) * 100
      setHydra(parseInt(mypercent));
      // setHydra()
      await StoreinDB(237);
      await AsyncStorage.setItem('hydration', curr_amt.toString());
      fetchHydration();
    }
    else {
      await StoreinDB(dailyHydrationGoal);
      await AsyncStorage.setItem('hydration', dailyHydrationGoal.toString());
      setHydra(parseInt(100));
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
  const [foodNames, setFoodNames] = useState(defaultFoodNames);
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  const fetchImages = async () => {
    setLoading(true);
    for(var i = currentFoodIndex; i < currentFoodIndex+ 10 && i < foodNames.length ; i++){

    const currentFoodName = foodNames[i]; 
    // console.log(currentFoodName);
    try {
      const response = await fetch(`https://query-food-images.onrender.com/get_images?food_name=${currentFoodName}`);
      const data = await response.json();

      if (data.error) {
        
        break ;
        
      } else {
        const oneImg = await data.images[1];
        setCurrentImages((old) => [...old, oneImg]);
        findex+=1 ;
      }
    } catch (error) {
      // console.error('Error fetching images:', error);
    }
  }
  setCurrentFoodIndex(currentFoodIndex+10);
  setLoading(false);
  };

  useEffect(() => {
    checkUserSession();
    fetchNutri();
    hydraFetch();
    fetchImages();
  }, [username]);
  

  return (
    <View style={[t.wFull, t.flex, t.flexCol, t.hFull,t.bg=['#F5F5F4']]}>
    
      
      <View style={[t.flex1]}>
        {view== 1 ? (
          <MainHome fetchNutri={fetchNutri} labels={labels} daysarr={daysarr} usernutri={usernutri} mynutridata={mynutridata} bardata={bardata} calculateHydra = {calculateHydra} hydra = {hydra} username={username} days={days} ids = {ids}/>
        ):
        view==4 ?
       (
          <UserMgmt/>
        ) :
        view==2 ? (
          <DietRecommend fetchImages={fetchImages} currentImages={currentImages} foodNames={foodNames} loading={loading}/>
          // <Empty/>
        )
        :
        view == 3 ?(
          
          <Empty/>
        
        ) : null
      }
       
      </View>

      <View style={[t.wFull, t.h16, t.bgGray100, t.bottom0, t.flex, t.flexRow, t.pT4, t.pB3,t.justifyBetween,t.pL10,t.pR10, t.borderT2,t.borderGray300]}>
  <TouchableOpacity onPress={() => setview(1)} style={[t.mR6, view === 1 ? t.borderB2 : null]}>
    <Octicons name="home" size={25} color="black" style={[t.pT1]} />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setview(2)} style={[t.mL6, t.mR6, view === 2 ? t.borderB2 : null]}>
    <Entypo name="book" size={25} color="black" style={[t.pT1]} />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setview(3)} style={[t.mL6, t.mR6,t.mT1, view === 3 ? t.borderB2 : null]}>
    
    <Feather name="globe" size={25} color="black" />
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setview(4)} style={[t.mL6, view === 4 ? t.borderB2 : null]}>
    <FontAwesome5 name="user" size={24} color="black" style={[t.pT1]} />
  </TouchableOpacity>
</View>

    </View>

  );
}
// export default TabsLayout ;