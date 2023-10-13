import React, {useState, useEffect} from 'react';
import { View, Text, Image,Button, TouchableOpacity,ScrollView , StatusBar} from 'react-native';
import { t } from 'react-native-tailwindcss';
import {useRouter} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Start() {
    const navigation = useRouter() ;
  return (
    <ScrollView contentContainerStyle={{  flexGrow: 1, paddingBottom: 100, backgroundColor:'white' }}>
    <View style={[t.p1, t.bgWhite, t.flex, t.flexCol, t.itemsCenter, t.justifyCenter]}>
      
      <View style={{ width: 300, height: 150 }}>
        <Image 
          source={require('./assets/logo-white.png')}
          style={{ flex: 1, width: null, height: null }}
          resizeMode="contain" // or "cover" depending on your preference
        />
      </View>
      
      <View style={{ width: 300, height: 300 }}>
        <Image 
          source={require('./assets/banner-1.png')}
          style={{ flex: 1, width: null, height: null }}
          resizeMode="contain" // or "cover" depending on your preference
        />
      </View>
      <Text style={[t.text4xl, t.m110, t.flex, t.mT4, t.textGray700, t.fontHairline]}>TRACK YOUR HEALTH</Text>
      <Text style={[t.textSm, t.mT2, t.textGray600]}>Get Meal Plans Designed to Reach your Goals</Text>

<View style={{ width: '90%', height: '6%', marginTop:'20%' }}>

  <TouchableOpacity
  onPress={()=>{navigation.push("/MainOptions")}}
    style={{
      backgroundColor: '#EC0444',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1, 
    }}
  >
    <Text
      style={{
        color: 'white',
        fontWeight: '600', // Semibold
        fontSize: 18, // Adjust the font size as needed
      }}
    >
      Get Started
    </Text>
  </TouchableOpacity>
</View>


    </View>
    </ScrollView>
  );
}

export default Start;
