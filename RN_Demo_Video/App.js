import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import VideoPlayer from 'react-native-video-player';

export default class App extends Component {
  render() {
    return (
      <View>
        <Text style={{fontSize: 22, marginTop: 22}}>
          React Native Video Player
        </Text>
        <VideoPlayer
          video={{
            uri: 'https://www.youtube.com/embed/qaiLSpqeBHY',
          }}
          videoWidth={1600}
          videoHeight={900}
          thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
        />
      </View>
    );
  }
}
