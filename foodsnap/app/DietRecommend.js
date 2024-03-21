import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, Dimensions, ActivityIndicator, Modal, FlatList, Alert,Linking } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { t } from 'react-native-tailwindcss';
import DDModalComponent from './DetailedDiet';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import HOST_URL from './config';
import * as IntentLauncher from 'expo-intent-launcher';

const DietRecommend = ({ fetchImages, recommendInfo, loading }) => {

  const [breakLoop, setbreakLoop] = useState(true);
  const [DDModelVisible, setDDModelVisible] = useState(false);
  const [findex, setfindex] = useState(null);
  const openDDModal = async (index) => {
    setfindex(index)
    setbreakLoop(false);
    setDDModelVisible(true);
  };

  const closeDDModal = async () => {
    setfindex(null);
    setbreakLoop(true);
    setDDModelVisible(false);
  };
  // var findex = 0 ;

  const handleNext = () => {
    fetchImages();
  };
  const [tab, settab] = useState(1);

  // const handleDetails=(index)=>{
  //   openDDModal()
  // }
  // const dummytext = "Chapati contains whole wheat flour, water, and salt, forming a simple unleavened flatbread staple in Indian cuisine."

  const [files, setFiles] = useState([]);



  const fetchFiles = async () => {
    try {
      const response = await fetch(`${HOST_URL}/api/user/files`, {
        method: 'GET',
      });
      const { data } = await response.json();
      // console.log(data);
      setFiles(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);
  const handleDownload = async(downloadLink,fileName) => {
    const localUri = `${FileSystem.documentDirectory}${fileName}`;
    const mimetype = 'application/pdf';
    const { uri } = await FileSystem.downloadAsync(
      `${HOST_URL}/api/user${downloadLink}`,
      localUri
    ); 
    // console.log('File copied to:', localUri);
      let content = await FileSystem.getContentUriAsync(localUri)
      // await Linking.openURL(uri);
      IntentLauncher.startActivityAsync(activityAction = "android.intent.action.VIEW", {
        data: content,
        flags: 1,
        type: mimetype,

      });
  };


  return (
    <View style={[t.flex1]}>
      {breakLoop ?
        <View style={[t.flex1]}>
          <View style={[t.h16, t.shadowLg, t.bgGray100, t.borderB2, t.borderGray300]}>
            <View style={[t.flex, t.flexRow, t.m1, t.textCenter, t.justifyStart, t.wFull]}>
              <Text style={[t.fontBold, t.text2xl, t.textBlack, t.mT4, t.mL4]}>Diet Recommendations</Text>
            </View>

          </View>
          <View style={[t.flex, t.flexRow, t.m2]}>
            <TouchableOpacity onPress={() => settab(1)} style={[t.p2, t.mX2, t.roundedLg, t.borderTeal800, t.border2, tab == 1 ? t.bgTeal800 : [t.bgWhite]]}>
              <Text style={[t.textBase, tab == 1 ? t.textWhite : t.textTeal900]}>Suggested Foods</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => settab(2)} style={[t.p2, t.mX2, t.bgTeal800, t.borderTeal800, t.border2, t.roundedLg, tab == 2 ? t.bgTeal800 : t.bgWhite]}>
              <Text style={[t.textBase, tab == 2 ? t.textWhite : t.textTeal900]}>Meal Plans</Text>
            </TouchableOpacity>
          </View>

          {
            tab === 1 && <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%', paddingBottom: 30 }}>

              <View>
                {
                  breakLoop ? recommendInfo.currentImages.map((img, index) => (

                    <TouchableOpacity style={[t.w30]} key={index} onPress={() => openDDModal(index)} >
                      <View style={[t.flex, t.flexRow, t.bgGray100, t.roundedLg, t.m2, t.border2, t.borderBlue200, t.shadowLg, t.itemsCenter]}>
                        <Image source={{ uri: `data:image/jpeg;base64,${img}` }} style={styles.image} />
                        <View style={[t.justifyCenter, t.mX2, t.flex1]}>
                          <Text style={[t.fontSemibold, t.textLg, t.mY2]}>{recommendInfo.foodNames[index]}</Text>
                          <Text>{recommendInfo.descriptions[index]}.</Text>
                          {/* <Text>🟥 P: 15g | 10 25</Text> */}
                          <View style={[t.flex, t.flexRow, t.mY2, t.justifyBetween]}>
                            <View style={[t.flexCol, t.itemsCenter]}>
                              {/* <Text style={[t.textXs,t.fontSemibold,t.textOrange800]}>PROTEIN</Text> */}
                              <Text style={[t.textXs, t.fontSemibold, t.textGreen700, t.mT1]}>🟥 P: {recommendInfo.nutritionInfo[index]['PROTEIN(G)']}% |</Text>
                            </View>
                            <View style={[t.flexCol, t.itemsCenter]}>
                              {/* <Text style={[t.textXs,t.fontSemibold,t.textOrange800]}>FATS</Text> */}
                              <Text style={[t.textXs, t.fontSemibold, t.textGreen700, t.mT1]}> 🟩 F:{recommendInfo.nutritionInfo[index]['FAT(G)']}% |</Text>

                            </View>
                            <View style={[t.flexCol, t.itemsCenter]}>
                              {/* <Text style={[t.textXs,t.fontSemibold,t.textOrange800]}>CARBOHYDRATES</Text> */}
                              <Text style={[t.textXs, t.fontSemibold, t.textGreen700, t.mT1]}> 🟦 C:{recommendInfo.nutritionInfo[index]['CARBOHYDRATES(G)']}%</Text>
                            </View>
                          </View>


                        </View>
                      </View>
                    </TouchableOpacity>
                  )) : null
                }
              </View>

              <TouchableOpacity onPress={handleNext} style={[t.w20, t.h10, t.bgTeal800, t.roundedLg, t.justifyCenter, t.selfEnd, t.m4]} disabled={loading} >

                <Text style={[t.textSm, t.textWhite, t.fontSemibold, t.textCenter, t.pX2]}>
                  {loading ?
                    (
                      <ActivityIndicator size="small" color='white' />) : (<>Generate</>)
                  }
                </Text>
              </TouchableOpacity>

            </ScrollView>
          }

          {
            tab === 2 &&

            
            <ScrollView>
              {
                files.map((file, index) => (
                  <View style={[t.bgGray100, t.h30]} key={index}>
                    <View style={[t.p4, t.flex, t.flexRow, t.textCenter, t.border2, t.borderGray200, t.mX2, t.mY2, t.roundedLg, t.bgWhite]}>
                      <Text style={[t.fontExtrabold, t.textBase, t.textGray600]}>{index + 1}</Text>
                      <View style={[t.flex, t.flexRow, t.mX4, t.justifyBetween, t.wFull, t.pX4]}>

                        <Text style={[t.textGray600]}>
                          {file.name.length > 32 ? `${file.name.substring(0, 32)}...` : file.name}
                        </Text>
                        <TouchableOpacity style={[t.bgTeal800, t.p2, t.roundedLg]} onPress={() => handleDownload(file.downloadLink,file.name)}>
                          <Text style={[t.textGray600, t.textWhite]}>Download</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                ))
              }

            </ScrollView>
          }


        </View> :
        <DDModalComponent
          modalVisible={DDModelVisible}
          closeModal={closeDDModal}
          recommendInfo={recommendInfo}
          findex={findex}
        />
      }
    </View>

  );
};

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({

  image: {
    // flex:1,
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 4,

  },
  button: {
    // shadowColor: 'rgba(0, 0, 0, 0.5)',
    // shadowOffset: { width: 2, height: 2 },
    // shadowRadius: 5,
    width: 10,
    height: 5
  },
});
export default DietRecommend;
