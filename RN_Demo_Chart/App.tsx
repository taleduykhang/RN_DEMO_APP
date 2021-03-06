/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import {Defs, LinearGradient, Stop} from 'react-native-svg';
import {
  VictoryArea,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryPie,
  VictoryStack,
  VictoryTheme,
  VictoryTooltip,
} from 'victory-native';
import data from './data.json';
import dataGroup from './dataGroup.json';
const {width} = Dimensions.get('window');

const colorArray = [
  '#b34700',
  '#cc5200',
  '#e65c00',
  '#FF6633',
  '#ff751a',
  '#ff8533',
  '#ff944d',
  '#ffa366',
  '#ffb380',
  '#ffc299',
  '#ffd1b3',
  '#ffe0cc',
  '#fff0e6',
];
const colorArray2 = ['#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
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

  //format number decimal places
  const formatNumber = (num: any) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };
  const sumPopulations = (arr: any) => {
    let sum = 0;
    for (let i = 0; i < arr?.length; i++) {
      if (chart === 3) {
        sum += arr[i]?.Population;
      } else {
        sum += arr[i]?.value;
      }
    }
    return sum / arr?.length;
  };
  const data1 = {
    data: [
      {
        x: 'T2',
        value: 100,
      },
      {
        x: 'T3',
        value: 100,
      },
      {
        x: 'T4',
        value: 100,
      },
      {
        x: 'T5',
        value: 100,
      },
      {
        x: 'T6',
        value: 100,
      },
      {
        x: 'T7',
        value: 100,
      },
      {
        x: 'CN',
        value: 100,
      },
    ],
  };
  const getBarData = () => {
    return dataGroup.map(dat => {
      return [
        {x: 'TK c?? b???n', y: dat.value, label1: dat.x},
        {x: 'TK t??ch l??y', y: dat.value * 2.3, label1: dat.x},
      ];
    });
  };
  var MyChart = (
    <VictoryChart
      // theme={VictoryTheme.material}
      domainPadding={{x: 30}}
      // domain={[0, 100]}
    >
      {/* GRADIENT FOR VictoryArea */}
      <Defs>
        <LinearGradient id="gradientStroke" x1="0%" y1="0%" x2="0%" y2="100%">
          {stops}
        </LinearGradient>
      </Defs>
      <VictoryAxis
        dependentAxis
        tickFormat={tick => `${tick}%`}
        style={{
          axis: {stroke: 'transparent'},
          ticks: {stroke: 'transparent'},
        }}
      />

      <VictoryAxis
        tickFormat={['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']}
        style={{
          axis: {stroke: 'transparent'},
          ticks: {stroke: 'transparent'},
        }}
      />

      <Text style={{color: '#FF6633', fontSize: 24, fontWeight: 'bold'}}>
        Trung b??nh:
        {Math.round(sumPopulations(data?.data) * 10) / 10}%
      </Text>

      <VictoryBar
        data={data?.data}
        x="x"
        y="value"
        animate={{
          duration: 2000,
          onLoad: {duration: 1000},
        }}
        alignment="middle"
        cornerRadius={{top: 10, bottom: 10}}
        style={{
          data: {
            fill: 'url(#gradientStroke)',
            fillOpacity: 0.7,
            // stroke: 'url(#gradientStroke)',
            strokeWidth: 1,
            border: 0,
          },
        }}
        // labels={({datum}) => `${datum.value}`}
        // labelComponent={<VictoryLabel angle={0} verticalAnchor="middle" />}
      />
      <VictoryBar
        data={data1.data}
        x="x"
        y="value"
        animate={{
          duration: 2000,
          onLoad: {duration: 1000},
        }}
        alignment="middle"
        cornerRadius={{top: 10, bottom: 10}}
        style={{
          data: {
            fill: '#d1d1e0',
            fillOpacity: 0.2,
            // stroke: 'url(#gradientStroke)',
            strokeWidth: 1,
            border: 0,
          },
        }}
        // labels={({datum}) => `${datum.value}`}
        // labelComponent={<VictoryLabel angle={0} verticalAnchor="middle" />}
      />
    </VictoryChart>
  );

  if (chart === 1) {
    MyChart = (
      <>
        <VictoryChart theme={VictoryTheme.material} domainPadding={{x: 100}}>
          <VictoryAxis
            style={{
              axis: {stroke: 'transparent'},
              ticks: {stroke: 'transparent'},
            }}
          />

          <VictoryStack
            colorScale={colorArray2}
            style={{
              data: {stroke: 'white', strokeWidth: 3},
            }}>
            {getBarData().map((dat, index) => {
              return (
                <VictoryBar
                  key={index}
                  data={dat}
                  labels={({datum}) => `${Math.round(datum.y / 10)}`}
                  labelComponent={<VictoryTooltip />}
                  style={{labels: {fill: 'black'}}}
                  animate={{
                    duration: 2000,
                    onLoad: {duration: 1000},
                  }}
                />
              );
            })}
          </VictoryStack>
          <VictoryLegend
            x={0}
            y={0}
            centerTitle
            title="Ch?? th??ch"
            orientation="vertical"
            gutter={20}
            style={{border: {stroke: 'black'}, title: {fontSize: 20}}}
            colorScale={colorArray2}
            data={getBarData().map((abc: any) => ({
              name: abc[0]?.label1,
            }))}
          />
        </VictoryChart>
      </>
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
          title="Ch?? th??ch"
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
      {MyChart}
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
