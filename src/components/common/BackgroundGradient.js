import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Colors } from '../../themes';

export default class BackgroundGradient extends PureComponent {

  static propTypes = {
    color: PropTypes.any,
    styleBackground: PropTypes.any,
  };

  static defaultProps = {
    color: Colors.gradientBlackColor,
    styleBackground: {}
  };

  render() {
    const { color, styleBackground } = this.props;
    return (
      <LinearGradient
        colors={color}
        style={[
          { flex: 1 },
          styleBackground
        ]}
      >
        {this.props.children}
      </LinearGradient>
    );
  }
}
