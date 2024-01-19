import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, ActivityIndicator, Modal, Switch, TextInput, Alert, StyleSheet, Button, Image, Linking, FlatList } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, InputField, InputSlot, InputIcon } from '@gluestack-ui/themed';
import { AntDesign, Feather, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Octicons, Entypo } from '@expo/vector-icons';
import axios from 'axios';
import HOST_URL from './config';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { encode } from 'base-64';
import { Buffer } from "buffer";

function TriceModal({ modalVisible, closeModal, ItemName }) {
  const [startDate, setStartDate] = useState(new Date(1598051730000));
  const [endDate, setEndDate] = useState(new Date()); // Initialize with the current date
  const [startMode, setStartMode] = useState('date');
  const [endMode, setEndMode] = useState('date');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [startDateSelected, setStartDateSelected] = useState(false);
  const [endDateSelected, setEndDateSelected] = useState(false);

  const startOnChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStart(Platform.OS === 'Android');
    setStartDate(currentDate);
    setStartDateSelected(true);

    if (startMode === 'date') {
      showStartMode('time');
    }
  };

  const endOnChange = (event, selectedDate) => {
    const currentDate = selectedDate < endDate ? selectedDate : new Date();
    setShowEnd(Platform.OS === 'Android');
    setEndDate(currentDate);
    setEndDateSelected(true);

    if (endMode === 'date') {
      showEndMode('time');
    }
  };

  const showStartMode = (currentMode) => {
    setStartMode(currentMode);
    setShowStart(true);
  };

  const showEndMode = (currentMode) => {
    setEndMode(currentMode);
    setShowEnd(true);
  };

  const showStartDatepicker = () => {
    showStartMode('date');
  };

  const showEndDatepicker = () => {
    showEndMode('date');
  };

  const showStartTimepicker = () => {
    if (startDateSelected) {
      showStartMode('time');
    } else {

    }
  };

  const showEndTimepicker = () => {
    if (endDateSelected) {
      showEndMode('time');
    } else {

    }
  };

  const StartHandler = () => {
    showStartDatepicker();
  };

  const EndHandler = () => {
    showEndDatepicker();
  };

  const convertToMongoDBDate = async (reactNativeDate) => {
    const year = reactNativeDate.getUTCFullYear();
    const month = String(reactNativeDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(reactNativeDate.getUTCDate()).padStart(2, '0');
    const hours = String(reactNativeDate.getUTCHours()).padStart(2, '0');
    const minutes = String(reactNativeDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(reactNativeDate.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(reactNativeDate.getUTCMilliseconds()).padStart(3, '0');

    const timeZoneOffset = '+00:00';
    const mongoDBDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timeZoneOffset}`;

    return mongoDBDateString;
  };

  const [pdfUri, setPdfUri] = useState(null);
  const downloadAndOpenPdf = async () => {
    // console.log(startDate)
    const token = await AsyncStorage.getItem('token');
    const act_start = await convertToMongoDBDate(startDate);
    const act_end = await convertToMongoDBDate(endDate);
    // console.log(act_start)
    // console.log(act_end)
    try {
      const response = await axios.post(
        HOST_URL + '/api/user/diet-report',
        {
          start: act_start,
          end: act_end
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        }
      );
      const filename = 'foodsnap_' + Date.now() + '.pdf';
      const directoryName = 'foodsnap';
      const directoryUri = FileSystem.cacheDirectory + directoryName + '/';
      const uri = directoryUri + filename;
      const buff = Buffer.from(response.data, 'base64');
      const base64Data = buff.toString('base64');
      const mimetype = 'application/pdf';
      await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });

      // Write the PDF file to the directory
      await FileSystem.writeAsStringAsync(uri, base64Data, { encoding: FileSystem.EncodingType.Base64 });

      const destinationUri = FileSystem.documentDirectory + filename;
      await FileSystem.copyAsync({ from: uri, to: destinationUri });
      setPdfUri(uri)
      console.log('File copied to:', destinationUri);
      let content = await FileSystem.getContentUriAsync(uri)
      // await Linking.openURL(uri);
      IntentLauncher.startActivityAsync(activityAction = "android.intent.action.VIEW", {
        data: content,
        flags: 1,
        type: mimetype,

      });

    } catch (error) {
      console.error(error);
    }
  };
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const directoryName = 'foodsnap';
        const directoryUri = FileSystem.cacheDirectory + directoryName + '/';
        const files = await FileSystem.readDirectoryAsync(directoryUri);

        // Create an array of objects with URI and name for each file
        const fileDetails = files.map((fileName) => ({
          uri: directoryUri + fileName,
          name: fileName,
        }));

        // Update the state with the file details
        setFileList(fileDetails);
      } catch (error) {
        console.error('Error reading directory:', error);
      }
    };
    loadFiles();
  }, [pdfUri]);


  const deleteFile = async (fileName) => {
    try {
      const directoryName = 'foodsnap';
      const directoryUri = FileSystem.cacheDirectory + directoryName + '/';
      const filePath = directoryUri + fileName;

      // Delete the file
      await FileSystem.deleteAsync(filePath);

      // Update the file list after deletion
      setFileList((prevList) => prevList.filter((file) => file.name !== fileName));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handlePDFOpen=async(uri)=>{
    let content = await FileSystem.getContentUriAsync(uri)
      IntentLauncher.startActivityAsync(activityAction = "android.intent.action.VIEW", {
        data: content,
        flags: 1,
        type: 'application/pdf',

      });
  }

  const showOpenAlert = (uri) => {
    Alert.alert(
      'Open PDF File',
      'Do you want to open this PDF file?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => handlePDFOpen(uri),
        },
      ],
      { cancelable: false }
    );
  };
  const showDeleteAlert = (name) => {
    Alert.alert(
      'Permanently Delete File',
      `Are you sure you want to permanently delete the file "${name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => deleteFile(name),
        },
      ],
      { cancelable: false }
    );
  };
  


  return (
    <Modal
      animationType="fade"
      transparent={true}
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
          ItemName == "Reports" && <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }}>
            <View style={[t.mX4, t.mY2]}>
              <Text style={[t.textBase, t.fontSemibold, t.textGray700, t.mT1, t.mX1]}>Diet Report Generator</Text>
              <View style={[t.flexCol, t.p4, t.textCenter, t.itemsCenter, t.border2, t.borderGray200, t.mY1, t.roundedLg, t.bgWhite]}>
                <Image
                  source={require('./assets/InappAssets/generating_report.gif')}
                  style={{ width: '90%', height: 200, marginRight: 4 }} // Adjust the width
                  resizeMode="contain"
                />

                <View style={[t.mY4, t.flexCol]}>
                  <TouchableOpacity style={[t.bgWhite, t.roundedLg, t.p2, t.mY4, t.borderTeal800, t.border2]} onPress={StartHandler}>
                    <Text style={[t.textTeal800, t.textXl, t.textCenter]}>Select Start Date</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[t.bgWhite, t.roundedLg, t.p2, t.mY4, t.borderTeal800, t.border2]} onPress={EndHandler}>
                    <Text style={[t.textTeal800, t.textXl, t.textCenter]}>Select End Date</Text>
                  </TouchableOpacity>
                  {showStart && (
                    <DateTimePicker
                      value={startDate}
                      mode={startMode}
                      onChange={startOnChange}
                      maximumDate={new Date()}
                    />
                  )}
                  {showEnd && (
                    <DateTimePicker
                      value={endDate}
                      mode={endMode}
                      onChange={endOnChange}
                      maximumDate={new Date()}


                    />
                  )}
                </View>
                <Text style={[t.textBase, t.fontSemibold, t.selfStart, t.mY4, t.textGray700]}>Selected Duration Intervals:</Text>
                <View style={[t.flexRow, t.itemsStart]}>
                  <View style={[t.flexCol]}>
                    <View style={[t.flexRow, t.itemsCenter]}>
                      <MaterialCommunityIcons name="ray-start-arrow" size={24} color="#374151" />
                      <Text style={[t.textXl, t.fontSemibold, t.selfStart, t.mY4, t.textGray700]}> From:  </Text>
                    </View>

                    <View style={[t.flexRow, t.itemsCenter]}>
                      <MaterialCommunityIcons name="ray-end-arrow" size={24} color="#374151" />
                      <Text style={[t.textXl, t.fontSemibold, t.selfStart, t.mY4, t.textGray700]}> To:  </Text>
                    </View>
                  </View>
                  <View style={[t.flexCol]}>
                    <Text style={[t.textXl, t.selfStart, t.mY4, t.textGray700]}>{startDate.toLocaleString()}</Text>
                    <Text style={[t.textXl, t.selfStart, t.mY4, t.textGray700]}>{endDate.toLocaleString()}</Text>
                  </View>
                </View>
                <View style={[t.mT4]}>
                  <Text>Please Wait while we generate your report</Text>
                </View>

              </View>



              <TouchableOpacity style={[t.bgTeal900, t.roundedLg, t.p2, t.mY4, t.borderTeal800, t.border2]} onPress={downloadAndOpenPdf}>
                <Text style={[t.textWhite, t.textXl, t.textCenter]}>Generate and Download Report</Text>
              </TouchableOpacity>
              <View>
                <Text style={[t.textBase, t.fontSemibold, t.textGray700, t.mT1, t.mX1]}>Download History</Text>
                <View style={[t.flexCol,t.p2, t.border2, t.borderGray200, t.mY1, t.roundedLg, t.bgWhite]}>
                  {
                    fileList?.map((file, index) => (
                      <View key={index} style={[t.flexRow,t.m2,t.justifyBetween,t.itemsCenter]}>
                        <Text style={[t.fontSemibold,t.textBase,t.textGray700]}>{index+1 + ".  "+file.name}</Text>
                        <TouchableOpacity onPress={()=>showDeleteAlert(file.name)}><Ionicons name="trash-outline" size={25} color="#e11d48" /></TouchableOpacity>
                        <TouchableOpacity onPress={()=>showOpenAlert(file.uri)}><AntDesign name="pdffile1" size={25} color="#e11d48" /></TouchableOpacity>
                        
                      </View>
                    ))
                  }


                </View>
              </View>

            </View>
          </ScrollView>
        }

      </View>

    </Modal>
  );
}

export default TriceModal;
