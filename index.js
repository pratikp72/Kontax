/**
 * @format
 */

import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';

import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
console.error=()=>null
if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
} else {
  Text.defaultProps = {};

  Text.defaultProps.allowFontScaling = false;
}
if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}
if (View.defaultProps == null) {
  View.defaultProps = {};
  View.defaultProps.allowScaling = false;
}
if (TouchableOpacity.defaultProps == null) {
  TouchableOpacity.defaultProps = {};
  TouchableOpacity.defaultProps.allowScaling = false;
}
