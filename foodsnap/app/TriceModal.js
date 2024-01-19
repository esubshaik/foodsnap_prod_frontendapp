import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, ActivityIndicator, Modal, Switch, TextInput, Alert, StyleSheet, Button, Image } from 'react-native';
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
import {Buffer} from "buffer";

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
    const currentDate = selectedDate || endDate;
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
      // Handle the case where the user tries to select start time without selecting start date
      // You can inform the user to select a start date first or set the start date to the current date
      // For example, you can call showStartMode('time') here with the current start date.
    }
  };

  const showEndTimepicker = () => {
    if (endDateSelected) {
      showEndMode('time');
    } else {
      // Handle the case where the user tries to select end time without selecting end date
      // You can inform the user to select an end date first or set the end date to the current date
      // For example, you can call showEndMode('time') here with the current end date.
    }
  };

  const StartHandler = () => {
    showStartDatepicker();
  };

  const EndHandler = () => {
    showEndDatepicker();
  };

  async function saveFile(uri, filename, mimetype) {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        // const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch(e => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  }


  const [pdfUri, setPdfUri] = useState(null);
  const downloadAndOpenPdf = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(
        HOST_URL + '/api/user/diet-report',
        {
          start: "2024-01-18T12:27:43.961+00:00",
          end: "2024-01-19T07:28:53.443+00:00"
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        }
      );

      const filename = 'cachefile_' + Date.now() + '.pdf';
      const uri = FileSystem.cacheDirectory + filename;
      buff = Buffer.from(response.data, 'base64')

      const base64Data = buff.toString("base64");
      // console.log(base64Data)
      const mimetype = "application/pdf"
      if (Platform.OS === "android") {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          // const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  
          await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename,mimetype)
            .then(async (uri) => {
              console.log(uri);
              await FileSystem.writeAsStringAsync(uri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
            })
            .catch(e => console.log(e));
        } else {
          shareAsync(uri);
        }
      } else {
        shareAsync(uri);
      }


      // await FileSystem.writeAsStringAsync(uri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
      console.log("saved pdf")
    } catch (error) {
      console.error(error);
    }
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
                    />
                  )}
                  {showEnd && (
                    <DateTimePicker
                      value={endDate}
                      mode={endMode}
                      onChange={endOnChange}
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


            </View>
          </ScrollView>
        }

      </View>

    </Modal>
  );
}

export default TriceModal;
