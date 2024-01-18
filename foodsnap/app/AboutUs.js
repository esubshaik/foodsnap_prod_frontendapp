import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, ActivityIndicator, Modal,Switch, TextInput,Alert,StyleSheet } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, InputField, InputSlot, InputIcon } from '@gluestack-ui/themed';
import { AntDesign, Feather,MaterialIcons,MaterialCommunityIcons,Ionicons} from '@expo/vector-icons';
import { Octicons, Entypo } from '@expo/vector-icons';
import axios from 'axios';
import HOST_URL from './config';
import { FontAwesome } from '@expo/vector-icons';

function AboutUs({ modalVisible, closeModal,ItemName }) {
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
        </View>{
          ItemName == "About us" &&  <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%', }}>
          <View style={styles.container}>
          <Text style={styles.subHeading}>Who we are</Text>
          <Text style={[t.pB4]}>
        We are a team of Btech final year students from VVIT College, specializing in AI & ML, passionately developing the innovative mobile application "FoodSnap."
          </Text>
        <Text style={styles.subHeading}>Conclusion</Text>
        
  
        <Text>
          Thank you for choosing FoodSnap. Together, let's foster healthier eating habits and improved well-being for all. {'\n\n'}Appreciate your time with us! Thank you for choosing our service. For any queries like that, feel free to reach out
        </Text>
  
        <Text style={styles.signature}>
          Sincerely,
          {'\n'}FoodSnap Team
          {'\n'}foodsnapl1456@gmail.com
        </Text>
      </View>
      <Text style={[t.textGray700,t.textCenter,t.mT10]}>Thats all folks!</Text>
      </ScrollView>
        }
        {
          ItemName === "Diet Report" && <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%',backgroundColor: '#F7FCFF' }}>
              <View style={[t.bgWhite,t.hFull,t.wFull]}>
                <Text>Hello</Text>
              </View>
            </ScrollView>
        }
       
      </View>
      
    </Modal>
  );
}
const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    subHeading: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 12,
      marginBottom: 8,
    },
    signature: {
      marginTop: 16,
    },
  });

export default AboutUs;
