import React, { useState, useEffect, Component, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, StyleSheet, Dimensions, Alert, Image, ActivityIndicator } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, InputField, InputSlot, InputIcon } from '@gluestack-ui/themed';
import { AntDesign, Ionicons, Entypo, MaterialIcons,SimpleLineIcons } from '@expo/vector-icons';
import ProgressChartGrid from './SpiralChart';
import ModalComponent from './ModalClass';
import UserProgress from './Progress';
import DateNavigator from './DateNavigator';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
// import BarComponent from '/BarChart';
import BarComponent from './BarChart';
import FillProfile from './FillProfile';
import FoodHistory from './FoodHistory';
// import { AntDesign } from '@expo/vector-icons';
// import { MaterialIcons } from '@expo/vector-icons';


const MainHome = ({fetchNutri,formdata,calculateHydra}) => {
  // const screenWidth = Dimensions.get("window").width;
  // console.log(formdata);
  const navigation = useRouter();
  const [myInput, setInput] = useState("");
  const [loading, setloading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
 
  useEffect(() => {
    checkProfileStatus();
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const analyzeFood = async () => {
    const foodid = myInput;
    if (foodid.length <= 1) {
      Alert.alert(
        '',
        'Please Enter the Food name',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            // onPress: () => ToastAndroid.show('Thank you ☺️', ToastAndroid.SHORT),
          },
        ],
        { cancelable: false }
      );
    }
    console.log(foodid);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodname: foodid })
    };
    try {
      await fetch(
        'https://backend-updated-w7a2.onrender.com/api/user/analyze-food', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              // console.log(data);
              if (data['data']['CALORIES(G)']) {
                setModalData([data]);
                openModal();
                // console.log(data);
              }

            });
        })

    }
    catch (error) {
      // console.log(error);
    }
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([{ "data": { "CALORIES(G)": 0, "CARBOHYDRATES(G)": 0, "FAT(G)": 0, "PROTEIN(G)": 0 } }]);

  const openModal = () => {
    // setModalData('Hello from Main Component!'); // Set the data you want to send
    setModalVisible(true);
  };

  const closeModal = async() => {
    setModalVisible(false);
    await fetchNutri();
  };

  const [rec, setrec] = useState(false);
  const [recording, setRecording] = React.useState();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      setrec(true);
      ToastAndroid.show(`Started Listening...`, ToastAndroid.SHORT);
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      // console.error('Failed to start recording', err);
    }
  }

  const convertToWav = async (m4aUri) => {
    const wavUri = FileSystem.cacheDirectory + 'recording.wav';

    try {
      await FileSystem.copyAsync({
        from: m4aUri,
        to: wavUri,
      });

      return wavUri;
    } catch (error) {
      // console.error('Error converting to WAV:', error);
      return null;
    }
  };

  const transcribeAudio = async (audioUri) => {

    // const endpoint = `https://centralindia.api.cognitive.microsoft.com/`;
    try {
      const subscriptionKey = 'fca430972c1242629c43d363587f5337';
      const region = 'centralindia';
      // console.log(audioUri);
      const { uri } = await FileSystem.getInfoAsync(audioUri);
      const audioData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      console.log(audioData);
      const apiUrl = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;

      const headers = {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      };
      const response = await axios.post(apiUrl, audioData, { headers });
      console.log(response.data);
      // setTranscription(response.data);
    }
    catch (error) {
      // console.error('Error:', error.response ? error.response.data : error.message);
    }
  }

  // Example usage in stopRecording function
  async function stopRecording() {
    setrec(false);
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    ToastAndroid.show(`Stopped Listening...`, ToastAndroid.SHORT);
    try {
      const uri = await recording.getURI();
      const wavUri = await convertToWav(uri);
      const stt = await transcribeAudio(wavUri);
      console.log('You Spoke:', stt);
    } catch (error) {
      // console.error('Error in stopRecording:', error);
    }
  }

  
  const [reqnutri, setreqnutri] = useState([0, 0, 0, 0]);
  const [alertstatus, setalertstatus] = useState(false);
  const [pstatus, setpstatus] = useState(false);
  const [dp,setdp] = useState('');

  async function checkProfileStatus() {
    try {
      const userdp = await AsyncStorage.getItem("userprofile");
      setdp(userdp);
      const token = await AsyncStorage.getItem('bmi');
      if (!parseInt(token)) {
        setalertstatus(true);
      }
      else {
        setalertstatus(false);
      }
    } catch (error) {
    }
  }


  const openPS = () => {
    setpstatus(true);
  }
  const closePS = () => {
    setpstatus(false);
  }
  const localImage = require('./assets/defaultuser.png');

  return (
    <View>
      <View style={[t.h17, t.shadowLg, t.bgWhite,t.borderB2, t.borderGray300]}>
        <View style={[t.flex, t.flexRow,t.m1,t.justifyBetween]}>
      
          <View style={[t.flex, t.flexRow]}>
          <Image
              // source={require('./assets/defaultuser.png')}
              source = {dp ? {uri: dp} : require('./assets/defaultuser.png')}
              style={{ width: 45, height: 45 ,margin:8, borderRadius:40, borderWidth:1, borderColor:'#294D61'}} // Adjust the width
              resizeMode="contain"
            />
            
            <View style={[t.flex, t.flexCol, t.w40,t.h45,t.selfCenter,t.textGray200]}>
            <View style={[t.flex, t.flexRow]}>
            <Image
            
              source={require('./assets/Levels/bronze.png')}
              style={{ width:15, height: 15,marginRight:4}} // Adjust the width
              resizeMode="contain"
            />
            <Text style={[t.fontBold,t.textSm,t.textGray800]}>Bronze III</Text>
            </View>
            <View style={[t.h14,t.mT1,t.flex, t.flexRow]}>
            <Text style={[t.fontBold,t.textSm,t.textGray800]}>👋 Welcome </Text>
            <Text style={[t.fontBold,t.textSm,t.textGray600]}>{formdata.username} !</Text>
            </View>
          </View>
          </View>
      
          <View style={[t.m4]}>
            <TouchableOpacity onPress={()=>navigation.push('/Notifications')}>
          <Ionicons name="md-notifications-outline" size={25} color="black" style={[t.roundedFull]} />
          </TouchableOpacity>
          </View>
          
          <View style={[t.m4]}>
          <SimpleLineIcons name="options-vertical" size={24} color="black" />
          </View>
          
        </View>

      </View>
   
    <ScrollView contentContainerStyle={{ backgroundColor: 'white' }}>
      <View style={[t.p1, t.bgWhite, t.flex, t.textCenter, t.flexCol]}>
        <View style={{ position: 'absolute', margin: '50%' }}>
          {loading ? ActivityIndicator : null}
        </View>

        <Input style={[t.flex, t.flexRow, t.border2, t.m4, t.roundedLg, t.h12, isFocused ? t.borderBlue600 : t.borderBlack, t.flex, t.flexRow]}>
          {
            rec ? <Ionicons name="ios-stop-outline" onPress={stopRecording} size={24} color={isFocused ? '#1e88e5' : 'black'} style={{ width: '12%', marginTop: '3%', marginLeft: '2%' }} />
              : <Ionicons name="ios-mic-outline" size={26} onPress={() => alertstatus ? (Alert.alert("Please Complete Your Profile!")) : startRecording} color={isFocused ? '#1e88e5' : 'black'} style={{ width: '12%', marginTop: '3%', marginLeft: '2%' }} disabled={rec} />
          }
          <Ionicons name="ios-camera-outline" onPress={() => { alertstatus ? (Alert.alert("Please Complete Your Profile!")) : navigation.push("/Camera") }} size={24} color={isFocused ? '#1e88e5' : 'black'} style={{ width: '12%', marginTop: '3%', marginLeft: '0%' }} />

          <Text style={[t.roundedRSm, t.bgTeal800, t.absolute, t.right0, t.w10, t.hFull, t.pT2, t.pL2]}>
            <TouchableOpacity onPress={alertstatus ? (Alert.alert("Please Complete Your Profile!")) : analyzeFood}>
              <AntDesign name="search1" size={24} color='white' />
            </TouchableOpacity>
          </Text>
          <View style={{ width: '60%', height: '100%' }}>
            <InputField style={[ t.hFull, t.textGray600]} onFocus={handleFocus} onChange={(event) => setInput(event.nativeEvent.text)}
              onSubmitEditing={alertstatus ? (Alert.alert("Please Complete Your Profile!")) : analyzeFood}
              placeholder='Start adding your food item'
              returnKeyType="search"
            />
          </View>
        </Input>
      </View>

      {
        alertstatus ? <View style={[t.flex, t.flexRow, t.mY2, t.justifyCenter, t.alignCenter, t.itemsCenter]}>
          <MaterialIcons name="label-important" size={20} style={[t.mX2]} color="red" />
          <Text style={[t.textBase, t.fontSemibold]}>Please Fill Your Profile to Continue! </Text>
          <TouchableOpacity onPress={openPS}>
            <AntDesign name="form" size={18} color="#0096FF" style={[t.mX2, t.fontBold]} />
          </TouchableOpacity>
          <FillProfile modalVisible={pstatus} closeModal={closePS} reload={checkProfileStatus} />
        </View> : null
      }

      <View style={[t.mB32]}>
        <DateNavigator />
        <ProgressChartGrid mynutridata={formdata.mynutridata} hydrapercent={formdata.hydra} />
        <View style={{
          backgroundColor: 'white', marginLeft: 16, marginRight: 0, borderRadius: 15, flexDirection: 'row', height: 100, shadowColor: 'white', shadowOpacity: 0.4,
          shadowRadius: 4, elevation: 5, justifyContent: 'space-between', alignItems: 'center'
        }}>
          <View style={{
            width: '68%',
            // backgroundColor: 'skyblue',
            shadowColor: '#575555',
            elevation: 2,
            padding: 1, marginTop: 4, marginBottom: 4, borderRadius: 15
          }}>
            <TouchableOpacity onPress={() => ToastAndroid.show("Challenge is not yet completed", ToastAndroid.SHORT)} style={[t.hFull, t.p2, t.bgRed200, t.roundedLg, t.wFull, t.flex, t.flexRow, t.justifyBetween]}>
              <View style={[t.flex, t.flexCol, t.justifyBetween]}>
                <Text style={[t.fontSemibold, t.m2, t.textLg, t.textRed900]}>Challenges</Text>
                <Text style={[t.fontSemibold, t.m2, t.textXl, t.textRed900]}>WinterHarvest Eats</Text>
              </View>
              <View style={{}}>
                <Image
                  source={require('./assets/challengeFood/dates.png')}
                  style={{ flex: 1, width: 50, height: 50, margin: '2%' }}
                  resizeMode="contain"
                />
              </View>

            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={calculateHydra}>
            <View style={{
              width: '26%', height: '92%',
              backgroundColor: '#0096FF',
              shadowColor: '#575555',
              elevation: 2,
              padding: 2, marginTop: 4, marginBottom: 4, borderRadius: 15, marginLeft: 8
            }}>
              <View style={[t.wFull, t.flex, t.flexRow, t.hFull, t.itemsCenter, t.justifyCenter]}>
                <Entypo name="cup" size={25} color="white" />
                <MaterialIcons name="exposure-plus-1" size={26} color="white" />
              </View>
            </View>
          </TouchableOpacity>
          <View>

          </View>
        </View>
        <View style={{
          backgroundColor: '#294D61', marginLeft: 16,marginRight:16,marginBottom:14,marginTop:10, borderRadius: 15, flexDirection: 'row', height: 100, shadowColor: 'black', shadowOpacity: 0.9,
          shadowRadius: 4, elevation: 5, justifyContent: 'space-between', alignItems: 'center'
        }}>
          <UserProgress presentarr={formdata.daysarr} />
        </View>
        <ModalComponent
          modalVisible={modalVisible}
          closeModal={closeModal}
          modalData={modalData}
          foodname={[myInput]}
          reload={fetchNutri}
        />
      
<BarComponent labels={formdata.labels} data={formdata.bardata} /> 
        <FoodHistory foodnames = {formdata.labels} dates={formdata.days} ids={formdata.ids} reloadpage={fetchNutri}/>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    margin: 10,
    fontWeight: 'bold'
  },
})

export default MainHome;
