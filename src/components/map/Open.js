import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
  ImageBackground
} from 'react-native';

import {
  AppStyles,
  Colors,
  Metrics,
  Fonts,
} from '../../themes';

class Open extends PureComponent {

  static propTypes = {
    open: PropTypes.bool,
  };

  static defaultProps = {
    open: false,
  };

  render() {

    const {
      open,
    } = this.props;

    return (
      <View
        style={[
          AppStyles.center,
          AppStyles.row,
          styles.container,
          { backgroundColor: open ? "#7ad717" : "#ee6785" }
        ]}
      >
        <View style={[
          styles.point,
          { backgroundColor: open ? "#5ca70d" : "#d8254d" }
        ]} />
        <Text style={[
          styles.title,
        ]}>
          {open ? "OPEN" : "CLOSE"}
        </Text>
      </View>
    );
  }
}
export default (Open);

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 25,
    borderWidth: 0,
    borderRadius: 5
  },
  point: {
    width: 8,
    height: 8,
    borderWidth: 0,
    borderRadius: 4,
    marginRight: 3
  },
  title: {
    fontSize: 10,
    color: Colors.white
  },
})
