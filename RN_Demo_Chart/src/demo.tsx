/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryArea,
  VictoryLine,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
  VictoryPie,
  VictoryTooltip,
  VictoryLegend,
  VictoryVoronoiContainer,
} from 'victory-native';
import Svg, {Defs, G, LinearGradient, Stop} from 'react-native-svg';
import RadioForm from 'react-native-simple-radio-button';
import axios from 'axios';
const {width} = Dimensions.get('window');

const colorArray = [
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
];

var radio_props = [
  {label: 'Bar', value: 0},
  {label: 'Line', value: 1},
  {label: 'Area', value: 2},
  {label: 'Pie', value: 3},
];

const App = () => {
  const [chartData, setData] = useState<any>([]);
  const [chart, setChart] = useState(0);
  const getData = async () => {
    try {
      await axios
        .get(
          'https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest',
        )
        .then(response => {
          setData(response?.data?.data?.slice(0, 10));
        });
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const genStops = () => {
    var percentage = 100 / chartData.length;
    var stops = [<Stop key={0} offset="0%" stopColor={colorArray[0]} />];
    chartData.forEach((x: any, i: any) => {
      var stop = (
        <Stop
          key={i + 1}
          offset={`${percentage * (i + 1)}%`}
          stopColor={pickColor(i)}
        />
      );
      stops.push(stop);
    });
    return stops;
  };

  const pickColor = (i: any) => {
    var index = indexHelper(i, colorArray.length);
    return colorArray[index];
  };

  const indexHelper = (a: any, b: any): any => {
    return a >= b ? indexHelper(a - b, b) : a;
  };

  const stops = genStops();

  // if you want colors for gradient to be static, replace {stops} inside <LinearGradient> with
  // <Stop offset="0%" stopColor="red"/>
  // <Stop offset="25%" stopColor="orange"/>
  // <Stop offset="50%" stopColor="gold"/>
  // <Stop offset="75%" stopColor="yellow"/>
  // <Stop offset="100%" stopColor="green"/>

  //format number decimal places
  const formatNumber = (num: any) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };
  const sumPopulations = (arr: any) => {
    let sum = 0;
    for (let i = 0; i < arr?.length; i++) {
      sum += arr[i]?.Population;
    }
    return sum;
  };

  var MyChart = (
    <VictoryBar
      data={chartData}
      x="State"
      y="Population"
      animate={{
        duration: 2000,
        onLoad: {duration: 1000},
      }}
      alignment="middle"
      style={{
        data: {fill: 'red', border: 0},
      }}
      labels={({datum}) => `${datum.Population}`}
      labelComponent={
        <VictoryLabel angle={90} verticalAnchor="start" textAnchor="end" />
      }
    />
  );

  if (chart === 1) {
    MyChart = (
      <VictoryLine
        data={chartData}
        x="State"
        y="Population"
        animate={{
          onLoad: {duration: 1000},
          duration: 1000,
          easing: 'bounce',
        }}
        style={{
          data: {
            stroke: 'purple',
            strokeWidth: 3,
          },
        }}
      />
    );
  } else if (chart === 2) {
    MyChart = (
      <VictoryArea
        data={chartData}
        x="State"
        y="Population"
        animate={{
          duration: 1000,
          easing: 'bounce',
          onLoad: {duration: 1000},
        }}
        style={{
          data: {
            fill: 'url(#gradientStroke)',
            stroke: '#1E93FA',
            strokeWidth: 2,
          },
        }}
      />
    );
  } else if (chart === 3) {
    MyChart = (
      <View>
        <Text>{formatNumber(sumPopulations(chartData))}</Text>

        <VictoryPie
          width={width}
          colorScale={colorArray}
          data={chartData}
          x="State"
          y="Population"
          labels={({datum}) =>
            `${
              Math.round(
                (datum.Population / sumPopulations(chartData)) * 100 * 10,
              ) / 10
            }%`
          }
          style={{labels: {fontSize: 13, fill: 'black'}}}
          labelComponent={<VictoryLabel />}
          theme={VictoryTheme.material}
          origin={{x: width / 2, y: width / 2}}
          radius={(active: any) => (active ? width / 2 - 20 : width / 2 - 40)}
          labelRadius={width / 4 - 10}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPressIn: () => {
                  return [
                    {
                      target: 'labels',
                      mutation: ({text, data, index}) => {
                        // console.log(data[index].Population);
                        return text === data[index].Population
                          ? null
                          : {text: data[index].Population};
                      },
                    },
                  ];
                },
              },
            },
          ]}
        />

        <VictoryLegend
          x={0}
          y={0}
          centerTitle
          title="Chú thích"
          orientation="vertical"
          gutter={0}
          colorScale={colorArray}
          data={chartData.map((data: any) => ({
            name: data?.State,
          }))}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {chart === 3 ? (
        MyChart
      ) : (
        <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
          {/* GRADIENT FOR VictoryArea */}
          <Defs>
            <LinearGradient id="gradientStroke">{stops}</LinearGradient>
          </Defs>
          {/* <VictoryAxis
          dependentAxis
          animate={{
            duration: 2000,
            easing: 'bounce',
          }}
        />
        <VictoryAxis
          crossAxis
          // width={400}
          // theme={VictoryTheme.material}
          // offsetX={100}
          // standalone={false}
        /> */}

          {MyChart}
        </VictoryChart>
      )}
      <View style={{position: 'absolute', bottom: 10}}>
        <RadioForm
          radio_props={radio_props}
          formHorizontal={true}
          labelHorizontal={false}
          buttonColor={'#2196f3'}
          onPress={value => setChart(value)}
        />
      </View>

      {/* <Button onPress={addData} title="Add Earnings" />
      <Button onPress={reset} title="Reset" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  title: {
    margin: 5,
  },
});

export default App;
