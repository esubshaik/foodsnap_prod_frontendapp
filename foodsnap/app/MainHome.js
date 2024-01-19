import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, StyleSheet, Dimensions, Alert, Image, ActivityIndicator } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, InputField, InputSlot, InputIcon } from '@gluestack-ui/themed';
import { AntDesign, Ionicons, Entypo, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
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
import HOST_URL from './config';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { FontAwesome5,Feather,Foundation,Octicons,MaterialCommunityIcons } from '@expo/vector-icons';
// import { AntDesign } from '@expo/vector-icons';
// import { MaterialIcons } from '@expo/vector-icons';
import AboutUsModal from './AboutUs';
import TriceModal from './TriceModal';


const MainHome = ({ fetchNutri, formdata, calculateHydra, sploading,image,checkProfileStatus,alertstatus }) => {
  // console.log(formdata);
  const navigation = useRouter();
  const [myInput, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);


  const handleFocus = () => {
    setIsFocused(true);
  };

  const analyzeFood = async () => {
    const foodid = myInput;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodname: foodid })
    };
    try {
      await fetch(
        HOST_URL + '/api/user/analyze-food', requestOptions)
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

  const closeModal = () => {
    setModalVisible(false);
    fetchNutri();
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

  
  const [pstatus, setpstatus] = useState(false);

  const openPS = () => {
    setpstatus(true);
  }
  const closePS = () => {
    setpstatus(false);
  }


  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);
  const parentFunction = (fn) => {
    fetchNutri();
    fn();
  }

  const [menuModal, setMenuModal] = useState([false, false, false]);
  const titles = ["Diet Report","User Guide","About us"] ;

  const openMenuModal = (index) => {
    const updatedMenuModal = [...menuModal];
    updatedMenuModal[index] = true;
    setMenuModal(updatedMenuModal);
  };
  const closeMenuModal = () => {
    setMenuModal([false, false, false]);
  };

  const [three,setthree] = useState([false,false,false]);
  const trice = ["Goals","Alerts","Reports"] ;

  const openTriceModal = (index) => {
    const updatedTriceModal = [...three];
    updatedTriceModal[index] = true;
    setthree(updatedTriceModal);
  };
  const closeTriceModal = () => {
    setthree([false, false, false]);
  };
  // const imageSource = Image.resolveAssetSource(require('./assets/defaultuser.png'));

  return (
    <View>
      <View style={{ backgroundColor: '#F7FCFF' }}>
        <View style={[t.h17, t.shadowLg, t.borderB2, t.roundedTSm, t.borderGray300, t.bgGray100]}>
          <View style={[t.flex, t.flexRow, t.justifyBetween]}>

            <View style={[t.flex, t.flexRow, t.mL2]}>
              <Image
                // source={require('./assets/defaultuser.png')}
                // source={dp ? { uri: dp } : require('./assets/defaultuser.png')}
                source={{ uri: image }}
                style={{ width: 50, height: 50, margin: 8, borderRadius: 40, borderWidth: 2, borderColor: '#294d61' }} // Adjust the width
                resizeMode="contain"
              />

              <View style={[t.flex, t.flexCol, t.h50, t.selfCenter, t.textGray200]}>
                <View style={[t.flex, t.flexRow]}>
                  <Image

                    source={require('./assets/Levels/fs-coin.png')}
                    style={{ width: 15, height: 15, marginRight: 4 }} // Adjust the width
                    resizeMode="contain"
                  />
                  <Text style={[t.fontSemibold, t.h14, t.textGray800]}>{formdata.allfoodlabels.length * 5} points</Text>
                </View>
                <View style={[t.h14, t.mT1, t.flex, t.flexRow]}>
                  <Text style={[t.fontBold, t.textGray900]}>👋</Text>
                  <Text style={[t.fontBold, t.textGray900]}>{`Hi, ${formdata.username} !`}</Text>
                </View>
              </View>
            </View>
           
            <View style={[]}>
              <Menu
                visible={visible}
                anchor={<TouchableOpacity onPress={showMenu}>
                  <SimpleLineIcons name="options-vertical" size={22} color="black" style={[t.p5]} />
                </TouchableOpacity>}
                onRequestClose={hideMenu}
                style={[t.bgWhite, t._mX2, t.mY2]}
              >
                <MenuItem onPress={() => parentFunction(hideMenu)}><Text style={[]}>Refresh</Text></MenuItem>
                <MenuItem onPress={()=>openMenuModal(0)}><Text>Diet Report</Text></MenuItem>

                <MenuItem onPress={hideMenu}><Text>User Guide</Text></MenuItem>
                {/* <MenuItem disabled>Disabled item</MenuItem> */}
                <MenuDivider color='gray' />
                <MenuItem onPress={()=>openMenuModal(2)}><Text>About us</Text></MenuItem>
              </Menu>
              <AboutUsModal modalVisible={menuModal[2]} closeModal={closeMenuModal} ItemName={titles[2]}/>
            </View>

          </View>

        </View>
      </View>

      <ScrollView contentContainerStyle={{ backgroundColor: '#F7FCFF' }}>
        <View style={[t.p1, t.flex, t.textCenter, t.flexCol]}>
          <View style={{ position: 'absolute', margin: '50%' }}>
          </View>
          <Input style={[t.flex, t.flexRow, t.border2, t.m4, t.roundedLg, t.h12, isFocused ? t.borderTeal700 : t.borderTeal800, t.flex, t.flexRow]}>
            {
              rec ? <Ionicons name="ios-stop-outline" onPress={stopRecording} size={24} color={isFocused ? '#1e88e5' : 'black'} style={{ width: '12%', marginTop: '3%', marginLeft: '2%' }} />
                : <Ionicons name="ios-mic-outline" size={26}
                  onPress={() => startRecording} color={isFocused ? '#1e88e5' : 'black'} style={{ width: '12%', marginTop: '3%', marginLeft: '2%' }} disabled={rec} />
            }
            <Ionicons name="ios-camera-outline" onPress={() => { navigation.push("/Camera") }} size={24} color={isFocused ? '#1e88e5' : 'black'} style={{ width: '12%', marginTop: '3%', marginLeft: '0%' }} />

            <Text style={[t.roundedRSm, t.bgTeal800, t.absolute, t.right0, t.w10, t.hFull, t.pT2, t.pL2,t.borderT2,t.borderTeal800,t.itemsEnd]}>
              <TouchableOpacity
                onPress={analyzeFood}
              >
                <AntDesign name="search1" size={24} color='white' />
              </TouchableOpacity>
            </Text>
            <View style={{ width: '60%', height: '100%' }}>
              <InputField style={[t.hFull, t.textGray600]} onFocus={handleFocus} onChange={(event) => setInput(event.nativeEvent.text)}
                onSubmitEditing={analyzeFood}
                placeholder='Start adding your food item'
                returnKeyType="search"
              />
            </View>
          </Input>
        </View>
        {
          alertstatus ?
            <TouchableOpacity onPress={openPS}>
              <View style={[t.flex, t.flexRow, t.mB4, t.pY2, t.justifyBetween, t.mX4, t.pX2, t.roundedLg, t.borderTeal800, t.border2, t.bgTeal800]}>
                {/* <MaterialIcons name="label-important" size={20} style={[t.mX2]} color="red" /> */}
                <Text style={[t.textWhite, t.fontSemibold]}>Update your Profile! </Text>

                <FontAwesome5 name="greater-than" size={16} color="white" />

                <FillProfile modalVisible={pstatus} closeModal={closePS} reload={checkProfileStatus} />
              </View>
            </TouchableOpacity> : null
        }

        <View style={[t.mB32]}>
          <DateNavigator />
          <ProgressChartGrid mynutridata={formdata.mynutridata} hydrapercent={formdata.hydra} sploading={sploading} />
          <View style={{
            backgroundColor: 'white', marginLeft: 16, marginRight: 0, borderRadius: 15, flexDirection: 'row', height: 100, shadowColor: 'white', shadowOpacity: 0.4,
            shadowRadius: 4, elevation: 5, justifyContent: 'space-between', alignItems: 'center'
          }}>
            <View style={{
              width: '68%',
              shadowColor: '#575555',
              elevation: 2,
              padding: 1, marginTop: 4, marginBottom: 4, borderRadius: 15
            }}>
              <TouchableOpacity onPress={
                () => ToastAndroid.show("Challenge is not yet completed", ToastAndroid.SHORT)
              } style={[t.hFull, t.p2, t.bgRed100, t.roundedLg, t.wFull, t.flex, t.flexRow, t.justifyBetween]}>
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
           
          </View>
          <View style={{backgroundColor:'#eff6ff', marginHorizontal:16,marginVertical:10,borderRadius: 15}}>
          <View style={[t.p2,t.flex,t.flexRow,t.textCenter,t.itemsCenter, t.border2,t.borderGray200,t.roundedLg]}>
            {
              sploading ? <Text style={[t.mY4, t.textCenter, t.wFull]}> <ActivityIndicator size="large" color='#115e59' /> </Text> :
                <UserProgress presentarr={formdata.daysarr} />
            }
          </View>
          </View>

          <ModalComponent
            modalVisible={modalVisible}
            closeModal={closeModal}
            modalData={modalData}
            foodname={[myInput]}
            reload={fetchNutri}
          />

          <BarComponent labels={formdata.labels} data={formdata.bardata} sploading={sploading} />
          <View style={{
            // ccfbf1
            backgroundColor: '#eff6ff', marginLeft: 16, marginRight: 16, marginBottom: 4, marginTop: 16, borderRadius: 15, flexDirection: 'row', height: 100, shadowColor: 'black', shadowOpacity: 0.9,
            shadowRadius: 4, elevation: 5, justifyContent: 'space-between', alignItems: 'center'
          }}>

          <View style={[t.mX4,t.h30]}>
          <View style={[t.flex, t.flexRow, t.justifyAround,t.roundedLg]}>
            <TouchableOpacity onPress={()=>openTriceModal(0)} style={[t.w20,t.h16,t.m4,t.roundedFull,t.bgYellow100,t.itemsCenter,t.justifyCenter,t.flexCol]}>
            <MaterialCommunityIcons name="clock-edit-outline"  size={30} style={[t.textGray700,t.textCenter]} />
            <Text style={[t.fontSemibold,t.textCenter]}>Goals</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>openTriceModal(1)} style={[t.w20,t.h16,t.m4,t.roundedFull,t.bgYellow100,t.itemsCenter,t.justifyCenter,t.flexCol]}>
          <Octicons name="alert" size={30}  style={[t.textGray700,t.textCenter]} />
            <Text style={[t.fontSemibold,t.textCenter]}>Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>openTriceModal(2)} style={[t.w20,t.h16,t.m4,t.roundedFull,t.bgYellow100,t.itemsCenter,t.justifyCenter,t.flexCol]}>
          <Ionicons name="document-attach-outline" size={30} style={[t.textGray700,t.textCenter]} />
            <Text style={[t.fontSemibold,t.textCenter]}>Reports</Text>
          </TouchableOpacity>
            </View>
            <TriceModal modalVisible={three[2]} closeModal={closeTriceModal} ItemName={trice[2]}/>
          </View>
          </View>
          <FoodHistory foodlabels={formdata.allfoodlabels} dates={formdata.days} ids={formdata.ids} reloadpage={fetchNutri} sploading={sploading} />
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
