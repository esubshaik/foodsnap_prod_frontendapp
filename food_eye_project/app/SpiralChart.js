import React from 'react';
import { View, Text } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { ProgressChart, BarChart } from 'react-native-chart-kit';
import { useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProgressChartGrid = ({mynutridata}) => {


  // useEffect(() => {
  //   checkUserNutriData();
  // }, []);
  return (
    <View style={{backgroundColor:'#F0FCF7',margin:16,borderRadius:15,flexDirection:'row',height:'fit',shadowColor: '#05161A',shadowOpacity: 0.4,
    shadowRadius: 4,elevation: 5}}>
    <View style={[t.flex, t.flexCol]}>
      <View style={[t.flex, t.flexRow]}>
        <View style={[t.flex, t.flexCol]}>
          <Text style={[t.fontSemibold,t.pX6,t.pT6]}>KCal</Text>
          <ProgressChart
            data={{
              
              data: [mynutridata[0]],
               // Replace with your actual data
            }}
            width={110}
            height={100}
            strokeWidth={8}
            radius={20}
            chartConfig={{
              backgroundColor: '#F0FCF7',
              backgroundGradientFrom: '#F0FCF7',
              backgroundGradientTo: '#F0FCF7',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        </View>

        <View style={[t.flex, t.flexCol]}>
        <Text style={[t.fontSemibold,t.pX6,t.pT6]}>Protiens</Text>
          <ProgressChart
             data={{

              data: [mynutridata[1]],
               // Replace with your actual data
            }}
            width={110}
            height={100}
            strokeWidth={8}
            radius={20}
            
            chartConfig={{
              backgroundColor: '#F0FCF7',
              backgroundGradientFrom: '#F0FCF7',
              backgroundGradientTo: '#F0FCF7',
              color: (opacity = 8) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        </View>
      </View>

      <View style={[t.flex, t.flexRow]}>
        <View style={[t.flex, t.flexCol]}>
        <Text style={[t.fontSemibold,t.pX6]}>Fats</Text>
          <ProgressChart
             data={{
              
              data: [mynutridata[2]],
               // Replace with your actual data
            }}
            width={110}
            height={100}
            strokeWidth={8}
            radius={20}
            chartConfig={{
              backgroundColor: '#F0FCF7',
              backgroundGradientFrom: '#F0FCF7',
              backgroundGradientTo: '#F0FCF7',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        </View>

        <View style={[t.flex, t.flexCol]}>
        <Text style={[t.fontSemibold,t.pX6]}>Carbohydrates</Text>
          <ProgressChart
             data={{
              
              data: [mynutridata[3]],
               // Replace with your actual data
            }}
            width={110}
            height={100}
            strokeWidth={8}
            radius={20}
            chartConfig={{
              backgroundColor: '#F0FCF7',
              backgroundGradientFrom: '#F0FCF7',
              backgroundGradientTo: '#F0FCF7',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        </View>
      </View>
    </View>
    <View>
    <Text style={[t.fontSemibold,t.mT6,t.pX4]}>Hydration</Text>
    <View style={[t.border2,t.mT6,t.mB6,t.mL4,t.w16,t.roundedLg,t.h40]}>
    <View style={{backgroundColor:'transparent',height:'30%',width:'full',borderRadius:20}}></View>
      <View style={{backgroundColor:'#294D61',height:'70%',width:'full',borderRadius:5}}>
        <Text style={[t.textWhite,t.selfCenter,t.mT1,t.fontMedium]}>90%</Text>
      </View>
    </View>
    </View>
    </View>
  );
};

export default ProgressChartGrid;
