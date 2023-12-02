import React, { useState, useEffect,Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler,StyleSheet } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input,InputField,InputSlot,InputIcon } from '@gluestack-ui/themed';
import { AntDesign,Ionicons } from '@expo/vector-icons';
// import PieChart from 'react-native-expo-pie-chart';
// import PieChart from './Piechart';
import PieChart from 'react-native-pie-chart'



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
 
  const widthAndHeight = 150
  const series = [40, 30, 50]
  // const sliceColor = ['#6DA5C0', '#F9690C','#5EE030']
  // const sliceColor = ['#006400', '#DAA520', '#800020'];
  // const sliceColor = ['#556B2F', '#BDB76B', '#800000'];

  // Soft Blues and Greens
// const sliceColor = ['#7CB9E8', '#A2D9CE', '#BFD3C1'];

// Earthy Tones
// const sliceColor = ['#D2B48C', '#B0C4B1', '#8B8680'];

// Muted Purples and Pinks
// const sliceColor = ['#BAA1C2', '#C4A7CB', '#D3BCC0'];
// Rich Greens and Blues
// const sliceColor = ['#004225', '#006d5b', '#003c64'];

// Deep Purples and Reds
// const sliceColor = ['#4B0082', '#800000', '#8B4513'];

// Luxurious Golds and Browns
const sliceColor = ['#FFD700', '#CD853F', '#8B4513'];






  return (
    <ScrollView contentContainerStyle={{ backgroundColor: 'white' }}>
      <View style={[t.p1, t.bgWhite, t.flex, t.textCenter, t.flexCol]}>
        
    <Input style={[t.flex,t.flexRow,t.border2,t.m4,t.roundedLg,t.h12,isFocused ? t.borderBlue600 : t.borderBlack, t.flex, t.flexRow]}>
    <Ionicons name="ios-reorder-three-outline" size={34} color= {isFocused ? '#1e88e5'  : 'black'} style={{width:'12%',marginTop:'1%',marginLeft:'2%'}} />
    <Text style={[t.roundedRSm,t.bgTeal800,t.absolute,t.right0,t.w10,t.hFull,t.pT2,t.pL2]}>
    <AntDesign name="search1" size={24}  color= 'white' />
    </Text>
    <View style={{width:'70%',height:'100%'}}>
    <InputField style={[t.textLg,t.hFull,t.fontSemibold,t.textGray600]} onFocus={handleFocus}/>
    </View>
    
  </Input>
      </View>
<View>
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
<View style={styles.container}>
          <Text style={styles.title}>Nutritional Analysis</Text>
          <PieChart widthAndHeight={widthAndHeight} series={series} sliceColor={sliceColor} />
          {/* <Text style={styles.title}>Doughnut</Text>
          <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.45}
            coverFill={'#FFF'}
          /> */}
        </View>
    </View>
</View>
      
      
      
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    margin: 10,
    fontWeight:'bold'
  },
})

export default Home;
