import React, { useState,useMemo } from 'react';
import { View, Text, Modal, Button,ScrollView,TouchableOpacity,Image, Dimensions,Alert} from 'react-native';
import { t } from 'react-native-tailwindcss';
import PieChartExample from './PieChart';
import { AntDesign, Feather,MaterialIcons,MaterialCommunityIcons,Ionicons} from '@expo/vector-icons';
import CounterApp from './Counter';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ImageOpener = ({ modalVisible, closeModal,imgURL,handleReload}) => {
    const [image, setImage] = useState(null);
    const wh = Dimensions.get('window').width ;

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
          handleReload();
        } 
      };
      const handleRemove=()=>{
        Alert.alert(
            '',
            'Are you sure to remove Profile',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => removeImage(),
              },
            ],
            { cancelable: true }
          );
      }
      const removeImage=async()=>{
        const imageSource = Image.resolveAssetSource(require('./assets/defaultuser.png'));
        await AsyncStorage.setItem('userprofile',imageSource.uri);
        setImage(imageSource.uri);
        handleReload();
      }
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
        <View style={{backgroundColor:'#2D2D2D'}}>
      <View style={[t.hFull,t.wFull,t.alignCenter,t.justifyStart]}>
        <View style={[t.flexRow,t.wFull,t.bgBlack]}>
            <TouchableOpacity onPress={closeModal}>
      <AntDesign name="close" size={30} color="white"  style={[t.p4,t.itemsCenter]}/>
      </TouchableOpacity>
      <Text style={[t.textWhite,t.textXl,t.fontSemibold,t.selfCenter]}>Profile Photo</Text>
      </View>
        <View style={{
            width: '100%', height: '85%',borderRadius:10,borderColor:'white',justifyContent:'center',
        }}>
            <View style={{borderRadius:500,backgroundColor:'white',width:'100%'}}>
            <Image source={{ uri: imgURL }} style={{ width: wh, height:wh}} />
            </View>

        </View>
        <View style={[t.flexRow,t.mX4,t.hFull,t.justifyBetween, t.bgTransparent] }>
            <TouchableOpacity onPress={pickImage}><Text style={[t.textWhite,t.borderWhite,t.border2,t.p2,t.roundedLg]}>Change Photo</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleRemove} ><Text style={[t.textWhite,t.borderWhite,t.border2,t.p2,t.roundedLg]}>Remove Photo</Text></TouchableOpacity>
        </View>
      </View>
      </View>
    </Modal>
  );
};
export default ImageOpener;