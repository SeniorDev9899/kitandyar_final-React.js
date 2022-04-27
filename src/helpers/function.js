import { Dimensions } from 'react-native';

// Grab the window object from that native screen size.
const window = Dimensions.get('window');

// The vertical resolution of the screen.
const screenHeight = window.height;

// The horizontal resolution of the screen.
const screenWidth = window.width;

export const wp = (percentage) => {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
};

