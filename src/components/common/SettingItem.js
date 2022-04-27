import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { AppStyles, Metrics, Images, Fonts, Colors } from '../../themes';

const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

var storage = require("react-native-local-storage");
export default class SettingItem extends PureComponent {

  static propTypes = {
    icon: PropTypes.any,
    text: PropTypes.string,
    onPress: PropTypes.any
  };

  static defaultProps = {
    icon: '',
    text: '',
    onPress: () => { }
  };

  state = {
    lang: "",
    isRTL: false,
  }

  componentDidMount() {
    this.setState({loading:true});

    storage.get('lang').then((lang) => {
        if (lang != null) {
          this.setState({lang: lang});
          if(lang == 'ar'){
            this.setState({isRTL: true});
          }
        }
    });
  }

  render() {

    const { icon, text, onPress } = this.props;
    const {lang, isRTL} = this.state;

    let arrowIcon =  isRTL ? LEFT_ICON : RIGHT_ICON;

    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[
          AppStyles.row,
          AppStyles.spaceBetween,
          AppStyles.center,
          styles.container
        ]}
      >
        <View style={{ flex: 0.5 }}>
          <Image
            resizeMode={'contain'}
            style={styles.icon}
            source={this.props.icon}
          />
        </View>
        <View style={{
          flex: 5,
          justifyContent: 'flex-start'
        }}
        >
          <Text style={styles.text}>
            {this.props.text}
          </Text>
        </View>
        <View style={{ flex: 0.5 }}>
          <Image
            resizeMode={'contain'}
            style={styles.smallIcon}
            source={arrowIcon}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingVertical: Metrics.smallMargin,
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingHorizontal: Metrics.smallMargin,
    marginHorizontal: Metrics.smallMargin,
  },
  text: {
    ...Fonts.style.normal,
    color: Colors.black,
    marginLeft: Metrics.smallMargin
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: Colors.black
  },
  smallIcon: {
    width: 12,
    height: 12,
    tintColor: Colors.dark_gray
  }
}); 