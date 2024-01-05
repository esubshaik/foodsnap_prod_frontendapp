import React, { useState, useEffect  } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, ToastAndroid } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function MyNotifications() {

  const navigation = useRouter();
  const handleBack=()=>{
   navigation.push('/Home');
  }

  
  const [isEnabled, setIsEnabled] = useState(false);




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
  const [statuses,setstatuses] = useState([0,0]);
  const getstatus=async()=>{
    const pstatus = await AsyncStorage.getItem('pstatus');
    const astatus = await AsyncStorage.getItem('astatus');
    setstatuses([parseInt(pstatus),parseInt(astatus)]);
    // console.log(pstatus);
  }
  useEffect(()=>{
    getstatus();
  },[])
  
  const toggleSwitch = (index) => {
    setstatuses(prevStatuses => {
      return prevStatuses.map((status, i) => {
        return i === index ? !status : status;
      })
    });
  }
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        'https://backend-updated-w7a2.onrender.com/api/user/update-status',
        {
          pstatus : statuses[0],
          astatus : statuses[1]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',

          },
        }
      );
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <View> 
    <View style={[t.h18, t.shadowLg, t.bgWhite, t.borderB2, t.borderGray300,t.pB2]}>
      <View style={[t.flex, t.flexRow,t.m1, t.textCenter,t.justifyStart, t.wFull]}>
        <View style={[t.mT4,t.mL4,t.flexRow]}>
          <TouchableOpacity onPress={handleBack}>
            <Feather name="arrow-left" size={26} color="black" style={[t.bgBlue200, t.p1,t.roundedFull]} />
          </TouchableOpacity>
          <Text style={[t.fontBold, t.text2xl, t.textBlack, t.mL3,t.mT2]}>Notifications</Text>
        </View>
      </View>
    </View>
    <ScrollView contentContainerStyle={{ backgroundColor: 'white', marginLeft:20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[t.textBase]}>Enable Push Notifications:</Text>
        <Switch

          trackColor={{ false: '#B4CCB9', true: 'skyblue' }}
          thumbColor={statuses[0] ? 'darkgreen' : '#f4f3f4'}
          ios_backgroundColor="#81b0ff"
          onValueChange={()=>toggleSwitch(0)}
          value={statuses[0] ? true : false}
        />
      </View>
      {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[t.textBase]}>Enable Food Allergen Alerts:</Text> 
        <Switch
          trackColor={{ false: '#B4CCB9', true: 'skyblue' }}
          thumbColor={isEnabled ? 'darkgreen' : '#f4f3f4'}
          ios_backgroundColor="#81b0ff"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View> */}
      
    </ScrollView>
    <View style={[t.mT10,t.wFull]}>
        <TouchableOpacity onPress={handleSave} style={[t.p3,t.bgGreen700,t.roundedLg,t.selfCenter]}>
          <Text style={[t.textWhite, t.textBase,t.fontSemibold,t.textCenter]}>Save Changes</Text>
        </TouchableOpacity>
      </View>
  </View>
  
  
  );
}
