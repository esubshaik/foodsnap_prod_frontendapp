import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input,InputField,InputSlot,InputIcon } from '@gluestack-ui/themed';
import { AntDesign } from '@expo/vector-icons';


function Empty() {
  const navigation = useRouter();
  
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
      <View style={[t.h16, t.shadowLg, t.bgGray100, t.borderB2, t.borderGray300]}>
    <View style={[t.flex, t.flexRow,t.m1, t.textCenter,t.justifyStart, t.wFull]}>
  <Text style={[t.fontBold, t.text2xl, t.textBlack,t.mT4,t.mL4]}>Community</Text>
    </View>
  </View>
    {/* <ScrollView contentContainerStyle={{ backgroundColor: 'white',alignContent:'center',alignItems:'center' }}>
      
    </ScrollView> */}
    </View>
  );
}

export default Empty;
