import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const PieChartWithColoredBar = ({ data }) => {
  const barColor = 'purple';
  const barTitle = 'Bar Title';

  const totalValue = data.reduce((total, slice) => total + slice.value, 0);

  let cumulativePercentage = 0;

  return (
    <View>
      {/* Pie Chart */}
      <Svg height="200" width="200">
        {data.map((slice) => {
          const percentage = (slice.value / totalValue) * 100;
          const startAngle = (cumulativePercentage / 100) * 360;
          cumulativePercentage += percentage;

          return (
            <G key={slice.key}>
              <Circle
                cx="100"
                cy="100"
                r="90"
                fill="transparent"
                stroke={slice.color}
                strokeWidth="20"
                strokeDasharray={`${percentage} ${100 - percentage}`}
                strokeLinecap="round"
                transform={`rotate(${startAngle} 100 100)`}
              />
            </G>
          );
        })}
      </Svg>

      {/* Colored Bar with Title */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, marginTop: 10 }}>
        <View style={{ backgroundColor: barColor, width: 20, height: 20, borderRadius: 10 }} />
        <Text style={{ marginLeft: 5, color: barColor, fontWeight: 'bold' }}>{barTitle}</Text>
      </View>
    </View>
  );
};

export default PieChartWithColoredBar;
