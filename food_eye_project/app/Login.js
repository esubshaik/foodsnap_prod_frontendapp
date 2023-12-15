import React, {useState,useRef} from 'react';
import { View, Text, Image, TouchableOpacity,TextInput ,Pressable,ScrollView,ToastAndroid,StatusBar,ActivityIndicator,Modal} from 'react-native';
import { t } from 'react-native-tailwindcss';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox' ;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router' ;
import { Ionicons } from '@expo/vector-icons';
// import { Input,Button,ButtonSpinner,ButtonText } from '@gluestack-ui/themed';

const  Login=({ modalVisible, closeModal,data})=> {
  // console.log(modalVisible);
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
              ToastAndroid.show('Please enter your registered Email and Password', ToastAndroid.SHORT);
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
                ToastAndroid.show('Fill all details', ToastAndroid.SHORT);
              } else if (response.status === 200) {
                // console.log('entered successfully');
                const { message, name, accessToken,age,height,weight } = response.data;
        
                ToastAndroid.show(`${message}. Welcome, ${name}!`, ToastAndroid.SHORT);
                await AsyncStorage.setItem('age',age);
                await AsyncStorage.setItem('height',height);
                await AsyncStorage.setItem('weight',weight);
                await AsyncStorage.setItem('token', accessToken);
                await AsyncStorage.setItem('name', name);
                await AsyncStorage.setItem('email', formData.email);
                await AsyncStorage.setItem('hydration','0');
                const heightInMeters = height * 0.3048; // 1 foot = 0.3048 meters

        // Calculate BMI
                if (height.length > 0) {
                  const bmi = (parseFloat(weight)) / (parseFloat(heightInMeters) * parseFloat(heightInMeters));
                  await AsyncStorage.setItem('bmi',bmi.toString());
                }
                
                setTimeout(() => {
                  // Navigate to the home screen after 4 seconds
                  navigation.push('/Home'); // Replace 'Home' with your actual route name
                }, 1000);
              } else if (response.status === 401) {
                ToastAndroid.show('Invalid Credentials', ToastAndroid.SHORT);
              } else if (response.status === 404) {
                ToastAndroid.show('User Not Found', ToastAndroid.SHORT);
              } else if (response.status === 500) {
                ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
              }
            } catch (err) {
              // console.log(err);
              ToastAndroid.show("Email Not Found, Please Register!", ToastAndroid.SHORT);
            }
            finally{
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
      <View style={[t.roundedLg, t.wFull,t.absolute, t.bottom0]}>
      <ScrollView contentContainerStyle={{ height:'70%', flexGrow: 1, backgroundColor:'#072e33'}}>
      <View style={[t.p1, t.flex, t.textCenter, t.flexCol, t.itemsCenter,t.pB100,t.roundedTLg]}>

    <View>
    
      <View style={[t.flex, t.flexRow, t.justifyBetween,t.mT4, t.mB6]}>
      <Text style={[t.textXl, t.fontSemibold,t.textWhite]}>Log in</Text>
      <TouchableOpacity onPress={closeModal}>
      <Ionicons name="ios-close-sharp" size={24} color="white" />
      </TouchableOpacity>
      </View>
      <View style={{ width: 300, height: null }}>
      

      <View style={t.mB4}>
        <Text style={[t.textBase,t.textWhite ,t.fontBold, t.mB1]}>Email:</Text>
        <TextInput
          style={[t.border,t.borderWhite, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull,t.textWhite,t.fontSemibold]}
          placeholder="Enter your email"
          placeholderTextColor="white" 
          keyboardType="email-address"
          autoCapitalize="none" 
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
      </View>
     

      <View style={t.mB4}>
      <Text style={[t.textBase,t.textWhite, t.fontBold, t.mB1]}>Password:</Text>
      <View style={[t.relative, t.flex, t.wFull]}>
        <TextInput
          style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull, t.pl10pr10,t.textWhite,t.fontSemibold]}
          placeholder="Enter your password"
          secureTextEntry={passwordVisibility1}
          autoCapitalize="none" 
          placeholderTextColor="white" 
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
        <Pressable
          onPress={handlePasswordVisibility1}
          style={[t.absolute, t.right0,t.mR2,t.mT3]}
        >
          <MaterialCommunityIcons name={rightIcon1} size={22} color="white" />
        </Pressable>
      </View>
    </View>
   
<View style={t.mT2}>
  <View style={{position:'absolute',right:0}}>
    <TouchableOpacity>
    <Text style={[t.textBase, t.fontBold, t.textGray200]}>
      Forgot Password
    </Text>
    </TouchableOpacity>
  </View>
</View>

<View style={{ width: '50%', height: '15%', marginTop:'15%', marginBottom:'15%', alignSelf:'center'}}>

  <TouchableOpacity
    onPress={handleSubmit}
    style={{
      backgroundColor: 'white',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      
      flex: 1,
      flexDirection:'row'
    
    }}
  >
     { loading ?
      (
      <ActivityIndicator size="large" color='#072e33'/> ): (<></>)
       }
    <Text
      style={{
        color: '#072e33',
        fontWeight: '600',
        marginLeft:4,
         // Semibold
        fontSize: 16, // Adjust the font size as needed
      }}
    >
      {
        loading ? "Please wait" : "Log in"
      }
     
    </Text>
  </TouchableOpacity>
</View>

    </View>
    </View>
    </View>
    </ScrollView>
    {/* <Button title='Close' ></Button> */}
      </View>
    </Modal>
    
  );
}

export default Login;
