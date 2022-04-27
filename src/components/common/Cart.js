import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import i18n from '../../helpers/I18n/I18n';

import Icon from './Icon';
import {
  AppStyles,
  Colors,
  Fonts,
  Metrics,
  Images
} from '../../themes';

  var storage = require("react-native-local-storage");
 class Cart extends React.Component {

  static propTypes = {
    currency: PropTypes.string,
    numbre: PropTypes.number,
    total: PropTypes.string,
    color: PropTypes.string,
    onPress: PropTypes.func.isRequired
  };

  static defaultProps = {
    currency: "",
    numbre: 0,
    total: "0.00",
    color: Colors.white,
    onPress: () => { }
  };

  state = {
    lang: "",
    isRTL: false,
  }

  componentDidMount() {

    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
          this.setState({})
        }
      }
    });
  }

  render() {

    const { onPress, numbre, total, color } = this.props;
    const { lang, isRTL } = this.state;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          AppStyles.row,
          { alignItems: "center" }
        ]}
      >
      
        <View style={[
          styles.container,
          AppStyles.center,
        ]}>
          <Image
            resizeMode={'contain'}
            source={require('../../resources/icons/bag.png')}
            style={{
              width: 22,
              height: 22,
              tintColor: color,
            }}
          />
          <View style={styles.badge}>
            <Text style={styles.numbre}>
              {parseFloat(numbre)}
            </Text>
          </View>
          <Text style={styles.title}>
            {i18n.t('cart_component.total', { locale: lang })}
          </Text>
          <Text style={styles.total}>
            {this.props.currency}{total}
          </Text>
        </View>
        <View style={{backgroundColor: "#FFBAD2"}}>
          
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(Cart);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: Metrics.smallMargin,
    backgroundColor: "#FFBAD2",
  },
  badge: {
    right: 0,
    top: 0,
    position: 'absolute',
    height: 15,
    width: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000'
  },
  numbre: {
     fontSize: 10,
    color: Colors.white,

  },
  title: {
    ...Fonts.style.small,
    color: Colors.white,
    fontSize:10
  },
  total: {
    ...Fonts.style.small,
    // color: '#FFBAD2',
    color: '#FFFFFF',
    fontSize:8
  },
});                               