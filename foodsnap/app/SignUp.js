import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, Button, TouchableOpacity, TextInput, Pressable, ScrollView, ToastAndroid, StatusBar, ActivityIndicator, Modal } from 'react-native';
import { t } from 'react-native-tailwindcss';
// import PhoneInput from "react-native-phone-number-input";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Collapsible from 'react-native-collapsible';
import HOST_URL from './config';

const SignUp = ({ modalVisible, closeModal, data, isCollapsed, setCollapsed }) => {

  const toggleCollapsible = () => {
    setCollapsed(!isCollapsed);
  };
  const [loading, setLoading] = useState(false);
  const navigation = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [otp, setotp] = useState("");
  const [recotp, setrecotp] = useState("");
  const [ismatched, setismatched] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '0',
    height: '0',
    weight: '0',
    gender: '',
    location: '',
    pstatus: 1,
    astatus: 1,
    nstatus: 1,
    fstatus: 1,
    ostatus: 1,
    calrange: '',
    issues: 'None'
  });

  const requestOTP = async () => {

    const emailData = {
      email: formData.email
    };
    // console.log(emailData);
    try {
      const response = await axios.post(
        HOST_URL + '/api/user/send-otp',
        emailData, {}
      );

      // console.log(response.data);
      if (response.status === 200) {
        const { message, OTP } = response.data;
        ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
        setrecotp(OTP);
        toggleCollapsible();
      }
      else {
        ToastAndroid.show(`An Unknown Error Occured!`, ToastAndroid.SHORT);
      }
    }
    catch (error) {
      ToastAndroid.show(`Please Request OTP again !`, ToastAndroid.SHORT);
    }
    finally {

    }

  }
  // const handleOTPCheck=()=>{

  //   if (otp.length === 5 && otp === recotp){
  //     setismatched(false);
  //   }
  // }

  const [passwordVisibility1, setPasswordVisibility1] = useState(true);
  const [passwordVisibility2, setPasswordVisibility2] = useState(true);
  const [rightIcon1, setRightIcon1] = useState('eye-off');
  const [rightIcon2, setRightIcon2] = useState('eye-off');

  const handlePasswordVisibility1 = () => {
    if (rightIcon1 === 'eye') {
      setRightIcon1('eye-off');
      setPasswordVisibility1(!passwordVisibility1);
    } else if (rightIcon1 === 'eye-off') {
      setRightIcon1('eye');
      setPasswordVisibility1(!passwordVisibility1);
    }
  }
  const handlePasswordVisibility2 = () => {
    if (rightIcon2 === 'eye') {
      setRightIcon2('eye-off');
      setPasswordVisibility2(!passwordVisibility2);
    } else if (rightIcon2 === 'eye-off') {
      setRightIcon2('eye');
      setPasswordVisibility2(!passwordVisibility2);
    }
  }
  const handleSubmit = async () => {

    try {
      setLoading(true);
      if (otp !== recotp) {
        // console.log(otp);
        // console.log(recotp);
        ToastAndroid.show('OTP is wrong', ToastAndroid.SHORT);
        return;
      }

      else if (!formData.name || !formData.confirmPassword || !formData.email || !formData.phone || !formData.password) {
        ToastAndroid.show('Please Fill all details', ToastAndroid.SHORT);
        return;
      }
      else if (!isChecked) {
        ToastAndroid.show('Please accept the Terms of Service and Privacy Policy', ToastAndroid.SHORT);
        return;
      }
      else if (formData.password !== formData.confirmPassword) {
        ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
        return;
      }
      else{
// setLoading(true);
      const response = await axios.post(

        HOST_URL + '/api/user/register',
        formData,
        {
          headers: {
            'Content-type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        const { message, name, accessToken } = response.data;

        ToastAndroid.show(`Registered successfully, Please Login`, ToastAndroid.SHORT);
        closeModal();
        setTimeout(() => {
          // Navigate to the home screen after 4 seconds
          navigation.push("/MainOptions");
          // Replace 'Home' with your actual route name
        }, 2000); // 4000 milliseconds = 4 seconds
      } else if (response.status === 400) {
        ToastAndroid.show('Bad Request', ToastAndroid.SHORT);
      } else if (response.status === 401) {
        ToastAndroid.show('Unauthorized', ToastAndroid.SHORT);
      } else if (response.status === 409) {
        ToastAndroid.show('User already exists', ToastAndroid.SHORT);
      } else if (response.status === 500) {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      }
      }
      
      
    } catch (err) {
      // console.log(err);
      // navigation.push("/SignUp");
      ToastAndroid.show("User Already Exists!", ToastAndroid.SHORT);
    }
    finally {
      // <ActivityIndicator size="large" />
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      key={data}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={[t.roundedLg, t.wFull, t.absolute, t.bottom0]}>
        <ScrollView contentContainerStyle={{ height: '70%', flexGrow: 1, backgroundColor: '#072e33' }}>
          <View style={[t.p1, t.flex, t.textCenter, t.flexCol, t.itemsCenter, t.pB100, t.roundedTLg]}>

            <View>

              <View style={[t.flex, t.flexRow, t.justifyBetween, t.mT4, t.mB6]}>
                <Text style={[t.textXl, t.fontSemibold, t.textWhite]}>Sign up</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="ios-close-sharp" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View style={{ width: 300, height: '100%' }}>
                <Collapsible collapsed={isCollapsed}>
                  <View style={t.mB4}>
                    <Text style={[t.textBase, t.textWhite, t.fontBold, t.mB1]}>Name:</Text>
                    <TextInput
                      style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull, t.pl10pr10, t.textWhite, t.fontSemibold]}
                      placeholder="Enter your name"
                      placeholderTextColor="white"
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      autoFocus
                    />
                  </View>

                  <View style={t.mB4}>
                    <Text style={[t.textBase, t.textWhite, t.fontBold, t.mB1]}>Email:</Text>
                    <TextInput
                      style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull, t.pl10pr10, t.textWhite, t.fontSemibold]}
                      placeholder="Enter your email"
                      placeholderTextColor="white"
                      onChangeText={(text) => setFormData({ ...formData, email: text.toLowerCase() })}
                      keyboardType="email-address"
                      editable={ismatched}
                    />
                  </View>
                  {/* { loading ?
      (
         <ActivityIndicator size="large"/> ): (<></>)
      }  */}

                  <View style={t.mB4}>
                    <Text style={[t.textBase, t.textWhite, t.fontBold, t.mB1]}>Phone:</Text>
                    <TextInput
                      style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull, t.pl10pr10, t.textWhite, t.fontSemibold]}
                      placeholder="Enter your phone number"
                      placeholderTextColor="white"
                      onChangeText={(text) => setFormData({ ...formData, phone: text })}
                      keyboardType="numeric"
                    />
                  </View>


                  <View style={{ width: '40%', height: '14%', marginTop: '2%', marginBottom: '20%', alignSelf: 'center' }}>
                    <TouchableOpacity
                      onPress={() => requestOTP()}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1, // Add this to make the button expand to fill the parent View
                      }}
                    >
                      <Text
                        style={{
                          color: '#072e33',
                          fontWeight: '600',
                          // Semibold
                          fontSize: 18, // Adjust the font size as needed
                        }}
                      >
                        {
                          loading ? "Please wait" : "Send OTP"
                        }
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Collapsible>
                <Collapsible collapsed={!isCollapsed}>
                  <View style={t.mB4}>
                    <View style={[t.relative, t.flex, t.wFull]}>
                      <Text style={[t.textBase, t.textWhite, t.fontBold, t.mB1]}>OTP:</Text>
                      <TextInput
                        style={[t.border, t.borderGray100, t.rounded, t.pY2, t.pT1, t.pX4, t.textWhite, t.textBase, t.textCenter, t.flex, t.wFull]}
                        placeholder="Enter OTP"
                        placeholderTextColor="white"
                        value={String(otp)}
                        onChangeText={(text) => {
                          setotp(text); // Update the 'otp' state with the new value
                        }}
                        // editable={ismatched}
                        keyboardType="numeric"
                      />
                      {
                        ismatched ? null : (
                          <Ionicons name="checkmark" size={24} color="white" style={[t.absolute, t.right0, t.mR2, t.mT6,]} />
                        )
                      }

                    </View>
                  </View>
                  <View style={t.mB4}>
                    <Text style={[t.textBase, t.textWhite, t.fontBold, t.mB1]}>Password:</Text>
                    <View style={[t.relative, t.flex, t.wFull]}>
                      <TextInput
                        style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull, t.pl10pr10, t.textWhite, t.fontSemibold]}
                        placeholder="Enter your own password"
                        placeholderTextColor="white"
                        secureTextEntry={passwordVisibility1}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                      />
                      <Pressable
                        onPress={handlePasswordVisibility1}
                        style={[t.absolute, t.right0, t.mR2, t.mT3]}
                      >
                        <MaterialCommunityIcons name={rightIcon1} size={22} color="#232323" />
                      </Pressable>
                    </View>
                  </View>
                  <View style={t.mB4}>
                    <Text style={[t.textBase, t.textWhite, t.fontBold, t.mB1]}>Password:</Text>
                    <View style={[t.relative, t.flex, t.wFull]}>
                      <TextInput
                        style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull, t.pl10pr10, t.textWhite, t.fontSemibold]}
                        placeholder="Confirm your own password"
                        placeholderTextColor="white"
                        secureTextEntry={passwordVisibility2}
                        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                      />
                      <Pressable
                        onPress={handlePasswordVisibility2}
                        style={[t.absolute, t.right0, t.mR2, t.mT3]}
                      >
                        <MaterialCommunityIcons name={rightIcon2} size={22} color="white" />
                      </Pressable>
                    </View>
                  </View>

                  <View style={t.mT2}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <CheckBox style={[t.mL1, t.textTeal800, t.textWhite]}
                        // color={'#072e33'}
                        value={String(isChecked)}
                        onValueChange={(newValue) => setIsChecked(newValue)}
                      />
                      <Text style={[t.textSm, t.fontBold, t.mB1, t.textGray100, t.mL4, t.mR4, t.mT1]}>
                        By signing up you accept the Terms of service and Privacy Policy
                      </Text>
                    </View>
                  </View>



                  <View style={{ width: '50%', height: '12%', marginTop: '4%', marginBottom: '20%', alignSelf: 'center' }}>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={{

                        backgroundColor: 'white',
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1, // Add this to make the button expand to fill the parent View
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
                          marginLeft: 1,
                          // Semibold
                          fontSize: 16, // Adjust the font size as needed
                        }}
                      >
                        {
                          loading ? "Please wait" : "Sign up"
                        }
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Collapsible>

              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>

  );
}

export default SignUp;
