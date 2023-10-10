/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { GetAllPDF, DeviceContact, DeviceCallLogs } from './LocalFiles';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
