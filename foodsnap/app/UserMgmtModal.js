import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, ActivityIndicator, Modal,Switch, TextInput,Alert } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, InputField, InputSlot, InputIcon } from '@gluestack-ui/themed';
import { AntDesign, Feather,MaterialIcons,MaterialCommunityIcons,Ionicons} from '@expo/vector-icons';
import { Octicons, Entypo } from '@expo/vector-icons';
import axios from 'axios';
import HOST_URL from './config';
import { FontAwesome } from '@expo/vector-icons';

function UserMgmtModal({ modalVisible, closeModal, Itemindex, ItemName,userData,setuserdata,statuses,setstatuses,ReloadProfile }) {
  const [loading, setLoading] = useState(false);
  const [Hloading, setHLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  }); 
  const [tickets, settickets] = useState([]);
  const [newpass,setnewpass] = useState(false);

  const updateProfile = async () => {
    try {
      setLoading(true);
      if (!userData.name || !userData.email || !userData.phone || !userData.currpass) {
        ToastAndroid.show(`One or more required fields are missing`, ToastAndroid.SHORT);
        return;
      }
      // console.log(userData);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        HOST_URL + '/api/user/update-fullprofile',
        userData,
        {
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      if (response.status === 200){
        await AsyncStorage.setItem('name',userData.name);
        await AsyncStorage.setItem('email',userData.email);
        await AsyncStorage.setItem('phone',userData.phone);
        await AsyncStorage.setItem('location',userData.location);
        await AsyncStorage.setItem('age',userData.age);
        await AsyncStorage.setItem('height',userData.height);
        await AsyncStorage.setItem('weight',userData.weight);
        await AsyncStorage.setItem('email',userData.email);
        ReloadProfile();
      }
    }
    catch (error) {
      // console.log(error)
      // 
    }
    finally {
      setLoading(false);
    }
  }


  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!formData.title || !formData.content) {
        ToastAndroid.show(`Please enter title and content`, ToastAndroid.SHORT);
        return;
      }
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        HOST_URL + '/api/user/support-request',
        formData,
        {
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      getHistory();
    }
    catch (error) {
      // console.log(error)
      // 
    }
    finally {
      setLoading(false);
    }
  }

  const getHistory = async () => {
    setHLoading(true);
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    try {
      await fetch(
        HOST_URL + '/api/user/support-request', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              if (data) {
                // console.log(data);
                settickets(data.tickets);
              }
            });
        })

    }
    catch (error) {
      // console.error(error);
    }
    finally {
      setHLoading(false);
    }
  };
  useEffect(() => {
    if (Itemindex === 4){
      getHistory();
    }
  }, [Itemindex]);
  const showHistDetails=(ticket)=>{
    let status = "Under Review";
    if (ticket.status == 1){
      status = "Issue Closed"
    }
    Alert.alert(
      'Support Ticket Details',
      `Title: ${ticket.title}\nDescription: ${ticket.content}\nDate:${new Date(ticket['createdAt']).toString()}\nStatus: ${status}`,
      [
        // {
        //   text: 'Cancel',
        //   style: 'cancel',
        // },
        {
          text: 'OK',
        },
      ],
      { cancelable: false }
    );
    
  }
  
  
  const toggleSwitch = (index) => {
    setstatuses(prevStatuses => {
      return prevStatuses.map((status, i) => {
        return i === index ? !status : status;
      })
    });
  }

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        HOST_URL+'/api/user/update-status',
        {
          pstatus : statuses[0],
          astatus : statuses[1],
          nstatus : statuses[2],
          fstatus : statuses[3],
          ostatus : statuses[4]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',

          },
        }
      );
      await AsyncStorage.setItem('pstatus',statuses[0].toString());
      await AsyncStorage.setItem('astatus',statuses[1].toString());
      await AsyncStorage.setItem('nstatus',statuses[2].toString());
      await AsyncStorage.setItem('fstatus',statuses[3].toString());
      await AsyncStorage.setItem('ostatus',statuses[4].toString());
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={[t.flex1, t.borderB2, t.borderGray200, t.hFull, t.bgGray100]}>
        <View style={[t.h16, t.shadowLg, t.bgGray100, t.borderB2, t.borderGray300]}>
          <View style={[t.flex, t.flexRow, t.justifyStart, t.wFull]}>
            <View style={[t.textBlack, t.mT4, t.mL4]}>
              <View style={[t.flexRow, t.itemsCenter]}>
                <TouchableOpacity onPress={closeModal}>
                  <Feather name="arrow-left" size={26} color="black" style={[t.bgBlue100, t.roundedFull]} />
                </TouchableOpacity>
                <Text style={[t.fontBold, t.text2xl, t.textBlack, t.mL2,]}>{ItemName}</Text>
              </View>
            </View>
          </View>
        </View>
{
  Itemindex == 4 &&  <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%', paddingBottom: 30 }}>
  <View style={[t.flexCol]}>
    <Text style={[t.textBase, t.fontBold,t.mL4,t.mT4,t.mB2, t.textGray700]}>Issue title</Text>
    <View style={[t.mX4, t.border2, t.borderGray600, t.bgWhite, t.roundedLg]}>

      <TextInput
        multiline={true}
        numberOfLines={1}
        style={{ textAlignVertical: 'top', padding: 6, fontSize: 16 ,paddingTop:12}}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
        placeholder='eg: unable to update hydration level'
      />
    </View>
  </View>
  <View style={[t.flexCol]}>
    <Text style={[t.textBase, t.fontBold, t.mL4,t.mT4,t.mB2, t.textGray700]}>Describe issue in detail</Text>
    <View style={[t.mX4, t.border2, t.borderGray600, t.bgWhite, t.roundedLg]}>
      <TextInput
        multiline={true}
        numberOfLines={10}
        style={{ textAlignVertical: 'top', padding: 6, fontSize: 16 }}
        onChangeText={(text) => setFormData({ ...formData, content: text })}
        placeholder='eg: While updating hydration level today, It shows failed to update.'
      />
    </View>
  </View>
  <TouchableOpacity
    onPress={handleSubmit}
    style={{
      backgroundColor: '#072e33',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: '35%',
      height: '5%',
      padding: 6,
      margin: '10%',
      alignSelf: 'center'
    }}
  >
    {loading ?
      (
        <ActivityIndicator size="small" color='white' />) : (<></>)
    }
    <Text
      style={{
        color: 'white',
        fontWeight: '600',
        marginLeft: 4,
        // Semibold
        fontSize: 16,
      }}
    >
      {
        loading ? "Please wait" : "Submit"
      }

    </Text>
  </TouchableOpacity>

  <View style={[t.flexCol, t.mB4, t.borderT2, t.mX4, t.borderGray600]}>

    <View style={[t.flexRow, t.justifyBetween, t.mX2]}>
      <View style={[t.flexRow, t.itemsCenter]}>
        <View style={[t.mY4, t.border2, t.roundedFull, t.w12, t.h12, t.textCenter, t.itemsCenter, t.contentCenter, t.borderOrange600]}>
          <Entypo name="dots-three-horizontal" size={24} color="#D88C00" style={[t.textCenter, t.mT2]} />
        </View>
        <Text style={[t.textBase, t.fontSemibold, t.textGray700, t.mL4]}>Under Review</Text>
      </View>
      <View style={[t.flexRow, t.itemsCenter]}>
        <View style={[t.mY4, t.border2, t.roundedFull, t.w12, t.h12, t.textCenter, t.itemsCenter, t.contentCenter, t.borderGreen600]}>
          <AntDesign name="check" size={24} color="green" style={[t.textCenter, t.mT2]} />
        </View>
        <Text style={[t.textBase, t.fontSemibold, t.textGray700, t.mL4]}>Issue closed</Text>
      </View>

    </View>



    <Text style={[t.textXl, t.fontBold, t.mY4, t.textGray800]}>History:</Text>

    <View style={[t.flexCol]}>
        {
          Hloading ?
          <ActivityIndicator size="large" color='#072e33' /> :
          tickets.map((ticket, index) => (
            <View style={[t.flexRow, t.itemsCenter, t.justifyBetween,t.mY2]} key={index}>
            <View style={[t.flexRow]} key={index}>
            {
              ticket.status == 0 ?<MaterialIcons name="pending" size={28} color="white" style={[t.bgOrange600,t.roundedFull]}/>
              : <Octicons name="issue-closed" size={28} color="darkgreen" />
            }
              <View style={[t.flexCol, t.mL4]}>
                <Text style={[t.textBase, t.fontSemibold]}>
                  {ticket.title}
                </Text>
                <Text>
                  {/* 19 March 2024 8.00 PM GMT0530 IST */}
                  {new Date(ticket['createdAt']).toString()}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={()=>showHistDetails(ticket)}>
            <Text style={[t.textBase, t.fontSemibold, t.textBlue600, t.mX4]}>View</Text></TouchableOpacity>
      </View>
          ))  
          
        }
        
    </View>

  </View>

</ScrollView> 
}
{
   Itemindex == 3 && <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%', paddingBottom: 30 }}>
<View style={[t.m4]}>
  <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mY2]}>Notifications</Text>

  
