import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, StyleSheet } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input,InputField,InputSlot,InputIcon } from '@gluestack-ui/themed';
import { AntDesign } from '@expo/vector-icons';
import ImageUpload from './ImageUpload';



function UserMgmt() {


  const navigation = useRouter();
  const [username, setUsername] = useState("");
  const [age,setage]= useState("");
  const [height,setheight] = useState("");
  const [weight,setweight] = useState("");
  const [bmi,setbmi] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const checkUserSession = async () => {
    const _age = await AsyncStorage.getItem('age');
    const _height = await AsyncStorage.getItem('height');
    const _weight = await AsyncStorage.getItem('weight');
    const _bmi = await AsyncStorage.getItem('bmi');
    setage(_age);
    setheight(_height);
    setweight(_weight);
    setbmi(parseFloat(_bmi).toFixed(2));
    const user = await AsyncStorage.getItem('name');
    setUsername(user);
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    ToastAndroid.show('Logged out Successfully!', ToastAndroid.SHORT);
    navigation.push('/MainOptions');
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp(); // This will exit the app
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

 
  return (
    <ScrollView contentContainerStyle={{ backgroundColor: 'white' }}>
      <View style={[t.p1, t.bgWhite, t.flex, t.textCenter, t.flexCol]}>
      <View style={styles.container}>
      <ImageUpload/>
      <Text style={{marginVertical:20,fontSize:24, fontWeight:'800'}}>Hi, {username} </Text>
    </View>
      <View style={[t.mX10, t.bgGray200, t.flex, t.flexRow, t.fontSemibold, t.text4xl, t.itemsCenter, t.justifyCenter, t.roundedLg,t.pY4]}>
        <View>
        <Text style={[t.textLg, t.bgTeal800, t.textWhite, t.p2, t.roundedLg,t.m2]} >Age</Text>
          <Text style={[t.textLg, t.bgTeal800, t.textWhite, t.p2, t.roundedLg,t.m2]}>Height </Text>
          <Text style={[t.textLg, t.bgTeal800, t.textWhite, t.p2, t.roundedLg,t.m2]}>Weight </Text>
          <Text style={[t.textLg, t.bgTeal800, t.textWhite, t.p2, t.roundedLg,t.m2]}>BMI </Text>
        </View>
        <View>
        <Text style={[t.textLg, t.p2, t.m2, t.fontBold]} >  :    {age} Years</Text>
          <Text style={[t.textLg,t.p2, t.m2, t.fontBold]}>  :    {height} Feet</Text>
          <Text style={[t.textLg,t.p2, t.m2,t.fontBold]}>  :    {weight} KG</Text>
          <Text style={[t.textLg,t.p2, t.m2,t.fontBold]}>  :    {bmi}</Text>
        </View>
          
      </View>
      <View style={[t.mT10]}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ width: '40%', height: '16%', marginTop: '4%',padding:10, alignSelf: 'center', marginTop: '6%', backgroundColor: '#0C7078', borderRadius: 20, justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Logout</Text>
        </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
          onPress={() => { navigation.push("/Camera") }}
          style={{ width: '40%', height: '18%',padding:10, marginTop: '4%', alignSelf: 'center', marginTop: '6%', backgroundColor: '#0C7078', borderRadius: 20, justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Scan my Food</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding:50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserMgmt;
