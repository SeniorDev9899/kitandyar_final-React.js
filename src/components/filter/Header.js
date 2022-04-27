import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  Text
} from 'react-native';

import Icon from '../common/Icon';
import {
  AppStyles,
  Colors,
  Fonts,
  Metrics
} from '../../themes';

export default class Header extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func
  };

  static defaultProps = {
    title: "",
  };

  render() {

    const {
      title,
      onClose
    } = this.props;

    return (
      <View style={[
        AppStyles.row,
        AppStyles.spaceBetween,
        styles.container,
        { alignItems: "center" }
      ]}>

        <Text
          style={[
            Fonts.style.medium,
            Fonts.style.center,
            {
              color: Colors.black,
              fontWeight: "bold"
            }
          ]}
          onPress={() => { }}
        >
          Reset
        </Text>
        <Text
          style={[
            Fonts.style.medium,
            Fonts.style.center,
            {
              color: Colors.black,
              fontWeight: "bold"
            }
          ]}
        >
          {title}
        </Text>
        <Icon
          width={35}
          image={require('../../resources/icons/cancel.png')}
          tintColor={Colors.black}
          onPress={() => onClose()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 25,
    paddingHorizontal: Metrics.baseMargin
  }
});
