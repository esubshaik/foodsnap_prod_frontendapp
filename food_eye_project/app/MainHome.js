import React, { useState, useEffect,Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler,StyleSheet,Dimensions,Alert } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input,InputField,InputSlot,InputIcon } from '@gluestack-ui/themed';
import { AntDesign,Ionicons } from '@expo/vector-icons';
import ProgressChartGrid from './SpiralChart';
import ModalComponent from './ModalClass';


function Home() {
  const screenWidth = Dimensions.get("window").width;
  const navigation = useRouter();
  const [username, setUsername] = useState("");
  const [myInput,setInput] = useState("");
  
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

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp(); // This will exit the app
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);


const analyzeFood  = async () => { 
  const foodid = myInput ;
  console.log(foodid);
  const requestOptions = { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ foodname: foodid }) 
}; 
    try { 
        await fetch( 
            'https://backend-server-lhw8.onrender.com/api/user/analyze-food', requestOptions) 
            .then(response => { 
                response.json() 
                    .then(data => { 
                        console.log(data); 
                        setModalData(data);
                    }); 
            }) 

            openModal();
    } 
    catch (error) { 
        console.error(error); 
    } 
} 
const [modalVisible, setModalVisible] = useState(false);
const [modalData, setModalData] = useState('');

const openModal = () => {
  // setModalData('Hello from Main Component!'); // Set the data you want to send
  setModalVisible(true);
};

const closeModal = () => {
  setModalVisible(false);
};
  return (
    <ScrollView contentContainerStyle={{ backgroundColor: 'white' }}>
      <View style={[t.p1, t.bgWhite, t.flex, t.textCenter, t.flexCol]}>
        
    <Input style={[t.flex,t.flexRow,t.border2,t.m4,t.roundedLg,t.h12,isFocused ? t.borderBlue600 : t.borderBlack, t.flex, t.flexRow]}>
    <Ionicons name="ios-reorder-three-outline" size={34} color= {isFocused ? '#1e88e5'  : 'black'} style={{width:'12%',marginTop:'1%',marginLeft:'2%'}} />
   
    <Text style={[t.roundedRSm,t.bgTeal800,t.absolute,t.right0,t.w10,t.hFull,t.pT2,t.pL2]}>
    <TouchableOpacity onPress={analyzeFood}>
    <AntDesign name="search1" size={24}  color= 'white' />
    </TouchableOpacity>
    </Text>
    
    <View style={{width:'70%',height:'100%'}}>
    <InputField style={[t.textLg,t.hFull,t.fontSemibold,t.textGray600]} onFocus={handleFocus} onChange={(event) => setInput(event.nativeEvent.text)}
 onSubmitEditing={analyzeFood} />
    </View>
    
  </Input>
      </View>
      <View>
      <ProgressChartGrid/>


      <ModalComponent
        modalVisible={modalVisible}
        closeModal={closeModal}
        modalData={modalData}
        foodname={myInput}
      />


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
