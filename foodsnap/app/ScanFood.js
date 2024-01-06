import React, {useState,useRef} from 'react';
import { View } from 'react-native';
import ScanFood from './Camera';


function Camview() {
  return (
    <View>
      <ScanFood/>
    </View>
  );
}

export default Camview;
