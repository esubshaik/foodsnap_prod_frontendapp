import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image,StyleSheet,Dimensions,ActivityIndicator} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {t} from 'react-native-tailwindcss' ;

const DietRecommend = ({fetchImages, currentImages, foodNames,loading}) => {

  const [temp,settemp] = useState('null');
  var findex = 0 ;

  const handleNext = () => {
    fetchImages();
  };
  const [tab,settab] = useState(1);

  // const handleDetails=(foodname,foodimage,foodinfo)=>{
  //   navigation.push("/DetailedDiet", {
  //     // your data goes here
  //     foodname: foodname,
  //     foodimage : foodimage,
  //     foodinfo : foodinfo
  //     // add more key-value pairs as needed
  //   });
  // }
const dummytext = "Chapati contains whole wheat flour, water, and salt, forming a simple unleavened flatbread staple in Indian cuisine."
  return (
    <View style={[t.flex1]}>
      <View style={[t.h16, t.shadowLg, t.bgWhite, t.borderB2, t.borderGray300]}>
        <View style={[t.flex, t.flexRow,t.m1, t.textCenter,t.justifyStart, t.wFull]}>
      <Text style={[t.fontBold, t.text2xl, t.textBlack,t.mT4,t.mL4]}>Diet Recommendations</Text>
        </View>

      </View>
      <View style={[t.flex, t.flexRow,t.m2]}>
       <TouchableOpacity onPress={()=>settab(1)} style={[t.p2,t.mX2,t.roundedLg,t.borderTeal800,t.border2, tab == 1 ? t.bgTeal800 : [t.bgWhite]]}>
          <Text style={[t.textBase, tab==1 ? t.textWhite : t.textTeal900]}>Suggested Foods</Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>settab(2)} style={[t.p2,t.mX2,t.bgTeal800,t.borderTeal800,t.border2,t.roundedLg,tab == 2 ? t.bgTeal800 : t.bgWhite]}>
          <Text style={[t.textBase,tab==2 ? t.textWhite : t.textTeal900]}>Meal Plans</Text>
       </TouchableOpacity>
       </View>
       

       <ScrollView contentContainerStyle={{ flexGrow: 1 , minHeight: '100%', paddingBottom:30 }}>
        <View style={[t.flex,t.flexCol,t.selfCenter]}>
       <Text style={[t.textCenter, t.textGray700]}>The suggestions are completely based on BMI, </Text>
       <Text style={[t.textBlue400,t.textCenter,t.mT1,t.fontSemibold]}>Tap to learn more!</Text>
       </View>
        <View>
        {
          currentImages.map((img,index)=>(
            <TouchableOpacity style={[t.w30]} key={index} >
            <View style={[t.flex, t.flexRow, t.bgOrange100, t.roundedLg,t.m2,t.border2,t.borderOrange200,t.shadowLg]}>
             <Image source={{ uri: `data:image/jpeg;base64,${img}` }} style={styles.image} />
             <View style={[t.justifyCenter,t.mX6,t.flex1]}>
             <Text style={[t.fontSemibold,t.textLg, t.mB2]}>{foodNames[index]}</Text>
             <Text>{dummytext}</Text>
             </View>
             </View>
             </TouchableOpacity>
          ))
        }
        </View>
      
      <TouchableOpacity onPress={handleNext} style={[t.w20,t.h8, t.bgTeal800,t.roundedLg,t.justifyCenter,t.selfEnd,t.m4]} disabled={loading} >
     
        <Text style={[t.textXl, t.textWhite, t.fontSemibold, t.textCenter]}>
        { loading ?
      (
      <ActivityIndicator size="small" color='white'/> ): (<>Next</>)
       }
          
          </Text>
      </TouchableOpacity>
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
