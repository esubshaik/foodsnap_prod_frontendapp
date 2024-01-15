import React from 'react';
import { View, StyleSheet,Dimensions,Text,ActivityIndicator,ScrollView} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import {t} from 'react-native-tailwindcss' ;

const BarComponent = ({data,labels,sploading}) => {
  const chartConfig = {
    backgroundGradientFrom: '#FFF0B2',
    backgroundGradientTo: '#FFF0B2',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 1,
    barPercentage: 1,
    decimalPlaces: 0,
  };
  const barwidth = labels.length;

  return (
    <View style={styles.container}>
      <Text style={[t.fontSemibold,t.textYellow800, t.textLg, t.mT2,t.mB2,t.mL4,t.pT1,t.overflowVisible]}>🍔 Today's Food Journey</Text>
      {
        sploading ? <ActivityIndicator size="large" color='#294D61'/> :
        labels[0] ?
        <ScrollView horizontal contentContainerStyle={{ flexGrow: 0, minHeight: '100%', minHeight:'100%' }}>
        <BarChart 
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        }}
        // width={Dimensions.get('window').width-40} 
        width={barwidth*75}
  height={180} 
  yAxisLabel={''}
        fromZero
        
        overflowVisible={true}
        yAxisSuffix=' '
        chartConfig={chartConfig}
        withHorizontalLabels={true}
        segments={3}
        // horizontalLabelRotation={270}
        // xLabelsOffset={-40}
        withInnerLines={true}
        verticalLabelRotation={0}
        yAxisInterval={10}
        xLabelsOffset={0}
        // withInnerLines={false}
        // showValuesOnTopOfBars
        showBarTops
        style={[t.mT4,t.relative,t.mR4,t.mL2,t.mY0]}
      />
      </ScrollView>
   : <View style={[t.border,t.mX4]}></View>
      }
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:20,
    backgroundColor:'#FFF0B2',borderRadius:10,shadowColor: '#05161A',shadowOpacity: 0.4,
    shadowRadius: 4,elevation: 5, marginLeft:18, marginRight:18, paddingTop:12, marginTop:0
  },
});

export default BarComponent;
