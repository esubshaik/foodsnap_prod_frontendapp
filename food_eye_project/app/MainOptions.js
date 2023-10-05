import React, {useState} from 'react';
import { View, Text, Image,Button, TouchableOpacity,ScrollView ,StatusBar} from 'react-native';
import { t } from 'react-native-tailwindcss';
import {useRouter} from 'expo-router' ;

function MainOptions() {
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
        <View></View>
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
      
      <View style={{ width: '90%', height: 'auto', marginTop: '20%' }}>

  <View style={[t.wFull, t.flexRow]}>
    <TouchableOpacity
      onPress={()=>{navigation.push("/SignUp")}}
      style={{
        backgroundColor: '#EC0444',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height:40,
        flex: 1,
        margin: 5, // Add some margin for spacing between buttons
      }}
    >
      <Text
        style={{
          color: 'white',
          fontWeight: '600',
          fontSize: 18,
        }}
      >
        SignUp
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
       onPress={()=>{navigation.push("/Login")}}
      style={{
        backgroundColor: '#EC0444',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        margin: 5,
      }}
    >
      <Text
        style={{
          color: 'white',
          fontWeight: '600',
          fontSize: 18,
        }}
      >
        Login
      </Text>
    </TouchableOpacity>
  </View>
</View>


    </View>
    </ScrollView>
  );
}

export default MainOptions;
