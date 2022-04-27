import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import Layout from "./Layout";
import Icon from "../common/Icon";
import { Switch } from '../../data/Switch';

class SwitchLayout extends PureComponent {

  static propTypes = {
    updateLayout: PropTypes.func,
    list: PropTypes.any,
    layout: PropTypes.any
  };

  static defaultProps = {
    updateLayout: () => { },
    list: [],
    layout: 1
  };

  render() {

    const {
      updateLayout,
      list,
      layout
    } = this.props;

    return (
      <View style={[
        styles.container,  
        AppStyles.row
      ]}> 
        {
          Switch.map((layoutItem, i) => <Icon
            width={30}
            image={layoutItem.image}
            iconStyle={[
              styles.icon,
              layoutItem.layout === layout ? styles.enable : styles.disable
            ]}
            onPress={() => updateLayout(layoutItem.layout)}
            tintColor={layoutItem.layout === layout ? Colors.lightDis_gray : Colors.light_gray}
          />
          )
        }
      </View>
    );
  }
}

export default SwitchLayout;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  icon: {
    width: 35,
    height: 35,  
  },
  enable: {
    backgroundColor: Colors.white,
    marginRight: Metrics.smallMargin
  },
  disable: {
    marginRight: Metrics.smallMargin
  }
});