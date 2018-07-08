/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button
} from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial';
const targetName = 'Samsung Galaxy XCover 4';
export default class App extends Component{

  constructor() {
    super();
    this.state = {
      devices: []
    } 
    this.onConnect = this.onConnect.bind(this);
    this.pairDevice = this.pairDevice.bind(this);
    this.onStartServer = this.onStartServer.bind(this);
}

write (message) {
  BluetoothSerial.write(message)
  .then((res) => {
    debugger;
    this.setState({ connected: true })
  })
}


pairDevice (device) {
  BluetoothSerial.pairDevice(device.id)
  .then((paired) => {
    debugger;
    this.setState({connected: paired})

    if(paired)  {
      BluetoothSerial.connect(device.id)
      .then(() => {
        debugger;
        this.write('hello');
      }).catch(() => {
        debugger;
      });
    }
    this.write('hello');
  })
  .catch((err) => {
    debugger;
  })
}

componentDidMount() {
  BluetoothSerial.isEnabled().then(isEnabled => {

  });

  
}

getTargetDevice(devices) {
  return devices.find(d => d.name === targetName);
}

onStartServer() {
  BluetoothSerial.startServer().then(() => {
    debugger;

    BluetoothSerial.on('read', (response) => {
      debugger;
      this.setState({message: response.data})
    })
  }).catch(() => {
    debugger;
  })
}
onConnect() { 
  BluetoothSerial.list().then((devices) => {
    const device = this.getTargetDevice(devices);
    debugger;
    if(device) {
      BluetoothSerial.connect(device.id)
        .then(() => {
          debugger;
          this.write('hello');
        }).catch(() => {
          debugger;
        });
    }
    else {
      BluetoothSerial.discoverUnpairedDevices()
      .then((devices) => {
        debugger;
        const device = this.getTargetDevice(devices);
        if(device) {
          this.pairDevice(device)
        }
      })
    }
  })
}

renderDevices() {
  <View>
    this.state.devices.map(device => <Text> { 1 }</Text>)
  </View>
}

  requestEnable () {
    BluetoothSerial.requestEnable()
    .then((res) => this.setState({ isEnabled: true }))
    .catch((err) => Toast.showShortBottom(err.message))
  }


  render() {
    return (
      <View style={styles.container}>
        {this.renderDevices()}
        <Text>Device id</Text>
        <Text> Is connected: {this.state.connected} </Text>
        <Text> Message: {this.state.message} </Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1, width: '100%'}}
          onChangeText={(text) => this.setState({connectToDeviceId: text})}
          value={this.state.connectToDeviceId}>
        </TextInput>
        <Button
          onPress={this.onConnect}
          title="Connect"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
         <Button
          onPress={this.onStartServer}
          title="Start server"
        />
          <Button
                title='Request enable'
                onPress={() => this.requestEnable()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
