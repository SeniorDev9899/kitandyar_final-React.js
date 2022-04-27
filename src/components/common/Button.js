import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Icon from '../common/Icon'
import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

export default class Button extends PureComponent {

  static propTypes = {
    styleButton: PropTypes.any,
    styleText: PropTypes.any,
    text: PropTypes.string.isRequired,
    widthIcon: PropTypes.number,
    iconRight: PropTypes.any,
    iconLeft: PropTypes.any,
    colorIcon: PropTypes.any,
    alignText: PropTypes.any,
    onPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    styleButton: {},
    styleText: {},
    text: "",
    widthIcon: 20,
    iconLeft: require('../../resources/icons/empty.png'),
    iconRight: require('../../resources/icons/empty.png'),
    colorIcon: null,
    alignText: true,
    onPress: () => { },
  };

  render() {

    const {
      text,
      onPress,
      iconLeft,
      iconRight,
      colorIcon,
      widthIcon,
      styleText,
      alignText,
      styleButton
    } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPress}
        style={[
          styles.container,
          styleButton,
          { flexDirection: 'row' }
        ]}
      >
        <View style={[AppStyles.center, { flex: 1 }]}>
          <Icon
            width={widthIcon}
            tintColor={colorIcon}
            image={iconLeft}
          />
        </View>

        <View style={[{ flex: 2 }, alignText === true ? AppStyles.center : {
          justifyContent: 'center',
          alignItems: 'flex-start'
        }]}>
          <Text
            style={[
              Fonts.style.normal,
              Fonts.style.center,
              styleText
            ]}
          >
            {text}
          </Text>
        </View>
        <View style={[AppStyles.center, { flex: 1 }]}>
          <Icon
            width={widthIcon}
            tintColor={colorIcon}
            image={iconRight}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    height: Metrics.buttonHeight,
    justifyContent: 'center'
  },
});