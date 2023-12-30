import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image,StyleSheet,Dimensions,ActivityIndicator} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {t} from 'react-native-tailwindcss' ;

const DietRecommend = ({foodname,foodimage,foodinfo}) => {

  return (
    <View style={[t.flex1]}>
      <View style={[t.h16, t.shadowLg, t.bgWhite, t.borderB2, t.borderGray300]}>
        <View style={[t.flex, t.flexRow,t.m1, t.textCenter,t.justifyStart, t.wFull]}>
      <Text style={[t.fontBold, t.text2xl, t.textBlack,t.mT4,t.mL4]}>Diet Recommendations</Text>
        </View>
      </View>
       

       <ScrollView contentContainerStyle={{ flexGrow: 1 , minHeight: '100%', paddingBottom:30 }}>
        
     
       </ScrollView>
    </View>
 
  );
};

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
 
  image: {

    width:120,
    height:120,
    borderRadius: 10,
    margin:8,
  },
  button: {
    // shadowColor: 'rgba(0, 0, 0, 0.5)',
    // shadowOffset: { width: 2, height: 2 },
    // shadowRadius: 5,
    width:10,
    height:5
  },
});
export default DietRecommend;
