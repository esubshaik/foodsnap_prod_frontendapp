import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text } from 'react-native';
import {t} from 'react-native-tailwindcss';
// const RenderBoundingBoxes = ({results}) => {
//     if (!results || results.length == 0) {
//       return null;
//     }
//     const result  = results['data']['results'];
//     // console.log(result);
//     return Object.entries(result).map(([className, boundingBox],index) => {
//       if (!Array.isArray(boundingBox) || boundingBox.length !== 4) {
//         // Handle the case where boundingBox is not a valid array with four elements
//         console.error(`Invalid boundingBox format for class ${className}`);
//         return null;
//       }
  
//       const [x1, y1, x2, y2] = boundingBox;
//       const boxWidth = Math.abs(x2 - x1);
//       const boxHeight = Math.abs(y2 - y1);
  
//       return (
//         <View
//           key={index}
//           style={{
//             position: 'absolute',
//             left: x1,
//             top: y1,
//             width: boxWidth,
//             height: boxHeight,
//             borderWidth: 2,
//             borderColor: 'red',
//             backgroundColor: 'transparent',
//           }}
//         >
//           <Text style={{ color: 'red', fontWeight: 'bold' }}>{className}</Text>
//         </View>
//       );
//     });
//   };
  
  import { Dimensions } from 'react-native';

// const App = () => {
//   // ... existing code

  const RenderBoundingBoxes = ({results}) => {
    if (!results) {
      return null;
    }
    const result  = results['data']['results'];
    // console.log(result);
    const screenWidth = 0.1 ;
    const screenHeight = 0.165 ;
  
    return Object.entries(result).map(([className, boundingBox], index) => {
      if (!Array.isArray(boundingBox) || boundingBox.length !== 4) {
        // console.error(`Invalid boundingBox format for class ${className}`);
        return null;
      }
  
      const [x_min, y_min, x_max, y_max] = boundingBox;
      const boxWidth = Math.abs(x_max - x_min) * screenWidth;
      const boxHeight = (Math.abs(y_max - y_min) * screenHeight)-60;
      const boxLeft = x_min * screenWidth;
      const boxTop = y_min * screenHeight;
  
      // console.log(`className: ${className}, boxLeft: ${boxLeft}, boxTop: ${boxTop}, boxWidth: ${boxWidth}, boxHeight: ${boxHeight}`);
  
      return (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: boxLeft,
            top: boxTop,
            width: boxWidth,
            height: boxHeight,
            borderWidth: 2,
            borderColor: 'red',
            backgroundColor: 'transparent',
          }}
        >
          <Text style={[t.textWhite,t.fontSemibold,t.textLg]}>{className}</Text>
        </View>
      );
    });
  };



  export default RenderBoundingBoxes ;