import React, {useState,useRef} from 'react';
import { View, Text, Image,Button, TouchableOpacity,TextInput ,Pressable,ScrollView,ToastAndroid,StatusBar,ActivityIndicator} from 'react-native';
import { t } from 'react-native-tailwindcss';
// import PhoneInput from "react-native-phone-number-input";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox' ;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigation = useRouter() ;
    const [isChecked, setIsChecked] = useState(false);
    const [otp,setotp] = useState("");

    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });

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
              if (!formData.name || !formData.confirmPassword || !formData.email || !formData.phone || !formData.password) {
                ToastAndroid.show('Please Fill all details', ToastAndroid.LONG);
                return;
              }
              if (!isChecked) {
                ToastAndroid.show('Please accept the Terms of Service and Privacy Policy', ToastAndroid.LONG);
                return;
              }
              if (formData.password !== formData.confirmPassword) {
                ToastAndroid.show('Passwords do not match', ToastAndroid.LONG);
                return;
              }
              // setLoading(true);
              const response = await axios.post(
                
                'https://backend-server-lhw8.onrender.com/api/user/register',
                formData,
                {
                  headers: {
                    'Content-type': 'application/json',
                  },
                }
              );
        
              console.log(response.data);
        
              if (response.status === 200) {
                const { message, name, accessToken } = response.data;
        
                ToastAndroid.show(`Registered Successfully!, Redirecting to Login!`, ToastAndroid.LONG);
        
                setTimeout(() => {
                  // Navigate to the home screen after 4 seconds
                navigation.push("/Login"); // Replace 'Home' with your actual route name
                }, 2000); // 4000 milliseconds = 4 seconds
              } else if (response.status === 400) {
                ToastAndroid.show('Bad Request', ToastAndroid.LONG);
              } else if (response.status === 401) {
                ToastAndroid.show('Unauthorized', ToastAndroid.LONG);
              } else if (response.status === 409) {
                ToastAndroid.show('User already exists', ToastAndroid.LONG);
              } else if (response.status === 500) {
                ToastAndroid.show('Internal Server Error', ToastAndroid.LONG);
              }
            } catch (err) {
              // console.log(err);
              // navigation.push("/SignUp");
              ToastAndroid.show("An Unknown Error Occured!", ToastAndroid.LONG);
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
      <Text style={[t.text5xl, t.fontBold, t.mB1]}> <Text style={{color:"#ff285b"}}>SIGN UP</Text></Text>
      <Text style={[t.textLg, t.fontBold, t.mB1, t.textGray600]}>Create a New Account</Text>
      <View style={{ width: 300, height: null }}>
      <View style={t.mB4}>
        <Text style={[t.textLg, t.fontBold, t.mB1]}>Name:</Text>
        <TextInput
          style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textLg, t.flex, t.wFull]}
          placeholder="Enter your name"
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          autoFocus
        />
      </View>

      <View style={t.mB4}>
        <Text style={[t.textLg, t.fontBold, t.mB1]}>Email:</Text>
        <TextInput
          style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textLg, t.flex, t.wFull]}
          placeholder="Enter your email"
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
        />
      </View>
      { loading ?
      (
      <ActivityIndicator size="large"/> ): (<></>)
       }
       
      <View style={t.mB4}>
        <Text style={[t.textLg, t.fontBold, t.mB1]}>Phone:</Text>
        <TextInput
          style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textLg, t.flex, t.wFull]}
          placeholder="Enter your phone number"
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="numeric"
        />
      </View>
      
      <View style={{ width: '40%', height: '7%', marginTop:'2%' , alignSelf:'center'}}>
  <TouchableOpacity
    onPress={() => setotp("1456")}
    style={{
      backgroundColor: '#EC0444',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1, // Add this to make the button expand to fill the parent View
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
      Send OTP
    </Text>
  </TouchableOpacity>
</View>
<View style={t.mB4}>
        <TextInput
          style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pT1, t.pX4, t.mT4, t.textLg,t.textCenter, t.flex, t.wFull]}
          placeholder="Enter OTP"
          value={otp}
          // onChangeText={(text) => setotp(text)}
          keyboardType="numeric"
        />
      </View>
      <View style={t.mB4}>
      <Text style={[t.textLg, t.fontBold, t.mB1]}>Password:</Text>
      <View style={[t.relative, t.flex, t.wFull]}>
        <TextInput
          style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textLg, t.flex, t.wFull, t.pl10pr10]}
          placeholder="Enter your own password"
          
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
    <View style={t.mB4}>
      <Text style={[t.textLg, t.fontBold, t.mB1]}>Password:</Text>
      <View style={[t.relative, t.flex, t.wFull]}>
        <TextInput
          style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textLg, t.flex, t.wFull, t.pl10pr10]}
          placeholder="Conform your own password"
          secureTextEntry={passwordVisibility2}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        />
        <Pressable
          onPress={handlePasswordVisibility2}
          style={[t.absolute, t.right0,t.mR2,t.mT3]}
        >
          <MaterialCommunityIcons name={rightIcon2} size={22} color="#232323" />
        </Pressable>
      </View>
    </View>
   
<View style={t.mT2}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <CheckBox style={[t.mL1]}
      value={isChecked}
      onValueChange={(newValue) => setIsChecked(newValue)}
    />
    <Text style={[t.textLg, t.fontBold, t.mB1, t.textGray800, t.mL4, t.mT1]}>
      By signing up you accept the Terms of service and Privacy Policy
    </Text>
  </View>
</View>



<View style={{ width: '40%', height: '8%', marginTop:'4%' , alignSelf:'center'}}>
  <TouchableOpacity
    onPress={handleSubmit}
    style={{
      backgroundColor: '#EC0444',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1, // Add this to make the button expand to fill the parent View
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
      SignUp
    </Text>
  </TouchableOpacity>
</View>

    </View>
    </View>
    </ScrollView>
  );
}

export default SignUp;
