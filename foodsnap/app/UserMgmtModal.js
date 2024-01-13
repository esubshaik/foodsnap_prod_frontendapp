import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, ActivityIndicator, Modal, TextInput,Alert } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, InputField, InputSlot, InputIcon } from '@gluestack-ui/themed';
import { AntDesign, Feather,MaterialIcons } from '@expo/vector-icons';
import { Octicons, Entypo } from '@expo/vector-icons';
import axios from 'axios';
import HOST_URL from './config';

function UserMgmtModal({ modalVisible, closeModal, Itemindex, ItemName }) {
  // console.log(Itemindex);
  const [loading, setLoading] = useState(false);
  const [Hloading, setHLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  }); 
  const [tickets, settickets] = useState([]);
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
  }, []);
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

        <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%', paddingBottom: 30 }}>
          <View style={[t.flexCol]}>
            <Text style={[t.textXl, t.fontBold, t.m5, t.textGray700]}>Title:</Text>
            <View style={[t.mX4, t.border2, t.borderGray600, t.bgWhite, t.roundedLg]}>

              <TextInput
                multiline={true}
                numberOfLines={2}
                style={{ textAlignVertical: 'top', padding: 6, fontSize: 16 }}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />
            </View>
          </View>
          <View style={[t.flexCol]}>
            <Text style={[t.textXl, t.fontBold, t.m4, t.textGray700]}>Describe issue in detail :</Text>
            <View style={[t.mX4, t.border2, t.borderGray600, t.bgWhite, t.roundedLg]}>
              <TextInput
                multiline={true}
                numberOfLines={10}
                style={{ textAlignVertical: 'top', padding: 6, fontSize: 16 }}
                onChangeText={(text) => setFormData({ ...formData, content: text })}
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

                {/* <View style={[t.flexRow]}>
                  <Octicons name="issue-closed" size={24} color="darkgreen" />
                  <View style={[t.flexCol, t.mL4]}>
                    <Text style={[t.textBase, t.textBase, t.fontSemibold]}>
                      Logout Failed Issue
                    </Text>
                    <Text>
                      19 March 2024 8.00 PM GMT0530 IST
                    </Text>
                  </View>
                </View> */}
                
            </View>

          </View>

        </ScrollView>
      </View>
    </Modal>
  );
}

export default UserMgmtModal;
