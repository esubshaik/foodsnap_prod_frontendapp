import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, Dimensions, ActivityIndicator, Modal, Linking ,TouchableOpacity,ScrollView,BackHandler, ToastAndroid} from 'react-native';
import { t } from 'react-native-tailwindcss';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import HOST_URL from './config';


const openExternalUrl = async (url) => {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    ToastAndroid.show("It seems there is no such application",ToastAndroid.SHORT)
    // console.error(`Don't know how to open URL: ${url}`);
  }
};

const DetailedDiet = ({ modalVisible, closeModal, recommendInfo, findex }) => {
  const zomatoURL = ``;
  const [loading, setLoading] = useState(false);
  const [moredata, setmoredata] = useState('');

  const fetchDescription = async () => {
    setLoading(true);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ foodname: recommendInfo.foodNames[findex] })

    };
    try {
      await fetch(
        HOST_URL + '/api/user/get_more_description', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              if (data) {
                //  // console.log();
                setmoredata(data.data.data.split(/\.\s+/).map((sentence, index) => (index % 3 === 0 && index !== 0) ? `\n\n${sentence}` : sentence).join('. '));
              }

            });
        })

    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };
  const [text, setText] = useState('');
  const title = 'Nutrient Insights';

  useEffect(() => {
    setText('Nutrient Insights');
    fetchDescription();
    // const backAction = () => {
    //   // BackHandler.exitApp();
    //   return true;
    // };
    // BackHandler.addEventListener('hardwareBackPress', backAction);
    // return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    
    // fetchImages();
  }, []);


  useEffect(() => {
    
    // let i = 0;
    // const type = () => {
    //   if (i < title.length) {
    //     setText((prevText) => prevText + title[i]);
    //     i++;
    //     setTimeout(type, 1);
    //   }
    // };

    // type();
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={[t.flex1, t.borderB2, t.borderGray200]}>
        <View style={[t.h16, t.shadowLg, t.bgWhite, t.borderB2, t.borderGray300]}>
        <View style={[t.flex, t.flexRow,t.justifyStart, t.wFull]}>
      <View style={[t.textBlack,t.mT4,t.mL4]}>
      <View style={[t.flexRow, t.itemsCenter]}>
              <TouchableOpacity onPress={closeModal}>
                <Feather name="arrow-left" size={26} color="black" style={[t.bgBlue100, t.roundedFull]} />
              </TouchableOpacity>
              <Text style={[t.fontBold, t.text2xl, t.textBlack, t.mL2,]}>{text}</Text>
            </View>
      </View>
        </View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%', paddingBottom: 30 }}>
          <View style={[t.flex, t.flexRow, t.justifyStart, t.mX1]}>
            <Image source={{ uri: `data:image/jpeg;base64,${recommendInfo.currentImages[findex]}` }} style={styles.image} />
            <View style={[t.mL2, t.mT6]}>
              <View style={[t.flexRow,t.contentCenter]}>
                <Text style={[t.textSm, t.bgBlue600,t.mB1, t.w5, t.textCenter, t.roundedSm, t.textWhite, t.fontSemibold]}>i</Text>
                <Text style={[ t.fontBold, t.mL2, t.textCenter]}>{recommendInfo.foodNames[findex]}</Text>
              </View>
              <View style={[t.flex, t.flexCol, t.mY2]}>
                <Text style={[ t.fontSemibold]}>MicroNutrients (100g)</Text>
                <View style={[t.flexCol, t.itemsStart]}>
                  {/* <Text style={[t.textXs,t.fontSemibold,t.textOrange800]}>PROTEIN</Text> */}
                  <Text style={[ t.fontSemibold, t.textGreen700, t.mT4]}>Protein: 🟥 {recommendInfo.nutritionInfo[findex]['PROTEIN(G)']}g </Text>
                </View>
                <View style={[t.flexCol, t.itemsStart]}>
                  {/* <Text style={[t.textXs,t.fontSemibold,t.textOrange800]}>FATS</Text> */}
                  <Text style={[ t.fontSemibold, t.textGreen700, t.mT4]}>Fat: 🟩 {recommendInfo.nutritionInfo[findex]['FAT(G)']}g </Text>

                </View>
                <View style={[t.flexCol, t.itemsStart]}>
                  {/* <Text style={[t.textXs,t.fontSemibold,t.textOrange800]}>CARBOHYDRATES</Text> */}
                  <Text style={[ t.fontSemibold, t.textGreen700, t.mT4]}>Carbohydrates: 🟦 {recommendInfo.nutritionInfo[findex]['CARBOHYDRATES(G)']}g</Text>
                </View>
              </View>
            </View>



          </View>
          <View style={[t.mX4,]}>
            <Text style={[t.text3xl, t.mT6, t.fontSemibold]}>NPD: Nutritional Profile Descriptions</Text>
            <Text style={[t.wFull, t.borderB2, t.borderGray300]}></Text>
            {
              loading ? <Text style={[t.mT4,t.textCenter]}> <ActivityIndicator size="large" color='#294D61'/> </Text>  : 
              <View>
                <Text style={[ t.mT4, t.fontSemibold, t.textGray800, t.bgOrange100,t.roundedLg,t.pT2,t.pB2, t.border2,t.borderOrange200,t.pX4]}>📌 {recommendInfo.descriptions[findex]}.</Text>
                <Text style={[t.mX1, t.mT4, t.textGray900, t.bgGray100,t.roundedLg,t.pT2,t.pB2, t.border2,t.borderGray200,t.p2]}>
                  <Text style={[t.selfCenter]}>🌟 {moredata}</Text>
                </Text>
              </View> 
    
            }
            <View>
              <Text style={[t.text3xl, t.mT6, t.fontSemibold]}>Macronutrient Distribution</Text>
              <LineChart
                data={{
                  labels: ['Protein', 'Fat', 'Carbohydrates'],
                  datasets: [{
                    data: [
                      recommendInfo.nutritionInfo[findex]['PROTEIN(G)'],
                      recommendInfo.nutritionInfo[findex]['FAT(G)'],
                      recommendInfo.nutritionInfo[findex]['CARBOHYDRATES(G)']
                    ]
                  }]
                }}
                width={Dimensions.get('window').width - 30} // from react-native
                height={240}
                yAxisLabel={''}
                chartConfig={{
                  backgroundColor: '#e26a00',
                  backgroundGradientFrom: '#fb8c00',
                  backgroundGradientTo: '#ffa726',
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  }
                }}
                bezier
                style={{
                  marginVertical: 20,
                  borderRadius: 16,
                  marginTop: 10,

                }}
              />
            </View>
            <Text style={[t.text2xl, t.mT6, t.fontSemibold,t.mB4]}>Wanna Search Food Online? </Text>
            <View style={[t.flex,t.flexRow,t.justifyBetween]}>
            <TouchableOpacity onPress={() => openExternalUrl(`zomato:///search?q=Roti`)}>
        <Text style={[t.textWhite,t.p2,t.bgRed600,t.roundedLg,t.fontSemibold,t.textCenter,t.w40]}>zomato</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openExternalUrl(`swiggy:///search?q=Roti`)}>
        <Text style={[t.textOrange600,t.border2,t.p2,t.borderOrange500,t.roundedLg,t.fontSemibold,t.textCenter,t.w40]}>swiggy</Text>
        </TouchableOpacity>
        </View>
          </View>
        
        </ScrollView>
      </View>
      
    </Modal>

  );
};

const styles = StyleSheet.create({
  image: {
    width: 180,
    height: 180,
    borderRadius: 10,
    margin: 8,
  },
  button: {
    // shadowColor: 'rgba(0, 0, 0, 0.5)',
    // shadowOffset: { width: 2, height: 2 },
    // shadowRadius: 5,
    width: 10,
    height: 5
  },
});

export default DetailedDiet;
