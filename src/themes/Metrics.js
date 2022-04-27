import { Dimensions, Platform } from 'react-native';
import {wp} from "../helpers/function";

const { width, height } = Dimensions.get('window');
const deviceWidth = width < height ? width : height;
const deviceHeight = width < height ? height : width;
const { widthScreen: viewportWidth, heightScreen: viewportHeight } = Dimensions.get('window');

const Metrics = {
  deviceWidth,
  deviceHeight,
  baseMargin: deviceWidth / 30,
  doubleBaseMargin: deviceWidth / 15,
  smallMargin: deviceWidth / 60,
  borderRadius: 8,
 
  basePadding: deviceWidth / 30,
  doubleBasePadding: deviceWidth / 15,
  smallPadding: deviceWidth / 60,
 
  navBarHeight: (Platform.OS === 'ios') ? 70 : 50,
  radius: 5,
  buttonHeight: 45,
  inputHeight: 45, 
  
  scrollDistance: 250,
  minHeightHeader: 60,
  maxHeightHeader: deviceHeight * 0.3,

  swipeHeightHeader: deviceWidth * 0.374,
 
};

export default Metrics;