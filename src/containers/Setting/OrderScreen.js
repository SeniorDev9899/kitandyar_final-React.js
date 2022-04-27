import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList
} from 'react-native';

import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import Button from "../../components/common/Button";
import OrderItem from "../../components/order/OrderItem";

import { Orders } from '../../data/Orders';
import { GET_ORDER_URL, GET_ORDER_STATES_URL, HEADER_ENCODED } from "../../constants/constants"
import Spinner from 'react-native-loading-spinner-overlay';

var storage = require("react-native-local-storage");
export default class OrderScreen extends PureComponent {

  state = {
    _orders:"",
    orders: "",
    orderStates: "",
    loading: false,
    lang: "",
    isRTL: false,
  }

  componentDidMount() {
    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });

    this.makeRequest();
  }

  makeRequest = () => {
    var storage = require("react-native-local-storage");
    storage.get('customer_id').then((customerId) => {
      if(customerId != null){
        this.setState({loading:true});
        url = GET_ORDER_URL + "?display=full&output_format=JSON&filter[id_customer]=" + customerId + "&sort=[id_DESC]";
        fetch(url, {
          method: "GET",
          headers: {
            'Authorization': 'Basic ' + HEADER_ENCODED
          }
        })
          .then(res => res.json())
          .then(resJson => {
            this.setState({
              orders: resJson.orders,
              error: resJson.error || null,
            })
    
            url = GET_ORDER_STATES_URL;
            fetch(url, {
              method: "GET",
              headers: {
                'Authorization': 'Basic ' + HEADER_ENCODED
              }
            })
              .then(res => res.json())
              .then(resJson => {
                this.setState({
                  orderStates: resJson.order_states,
                  error: resJson.error || null,
                })
    
                // Set current order state string to order data
                _orders = this.state.orders;
                for (let order of _orders) {
                  for (let state of this.state.orderStates) {
                    if(order.current_state == state.id) {
                      order.state_name = state.name[0].value;
                      break;
                    }
                  }
                }
                this.setState({_orders : _orders});
                this.setState({loading:false})
              })
              .catch(error => {
                this.setState({ error, loading: false });
                console.log(error);
              })
          })
          .catch(error => {
            this.setState({ error, loading: false });
            console.log(error);
          })
      }
      
    });
   
  }

  render() {

    const {lang, isRTL} = this.state;

    return (
      <View style={[
        AppStyles.mainContainer,
        { margintop: (Platform.OS === 'ios') ? 60 : 0 }
      ]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          title={i18n.t('order_screen.my_order', { locale: lang }) }
          back={true}
        />
        <View style={styles.container}>
          <FlatList
            style={{ marginTop: Metrics.baseMargin, backgroundColor: Colors.transparent }}
            data={this.state._orders}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) => <OrderItem
              item={item}
            />
            }
            keyExtractor={(item, i) => i}
          />
        </View>
        <Spinner visible={this.state.loading} textContent={i18n.t('global.connecting', { locale: lang }) } textStyle={{ color: '#FFF' }} />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:15
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black
  },
});
