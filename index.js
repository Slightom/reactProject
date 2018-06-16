import { AppRegistry } from 'react-native';
import App from './App';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning:', 'Virtualized']);

AppRegistry.registerComponent('project', () => App);
