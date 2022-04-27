import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import xml2js from 'react-native-xml2js'

import Icon from '../common/Icon';
import {
  AppStyles,
  Metrics,
  Images,
  Fonts,
  Colors
} from '../../themes';
import { JSON_FORMAT, PRODUCT_URL, IMAGE_WS_KEY, THUMB_IMAGE_URL, HEADER_ENCODED, GET_CART_URL, END_OF_BODY_XML, PRE_OF_BODY_XML, POST_CART_URL, GET_COMBINATIONS_URL, GET_PRODUCT_OPTION_VALUES_URL, GET_STOCK_AVAILABLES_URL } from '../../constants/constants';
import {ChangeCurrency} from '../../constants/helper'

const HEIGHT_IMAGE = 200;

var storage = require("react-native-local-storage");
class OrderDetailItem extends PureComponent {

  state = {
    productPrice: "",
    loading: false,
    product: JSON, 
    productThumbUrl: "",
    productName: "",
    color: "",
    size: "",
    currency: "BHD",
    oldCurrency: "BHD",
    currencies: null,
  }

  componentDidMount(){
    storage.get('new_currency').then((currency) => {
      this.setState({currency: currency});
    });

    storage.get('old_currency').then((oldCurrency) => {
      this.setState({oldCurrency: oldCurrency});
    });

    storage.get('currencies').then((currencies) => {
      this.setState({currencies: currencies});
    });

    console.log("product == ");
    console.log(this.props.product);
    this._getProductWithId(this.props.product.product_id);
    this.getSizeAndColor(this.props.product);

  }

  _formatOfPrice(price) {
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }
  _getProductWithId = (productId) =>{
    const url = PRODUCT_URL + productId + JSON_FORMAT;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
    .then(res => res.json())
    .then(resJson => { 
      const url = THUMB_IMAGE_URL + productId + "/" + resJson.product.id_default_image + IMAGE_WS_KEY;
      this.setState({productThumbUrl: url, product: resJson.product, productName: resJson.product.name[0].value});
    })
  }

   // ------------------------ get size and color ----------------------------------------------//
   getSizeAndColor(product){

    this.setState({loading: true});
    url = GET_COMBINATIONS_URL + product.product_attribute_id + JSON_FORMAT;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED,
      },
    })
    .then(res => res.json())
    .then(resJson => {
       optionValue = resJson.combination.associations.product_option_values;
        for(var i=0;i<optionValue.length;i++){
          url = GET_PRODUCT_OPTION_VALUES_URL + optionValue[i].id + JSON_FORMAT;
            fetch(url, {
              method: "GET",
              headers: {
                'Authorization': 'Basic ' + HEADER_ENCODED
              },
            })
            .then(res => res.json())
            .then(resJson => {
              if(resJson.product_option_value.color == "") {
                this.setState({ size: resJson.product_option_value.name[0].value});
              } else {
                this.setState({color: resJson.product_option_value.name[0].value});
              }
              this.setState({loading: false});
            }).catch(error => {
              console.log(error);
            })
        }
    }).catch(error => {
      console.log(error);
    })
  }

  // ------------------------------------------------------------------------------------------//

  render() {
    const { product, productThumbUrl, productName  } = this.state;

    return (
      <View
        style={[
          AppStyles.row,
          styles.container,
          {
            height: HEIGHT_IMAGE,
          }
        ]}
      >
        <ActivityIndicator style={{opacity: this.state.loading ? 1.0 : 0.0,  alignItems: 'center',   left: 0,right: 0, top: 0, bottom: 0,
            justifyContent: 'center', position: 'absolute'}} animating={true} size="large"/>
        <TouchableOpacity
          style={[
            AppStyles.imageView,
            AppStyles.blockRadius,
            {
              width: HEIGHT_IMAGE - 60,
              height: HEIGHT_IMAGE - 10,
            }
          ]}
          // onPress={() => { this.props.navigation.navigate("ProductDetail", { product: product }) }}
        >
          <Image
            resizeMode={"cover"}
            style={{
              width: HEIGHT_IMAGE - 60,
              height: HEIGHT_IMAGE - 10,
            }}
            source={{ uri: productThumbUrl}}
          />
        </TouchableOpacity>
        <View style={[
          styles.sectionDescription
        ]} >
          <Text style={styles.productName}>
            {productName}
          </Text>
          <Text style={styles.productPrice}>
          {this.state.currency}{ChangeCurrency(this.props.product.unit_price_tax_excl, this.state.oldCurrency, this.state.currency, this.state.currencies)}
          </Text>
          <Text style={styles.productPrice}>
            Size: {this.state.size}
          </Text>
          <Text style={styles.productPrice}>
            Color: {this.state.color}
          </Text>
        </View>
      </View>
    );
  }
}

export default withNavigation(OrderDetailItem);

const styles = StyleSheet.create({
  container: {
    padding: Metrics.smallMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingBottom: Metrics.baseMargin,
    backgroundColor: Colors.white
  },
  sectionDescription: {
    flex: 3,
    padding: (Platform.OS === 'ios') ? Metrics.smallMargin : Metrics.baseMargin 
  },
  productName: {
    ...Fonts.style.medium,
    fontFamily: Fonts.type.Book,
    color: Colors.dark,
  },
  productPrice: {
    ...Fonts.style.small,
    fontFamily: Fonts.type.Bold,
    color: Colors.black,
    marginTop: Metrics.baseMargin
  },
  actionButton: {
    width: 30,
    backgroundColor: Colors.gray,
    borderColor: Colors.light_gray,
    borderWidth: 1,
    borderRadius: 10
  },
  count: {
    ...Fonts.style.bold,
    color: Colors.black
  },
});