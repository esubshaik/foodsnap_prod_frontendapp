import React from 'react';
import { View, Text } from 'react-native';
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
      <Text style={[t.fontSemibold,t.textBase,t.m4]}>{foodname}: Nutrients Per 100 Grams</Text>
      <PieChart 
        data={
          nutrientData
            ? Object.keys(nutrientData).map((nutrient) => ({
                name: nutrient,
                population: nutrientData[nutrient],
                color: getRandomColor(),
                legendFontColor: '#7F7F7F',
                legendFontSize: 11,
                
              }))
            : []
        }
        center={[0, 10]}
        width={300}
        height={100}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(5, 22, 26, ${opacity})`,
          
        }}
        accessor="population"
        backgroundColor="transparent"

      />
    </View>
  );
};

export default PieChartExample;
