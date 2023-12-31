import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, Switch } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input,InputField,InputSlot,InputIcon } from '@gluestack-ui/themed';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

function Notifications() {
  const navigation = useRouter();
  
  const handleBack=()=>{
   navigation.push('/Home');
   

  }

  // useEffect(() => {
  //   const backAction = () => {
  //   //   BackHandler.exitApp(); // This will exit the app
    
  //     return true;
  //   };

  //   BackHandler.addEventListener('hardwareBackPress', backAction);

  //   return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  // }, []);
const [isEnabled, setIsEnabled] = useState(false);

const toggleSwitch = () => {
  setIsEnabled((previousState) => !previousState);
};

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
    thumbColor={isEnabled ? 'darkgreen' : '#f4f3f4'}
    ios_backgroundColor="#81b0ff"
    onValueChange={toggleSwitch}
    value={isEnabled}
  />
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text style={[t.textBase]}>Enable Food Allergen Alerts:</Text>
  <Switch
    trackColor={{ false: '#B4CCB9', true: 'skyblue' }}
    thumbColor={isEnabled ? 'darkgreen' : '#f4f3f4'}
    ios_backgroundColor="#81b0ff"
    onValueChange={toggleSwitch}
    value={isEnabled}
  />
</View>

    </ScrollView>
    </View>
  );
}

export default Notifications;
