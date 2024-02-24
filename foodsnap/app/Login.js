import { View, Text, Image, TouchableOpacity,TextInput ,Pressable,ScrollView,ToastAndroid,ActivityIndicator,Modal,StatusBar} from 'react-native';
import { t } from 'react-native-tailwindcss';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox' ;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router' ;
import { Ionicons } from '@expo/vector-icons';
import React, {useState,useEffect} from 'react';
import HOST_URL from './config';

// import { Input,Button,ButtonSpinner,ButtonText } from '@gluestack-ui/themed';

const  Login=({ modalVisible, closeModal,data})=> {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });


  // Notifications.setNotificationHandler({
  //   handleNotification: async () => ({
  //     shouldShowAlert: true,
  //     shouldPlaySound: true,
  //     shouldSetBadge: true,
  //   }),
  // });
  
  
// async function registerForPushNotificationsAsync() {
//   let token;
//   Notifications.setNotificationChannelAsync('default', {
//     name: 'default',
//     importance: Notifications.AndroidImportance.MAX,
//     vibrationPattern: [0, 250, 250, 250],
//     lightColor: 'teal',
//   });

//   if (Device.isDevice) { // Corrected from Device.isDevice
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = await Notifications.getExpoPushTokenAsync({
//       projectId: Constants.expoConfig.extra.eas.projectId,
//       // projectId: '9a74c053-51ce-4647-96c0-e3d8d923f47e'
//     });
//   } else {
//     alert('Must use a physical device for Push Notifications'); // Updated the alert message
//   }
//   return token.data;
// }

  
    // const [expoPushToken, setExpoPushToken] = useState('');
  
    // useEffect(() => {
    //   // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
      
      
    // }, []);

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
          
        
          const getusercal = async()=>{
            const str_age = await AsyncStorage.getItem('age');
            const age = parseInt(str_age);
            const gender = AsyncStorage.getItem('gender');
            const user_cal = await axios.get(HOST_URL+`/api/user/req-calories/${age}/${gender}`);
            await AsyncStorage.setItem('min_cal',age? user_cal.data.data.min_calories.toString(): '0'); 
            await AsyncStorage.setItem('max_cal',age? user_cal.data.data.max_calories.toString():  '0'); 
            await AsyncStorage.setItem('avg_cal',age? (((parseInt(user_cal.data.data.max_calories)+parseInt(user_cal.data.data.min_calories))/2)).toString(): '0');
          }

          const handleSubmit = async () => {
            setLoading(true);
            try {
            if (!formData.email || !formData.password) {
              ToastAndroid.show(`Please enter your registered Email and Password`, ToastAndroid.SHORT);
              return;
            }
              const response = await axios.post(
                HOST_URL+'/api/user/login',
               formData
                ,
                {
                  headers: {
                    'Content-type': 'application/json',
                  },
                }
              );
              setLoading(true);
              // console.log(response.data);
                
              if (response.status === 400) {
                ToastAndroid.show('Fill all details', ToastAndroid.SHORT);
              } else if (response.status === 200) {
                const { message, name, accessToken,age,height,weight,gender,location,pstatus,astatus,nstatus,fstatus,ostatus,calrange,phone } = response.data;
                await AsyncStorage.setItem('age',age);
                await AsyncStorage.setItem('height',height);
                await AsyncStorage.setItem('weight',weight);
                await AsyncStorage.setItem('token', accessToken);
                await AsyncStorage.setItem('name', name);
                await AsyncStorage.setItem('phone',phone.toString());
                await AsyncStorage.setItem('email', formData.email);
                await AsyncStorage.setItem('hydration','0');
                await AsyncStorage.setItem('gender',gender);
                await AsyncStorage.setItem('location',location);
                await AsyncStorage.setItem('pstatus',pstatus? pstatus.toString():'0');
                await AsyncStorage.setItem('astatus',astatus? astatus.toString():'0');
                await AsyncStorage.setItem('nstatus',nstatus? nstatus.toString():'0');
                await AsyncStorage.setItem('fstatus',nstatus? fstatus.toString():'0');
                await AsyncStorage.setItem('ostatus',ostatus? ostatus.toString():'0');
                await AsyncStorage.setItem('calrange',calrange);
                // await AsyncStorage.setItem('pushtoken',)
                await getusercal();
                const heightInMeters = parseFloat(height) * 0.3048; // 1 foot = 0.3048 meters
                const bmi = (parseFloat(weight)) / (parseFloat(heightInMeters) * parseFloat(heightInMeters));
                // console.log(bmi);
                await AsyncStorage.setItem('bmi',bmi.toString());
        // Calculate BMI
                // if (height >= 0) {
                  
                // }
                ToastAndroid.show(`${message}. Welcome, ${name}!`, ToastAndroid.SHORT);
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
              // ToastAndroid.show(er.message);
              ToastAndroid.show("Please try again", ToastAndroid.SHORT);
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
          // onChangeText={(text) => setFormData({ ...formData, email: text })}
          onChangeText={(text) => setFormData({ ...formData, email: text.toLowerCase() })}
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
