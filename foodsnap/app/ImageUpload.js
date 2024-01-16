import React, { useState, useEffect } from 'react';
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function UploadImage() {
    const [image, setImage] = useState(null);
    const getStoredImage=async()=>{
        try {
            const userdp = await AsyncStorage.getItem('userprofile') ;
            if (userdp) {
              setImage(userdp);
            }
          } catch (error) {
          }
        }
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
       aspect:[4,4],
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri)
        await AsyncStorage.setItem('userprofile',result.assets[0].uri)
        let filename = result?.assets[0].uri.substring(
          result?.assets[0].uri.lastIndexOf("/") + 1,
          result?.assets[0].uri.length
        );
  
        delete result.cancelled;
        result = {
          ...result,
          name: filename,
        };
      }
    };
useEffect(() => {
    getuserPermission();
    getStoredImage();
}, []);

  return (
            <TouchableOpacity onPress={pickImage} style={imageUploaderStyles.container}>
                {
                    image  && <Image source={{ uri: image }} style={{ width: 70, height: 70 }} />
                }
                    {/* <View style={imageUploaderStyles.uploadBtnContainer}>
                        <TouchableOpacity  style={imageUploaderStyles.uploadBtn} >
                            <AntDesign name="camera" size={20} color="black" />
                        </TouchableOpacity>
                    </View> */}

            </TouchableOpacity>
  );
}
const imageUploaderStyles=StyleSheet.create({
    container:{
        elevation:2,
        height:70,
        width:70,
        backgroundColor:"",
        position:'relative',
        borderRadius:999,
        overflow:'hidden',
    },
    uploadBtnContainer:{
        opacity:0.7,
        position:'absolute',
        right:0,
        bottom:0,
        backgroundColor:'lightgrey',
        width:'100%',
        height:'20%',
    },
    uploadBtn:{
        display:'flex',
        alignItems:"center",
        justifyContent:'center'
    }
})