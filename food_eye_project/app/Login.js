import React, {useState,useRef} from 'react';
import { View, Text, Image,Button, TouchableOpacity,TextInput ,Pressable,ScrollView,ToastAndroid,StatusBar,ActivityIndicator} from 'react-native';
import { t } from 'react-native-tailwindcss';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox' ;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router' ;

function Login() {
  const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const navigation = useRouter();

        const [passwordVisibility1, setPasswordVisibility1] = useState(true);
        const [passwordVisibility2, setPasswordVisibility2] = useState(true);
        const [rightIcon1, setRightIcon1] = useState('eye-off');
        const [rightIcon2, setRightIcon2] = useState('eye-off');
        const [cpassword,setcpassword] = useState("");
      
        const handlePasswordVisibility1 = () => {
          if (rightIcon1 === 'eye') {
            setRightIcon1('eye-off');
            setPasswordVisibility1(!passwordVisibility1);
          } else if (rightIcon1 === 'eye-off') {
            setRightIcon1('eye');
            setPasswordVisibility1(!passwordVisibility1);
          }
        }
          const [formData, setFormData] = useState({
            email: '',
            password: '',
          });
        
          const handleSubmit = async () => {
            try {
            setLoading(true);
            if (!formData.email || !formData.password) {
              ToastAndroid.show('Please enter your registered Email and Password', ToastAndroid.LONG);
              return;
            }
              const response = await axios.post(
                'https://backend-server-lhw8.onrender.com/api/user/login',
                formData,
                {
                  headers: {
                    'Content-type': 'application/json',
                  },
                }
              );
                 setLoading(true);
              console.log(response.data);
        
              if (response.status === 400) {
                ToastAndroid.show('Fill all details', ToastAndroid.LONG);
              } else if (response.status === 200) {
                console.log('entered successfully');
                const { message, name, accessToken } = response.data;
        
                ToastAndroid.show(`${message}. Welcome, ${name}!`, ToastAndroid.LONG);
        
                await AsyncStorage.setItem('token', accessToken);
                await AsyncStorage.setItem('name', name);
                await AsyncStorage.setItem('email', formData.email);
                setTimeout(() => {
                  // Navigate to the home screen after 4 seconds
                  navigation.push('/Home'); // Replace 'Home' with your actual route name
                }, 2000);
              } else if (response.status === 401) {
                ToastAndroid.show('Invalid Credentials', ToastAndroid.LONG);
              } else if (response.status === 404) {
                ToastAndroid.show('User Not Found', ToastAndroid.LONG);
              } else if (response.status === 500) {
                ToastAndroid.show('Internal Server Error', ToastAndroid.LONG);
              }
            } catch (err) {
              // console.log(err);
              ToastAndroid.show("Email Not Found, Please Register!", ToastAndroid.LONG);
            }
            finally{
              // <ActivityIndicator size="large" />
              setLoading(false); 
            }
          };
  return (
    <ScrollView contentContainerStyle={{  flexGrow: 1, paddingBottom: 100, backgroundColor:'white' }}>
      <View style={[t.p1, t.bgWhite, t.flex, t.textCenter, t.flexCol, t.itemsCenter, t.justifyCenter,t.pB100]}>
      <View style={{ width: 300, height: 150 }}>
        <Image 
          source={require('./assets/logo-white.png')}
          style={{ flex: 1, width: null, height: null }}
          resizeMode="contain" // or "cover" depending on your preference
        />
      </View>
      <Text style={[t.text5xl, t.fontBold, t.mB1]}> <Text style={{color:"#ff285b"}}>Welcome Back</Text></Text>
      <Text style={[t.textLg, t.fontBold, t.mB10, t.textGray600]}>Login to your Account</Text>
      <View style={{ width: 300, height: null }}>
      

      <View style={t.mB4}>
        <Text style={[t.textLg, t.fontBold, t.mB1]}>Email:</Text>
        <TextInput
          style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textLg, t.flex, t.wFull]}
          placeholder="Enter your email"
          keyboardType="email-address"
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
      </View>
      { loading ?
      (
      <ActivityIndicator size="large"/> ): (<></>)
       }

      <View style={t.mB4}>
      <Text style={[t.textLg, t.fontBold, t.mB1]}>Password:</Text>
      <View style={[t.relative, t.flex, t.wFull]}>
        <TextInput
          style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textLg, t.flex, t.wFull, t.pl10pr10]}
          placeholder="Enter your password"
          secureTextEntry={passwordVisibility1}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
        <Pressable
          onPress={handlePasswordVisibility1}
          style={[t.absolute, t.right0,t.mR2,t.mT3]}
        >
          <MaterialCommunityIcons name={rightIcon1} size={22} color="#232323" />
        </Pressable>
      </View>
    </View>
   
<View style={t.mT2}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <CheckBox style={[t.mL1]}
      value={isChecked}
      onValueChange={(newValue) => setIsChecked(newValue)}
    />
    <Text style={[t.textLg, t.fontBold, t.mB1, t.textGray800, t.mL2, t.mT1, t.textGray800]}>
     Remember Me
    </Text>
    <View>
    <Text style={[t.textLg, t.fontBold, t.mB1, t.textGray800, t.mT1, t.mL16 , t.textGray800]}>
      Forgot Password
    </Text>
    </View>
  </View>
</View>

<View style={{ width: '40%', height: '16%', marginTop:'4%' , alignSelf:'center', marginTop:'6%'}}>
  <TouchableOpacity
    onPress={handleSubmit}
    style={{
      backgroundColor: '#EC0444',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    }}
  >
    <Text
      style={{
        color: 'white',
        fontWeight: '600',
         // Semibold
        fontSize: 18, // Adjust the font size as needed
      }}
    >
      Login
    </Text>
  </TouchableOpacity>
</View>

    </View>
    </View>
    </ScrollView>
  );
}

export default Login;
