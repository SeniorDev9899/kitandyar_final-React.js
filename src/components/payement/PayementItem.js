import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image
} from 'react-native';
import { withNavigation } from 'react-navigation';

import Icon from '../common/Icon';
import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

class PayementItem extends PureComponent {

  render() {
    const { payement } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            width: (Metrics.deviceWidth - Metrics.baseMargin * 2) / 2,
            height: (Metrics.deviceWidth - Metrics.baseMargin * 2) / 2,
          }
        ]}
        onPress={() => { this.props.navigation.navigate("Tab") }}
      >
        <View
          style={[
            AppStyles.imageView,
            AppStyles.blockRadius  
          ]}
        >
          <Image
            resizeMode={"contain"}
            style={{
              width: (Metrics.deviceWidth - Metrics.baseMargin * 5) / 2,
              height: (Metrics.deviceWidth - Metrics.baseMargin * 5) / 2,
            }}
            source={payement.image}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(PayementItem);

const styles = StyleSheet.create({
  container: {
    margin: Metrics.smallMargin
  },
});