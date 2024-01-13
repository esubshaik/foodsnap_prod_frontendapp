import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, StyleSheet,Alert } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input,InputField,InputSlot,InputIcon } from '@gluestack-ui/themed';
import { AntDesign } from '@expo/vector-icons';
import ImageUpload from './ImageUpload';
import { Feather,Ionicons,MaterialCommunityIcons,FontAwesome5,FontAwesome,Entypo } from '@expo/vector-icons';
import UserMgmtModal from './UserMgmtModal';


function UserMgmt() {

  const navigation = useRouter();
  const [username, setUsername] = useState("");
  const [age,setage]= useState("");
  const [height,setheight] = useState("");
  const [weight,setweight] = useState("");
  const [bmi,setbmi] = useState("");
  const [reqcals,setreqcals] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [emailid,setemailid] = useState("");
  
  const checkUserSession = async () => {
    const _age = await AsyncStorage.getItem('age');
    const _height = await AsyncStorage.getItem('height');
    const _weight = await AsyncStorage.getItem('weight');
    const _bmi = await AsyncStorage.getItem('bmi');
    const _min = await AsyncStorage.getItem('min_cal');
    const _max = await AsyncStorage.getItem('max_cal');
    const mailid = await AsyncStorage.getItem('email');
    setage(_age);
    setheight(_height);
    setweight(_weight);
    setbmi(parseFloat(_bmi).toFixed(2));
    setemailid(mailid);
    // console.log(_min)
    setreqcals(_min+' - '+_max);
    const user = await AsyncStorage.getItem('name');
    setUsername(user);
  };

  useEffect(() => {
    checkUserSession();
  }, []);

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

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp(); // This will exit the app
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const [UModelVisible, setUModelVisible] = useState(false);
  const [ItemIndex,setItemIndex] = useState(0);
  const [ItemName,setItemName] = useState("");
  const [newWindow,openNewWindow] = useState(false);

    const openUModal = async(index,itemname) => {
      setItemIndex(index);
      setUModelVisible(true);
      setItemName(itemname);
      openNewWindow(true);
    };
  
    const closeUModal = async() => {
      setItemIndex(null);
      setUModelVisible(false);
      setItemName("");
      openNewWindow(false);
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
      <ImageUpload style={{ width: 70, height: 70  }}/>
      <View style={[t.flex, t.flexCol,t.mX6,t.itemsStart]}>
      <Text style={[t.fontExtrabold,t.text3xl]}>{username} </Text>
      <Text style={[t.textGray600]}>{emailid}</Text>
      </View>
    </View>
      <View style={[t.mX2,t.pX4,t.mY2,t.pY4, t.bgWhite, t.flex, t.flexRow, t.fontSemibold, t.roundedLg,t.border2,t.borderGray200]}>

      <View style={[t.flex, t.flexCol,t.itemsStart]}>
        <View style={[t.flexRow,t.itemsCenter]}>
        <Entypo name="calendar" size={24} color="#4A4E4F" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>{age} Years</Text>
      </View>
      <View style={[t.flexRow,t.itemsCenter,t.mY2]}>
      <Ionicons name="location-sharp" size={24} color="#4A4E4F" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>Guntur, Andhra Pradesh</Text>
      </View>
      <View style={[t.flexRow,t.itemsCenter,t.mY2]}>
      <MaterialCommunityIcons name="human-male-height" size={24} color="#4A4E4F" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>{height} Feet</Text>
      </View>
      <View style={[t.flexRow,t.itemsCenter,t.mY2,t.mL1]}>
      <FontAwesome5 name="weight" size={22} color="#4A4E4F"/>
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>{weight} KG's</Text>
      </View>
      <View style={[t.flexRow,t.itemsCenter,t.mY2,t.mL1]}>
      <MaterialCommunityIcons name="human-male-board-poll" size={24} color="#4A4E4F" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>{bmi} BMI</Text>
      </View>
      
      <View style={[t.flexRow,t.itemsCenter,t.mY2,t.mL1]}>
      <MaterialCommunityIcons name="food" size={24} color="#4A4E4F" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4]}>{reqcals} Cal</Text>
      </View>
      </View>
      <TouchableOpacity style={[t.absolute,t.justifyEnd,t.right0,t.bottom0]}><Feather name="edit" size={20} color="black" style={[t.pX4,t.pY4]}/></TouchableOpacity>
      </View>
      <View style={[t.flex, t.flexCol,t.itemsStart,t.bgWhite,t.mX2,t.mY2,t.border2,t.borderGray200,t.roundedLg    ]}>

      <View style={[t.mX2,t.pX4,t.mY1,t.pY2, t.bgWhite, t.flex, t.flexRow,t.itemsCenter]}>
      <FontAwesome name="user" size={24} color="black" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4,t.textCenter]}>Your Profile</Text>
      </View>
      <View style={[t.mX2,t.pX4,t.mY1,t.pY2, t.bgWhite, t.flex, t.flexRow,t.itemsCenter]}>
      <Ionicons name="settings-sharp" size={23} color="black" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4,t.textCenter]}>Settings</Text>
      </View>
      <TouchableOpacity style={[t.mX2,t.pX4,t.mY1,t.pY2, t.bgWhite, t.flex, t.flexRow,t.itemsCenter]} onPress={()=>openUModal(4,"Support")}>
      <Entypo name="help-with-circle" size={23} color="black" />
      <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mL4,t.textCenter]}>Support</Text>
      </TouchableOpacity>
      <TouchableOpacity
          onPress={handleLogout}>
      <View style={[t.mX2,t.pX4,t.mY1,t.pY2, t.bgWhite, t.flex, t.flexRow,t.itemsCenter]}>
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
      Itemindex = {4}
      ItemName = {ItemName}
      />
    </View>
  );
}

export default UserMgmt;
