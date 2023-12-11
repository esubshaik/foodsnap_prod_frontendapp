import React from 'react';
import { View, Text,Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import {t} from 'react-native-tailwindcss' ;

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const PieChartExample = ({ data,foodname }) => {
  const nutrientData = data?.data;

  return (
    <View style={{ width:'90%'}}>
      <View style={[t.m4]}> 
      <Text style={[t.fontSemibold,t.textBase,t.mL8,t.textTeal800]}>Nutrients Per 100 Grams of {foodname}</Text>
      <PieChart 
  data={
    nutrientData
      ? Object.keys(nutrientData).map((nutrient) => ({
          name: nutrient,
          population: nutrientData[nutrient],
          color: getRandomColor(),
          legendFontColor: '#7F7F7F',
          legendFontSize: 10,
        }))
      : []
  }
  width={Dimensions.get('window').width} 
  height={180} // Increase the height as needed
  chartConfig={{
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(5, 22, 26, ${opacity})`,
  }}
  accessor="population"
  backgroundColor="transparent"
  paddingLeft="2"
  center={[0, 10]}
  // absolute
/>

      </View>
    </View>
  );
};

export default PieChartExample;
