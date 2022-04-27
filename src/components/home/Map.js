import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { withNavigation } from 'react-navigation';

import {
  AppStyles,
  Colors,
  Fonts,
  Metrics,
  Images
} from '../../themes';

class Map extends PureComponent {

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => { this.props.navigation.navigate("Map") }}
      >
        {/* <Image
          resizeMode={'cover'}
          style={{ 
            width: Metrics.deviceWidth,
            height: Metrics.deviceHeight / 4
           }}
          source={require("../../resources/images/map.jpg")}
          /> */}
      </TouchableOpacity>
    );
  }
}
export default withNavigation(Map);

const styles = StyleSheet.create({
  container: { 
    marginTop: Metrics.smallMargin
  }
});