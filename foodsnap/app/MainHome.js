import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, StyleSheet, Dimensions, Alert, Image, ActivityIndicator, Modal, TextInput, FlatList, TouchableNativeFeedback } from 'react-native';
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
import { FontAwesome5, Feather, Foundation, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { AntDesign } from '@expo/vector-icons';
// import { MaterialIcons } from '@expo/vector-icons';
import AboutUsModal from './AboutUs';
import TriceModal from './TriceModal';
import ImageOpener from './ImageOpener';

const MainHome = ({ fetchNutri, formdata, calculateHydra, sploading, image, checkProfileStatus, alertstatus, getStoredImage, isConnected, foodnames, uploadHistory, peek }) => {

  // console.log(formdata);
  const navigation = useRouter();
  const [myInput, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [rec, setrec] = useState(false);
  const [names, setnames] = useState("");
  const handleFocus = () => {
    setIsFocused(true);
  };



  const analyzeFood = async () => {

    const foodid = myInput;
    // console.log(foodid);
    const token = await AsyncStorage.getItem('token');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'

      },
      body: JSON.stringify({ foodname: foodid })
    };
    if (!isConnected) {
      const fname = searchText;
      setModalData([{ "alert": "yes", "data": { "CALORIES(G)": 0, "CARBOHYDRATES(G)": 0, "FAT(G)": 0, "PROTEIN(G)": 0 }, "name": fname }]);
      setnames(fname);
      openModal();
      // setLoading(false);

    }
    else {
      try {
        setLoading(true);
        await fetch(
          HOST_URL + '/api/user/analyze-food', requestOptions)
          .then(response => {
            response.json()
              .then(data => {
                // console.log(data.alert);
                if (data['data']['CALORIES(G)']) {
                  if (data.alert === "no") {
                    showAlert(data);
                  }
                  else {
                    // console.log([data]);
                    setModalData([data]);
                    openModal();
                    setnames(data.name);
                  }
                  // console.log(data.name);
                }

              });
          })

      }
      catch (error) {
        // console.log(error);
      }
      finally {
        setLoading(false);
      }
    }

  }
  const showAlert = (data) => {
    Alert.alert(
      '',
      'The Food Item is not Recommended to eat based on your health Condition',
      [
        {
          text: 'Continue at Risk',
          onPress: () => {
            setModalData([data]);
            openModal();
            setnames(data.name);
          },
        },
        {
          text: 'Avoid Food',
          style: 'cancel', // This will make the button appear in a different style (e.g., on the left)
          // onPress: () => {

          // },
        },
      ],
      { cancelable: true }
    );
  };

  const cloudAlert = () => {
    Alert.alert(
      'Upload to Cloud',
      'Do you want to retry uploading offline data to cloud ?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {

          text: 'Yes',
          onPress: () => {
            uploadHistory();
          },
          // This will make the button appear in a different style (e.g., on the left)
        },
      ],
      { cancelable: true }
    );
  };



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


  const [recording, setRecording] = React.useState();

  async function startRecording() {
    setrec(true)
    try {
      // console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      ToastAndroid.show(`Started Listening...`, ToastAndroid.SHORT);
      // console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      // console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
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
      return null;
    }
  };

  const transcribeAudio = async (audioUri) => {
    // const { sound } = await Audio.Sound.createAsync(
    //   { uri: audioUri },
    //   { shouldPlay: false }
    // );

    // const formData = new FormData();
    // formData.append('file', sound);

    // const response = await fetch(HOST_URL + '/api/user/speech-to-text', {
    //   method: 'POST',
    //   body: formData,
    // });
    // console.log(response.json());
    // if (response) {
    //   const responseData = await response.data;
    //   // console.log('Transcription Response:', responseData);
    // }
    /// 


    // try {
    //   const subscriptionKey = 'fca430972c1242629c43d363587f5337';
    //   const region = 'centralindia';
    //   // console.log(audioUri);
    //   const { uri } = await FileSystem.getInfoAsync(audioUri);
    //   const audioData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    //   // console.log(audioData);
    //   const apiUrl = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;

    //   const headers = {
    //     'Content-Type': 'application/octet-stream',
    //     'Ocp-Apim-Subscription-Key': subscriptionKey,
    //   };
    //   const response = await axios.post(apiUrl, audioData, { headers });
    //   // console.log(response.data);
    //   // setTranscription(response.data);
    // }
    // catch (error) {
    //   console.error('Error:', error.response ? error.response.data : error.message);
    // }
  }

  // Example usage in stopRecording function
  async function stopRecording() {
    setrec(false);
    // console.log('Stopping recording..');
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    ToastAndroid.show(`Stopped Listening...`, ToastAndroid.SHORT);
    try {
      const uri_temp = await recording.getURI();
      const wavUri = await convertToWav(uri_temp);
      // console.log(wavUri);

      const { sound } = await Audio.Sound.createAsync(
        { uri: wavUri },
        { shouldPlay: false }
      );

      // const formData = new FormData();
      // Append the WAV file to the FormData
      // formData.append('file', );
      const audioFile = {
        uri: wavUri,
        type: 'audio/wav',
        name: 'audio.wav',
      }
      const subscriptionKey = '273e0fd970b14203adccc23ed282bb7a';
      const region = 'centralindia';

      const endpoint = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;

      const headers = {
        'Content-Type': 'audio/vnd.wave',
        'Ocp-Apim-Subscription-Key': subscriptionKey
      };

      const response = await axios.post(endpoint, audioFile, { headers });
      // console.log(response.data);
      // const response = await fetch(HOST_URL + '/api/user/speech-to-text', {
      //   method: 'POST',
      //   body: formData,
      // });

      // // Use await to get the JSON data
      // const responseData = await response.json();
      // console.log(responseData);

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
  const [imgstatus, setimgstatus] = useState(false);

  const closeImg = () => {
    setimgstatus(false);
    getStoredImage();

  }
  const openImg = () => {
    setimgstatus(true);
  }

  const [menuModal, setMenuModal] = useState([false, false, false]);
  const titles = ["Diet Report", "User Guide", "About us"];

  const openMenuModal = (index) => {
    const updatedMenuModal = [...menuModal];
    updatedMenuModal[index] = true;
    setMenuModal(updatedMenuModal);
  };
  const closeMenuModal = () => {
    setMenuModal([false, false, false]);
  };

  const [three, setthree] = useState([false, false, false]);
  const trice = ["Diet Goals", "Alerts", "Reports"];

  const openTriceModal = (index) => {
    const updatedTriceModal = [...three];
    updatedTriceModal[index] = true;
    setthree(updatedTriceModal);
  };
  const closeTriceModal = () => { 
    setthree([false, false, false]);
  };
  // const imageSource = Image.resolveAssetSource(require('./assets/defaultuser.png'));
  const [sMod, setSMod] = useState(false);
  const [loading, setLoading] = useState(false);
  const closeSMod = () => {
    setSMod(false);
  }

  const [searchText, setSearchText] = useState('');
  const [suggestedFoods, setSuggestedFoods] = useState([]);

  const handleTextChange = text => {
    setSearchText(text);
    // Filter food names based on entered text
    const filteredFoods = foodnames.filter(food =>
      food.toLowerCase().includes(text.toLowerCase())
    );
    // console.log(filteredFoods);
    setSuggestedFoods(filteredFoods);
  };


  return (
    <View>
      <ImageOpener modalVisible={imgstatus} closeModal={closeImg} imgURL={image} handleReload={getStoredImage} />
      <View style={{ backgroundColor: '#F7FCFF' }}>
        <View style={[t.h17, t.shadowLg, t.borderB2, t.roundedTSm, t.borderGray300, t.bgGray100]}>

          <View style={[t.flex, t.flexRow, t.justifyBetween]}>
            <TouchableOpacity onPress={openImg}>
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
            </TouchableOpacity>
            <View style={[t.flexRow, t.selfCenter, t.itemsCenter]}>
              <Entypo name="dot-single" size={40} color={isConnected ? "green" : "red"} />
              <Text style={[t.fontSemibold, t.mR2]}>{isConnected ? 'Online' : 'Offline'}</Text>
              {/* offline icon */}
              {
                peek && <TouchableOpacity onPress={cloudAlert}>
                  <Ionicons name="cloud-offline" size={24} color="darkgreen" />
                </TouchableOpacity>
              }


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
                <MenuItem onPress={() => openTriceModal(2)}><Text>Diet Report</Text></MenuItem>

                <MenuItem onPress={hideMenu}><Text>User Guide</Text></MenuItem>
                {/* <MenuItem disabled>Disabled item</MenuItem> */}
                <MenuDivider color='gray' />
                <MenuItem onPress={() => openMenuModal(2)}><Text>About us</Text></MenuItem>
              </Menu>
              <AboutUsModal modalVisible={menuModal[2]} closeModal={closeMenuModal} ItemName={titles[2]} />
            </View>

          </View>

        </View>
      </View>

      <ScrollView contentContainerStyle={{ backgroundColor: '#F7FCFF' }}>
        <View style={[t.pY4, t.pX4, t.flexRow, t.wFull, t.justifyBetween]}>
          <TouchableOpacity style={[t.bgWhite, t.w40, t.border2, t.borderRed700, t.h24, t.roundedLg, t.itemsCenter, t.justifyCenter]} onPress={() => { navigation.push("/Camera") }}>
            <Ionicons name="ios-camera-outline" size={50} style={[t.textRed700, t.selfCenter]} />
            <Text style={[t.textRed700, t.fontSemibold]}>Snap your food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[t.bgRed600, t.w40, t.h24, t.roundedLg, t.itemsCenter, t.justifyCenter]} onPress={() => setSMod(true)}>
            <MaterialCommunityIcons name="text-long" size={50} color="white" />
            <Text style={[t.textWhite, t.fontSemibold]}>Log your food</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={sMod}
          onRequestClose={closeSMod}
        >
          <View style={[t.wFull, t.hFull, t.bgWhite]}>
            <View style={[t.bgWhite, t.wFull, t.hFull, t.h16, t.borderB2, t.borderGray300]}>
              <View style={[t.flex, t.flexRow, t.justifyStart, t.wFull]}>
                <View style={[t.textBlack, t.mT4, t.mL4]}>
                  <View style={[t.flexRow, t.itemsCenter]}>
                    <TouchableOpacity onPress={closeSMod}>
                      <Feather name="arrow-left" size={26} color="black" style={[t.bgBlue100, t.roundedFull]} />
                    </TouchableOpacity>
                    <Text style={[t.fontBold, t.text2xl, t.textGray800, t.mL2,]}>Log your food</Text>

                  </View>
                </View>
              </View>
            </View>
            {/* //content */}
            <View>
              <View style={[t.itemsCenter]}>
                {/* <Ionicons name="ios-mic-outline" size={70} style={[t.textRed700, t.selfCenter,t.m4]} /> */}

                {/* <TouchableOpacity style={[t.bgTeal800,t.h10,t.w32,t.roundedLg,t.justifyCenter,t.m4]} onPress={() => startRecording}>
              <Text style={[t.textWhite,t.fontSemibold,t.textCenter]}>Start Recording</Text>
            </TouchableOpacity> */}
                {
                  !rec ?
                    <TouchableOpacity style={[t.textRed700, t.selfCenter, t.m4]} onPress={startRecording}>
                      <Ionicons name="ios-mic-outline" size={80}
                        style={[t.textRed700, t.selfCenter, t.m4]} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[t.textRed700, t.selfCenter, t.m4]} onPress={stopRecording}>
                      <Ionicons name="ios-stop-outline" size={80} />
                    </TouchableOpacity>
                }

              </View>
              {
                isConnected ?
                  <View>
                    <Text style={[t.textBase, t.fontBold, t.mL4, t.mT4, t.mB2, t.textGray700]}>Food Entry:</Text>
                    <View style={[t.mX4, t.border2, t.borderGray600, t.bgWhite, t.roundedLg]}>

                      <TextInput
                        multiline={true}
                        numberOfLines={5}
                        style={{ textAlignVertical: 'top', padding: 6, fontSize: 16 }}
                        // onChangeText={(text) => setFormData({ ...formData, content: text })}
                        placeholder='Input your food name/ Describe your food item'
                        onChange={(event) => setInput(event.nativeEvent.text)}
                      />
                    </View>
                  </View> :
                  <View>
                    <Text style={[t.textSm, t.fontBold, t.mL4, t.mT4, t.mB2, t.textGray700]}>It Seems you're not connected to internet. To log your meal, select food item from list and click Submit. </Text>
                    <View style={{ padding: 20 }}>
                      <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
                        placeholder="Enter food name"
                        value={searchText}
                        onChangeText={handleTextChange}
                      />

                      {suggestedFoods.length > -1 ? (
                        <FlatList
                          data={suggestedFoods}
                          renderItem={({ item }) => <Text style={[t.p2, t.borderGreen400, t.border, t.roundedLg, t.mY1, item === searchText ? t.bgGreen300 : t.bgWhite]} onPress={() => setSearchText(item)}>{item}</Text>}
                          keyExtractor={(item, index) => index.toString()}
                        />

                      ) : (
                        <Text>No items found</Text>
                      )}
                    </View>
                  </View>
              }






              <TouchableOpacity
                onPress={analyzeFood}
                style={{
                  backgroundColor: '#115e59',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '35%',
                  height: '8%',
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
            </View>

          </View>

        </Modal>
        {/* <View style={[t.p1, t.flex, t.textCenter, t.flexCol]}>
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
        </View> */}
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
          <DateNavigator reload={fetchNutri} />
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
              } style={[t.hFull, t.p2, t.bgRed200, t.roundedLg, t.wFull, t.flex, t.flexRow, t.justifyBetween]}>
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
          <View style={{ backgroundColor: '#eff6ff', marginHorizontal: 16, marginVertical: 10, borderRadius: 15 }}>
            <View style={[t.p2, t.flex, t.flexRow, t.textCenter, t.itemsCenter, t.border2, t.borderGray200, t.roundedLg]}>
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
            foodname={[names]}
            reload={fetchNutri}
            status={isConnected}
          />

          <BarComponent labels={formdata.labels} data={formdata.bardata} sploading={sploading} />
          <View style={{
            // ccfbf1
            backgroundColor: '#eff6ff', marginLeft: 16, marginRight: 16, marginBottom: 4, marginTop: 16, borderRadius: 15, flexDirection: 'row', height: 100, shadowColor: 'black', shadowOpacity: 0.9,
            shadowRadius: 4, elevation: 5, justifyContent: 'space-between', alignItems: 'center'
          }}>

            <View style={[t.mX4, t.h30]}>
              <View style={[t.flex, t.flexRow, t.justifyAround, t.roundedLg]}>
                <TouchableOpacity onPress={() => openTriceModal(0)} style={[t.w20, t.h16, t.m4, t.roundedFull, t.bgYellow100, t.itemsCenter, t.justifyCenter, t.flexCol]}>
                  <MaterialCommunityIcons name="clock-edit-outline" size={30} style={[t.textGray700, t.textCenter]} />
                  <Text style={[t.fontSemibold, t.textCenter]}>Goals</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openTriceModal(1)} style={[t.w20, t.h16, t.m4, t.roundedFull, t.bgYellow100, t.itemsCenter, t.justifyCenter, t.flexCol]}>
                  <Octicons name="alert" size={30} style={[t.textGray700, t.textCenter]} />
                  <Text style={[t.fontSemibold, t.textCenter]}>Alerts</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openTriceModal(2)} style={[t.w20, t.h16, t.m4, t.roundedFull, t.bgYellow100, t.itemsCenter, t.justifyCenter, t.flexCol]}>
                  <Ionicons name="document-attach-outline" size={30} style={[t.textGray700, t.textCenter]} />
                  <Text style={[t.fontSemibold, t.textCenter]}>Reports</Text>
                </TouchableOpacity>
              </View>
              <TriceModal modalVisible={three[0]} closeModal={closeTriceModal} ItemName={trice[0]} />
              <TriceModal modalVisible={three[1]} closeModal={closeTriceModal} ItemName={trice[1]} />
              <TriceModal modalVisible={three[2]} closeModal={closeTriceModal} ItemName={trice[2]} />
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
