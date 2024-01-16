import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, StyleSheet,Alert,Image } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input,InputField,InputSlot,InputIcon } from '@gluestack-ui/themed';
import { AntDesign } from '@expo/vector-icons';
import ImageUpload from './ImageUpload';
import { Feather,Ionicons,MaterialCommunityIcons,FontAwesome5,FontAwesome,Entypo } from '@expo/vector-icons';
import UserMgmtModal from './UserMgmtModal';
import ImageOpener from './ImageOpener';

function UserMgmt({Profile,userdata, setuserdata, statuses,setstatuses,ReloadProfile,getStoredImage,image}) {
  const navigation = useRouter();
  

  const [imgstatus,setimgstatus] = useState(false);

  const closeImg=()=>{
    setimgstatus(false);
    getStoredImage();
    
  }
  const openImg=()=>{
    setimgstatus(true);
  }

  // useEffect(() => {
  //   ReloadProfile();
  // }, []);

  const hardLogout=async()=>{
    await AsyncStorage.removeItem('token');
    ToastAndroid.show('Logged out Successfully!', ToastAndroid.SHORT);
    navigation.push('/MainOptions');
  }
  const handleLogout = async () => {
    Alert.alert(
      '',
      'Are you sure to logout',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => hardLogout(),
        },
      ],
      { cancelable: true }
    );

  };
 

  // useEffect(()=>{
  //   getstatus();
  // },[]);

  // useEffect(() => {
  //   const backAction = () => {
  //     BackHandler.exitApp();
  //     return true;
  //   };
  //   BackHandler.addEventListener('hardwareBackPress', backAction);

  //   return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  // }, []);

  const [UModelVisible, setUModelVisible] = useState(false);
  const [ItemIndex,setItemIndex] = useState(0);
  const [ItemName,setItemName] = useState("");

    const openUModal = async(index,itemname) => {
      setItemIndex(index);
      setUModelVisible(true);
      setItemName(itemname);
    };
  
    const closeUModal = async() => {
      setItemIndex(null);
      setUModelVisible(false);
      setItemName("");
    };
    

 
  return (
    <View>
    <View style={[t.hFull,t.bgGray100]}>
       <View style={[t.h16, t.shadowLg, t.bgGray100, t.borderB2, t.borderGray300]}>
        <View style={[t.flex, t.flexRow,t.m1, t.textCenter,t.justifyStart, t.wFull]}>
      <Text style={[t.fontBold, t.text2xl, t.textBlack,t.mT4,t.mL4]}>Profile</Text>
        </View>
      </View>
    
    <ScrollView contentContainerStyle={{ backgroundColor: '#F7FCFF' }}>
      <View style={[t.p1, t.bgWhite, t.flex, t.textCenter, t.flexCol,t.bgGray100]}>
      <View style={[t.p4,t.flex,t.flexRow,t.textCenter,t.itemsCenter, t.border2,t.borderGray200,t.mX2,t.mY2,t.roundedLg,t.bgWhite]}>
      {/* <ImageUpload style={{ width: 70, height: 70  }}/> */}
      {
        image  && 
        <TouchableOpacity onPress={openImg}>
          <Image source={{ uri: image }} style={{ width: 70, height: 70 ,borderRadius:50}} />
          </TouchableOpacity>
      }
      <View style={[t.flex, t.flexCol,t.mX6,t.itemsStart]}>
      <Text style={[t.fontExtrabold,t.text3xl]}>{Profile.username} </Text>
      <Text style={[t.textGray600]}>{Profile.emailid}</Text>
      </View>
    </View>
      <View style={[t.mX2,t.pX4,t.mY2,t.pY4, t.bgWhite, t.flex, t.flexRow, t.fontSemibold, t.roundedLg,t.border2,t.borderGray200]}>

      <View style={[t.flex, t.flexCol,t.itemsStart]}>
        <View style={[t.flexRow,t.itemsCenter]}>
        <Entypo name="calendar" size={24} color="#4A4E4F" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>{Profile.age} Years</Text>
      </View>
      <View style={[t.flexRow,t.itemsCenter,t.mY2]}>
      <Ionicons name="location-sharp" size={24} color="#4A4E4F" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>{userdata.location}</Text>
      </View>
      <View style={[t.flexRow,t.itemsCenter,t.mY2]}>
      <MaterialCommunityIcons name="human-male-height" size={24} color="#4A4E4F" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>{Profile.height} Feet</Text>
      </View>
      <View style={[t.flexRow,t.itemsCenter,t.mY2,t.mL1]}>
      <FontAwesome5 name="weight" size={22} color="#4A4E4F"/>
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>{Profile.weight} KG's</Text>
      </View>
      <View style={[t.flexRow,t.itemsCenter,t.mY2,t.mL1]}>
      <MaterialCommunityIcons name="human-male-board-poll" size={24} color="#4A4E4F" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>{Profile.bmi} BMI</Text>
      </View>
      
      <View style={[t.flexRow,t.itemsCenter,t.mY2,t.mL1]}>
      <MaterialCommunityIcons name="food" size={24} color="#4A4E4F" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>{Profile.reqcals} Cal</Text>
      </View>
      </View>
      {/* <TouchableOpacity style={[t.absolute,t.justifyEnd,t.right0,t.bottom0]}><Feather name="edit" size={20} color="black" style={[t.pX4,t.pY4]}/></TouchableOpacity> */}
      </View>
      <View style={[t.flex, t.flexCol,t.itemsStart,t.bgWhite,t.mX2,t.mY2,t.border2,t.borderGray200,t.roundedLg    ]}>

      <TouchableOpacity style={[t.mX2,t.pX4,t.mY1,t.pY2, t.bgWhite, t.flex, t.flexRow,t.itemsCenter,t.wFull]} onPress={()=>openUModal(2,"Your Profile")}>
      <FontAwesome name="user" size={24} color="black" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL5,t.textCenter]}>Your Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[t.mX2,t.pX4,t.mY1,t.pY2, t.bgWhite, t.flex, t.flexRow,t.itemsCenter,,t.wFull]} onPress={()=>openUModal(3,"Settings")}>
      <Ionicons name="settings-sharp" size={23} color="black" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4,t.textCenter]}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[t.mX2,t.pX4,t.mY1,t.pY2, t.bgWhite, t.flex, t.flexRow,t.itemsCenter,t.wFull]} onPress={()=>openUModal(4,"Support")}>
      <Entypo name="help-with-circle" size={23} color="black" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4,t.textCenter]}>Support</Text>
      </TouchableOpacity>
      <TouchableOpacity
          onPress={handleLogout}>
      <View style={[t.mX2,t.pX4,t.mY1,t.pY2, t.bgWhite, t.flex, t.flexRow,t.itemsCenter,,t.wFull]}>
      <MaterialCommunityIcons name="logout" size={26} color="#B60004" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4,t.textCenter]}>Logout</Text>
      </View>
      </TouchableOpacity>
      
      </View>
      </View>
    </ScrollView>
   
    </View>
    <UserMgmtModal
      modalVisible={UModelVisible}
      closeModal={closeUModal}
      Itemindex = {ItemIndex}
      ItemName = {ItemName}
      userData = {userdata}
      setuserdata = {setuserdata}
      statuses = {statuses}
      setstatuses = {setstatuses}
      ReloadProfile={ReloadProfile}
      />
      <ImageOpener modalVisible = {imgstatus} closeModal={closeImg} imgURL={image} handleReload={getStoredImage} />
    </View>
  );
}

export default UserMgmt;
