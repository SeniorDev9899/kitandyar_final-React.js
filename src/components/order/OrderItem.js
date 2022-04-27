import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  ImageBackground,
  Text,
  FlatList
} from 'react-native';
import { withNavigation } from 'react-navigation';
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Colors, Fonts, Metrics } from '../../themes';
import RowText from "../common/RowText";
import Status from "./Status";
import {ChangeCurrency} from '../../constants/helper'

var storage = require("react-native-local-storage");
class OrderItem extends PureComponent {

  static propTypes = {
    item: PropTypes.object
  };

  static defaultProps = {
    item: null
  };

  state = {
    visible: false,
    currency: "BHD",
    oldCurrency: "BHD",
    currencies: null,
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

    storage.get('new_currency').then((currency) => {
      this.setState({currency: currency});
    });

    storage.get('old_currency').then((oldCurrency) => {
      this.setState({oldCurrency: oldCurrency});
    });

    storage.get('currencies').then((currencies) => {
      this.setState({currencies: currencies});
    });
  }

  changeVisible = () => {
    this.setState({ visible: !this.state.visible });
  }

  getDate(datetime){
    date = String(datetime).split(' ');
    return date[0];
  }

  _formatOfPrice(price) {
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }

  getTotalPrice() {
    totalPrice = 0;
    for (let product of this.props.item.associations.order_rows) {
      totalPrice += product.product_quantity * product.unit_price_tax_incl;
    }
    return ChangeCurrency(totalPrice, this.state.oldCurrency, this.state.currency, this.state.currencies);
  }

  render() {

    const { item } = this.props;
    const { visible, lang, isRTL } = this.state;

    return (
      <View
        style={[
          AppStyles.blockRadius,
          styles.container,
        ]}
      >
        <View style={[
          styles.containerHeader,
          AppStyles.row,
          AppStyles.spaceBetween,
          AppStyles.blockRadius,
          { borderColor: Colors.appColor }
        ]}>
          <Text style={styles.number}>#{item.reference}</Text>
          <Text style={styles.number}></Text>
        </View>
        <View style={styles.containerContent}>
          <RowText
            title={ i18n.t('order_item_component.order_date', { locale: lang } )}
            description={this.getDate(item.date_add)}
          />
          <Status
            title={i18n.t('order_item_component.status', { locale: lang } )}
            status={item.state_name}
          />
          <RowText
            title={i18n.t('order_item_component.payment_method', { locale: lang } )}
            description={item.payment}
          />
          <RowText
            title={ i18n.t('order_item_component.total', { locale: lang } )}
            description={this.getTotalPrice()}
          />
          {/* <View style={styles.containerShow}>
            <Text
              style={styles.showText}
              onPress={() => { this.changeVisible() }}
            >
              More detail
            </Text>
          </View> */}
          {
            visible &&
            <FlatList
              style={{ backgroundColor: Colors.transparent }}
              data={item.detail}
              keyExtractor={this._keyExtractor}
              renderItem={({ item }) => <RowText
                title={item.productName}
                quantity={item.quantity}
                description={item.price}
                height={Metrics.navBarHeight / 2}
              />
              }
              keyExtractor={(item, i) => i}
            />
          }
        </View>
      </View>
    );
  }
}

export default withNavigation(OrderItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Metrics.smallMargin,
    borderColor: Colors.appColor,
  },
  containerHeader: {
    height: 30,
    backgroundColor: Colors.appColor,
    alignItems: "center",
    paddingHorizontal: Metrics.baseMargin
  },
  containerContent: {
    flex: 1,
    paddingHorizontal: Metrics.baseMargin
  },
  containerShow: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 30
  },
  number: {
    ...Fonts.style.bold,
    color: Colors.white
  },
  showText: {
    ...Fonts.style.boldnormal,
    color: Colors.appColor
  }
});
