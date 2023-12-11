import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input,InputField,InputSlot,InputIcon } from '@gluestack-ui/themed';
import { AntDesign } from '@expo/vector-icons';



function UserMgmt() {
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
      <View style={[t.p1,t.mT10, t.bgWhite, t.flex, t.textCenter, t.flexCol]}>
      <Text style={{ fontSize: 20, alignSelf:"center",marginBottom:'5%',fontWeight:'bold' }}>USER MANAGEMENT </Text>
        <Text style={{ fontSize: 16, alignSelf:"center",marginBottom:'100%',fontWeight:'bold' }}>Name: {username} </Text>

        <TouchableOpacity
          onPress={handleLogout}
          style={{ width: '40%', height: '16%', marginTop: '4%',padding:10, alignSelf: 'center', marginTop: '6%', backgroundColor: '#0C7078', borderRadius: 20, justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { navigation.push("/Camera") }}
          style={{ width: '40%', height: '18%',padding:10, marginTop: '4%', alignSelf: 'center', marginTop: '6%', backgroundColor: '#0C7078', borderRadius: 20, justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Scan my Food</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default UserMgmt;
