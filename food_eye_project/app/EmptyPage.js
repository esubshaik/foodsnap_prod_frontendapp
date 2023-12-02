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
    <ScrollView contentContainerStyle={{ backgroundColor: 'white',alignContent:'center',alignItems:'center' }}>
      <View  style={{marginTop:'60%'}}>
        
<Text style={[t.fontBold]}>YET TO DEVELOP</Text>

      </View>
    </ScrollView>
  );
}

export default Empty;
