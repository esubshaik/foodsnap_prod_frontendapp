import React, {useMemo} from 'react';
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
  // console.log(data);
  const nutrientData = data?.data;
  // console.log(nutrientData);
  return (
    <View style={{ width:'100%'}}>
      {
        nutrientData && nutrientData['CALORIES(G)'] ? 
        <View style={[t.m0]}> 
      <View style={[t.bgTeal800,t.p1,t.textCenter,t.mB6]}>
      <Text style={[t.textCenter,t.fontSemibold,t.textBase,t.mB2,t.textWhite,t.pT2]}>📌 Selected Food: {foodname}</Text>
      </View>
      <Text style={[t.fontSemibold,t.textBase,t.mL8,t.textTeal800]}>📊 Nutrient Breakdown (per 100g)</Text>
      <PieChart 
  data={
    nutrientData
      ? Object.keys(nutrientData).map((nutrient) => ({
          name: nutrient,
          population: nutrientData[nutrient],
          color: getRandomColor(),
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        }))
      : []
  }
  width={Dimensions.get('window').width-10} 
  height={180} // Increase the height as needed
  chartConfig={{
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(5, 22, 26, ${opacity})`,
  }}
  accessor="population"
  backgroundColor="transparent"
  paddingLeft="1"
  center={[0, 10]}
  // absolute
/>
      </View> : <View>
      <View style={[t.bgTeal800,t.p1,t.textCenter,t.mB6]}>
      <Text style={[t.textCenter,t.fontSemibold,t.textBase,t.mB2,t.textWhite,t.pT2]}>📌 Selected Food: {foodname}</Text>
      </View>
        <Text style={[t.textCenter,t.p4]}>*Nutrition Breakdown is unavailable in offline mode.</Text>
        <Text style={[t.textCenter,t.p2, t.fontSemibold]}>Note: Offline logging saves food entries locally and uploads them to the cloud once connected to the internet.</Text>
      </View>
      }
    </View>
  );
};

export default PieChartExample;
