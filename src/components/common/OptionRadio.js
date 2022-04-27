import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

import { AppStyles, Metrics, Images, Fonts, Colors } from '../../themes';

export default class OptionRadio extends PureComponent {

  static propTypes = {
    width: PropTypes.number,
    image: PropTypes.any,
    text: PropTypes.string,
    onPress: PropTypes.func,
    selected: PropTypes.bool,
    setyleRadio: PropTypes.any,
    sub: PropTypes.bool,
    color: PropTypes.string
  };

  static defaultProps = {
    image: require("../../resources/icons/circle.png"),
    width: 20,
    text: "",
    selected: false,
    setyleRadio: {},
    sub: false,
    color: Colors.appColor
  };

  render() {

    const {
      image,
      onPress,
      width,
      text,
      selected,
      setyleRadio,
      sub,
      color
    } = this.props;

    return (
      <TouchableOpacity
        style={[
          styles.container,
          AppStyles.center,
          AppStyles.row,
          setyleRadio
        ]}
        onPress={onPress}
      >
        {
          sub 
        }
        <View style={[
          AppStyles.center,
          {
            backgroundColor: selected ? color: Colors.transparent,
            width: width,
            height: width,
            borderRadius: width / 2,
            borderColor: color,
            borderWidth: 1,
          }
        ]}>
          <Image
            resizeMode={'contain'}
            style={[
              {
                tintColor: selected ? Colors.white : Colors.white,
                width: width - Metrics.baseMargin,
                height: width - Metrics.baseMargin,
              }
            ]}
            source={image}
          />
        </View>
        <View style={{ flex: 3 }}>
          <Text style={[
            Fonts.style.normal,
            {
              margin: Metrics.smallMargin,
              color: Colors.black,
            }
          ]}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    height: 35,
    borderBottomColor: Colors.lightBg_gray,
    borderBottomWidth: 1,
    justifyContent: 'center',
    margin: Metrics.smallMargin / 2,
    marginHorizontal: Metrics.baseMargin
  },
})
