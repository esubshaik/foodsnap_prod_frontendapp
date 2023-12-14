import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, endOfMonth } from 'date-fns';
import {t} from 'react-native-tailwindcss' ;

const UserProgress = () => {
  // Get the current date
  const currentDate = new Date();

  // Get the end of the current month
  const endOfMonthDate = endOfMonth(currentDate);

  // Extract the day part from the end of the month
  const numberOfDaysInMonth = format(endOfMonthDate, 'd');
  console.log(numberOfDaysInMonth);

  const daysArray = [
    1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  // console.log(daysArray.length);
const percent = 30;
  const firstRow = daysArray.slice(0, numberOfDaysInMonth / 2);
  const secondRow = daysArray.slice(numberOfDaysInMonth / 2);

  return (
    <View style={[t.flex,t.flexRow,t.justifyBetween,t.m4]}>
      <View style={[t.flex,t.flexCol]}>
        <Text style={[t.textWhite,t.textLg,t.fontSemibold,t.mL2,t.mB2]}>Your Progress</Text>
      <View style={styles.container}>
        {firstRow.map((day, index) => (
          <View key={index} style={[styles.circle, day === 1 ? styles.circleFilled : null]} />
        ))}
      </View>
      <View style={styles.container}>
        {secondRow.map((day, index) => (
          <View key={index} style={[styles.circle, day === 1 ? styles.circleFilled : null]} />
        ))}
      </View>
      </View>
      <View style={[t.flex1,t.mT6,t.mL4]}>
        <Text style={[t.textWhite,t.text3xl,t.fontSemibold]}>{percent}%</Text>
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