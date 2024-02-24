import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Pressable, ScrollView, ToastAndroid, StatusBar, ActivityIndicator, Modal } from 'react-native';
import { color, t } from 'react-native-tailwindcss';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import HOST_URL from './config';

const FillProfile = ({ closeModal, modalVisible, reload }) => {
  const navigation = useRouter();
  //   const [index,setindex]=useState(0) ;

  const [LoadingClose, setLoadingClose] = useState(false);

  const getusercal = async () => {
    const str_age = await AsyncStorage.getItem('age');
    const age = parseInt(str_age);
    const gender = AsyncStorage.getItem('gender');
    const user_cal = await axios.get(HOST_URL+`/api/user/req-calories/${age}/${gender}`);
    await AsyncStorage.setItem('min_cal', user_cal.data.data.min_calories.toString());
    await AsyncStorage.setItem('max_cal', user_cal.data.data.max_calories.toString());
    await AsyncStorage.setItem('avg_cal', (((parseInt(user_cal.data.data.max_calories) + parseInt(user_cal.data.data.min_calories)) / 2)).toString());

  }


  const fetchuserprofile = async () => {
    closeModal();
    const token = await AsyncStorage.getItem('token');
    try {
      setLoadingClose(true);
      const response = await axios.get(
        HOST_URL+'/api/user/get-user-profile',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      const age = await response.data.age;
      const height = await response.data.height;
      const weight = await response.data.weight;
      const calrange = await response.data.calrange ;
      const location = await response.data.location;

      // Convert height from feet to meters
      const heightInMeters = parseFloat(height) * 0.3048;

      if (heightInMeters <= 0 || parseFloat(weight) <= 0) {
        // console.error("Invalid height or weight");
      } else {
        const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);

        if (!isNaN(bmi) && isFinite(bmi)) {
          await AsyncStorage.setItem('age', age);
          await AsyncStorage.setItem('height', height);
          await AsyncStorage.setItem('weight', weight);
          await AsyncStorage.setItem('bmi', bmi.toString());
          // console.log(calrange);
          await AsyncStorage.setItem('calrange',calrange);
          await AsyncStorage.setItem('location',location);
          await getusercal();
        } else {
          // console.error("Invalid BMI calculation");
        }
      }


    }
    catch (error) {
      // console.log(error)
    }
    finally {
      
      reload();
      setLoadingClose(false);
    }
  }

  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    location:'India',
    activityfactor: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      // console.log(gender)
      if (!formData.age || !formData.height || !formData.weight || !formData.gender) {
        ToastAndroid.show('Please Fill All Details', ToastAndroid.SHORT);
        return;
      }
      // setFormData({ ...formData, gender: gender })

      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(

        HOST_URL+'/api/user/update-profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',

          },
        }
      );

      // console.error(response.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
      setTimeout(() => {
        // Navigate to the home screen after 4 seconds
        navigation.push('/Home'); // Replace 'Home' with your actual route name
      }, 1000);
    }

  }


  return (
    <Modal
      animationType="fade"
      transparent={false}
      //   key={data}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={[t.roundedLg, t.wFull, t.absolute, t.bottom0]}>
        <ScrollView contentContainerStyle={{ height: '70%', flexGrow: 1, backgroundColor: '#072e33',borderWidth:2,borderColor:'#072e33',borderTopLeftRadius:20,borderTopRightRadius:20 }}>
          <View style={[t.p1, t.flex, t.textCenter, t.flexCol, t.itemsCenter, t.pB100, t.roundedTLg]}>

            <View>

              <View style={[t.flex, t.flexRow, t.justifyBetween, t.mT4, t.mB6]}>
                <Text style={[t.textXl, t.fontSemibold, t.textWhite]}>Fill Profile</Text>
                <TouchableOpacity onPress={fetchuserprofile}>
                  <Ionicons name="ios-close-sharp" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={{ width: 300, height: null }}>




                <View style={{ width: '90%', height: '65%', marginTop: '5%', marginBottom: '15%', alignSelf: 'center' }}>

                  <View style={t.mB4}>
                    <Text style={[t.textBase, t.textWhite, t.fontBold, t.mB1]}>Gender: {formData.gender} </Text>
                    <View style={[t.flex, t.flexRow, t.justifyCenter, t.itemsCenter, t.selfCenter, t.wFull]}>
                    {/* () => setgender("male")  */}
                      <TouchableOpacity onPress={()=>setFormData({...formData, gender : 'male'})}>
                        <Foundation name="male-symbol" size={60} color={formData.gender === "male" ? '#294D61' : "white"} backgroundColor={formData.gender === "male" ? 'white' : "#294D61"}
                          style={[t.pX5, t.m2, t.border2, t.borderWhite, t.roundedLg]} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>setFormData({...formData, gender : 'female'})}>
                        <Foundation name="female-symbol" size={60} color={formData.gender === "female" ? '#294D61' : "white"} backgroundColor={formData.gender === "female" ? 'white' : "#294D61"} style={[t.pX6, t.m2, t.border2, t.borderWhite, t.roundedLg]} />
                      </TouchableOpacity>
                    </View>


                    {/* <TextInput
          style={[t.border,t.borderWhite, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull,t.textWhite,t.fontSemibold]}
          placeholder="Enter your Age"
          placeholderTextColor="white" 
          keyboardType="numeric"
          autoCapitalize="none" 
          onChangeText={(text) => setFormData({ ...formData, gender: text })}
        /> */}
                  </View>

                  <View style={t.mB4}>
                    <Text style={[t.textBase, t.textWhite, t.fontBold, t.mB1]}>Age:</Text>
                    <TextInput
                      style={[t.border, t.borderWhite, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull, t.textWhite, t.fontSemibold]}
                      placeholder="Years"
                      placeholderTextColor="white"
                      keyboardType="numeric"
                      autoCapitalize="none"
                      onChangeText={(text) => setFormData({ ...formData, age: text })}
                    />
                  </View>

                  <View style={t.mB4}>
                    <Text style={[t.textBase, t.textWhite, t.fontBold, t.mB1]}>Height:</Text>
                    <TextInput
                      style={[t.border, t.borderWhite, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull, t.textWhite, t.fontSemibold]}
                      placeholder="feet"
                      placeholderTextColor="white"
                      keyboardType="numeric"
                      autoCapitalize="none"
                      onChangeText={(text) => setFormData({ ...formData, height: text })}
                    />
                  </View>


                  <View style={t.mB4}>
                    <Text style={[t.textBase, t.textWhite, t.fontBold, t.mB1]}>Weight:</Text>
                    <View style={[t.relative, t.flex, t.wFull]}>
                      <TextInput
                        style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull, t.pl10pr10, t.textWhite, t.fontSemibold]}
                        placeholder="Kg"
                        keyboardType="numeric"
                        autoCapitalize="none"
                        placeholderTextColor="white"
                        onChangeText={(text) => setFormData({ ...formData, weight: text })}
                      />
                    </View>
                  </View>
                  <View style={t.mB4}>
                    <Text style={[t.textBase, t.textWhite, t.fontBold, t.mB1]}>Location:</Text>
                    <View style={[t.relative, t.flex, t.wFull]}>
                      <TextInput
                        style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull, t.pl10pr10, t.textWhite, t.fontSemibold]}
                        placeholder="Current location"
                        autoCapitalize="none"
                        placeholderTextColor="white"
                        onChangeText={(text) => setFormData({ ...formData, location: text })}
                      />
                    </View>
                  </View>
                  <View style={{ width: '100%', height: 44, alignSelf: 'center', marginBottom: 20, marginTop: 40 }}>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={{
                        backgroundColor: 'white',
                        height: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',

                        flex: 1,
                        flexDirection: 'row'

                      }}
                    >
                      {loading ?
                        (
                          <ActivityIndicator size="large" color='#072e33' />) : (<></>)
                      }
                      <Text
                        style={{
                          color: '#072e33',
                          fontWeight: '600',
                          marginLeft: 4,
                          // Semibold
                          fontSize: 16, // Adjust the font size as needed
                        }}
                      >
                        {
                          loading ? "Please wait" : "Submit"
                        }

                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: '100%', height: 44, alignSelf: 'center', marginBottom: 10 }}>
                    <TouchableOpacity
                      onPress={fetchuserprofile}
                      style={{
                        backgroundColor: '#E70A0A',
                        height: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',

                        flex: 1,
                        flexDirection: 'row'
                      }}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          marginLeft: 4,
                          fontSize: 16,
                        }}
                      >
                        {
                          LoadingClose ? "Please wait" : "Close"
                        }

                      </Text>
                    </TouchableOpacity>
                  </View>


                </View>

              </View>
            </View>
          </View>
        </ScrollView>
        {/* <Button title='Close' ></Button> */}
      </View>
    </Modal>

  );
};
export default FillProfile;