import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';

import {
  AppStyles,
  Metrics,
  Images,
  Fonts,
  Colors
} from '../../themes';

export default class Hr extends PureComponent {

  static propTypes = {
    width: PropTypes.number,
    color: PropTypes.string
  };

  static defaultProps = {
    width: 1,
    color: Colors.black,
  };

  render() {

    const { width, color } = this.props;

    return (
      <View style={[
        AppStyles.row, 
        styles.ligne,
        {alignItems: "center"}
      ]}>
        <View
          style={[
            styles.ligne,
            { height: width, backgroundColor: color }
          ]}
        />
        <Text style={[
          styles.text,
          { fontWeight: "bold" }
        ]}
        >
          Or
        </Text>
        <View
          style={[
            styles.ligne,
            { height: width, backgroundColor: color }
          ]}
        />
      </View>

    );
  }
}
 
const styles = StyleSheet.create({
  text: {
    ...Fonts.style.large,
    color: Colors.black,
    textAlign: "center",
    marginHorizontal: Metrics.baseMargin
  },
  ligne: {
    flex: 1 
  } 
})







