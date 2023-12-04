import React, { useState } from 'react';
import { View, Text, Modal, Button } from 'react-native';
import {t} from 'react-native-tailwindcss' ;
import PieChartExample from './PieChart';
import CounterApp from './Counter' ;

const ModalComponent = ({ modalVisible, closeModal, modalData,foodname,reload }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={{alignItems:'center',justifyContent:'center'}}>
        <View style={{ backgroundColor: '#F8F8F8',width:'92%',height:'72%',marginTop:'30%', borderRadius: 10 ,shadowColor: '#05161A',shadowOpacity: 0.4,
    shadowRadius: 4,elevation: 5}}>
        
            <View style={[t.flex,t.flexCol, t.selfCenter]}>
                <PieChartExample data={modalData} foodname={foodname}/>
                <CounterApp closeModal={closeModal} data={modalData} reloadnutri = {reload}/>
            </View>

          
        </View>
      </View>
    </Modal>
  );
};
export default ModalComponent ;