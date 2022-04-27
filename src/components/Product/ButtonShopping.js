import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import i18n from '../../helpers/I18n/I18n';

import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button'
import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import { withNavigation } from 'react-navigation';
import { CART_TEMP, PRE_OF_BODY_XML, END_OF_BODY_XML } from '../../constants/constants';

var storage = require("react-native-local-storage");
class ButtonShopping extends PureComponent {

  static propTypes = {
    quantity: PropTypes.number,
    total: PropTypes.any,
    addQuantity: PropTypes.func,
    subQuantity: PropTypes.func,
    putCart: PropTypes.func
  };

  static defaultProps = {
    quantity: 0,
    total: 0,
    addQuantity: () => { },
    subQuantity: () => { },
    putCart: () => { },
  };

  state = {
    currency: "$",
    lang: "",
    isRTL: false,
  }

  componentDidMount(){
    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });
  }

  _AddToCartOnPress(){
    this.props.putCart();
  }

  render() {

    const { quantity, total, addQuantity, subQuantity } = this.props;
    const { lang, isRTL } = this.state;

    return (
      <View
        style={[
          styles.container,
          AppStyles.row,
          {
            
          }
        ]}
      >
        {/* <View style={[
          AppStyles.row,
          styles.containerAddSub
        ]}>
          <View style={[AppStyles.center, { flex: 1 }]}>
            <Icon
              width={35}
              tintColor={Colors.black}
              image={require("../../resources/icons/subQuantity.png")}
              onPress={subQuantity}
            />
          </View>
          <View style={[AppStyles.center, { flex: 1 }]}>
            <Text style={styles.quantity}>
              {quantity}
            </Text>
          </View>
          <View style={[AppStyles.center, { flex: 1 }]}>
            <Icon
              width={35}
              tintColor={Colors.black}
              image={require("../../resources/icons/addQuantity.png")}
              onPress={addQuantity}
            />
          </View>
        </View> */}
        <View style={[AppStyles.row, { backgroundColor: Colors.black, flex:2 }]}>
          {/* <View style={[
            AppStyles.center,
            { flex: 1.5, backgroundColor: Colors.black }
          ]}>
            <Text style={styles.total}>
              {this.state.currency}{total}
          </Text>
          </View> */}
          {/* <View style={{
            width: 1,
            height: 20,
            backgroundColor: Colors.white,
            marginVertical: Metrics.baseMargin
          }} /> */}
          <View style={{ flex: 3, backgroundColor: Colors.black }}>
            <Button
              styleButton={styles.button}
              styleText={{ color: Colors.white, ...Fonts.style.normal }}
              text={i18n.t('button_shopping_component.add_to_cart', { locale: lang } )}
              onPress={() => { this._AddToCartOnPress() }}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default withNavigation(ButtonShopping);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    // height: Metrics.navBarHeight,
    justifyContent: 'center',
    borderTopColor: Colors.lightBg_gray,
    borderTopWidth: 1
  },
  containerAddSub: {
    marginHorizontal: Metrics.smallMargin,
    flex: 1
  },
  button: {
    backgroundColor: Colors.black 
  },
  quantity: {
    ...Fonts.style.normal,
    color: Colors.black,
  },
  total: {
    ...Fonts.style.normal,
    color: Colors.white,
  }
});