<View style={[t.bgWhite,t.roundedLg,t.border2,t.borderGray200,t.p2]}>
  <View style={[t.flexRow,t.itemsCenter, t.mL2]}>
<MaterialIcons name="circle-notifications" size={30} color="green"  />
        <Text style={[t.textBase,t.fontSemibold,t.mL2,t.textGray700]}>Enable Push Notifications:</Text>
        <Switch
          trackColor={{ false: '#B4CCB9', true: 'skyblue' }}
          thumbColor={statuses[0] ? 'darkgreen' : '#f4f3f4'}
          ios_backgroundColor="#81b0ff"
          onValueChange={()=>toggleSwitch(0)}
          value={statuses[0] ? true : false}
        />
        </View>
         <View style={[t.flexRow,t.itemsCenter,t.mL2]}>
      <MaterialCommunityIcons name="alert-circle" size={30} color="#B60004" />
        <Text style={[t.textBase,t.fontSemibold,t.mL2,t.textGray700]}>Enable Food Alerts:</Text>
        <Switch
          trackColor={{ false: '#B4CCB9', true: 'skyblue' }}
          thumbColor={statuses[1] ? 'darkgreen' : '#f4f3f4'}
          ios_backgroundColor="#81b0ff"
          onValueChange={()=>toggleSwitch(1)}
          value={statuses[1] ? true : false}
        />
      </View>
      </View>
      </View>
      <View style={[t.m4]}>
  <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mY2]}>Network Settings</Text>

  
