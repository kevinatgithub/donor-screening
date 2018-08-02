import React from 'react';
import { Screen, Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import {Database} from '../../lib/database'

export default class ChangePicture extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  async capture(){
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.props.complete(photo)
    }
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{flex:1}}>
          <Camera 
          ref={ref => this.camera = ref}
          style={{ flex: 1 }} 
          type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={this.capture.bind(this)}>
                <Text
                  style={{ fontSize: 18, marginBottom: 40, color: 'white' }}>
                  {' '}Take Donor Picture{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}