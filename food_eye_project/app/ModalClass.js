import React, { useState,useMemo } from 'react';
import { View, Text, Modal, Button,ScrollView,TouchableOpacity } from 'react-native';
import { t } from 'react-native-tailwindcss';
import PieChartExample from './PieChart';
import CounterApp from './Counter';

const ModalComponent = ({ modalVisible, closeModal, modalData, foodname, reload }) => {
  // console.log(modalData)
  // console.log(foodname)
  function cleanArray(inputArray) {
    const arrayWithoutEmpty = inputArray.filter(item => item !== "" && item != "[]");
    const uniqueArray = Array.from(new Set(arrayWithoutEmpty));
    return uniqueArray;
  }
  modalData = cleanArray(modalData)  ;
  foodname = cleanArray(foodname);

  const [index,setindex]=useState(0) ;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center', height:'100%' ,backgroundColor:'#F4F4F4'}}>
        <View style={{
           backgroundColor:'#F4F4F4', width: '94%', height: '100%', marginTop: '0%',borderRadius:10,borderColor:'white',
           
        }}>
          
 <ScrollView>
  <View style={[t.flex, t.flexCol, t.selfCenter, t.mT10,t.m4,t.roundedLg]}>
    
      <View style={[t.border4, t.borderWhite,{ borderRadius: 10 },t.shadowLg,t.borderTeal500]}>
      <View style={[t.bgWhite, ]}>
        <PieChartExample data={modalData[index]} foodname ={foodname[index]} key={index} />
        </View>
        <CounterApp data={modalData[index]} fooditem={foodname[index]}  />
       
        {index === modalData.length - 1 ? (
          <View style={{ width: 90, height:44,alignSelf:'center', marginBottom:20}}>
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
        <View style={{ width: 90, height:44,alignSelf:'center', marginBottom:20}}>
          <TouchableOpacity
            onPress={()=>setindex(index+1)}
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
</ScrollView>




        </View>
      </View>
    </Modal>
  );
};
export default ModalComponent;