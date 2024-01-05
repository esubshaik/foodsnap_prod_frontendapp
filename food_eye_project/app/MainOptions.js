import React, {useState,useEffect} from 'react';
import { View, Text, Image,Button, TouchableOpacity,ScrollView ,StatusBar,BackHandler} from 'react-native';
import { t } from 'react-native-tailwindcss';
import {useRouter} from 'expo-router' ;
import Login from './Login';
import SignUp from './SignUp';
import {Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


function MainOptions() {
  const navigation = useRouter() ;
  const [val,setval] = useState(0);
const [LoginVisible, setLoginVisible] = useState(false);
const [SignupVisible, setSignupVisible] = useState(false);
// const [modalData, setModalData] = useState('');

const openModal = () => {
  // setModalData('Hello from Main Component!'); // Set the data you want to send
  setval(val+1);
  setLoginVisible(true);
 
};

const closeModal = () => {
  setLoginVisible(false);
};

const openSignupModal = () => {
  // setModalData('Hello from Main Component!'); // Set the data you want to send
  setval(val+1);
  setSignupVisible(true);
  
};

const closeSignupModal = () => {
  setCollapsed(false);
  setSignupVisible(false);
  
};
useEffect(() => {
  const backAction = () => {
    BackHandler.exitApp(); // This will exit the app
    return true;
  };

  BackHandler.addEventListener('hardwareBackPress', backAction);
  return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
}, []);





  const [isEnabled, setIsEnabled] = useState(false);

const toggleSwitch = () => {
  setIsEnabled((previousState) => !previousState);
};
const [isCollapsed, setCollapsed] = useState(false);


  return (
    <ScrollView contentContainerStyle={{  flexGrow: 1, paddingBottom: 10, backgroundColor:'white' }}>
    <View style={[t.p1, t.bgWhite, t.flex, t.flexCol, t.itemsCenter]}>
    <View style={{ height: '20%', width:'50%',display:'flex', flexDirection:'row', alignContent:'flex-start', alignSelf:'flex-start' }}>
      <Image
        source={require('./assets/appicon.png')}
        style={{ flex: 0, width: 40, height: 40, margin:'5%' }}
        resizeMode="contain"
      />
      <Text style={[t.h12,t.alignCenter,t.mT1, t.text2xl, t.fontSemibold,t.textTeal800]}>Food Snap</Text>
    </View>
      
      <View style={{ width: 350, height: 320 }}>
        <Image 
          source={require('./assets/Initialize/RBlue.jpg')}
          style={{ flex: 1, width: null, height: null }}
          resizeMode="contain" // or "cover" depending on your preference
        />
      </View>
      <Text style={[t.text4xl, t.flex, t.mL4, t.textTeal800,t.selfStart, t.fontHairline,t.fontSemibold]}>Welcome.</Text>
      <Text style={[t.textBase,t.fontMedium, t.mT2, t.textTeal800,t.mL4,t.selfStart]}>Log your diet and elevate your nutritional journey</Text>
      
      <View style={{ width: '90%', height: '20%', marginTop: '20%' }}>
      <Login
        modalVisible={LoginVisible}
        closeModal={closeModal}
        data = {val}
      />
      <SignUp modalVisible={SignupVisible}
      closeModal={closeSignupModal}
      data = {val}
      isCollapsed = {isCollapsed}
      setCollapsed = {setCollapsed}
      />

  <View style={[t.wFull, t.flexCol,t.relative,t.bottom0]}>
    <TouchableOpacity
      // onPress={()=>{navigation.push("/SignUp")}}
      onPress={openSignupModal}
      style={{
        backgroundColor: '#0C7078',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:2,
        borderColor:'#0C7078',
        padding: 10,
        width:'100%',
        
      }}
    >
      <Text
        style={{
          color: 'white',
          fontWeight: '600',
          fontSize: 18,
        }}
      >
        Sign up
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      //  onPress={()=>{navigation.push("/Login")}}
      onPress={openModal}
      style={{
        // borderColor: '#0C7078',
        marginTop:20,
        borderWidth:2,
        borderColor:'#0C7078',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        
      }}
    >
      <Text
        style={{
          color: '#0C7078',
          fontWeight: '600',
          fontSize: 18,
        }}
      >
        Log in
      </Text>
    </TouchableOpacity>
  </View>
</View>


    </View>
    </ScrollView>
  );
}

export default MainOptions;
