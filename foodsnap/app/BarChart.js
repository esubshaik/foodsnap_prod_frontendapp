import React from 'react';
import { View, StyleSheet,Dimensions,Text} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import {t} from 'react-native-tailwindcss' ;

const BarComponent = ({data,labels}) => {
  const chartConfig = {
    backgroundGradientFrom: '#FFFFF0',
    backgroundGradientTo: '#FFFFF0',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.4,
    decimalPlaces: 0,
    
  };

  return (
    <View style={styles.container}>
      <Text style={[t.fontSemibold,t.textYellow800, t.textLg, t.mT2,t.mB2,t.mL4,t.pT1]}>🍔 Today's Food Journey</Text>
      {
        labels[0] ?
        <BarChart 
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        }}
        width={Dimensions.get('window').width-40} 
  height={180} 
  yAxisLabel={''}
        fromZero
        chartConfig={chartConfig}
        withHorizontalLabels={false}
        withInnerLines={false}
        showValuesOnTopOfBars
        // showBarTops
        style={[t.mT10, t.mL0,t.relative]}
      />
   : <View style={[t.border,t.mX4]}></View>
      }
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:20,
    
    backgroundColor:'#FFFFF0',borderRadius:10,shadowColor: '#05161A',shadowOpacity: 0.4,
    shadowRadius: 4,elevation: 5, marginLeft:18, marginRight:18, paddingTop:12, marginTop:0
  },
});

export default BarComponent;
