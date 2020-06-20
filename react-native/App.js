import * as React from 'react';
import { StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default class App extends React.Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={true} />
        <WebView
          source={{ uri: 'https://weitungchen.com/web-chess' }}
          style={{ flex: 1 }}
          userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"/>
      </View>
    );
  }
}
  