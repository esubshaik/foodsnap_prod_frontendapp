import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input,InputField,InputSlot,InputIcon } from '@gluestack-ui/themed';
import { AntDesign } from '@expo/vector-icons';


function Home() {
  const navigation = useRouter();
  const [username, setUsername] = useState("");
  
  const [isFocused, setIsFocused] = useState(false);
  const checkUserSession = async () => {
    const user = await AsyncStorage.getItem('name');
    setUsername(user);
  };

  useEffect(() => {
    checkUserSession();
  }, []);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    ToastAndroid.show('Logged out Successfully!', ToastAndroid.LONG);
    navigation.push('/Login');
  };



  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp(); // This will exit the app
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: 'white' }}>
      <View style={[t.p1, t.bgWhite, t.flex, t.textCenter, t.flexCol]}>
        

    <Input style={[t.flex,t.flexRow,t.border2,t.m6,t.roundedLg,t.h12,isFocused ? t.borderBlue600 : t.borderBlack]}>
    <AntDesign name="search1" size={24}  color= {isFocused ? '#1e88e5'  : 'black'} style={{width:'10%',marginTop:'3%',marginLeft:'2%'}} />
    <InputField style={{width:'86%',height:'100%'}} onFocus={handleFocus}/>
  </Input>

      </View>
    </ScrollView>
  );
}

export default Home;
