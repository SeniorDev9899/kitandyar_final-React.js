import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

export default class Color extends PureComponent {

  static propTypes = {
    selected: PropTypes.bool,
    color: PropTypes.string,
    width: PropTypes.number,
    onPress: PropTypes.any,
  };

  static defaultProps = {
    selected: false,
    color: Colors.white,
    width: 24,
    onPress: () => { },
  };

  render() {
    const { selected, color, width, onPress } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          AppStyles.center,
          styles.container,
          {
            backgroundColor: color,
            width: selected ?  width : width-8,
            height: selected ? width : width-8,
            borderRadius: selected ? width-12 : width-16,
          }
        ]}
      >
        <View style={{
          backgroundColor: Colors.white,
          width: selected ? width-18 : 0,
          height: selected ? width-18 : 0,
          borderRadius: selected ? width-21 : 0,
        }}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: Metrics.smallMargin,
    borderWidth: 1,
    borderColor: Colors.white,
  },
});
