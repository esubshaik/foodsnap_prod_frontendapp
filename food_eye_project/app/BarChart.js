import React from 'react';
import { View, StyleSheet,Dimensions,Text} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import {t} from 'react-native-tailwindcss' ;

const BarComponent = ({data,labels}) => {
  // Sample data and labels
  // const data = [10, 15, 20, 25, 30];
  // const labels = ['Label1', 'Label2', 'Label3', 'Label4', 'Label5'];

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
  };

  return (
    <View style={styles.container}>
      <Text style={[t.fontSemibold, t.textLg, t.mT6,t.mB2]}>Today's Food Record</Text>
      <BarChart
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        }}
        width={Dimensions.get('window').width-50} 
  height={180} 
        yAxisLabel={'%'}
        chartConfig={chartConfig}
        // verticalLabelRotation={0}
        
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom:50,
    
    backgroundColor:'white',borderRadius:10,shadowColor: '#05161A',shadowOpacity: 0.4,
    shadowRadius: 4,elevation: 5, margin:18
  },
});

export default BarComponent;
