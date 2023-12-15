import React, {useState,useRef} from 'react';
import { View, Text, Image, TouchableOpacity,TextInput ,Pressable,ScrollView,ToastAndroid,StatusBar,ActivityIndicator,Modal} from 'react-native';
import { t } from 'react-native-tailwindcss';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox' ;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router' ;
import { Ionicons } from '@expo/vector-icons';

const FillProfile = ({closeModal,modalVisible,reload}) => {
  
//   const [index,setindex]=useState(0) ;

const [LoadingClose,setLoadingClose] = useState(false);

    
const fetchuserprofile=async()=>{
    const token = await AsyncStorage.getItem('token');
    
    try{
        setLoadingClose(true);
          
          const response = await axios.get(
            
            'https://backend-server-lhw8.onrender.com/api/user/get-user-profile',
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          const age = await response.data.age ;
          const height = await response.data.height ;
          const weight = await response.data.weight ;
          const heightInMeters = height * 0.3048;
          await AsyncStorage.setItem('age',age);
            await AsyncStorage.setItem('height',height);
            await AsyncStorage.setItem('weight',weight);
            if (height.length > 0) {
                const bmi = (parseFloat(weight)) / (parseFloat(heightInMeters) * parseFloat(heightInMeters));
                await AsyncStorage.setItem('bmi',bmi.toString());
        }
          closeModal();
          reload();
    }
    catch(error){
        console.log(error)
    }
    finally{
        setLoadingClose(false);
    }
}

  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight : ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit=async()=>{
    try{
        if (!formData.age || !formData.height || !formData.weight) {
            ToastAndroid.show('Please Fill All Details', ToastAndroid.SHORT);
            return;
          }
          setLoading(true);
          const token = await AsyncStorage.getItem('token');
          const response = await axios.put(
            
            'https://backend-server-lhw8.onrender.com/api/user/update-profile',
            formData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json',
                
              },
            }
          );
    
        //console.error(response.data);
          ToastAndroid.show(response.data.message,ToastAndroid.SHORT);
    }
    catch(error){
        // console.error(error);
    }
    finally{
        setLoading(false);
    }
    
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
    //   key={data}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={[t.roundedLg, t.wFull,t.absolute, t.bottom0]}>
      <ScrollView contentContainerStyle={{ height:'70%', flexGrow: 1, backgroundColor:'#072e33'}}>
      <View style={[t.p1, t.flex, t.textCenter, t.flexCol, t.itemsCenter,t.pB100,t.roundedTLg]}>

    <View>
    
      <View style={[t.flex, t.flexRow, t.justifyBetween,t.mT4, t.mB6]}>
      <Text style={[t.textXl, t.fontSemibold,t.textWhite]}>Fill Profile</Text>
      <TouchableOpacity onPress={fetchuserprofile}>
      <Ionicons name="ios-close-sharp" size={24} color="white" />
      </TouchableOpacity>
      </View>
      <View style={{ width: 300, height: null }}>
      

     

<View style={{ width: '90%', height: '65%', marginTop:'5%', marginBottom:'15%', alignSelf:'center'}}>

<View style={t.mB4}>
        <Text style={[t.textBase,t.textWhite ,t.fontBold, t.mB1]}>Age:</Text>
        <TextInput
          style={[t.border,t.borderWhite, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull,t.textWhite,t.fontSemibold]}
          placeholder="Enter your Age"
          placeholderTextColor="white" 
          keyboardType="numeric"
          autoCapitalize="none" 
          onChangeText={(text) => setFormData({ ...formData, age: text })}
        />
      </View>
      <View style={t.mB4}>
        <Text style={[t.textBase,t.textWhite ,t.fontBold, t.mB1]}>Height:</Text>
        <TextInput
          style={[t.border,t.borderWhite, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull,t.textWhite,t.fontSemibold]}
          placeholder="Enter your Height in Feet"
          placeholderTextColor="white" 
          keyboardType="numeric"
          autoCapitalize="none" 
          onChangeText={(text) => setFormData({ ...formData, height: text })}
        />
      </View>
     

      <View style={t.mB4}>
      <Text style={[t.textBase,t.textWhite, t.fontBold, t.mB1]}>Weight:</Text>
      <View style={[t.relative, t.flex, t.wFull]}>
        <TextInput
          style={[t.border, t.borderGray400, t.rounded, t.pY2, t.pX4, t.textSm, t.flex, t.wFull, t.pl10pr10,t.textWhite,t.fontSemibold]}
          placeholder="Enter your Weight in KG"
          keyboardType="numeric"
          autoCapitalize="none" 
          placeholderTextColor="white" 
          onChangeText={(text) => setFormData({ ...formData, weight: text })}
        />
      </View>
    </View>
    <View style={{ width: '100%', height:44,alignSelf:'center', marginBottom:20, marginTop:40}}>
    <TouchableOpacity
    onPress={handleSubmit}
    style={{
      backgroundColor: 'white',
      height:40,
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
        loading ? "Please wait" : "Submit"
      }
     
    </Text>
  </TouchableOpacity>
  </View>
          <View style={{ width: '100%', height:44,alignSelf:'center', marginBottom:10}}>
          <TouchableOpacity
            onPress={fetchuserprofile}
            style={{
              backgroundColor: '#E70A0A',
              height:40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      
      flex: 1,
      flexDirection:'row'
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