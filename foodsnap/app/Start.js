import React, {useState, useEffect} from 'react';
import { View, Text, Image,Button, TouchableOpacity,ScrollView , StatusBar,BackHandler} from 'react-native';
import { t } from 'react-native-tailwindcss';
import {useRouter} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HorizontalStackPage from './HorizantalStack' ;
function Start() {
    const navigation = useRouter() ;

    useEffect(() => {
      const backAction = () => {
        BackHandler.exitApp(); // This will exit the app
        return true;
      };
  
      BackHandler.addEventListener('hardwareBackPress', backAction);
  
      return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []);
  return (
    <View style={{ paddingBottom: 10, backgroundColor: '#ffffff' }}>
  <View style={[t.p1, t.flex, t.flexCol, t.itemsCenter, t.hFull]}>
    <View style={{ height: '20%', width:'50%',display:'flex', flexDirection:'row', alignContent:'flex-start', alignSelf:'flex-start' }}>
      <Image
        source={require('./assets/appicon.png')}
        style={{ flex: 0, width: 40, height: 40, margin:'5%' }}
        resizeMode="contain"
      />
      <Text style={[t.h12,t.alignCenter,t.mT1, t.text2xl, t.fontSemibold,t.textTeal800]}>Food Snap</Text>
    </View>
    <View style={{ height: '60%' }}>
      <HorizontalStackPage />
    </View>

    <View style={{ width: '90%', height: '7%', marginTop: '25%' }}>
      <TouchableOpacity
        onPress={() => {
          navigation.push('/MainOptions');
        }}
        style={{
          backgroundColor: '#0C7078',
          borderRadius: 20,
          height: '7%',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: '600', // Semibold
            fontSize: 20, // Adjust the font size as needed
          }}
        >
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</View>

  );
}

export default Start;
