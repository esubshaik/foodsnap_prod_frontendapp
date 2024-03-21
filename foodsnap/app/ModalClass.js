import React, { useState, useMemo } from 'react';
import { View, Text, Modal, Button, ScrollView, TouchableOpacity } from 'react-native';
import { t } from 'react-native-tailwindcss';
import PieChartExample from './PieChart';
import { AntDesign, Feather, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import CounterApp from './Counter';




const ModalComponent = ({ modalVisible, closeModal, modalData, foodname, status }) => {
  // console.log(modalData);
  // console.log(foodname);
  function cleanArray(inputArray) {
    const arrayWithoutEmpty = inputArray.filter(item => item !== "" && item != "[]");
    const uniqueArray = Array.from(new Set(arrayWithoutEmpty));
    return uniqueArray;
  }
  modalData = cleanArray(modalData);
  foodname = cleanArray(foodname);
  const [index, setindex] = useState(0);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
    >

      <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#F7FCFF', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

        <View style={{
          backgroundColor: '#F7FCFF', width: '96%', height: '100%', marginTop: '0%', borderRadius: 10, borderColor: 'white',
        }}>

          <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%', paddingBottom: 30 }}>

            <View style={[t.flex, t.hFull, t.flexCol, t.selfCenter, t.roundedLg]}>
              <View style={[t.flexRow, t.itemsCenter, , t.pX4]}>
                <TouchableOpacity onPress={closeModal}>
                  <Feather name="arrow-left" size={26} color="black" style={[t.bgBlue100, t.roundedFull]} />
                </TouchableOpacity>
                <Text style={[t.fontBold, t.text2xl, t.textBlack, t.mL2, t.pY5]}>Nutrition Overview & Diet Log</Text>
              </View>
              <View style={[t.border4, t.bgWhite, { borderRadius: 10 }, t.shadowLg, t.borderTeal500, t.shadowLg, t.shadowXl]}>
                <PieChartExample data={modalData[index]} foodname={foodname[index]} key={index} />
                <CounterApp data={modalData[index]} fooditem={foodname[index]} status = {status}/>
                <View>
                  {index === modalData.length - 1 ? (
                    <View style={{ width: '50%', height: 44, alignSelf: 'center', marginBottom: 20 }}>
                      <TouchableOpacity
                        onPress={closeModal}
                        style={{
                          backgroundColor: '#E70A0A',
                          borderRadius: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          flex: 1,
                          flexDirection: 'row',
                        }}
                      >
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            marginLeft: 4,
                            fontSize: 16,
                          }}
                        >
                          Close
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) :
                    <View style={{ width: 90, height: 44, alignSelf: 'center', marginBottom: 20 }}>
                      <TouchableOpacity
                        onPress={() => setindex(index + 1)}
                        style={{
                          backgroundColor: '#006DFF',
                          borderRadius: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          flex: 1,
                          flexDirection: 'row',
                        }}
                      >
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            marginLeft: 4,
                            fontSize: 16,
                          }}
                        >
                          Next
                        </Text>
                      </TouchableOpacity>
                    </View>
                  }
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
export default ModalComponent;