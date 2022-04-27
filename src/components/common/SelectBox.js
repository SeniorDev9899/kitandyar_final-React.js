import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

export default class SelectBox extends PureComponent {

  static propTypes = {
    width: PropTypes.number,
    selected: PropTypes.bool,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    width: 25,
    selected: false,
    onPress: () => { }
  };

  render() {

    const {
      width,
      selected,
      onPress
     } = this.props;

    return (
      <TouchableOpacity
        style={[
          AppStyles.center,
          AppStyles.blockRadius,
          styles.container,
          {
            width: width,
            height: width
          }
        ]}
        onPress={onPress}
      >
        <Image
          resizeMode={'contain'}
          style={[
            {
              tintColor: selected ? Colors.black : Colors.white,
              width: width - Metrics.smallMargin,
              height: width - Metrics.smallMargin,
            }
          ]}
          source={require("../../resources/icons/checked.png")}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1, 
    borderRadius: Metrics.radius,
    backgroundColor: Colors.white,
    marginRight: Metrics.baseMargin,
    borderColor: Colors.light_gray
  },
})
