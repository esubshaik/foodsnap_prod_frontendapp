import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, endOfMonth } from 'date-fns';
import {t} from 'react-native-tailwindcss' ;

const UserProgress = ({presentarr}) => {
  // Get the current date
  const currentDate = new Date();

  // Get the end of the current month
  const endOfMonthDate = endOfMonth(currentDate);

  // Extract the day part from the end of the month
  const numberOfDaysInMonth = format(endOfMonthDate, 'd');
  // console.log(numberOfDaysInMonth);
  const daysArray = presentarr  ;
  const numberOfOnes = presentarr.reduce((count, value) => count + value, 0);
const totalDays = presentarr.length;
const percentageOfOnes = (numberOfOnes / totalDays) * 100;

const percent = parseInt(percentageOfOnes);
  const firstRow = daysArray.slice(0, numberOfDaysInMonth / 2);
  const secondRow = daysArray.slice(numberOfDaysInMonth / 2);

  return (
    <View style={[t.flex,t.flexRow,t.justifyBetween,t.m4]}>
      <View style={[t.flex,t.flexCol]}>
        <Text style={[t.textWhite,t.textLg,t.fontSemibold,t.pB2,t.pT1]}>🟢 Your Progress</Text>
      <View style={styles.container}>
        {numberOfOnes ? firstRow.map((day, index) => (
          <View key={index} style={[styles.circle, day === 1 ? styles.circleFilled : null]} />
        )): <View>
          <Text style={[t.textWhite,t.textBase,t.pT2]}>LOG YOUR MEAL TO START YOUR STREAK 🔥</Text>
          </View>
          }
      </View>
      <View style={styles.container}>
        {numberOfOnes ? secondRow.map((day, index) => (
          <View key={index} style={[styles.circle, day === 1 ? styles.circleFilled : null]} />
        )) : null}
      </View>
      </View>
      <View style={[t.flex1,t.mT6,t.mL4]}>
        <Text style={[t.textWhite,t.text3xl,t.fontSemibold]}>{percent ?percent+'%' : null}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'transparent',
    margin: 2,
  },
  circleFilled: {
    backgroundColor: 'white', // or any color you prefer
  },
});

export default UserProgress;