<View style={[t.bgWhite,t.roundedLg,t.border2,t.borderGray200,t.p2]}>
  <View style={[t.flexRow,t.itemsCenter, t.mL2]}>
  <FontAwesome name="group" size={16} color="white" style={[t.roundedFull,t.p1,t.bgOrange700]}/>
        <Text style={[t.textBase,t.fontSemibold,t.mL2,t.textGray700]}>Show me in Network:</Text>
        <Switch
          trackColor={{ false: '#B4CCB9', true: 'skyblue' }}
          thumbColor={statuses[2] ? 'darkgreen' : '#f4f3f4'}
          ios_backgroundColor="#81b0ff"
          onValueChange={()=>toggleSwitch(2)}
          value={statuses[2] ? true : false}
        />
        </View>
         <View style={[t.flexRow,t.itemsCenter,t.mL2]}>
         <MaterialIcons name="security" size={24} color="#006BE1" />
        <Text style={[t.textBase,t.fontSemibold,t.mL2,t.textGray700]}>Enable 2-Factor-Authentication:</Text>
        <Switch
          trackColor={{ false: '#B4CCB9', true: 'skyblue' }}
          thumbColor={statuses[3] ? 'darkgreen' : '#f4f3f4'}
          ios_backgroundColor="#81b0ff"
          onValueChange={()=>toggleSwitch(3)}
          value={statuses[3] ? true : false}
        />
      </View>
      <View style={[t.flexRow,t.itemsCenter,t.mL3]}>
      <Ionicons name="cloud-offline" size={22} color="#00A6EA" />
        <Text style={[t.textBase,t.fontSemibold,t.mL2,t.textGray700]}>Enable Offline Diet Logging:</Text>
        <Switch
          trackColor={{ false: '#B4CCB9', true: 'skyblue' }}
          thumbColor={statuses[4] ? 'darkgreen' : '#f4f3f4'}
          ios_backgroundColor="#81b0ff"
          onValueChange={()=>toggleSwitch(4)}
          value={statuses[4] ? true : false}
        />
      </View>
      </View>
      </View>


      <View style={[t.mT10,t.wFull]}>
        <TouchableOpacity onPress={handleSave} style={[t.p3,t.bgGreen700,t.roundedLg,t.selfCenter]}>
          <Text style={[t.textWhite, t.textBase,t.fontSemibold,t.textCenter]}>Save Changes</Text>
        </TouchableOpacity>
      </View>
   </ScrollView>
}
{
   Itemindex == 2 && <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%', paddingBottom: 30 }}>
<View style={[t.m4]}>
  <Text style={[t.textBase,t.fontSemibold,t.textGray700,t.mY2,t.mX1]}>Personal Information</Text>

  
<View style={[t.bgWhite,t.roundedLg,t.border2,t.borderGray200,t.p2]}>
  <View style={[t.flexCol,t.itemsStart, t.mX2]}>
        <Text style={[t.textBase,t.fontSemibold,t.mY2,t.mL1,t.textGray700]}>Full Name</Text>
        <TextInput
        numberOfLines={1}
        value={userData.name}
        style={[t.border2,t.wFull,t.roundedLg,t.textBase,t.borderGray600,t.pL2]}
        onChangeText={(text) => setuserdata({ ...userData, name: text })}
        placeholder='Enter your Fullname'
        inputMode='search'
        />
        </View>
        <View style={[t.flexCol,t.itemsStart, t.mX2,t.mT2]}>
        <Text style={[t.textBase,t.fontSemibold,t.mY2,t.mL1,t.textGray700]}>Email ID</Text>
        <TextInput
        inputMode='email'
        numberOfLines={1}
        value= {userData.email}
        style={[t.border2,t.wFull,t.roundedLg,t.textBase,t.borderGray600,t.pL2]}
        onChangeText={(text) => setuserdata({ ...userData, email: text })}
        placeholder='Enter your email Id'
        />
        </View>
        <View style={[t.flexCol,t.itemsStart, t.mX2,t.mT2]}>
        <Text style={[t.textBase,t.fontSemibold,t.mY2,t.mL1,t.textGray700]}>Phone Number (without +91)</Text>
        <TextInput
        maxLength={10}
        numberOfLines={1}
        inputMode='numeric'
        value={userData.phone}
        style={[t.border2,t.wFull,t.roundedLg,t.textBase,t.borderGray600,t.pL2]}
        onChangeText={(text) => setuserdata({ ...userData, phone: text })}
        placeholder='Enter your mobile number'
        />
        </View>
        <View style={[t.flexCol,t.itemsStart, t.mX2,t.mT2]}>
        <Text style={[t.textBase,t.fontSemibold,t.mY2,t.mL1,t.textGray700]}>Location</Text>
        <TextInput
        numberOfLines={1}
        value={userData.location}
        style={[t.border2,t.wFull,t.roundedLg,t.textBase,t.borderGray600,t.pL2]}
        onChangeText={(text) => setuserdata({ ...userData, location: text })}
        placeholder='Enter your Location name'
        />
        </View>
        <View style={[t.flexCol,t.itemsStart, t.mX2,t.mT2]}>
        <Text style={[t.textBase,t.fontSemibold,t.mY2,t.mL1,t.textGray700]}>Current Password</Text>
        <TextInput
        keyboardType='visible-password'
        numberOfLines={1}
        value={userData.currpass}
        style={[t.border2,t.wFull,t.roundedLg,t.textBase,t.borderGray600,t.pL2]}
        onChangeText={(text) => setuserdata({ ...userData, currpass: text })}
        placeholder='Enter your current password to update details' 
        
        visible-passwordm ={false}
        />
        <TouchableOpacity style={[t.mT4,t.selfEnd,t.p2,t.border2,t.roundedLg,newpass ? t.borderRed600: t.borderBlue600]} onPress={()=>setnewpass(!newpass)}><Text style={[t.fontSemibold,t.textSm, newpass ? t.textRed600: t.textBlue600]}>{ newpass? "Continue with Old Password": "Change Password"}</Text></TouchableOpacity>
        </View>
        {
          newpass ? 
          <View>
            <View style={[t.flexCol,t.itemsStart, t.mX2,t.mT2]}>
          <Text style={[t.textBase,t.fontSemibold,t.mY2,t.mL1,t.textGray700]}>New Password</Text>
          <TextInput
          keyboardType='visible-password'
          numberOfLines={1}
          value={userData.newpass}
          style={[t.border2,t.wFull,t.roundedLg,t.textBase,t.borderGray600,t.pL2]}
          onChangeText={(text) => setuserdata({ ...userData, newpass: text })}
          placeholder='Enter new password'
          />
          </View>
          <View style={[t.flexCol,t.itemsStart, t.mX2,t.mT2]}>
          <Text style={[t.textBase,t.fontSemibold,t.mY2,t.mL1,t.textGray700]}>Confirm New Password</Text>
          <TextInput
          numberOfLines={1}
          keyboardType='visible-password'
          value={userData.confirmpass}
          style={[t.border2,t.wFull,t.roundedLg,t.textBase,t.borderGray600,t.pL2]}
          onChangeText={(text) => setuserdata({ ...userData, confirmpass: text })}
          placeholder='Enter new password again'
          />
          </View>
          </View> :  null
        }
        <View style={[t.flexRow,t.justifyBetween]}>
        <View style={[t.flexCol,t.itemsStart, t.mX2,t.mT2]}>
        <Text style={[t.textBase,t.fontSemibold,t.mY2,t.mL1,t.textGray700]}>Enter Age</Text>
        <TextInput
        numberOfLines={1}
        inputMode='numeric'
        value={userData.age}
        style={[t.border2,t.w20,t.roundedLg,t.textBase,t.borderGray600,t.pL2]}
        onChangeText={(text) => setuserdata({ ...userData, age: text })}
        placeholder='years'
        />
        </View>
        <View style={[t.flexCol,t.itemsStart, t.mX2,t.mT2]}>
        <Text style={[t.textBase,t.fontSemibold,t.mY2,t.mL1,t.textGray700]}>Height</Text>
        <TextInput
        numberOfLines={1}
        inputMode='numeric'
        value={userData.height}
        style={[t.border2,t.w20,t.roundedLg,t.textBase,t.borderGray600,t.pL2]}
        onChangeText={(text) => setuserdata({ ...userData, height: text })}
        placeholder='feet'
        />
        </View>
        <View style={[t.flexCol,t.itemsStart, t.mX2,t.mT2]}>
        <Text style={[t.textBase,t.fontSemibold,t.mY2,t.mL1,t.textGray700]}>Weight</Text>
        <TextInput
        numberOfLines={1}
        inputMode='numeric'
        value={userData.weight}
        style={[t.border2,t.w20,t.roundedLg,t.textBase,t.borderGray600,t.pL2]}
        onChangeText={(text) => setuserdata({ ...userData, weight: text })}
        placeholder='Kg'
        />
        </View>
        </View>
      </View>
      </View>
      <View style={[t.mT10,t.wFull]}>
        <TouchableOpacity onPress={updateProfile}  style={[t.p3,t.bgGreen700,t.roundedLg,t.selfCenter]}>
          <Text style={[t.textWhite, t.textBase,t.fontSemibold,t.textCenter]}>Update Profile</Text>
        </TouchableOpacity>
      </View>
   </ScrollView>
}
       
      </View>
    </Modal>
  );
}

export default UserMgmtModal;
