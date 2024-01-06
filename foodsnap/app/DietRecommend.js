import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image,StyleSheet,Dimensions,ActivityIndicator,Modal} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {t} from 'react-native-tailwindcss' ;
import DDModalComponent from './DetailedDiet';

const DietRecommend = ({fetchImages, recommendInfo, loading}) => {

const [breakLoop,setbreakLoop]= useState(true);
  const [DDModelVisible, setDDModelVisible] = useState(false);
const [findex,setfindex] = useState(null);
  const openDDModal = async(index) => {
    setfindex(index)
    setbreakLoop(false);
    setDDModelVisible(true);
  };

  const closeDDModal = async() => {
    setfindex(null);
    setbreakLoop(true);
    setDDModelVisible(false);
  };
  // var findex = 0 ;

  const handleNext = () => {
    fetchImages();
  };
  const [tab,settab] = useState(1);

  // const handleDetails=(index)=>{
  //   openDDModal()
  // }
// const dummytext = "Chapati contains whole wheat flour, water, and salt, forming a simple unleavened flatbread staple in Indian cuisine."

  return (
    <View style={[t.flex1]}>
      { breakLoop ?
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
        {/* <View style={[t.flex,t.flexRow,t.selfCenter]}>
       <Text style={[t.textCenter, t.textGray700]}>The suggestions are completely based on BMI, </Text>
       <Text style={[t.textBlue400,t.textCenter,t.fontSemibold]}>Tap to learn more!</Text>
       </View> */}
        <View>
        {
          breakLoop?recommendInfo.currentImages.map((img,index)=>(
            
            <TouchableOpacity style={[t.w30]} key={index} onPress={()=>openDDModal(index)} >
            <View style={[t.flex, t.flexRow, t.bgGray100, t.roundedLg,t.m2,t.border2,t.borderBlue200,t.shadowLg,t.itemsCenter]}>
             <Image source={{ uri: `data:image/jpeg;base64,${img}` }} style={styles.image} />
             <View style={[t.justifyCenter,t.mX2,t.flex1]}>
             <Text style={[t.fontSemibold,t.textLg, t.mY2]}>{recommendInfo.foodNames[index]}</Text>
             <Text>{recommendInfo.descriptions[index]}.</Text>
             {/* <Text>🟥 P: 15g | 10 25</Text> */}
             <View style={[t.flex, t.flexRow,t.mY2, t.justifyBetween]}>
              <View style={[t.flexCol,t.itemsCenter]}>
              {/* <Text style={[t.textXs,t.fontSemibold,t.textOrange800]}>PROTEIN</Text> */}
              <Text style={[t.textXs,t.fontSemibold,t.textGreen700,t.mT1]}>🟥 P: {recommendInfo.nutritionInfo[index]['PROTEIN(G)']}% |</Text>
              </View>
              <View style={[t.flexCol,t.itemsCenter]}>
              {/* <Text style={[t.textXs,t.fontSemibold,t.textOrange800]}>FATS</Text> */}
              <Text style={[t.textXs,t.fontSemibold,t.textGreen700,t.mT1]}> 🟩 F:{recommendInfo.nutritionInfo[index]['FAT(G)']}% |</Text>
              
              </View>
              <View style={[t.flexCol,t.itemsCenter]}>
              {/* <Text style={[t.textXs,t.fontSemibold,t.textOrange800]}>CARBOHYDRATES</Text> */}
              <Text style={[t.textXs,t.fontSemibold,t.textGreen700,t.mT1]}> 🟦 C:{recommendInfo.nutritionInfo[index]['CARBOHYDRATES(G)']}%</Text>
              </View>
             </View>
            
             
             </View>
             </View>
             </TouchableOpacity>
          )): null
        }
        </View>
      
      <TouchableOpacity onPress={handleNext} style={[t.w20,t.h10, t.bgTeal800,t.roundedLg,t.justifyCenter,t.selfEnd,t.m4]} disabled={loading} >
     
        <Text style={[t.textSm, t.textWhite, t.fontSemibold, t.textCenter, t.pX2]}>
        { loading ?
      (
      <ActivityIndicator size="small" color='white'/> ): (<>Generate</>)
       }
      </Text>
      </TouchableOpacity>
     
       </ScrollView>
      
        </View> :  
        <DDModalComponent
          modalVisible={DDModelVisible}
          closeModal={closeDDModal}
          recommendInfo= {recommendInfo}
          findex = {findex}
        />
      }
    </View>
 
  );
};

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
 
  image: {
    // flex:1,
    width:150,
    height:150,
    borderRadius: 10,
    margin:4,
    
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
