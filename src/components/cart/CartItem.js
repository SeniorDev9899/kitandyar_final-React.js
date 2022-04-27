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
import { JSON_FORMAT, PRODUCT_URL, IMAGE_WS_KEY, THUMB_IMAGE_URL, HEADER_ENCODED, GET_CART_URL, END_OF_BODY_XML, PRE_OF_BODY_XML, POST_CART_URL, GET_COMBINATIONS_URL, GET_PRODUCT_OPTION_VALUES_URL, GET_STOCK_AVAILABLES_URL, GET_SPECIFIC_PRICE_URL, FULL_JSON_FORMAT } from '../../constants/constants';
import { ChangeCurrency } from '../../constants/helper'

const HEIGHT_IMAGE = 200;

var storage = require("react-native-local-storage");
class CartItem extends PureComponent {

  state = {
    isAddQuantity: false,
    quantity: 1,
    loading: false,
    product: JSON,
    productThumbUrl: " ",
    productName: "",
    price: "",
    color: "",
    size: "",
    limitOfQuantity: 1,
    currency: "BHD",
    oldCurrency: "BHD",
    currencies: null,
  }

  componentDidMount() {
    storage.get('new_currency').then((currency) => {
      this.setState({ currency: currency });
    });

    storage.get('old_currency').then((oldCurrency) => {
      this.setState({ oldCurrency: oldCurrency });
    });

    storage.get('currencies').then((currencies) => {
      this.setState({ currencies: currencies });
    });

    this._getProductWithId(this.props.product.id_product);
    this.getQuantityWithCombinationId(this.props.product.id_product_attribute);
    this.getSizeAndColor(this.props.product);
    this.setState({ quantity: this.props.product.quantity });
  }

  addQuantity() {
    if ((parseInt(this.state.quantity)) < parseInt(this.state.limitOfQuantity)) {
      this.setState({ isAddQuantity: true });
      this.updateCart(this.props.product);
      this.setState(prevState => ({
        quantity: parseInt(prevState.quantity) + 1,
      }));
      cartPrice = 0;
      storage.get('cart_price').then((cartPrice) => {
        newCartPrice = cartPrice + parseFloat(this.state.product.real_price);
        if (newCartPrice < 0) {
          storage.save('cart_price', 0);
        } else {
          storage.save('cart_price', newCartPrice);
        }
        // this.props.updateCartFromCartItem(this.props.rowKey, this.state.quantity, this.props.context);
      });
    }
  }

  subQuantity() {
    if (parseInt(this.state.quantity) > 0) {
      this.setState({ isAddQuantity: false });
      this.updateCart(this.props.product),
        this.setState((prevState) => ({
          quantity: (parseInt(prevState.quantity) - 1),
        }));
      var storage = require("react-native-local-storage");
      cartPrice = 0;
      storage.get('cart_price').then((cartPrice) => {
        newCartPrice = cartPrice - parseFloat(this.state.product.real_price);
        if (newCartPrice < 0) {
          storage.save('cart_price', 0);
        } else {
          storage.save('cart_price', newCartPrice);
        }

        // this.props.updateCartFromCartItem();
        // this.props.updateCartFromCartItem(this.props.rowKey, this.state.quantity, this.props.context);
      });
    }
  }

  _formatOfPrice(price) {
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }

  _getProductWithId = (productId) => {
    const url = PRODUCT_URL + productId + JSON_FORMAT;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
      .then(res => res.json())
      .then(resJson => {
        url_ = GET_SPECIFIC_PRICE_URL + FULL_JSON_FORMAT;
        fetch(url_, {
          method: "GET",
          headers: {
            'Authorization': 'Basic ' + HEADER_ENCODED
          },
        })
          .then(res => res.json())
          .then(resJson1 => {
            specificPrices = resJson1.specific_prices
            product = resJson.product;
            product.promo = false;
            for (var k = 0; k < specificPrices.length; k++) {
              if (product.id == specificPrices[k].id_product) {
                product.specific_price = specificPrices[k];
                product.reduction_price = (1 - specificPrices[k].reduction) * product.price;
                product.reduction = specificPrices[k].reduction;
                product.promo = true;
                product.real_price = product.reduction_price;
                break;
              }
            }
            if (!product.promo) {
              product.real_price = product.price;
            }
            const url = THUMB_IMAGE_URL + product.id + "/" + product.id_default_image + IMAGE_WS_KEY;
            this.setState({ productThumbUrl: url, product: product, price: product.real_price, productName: product.name[0].value });

          }).catch(error => {
            console.log(error);
          })
      })
  }

  // -------------------  update cart whenever increasing quantity ------------//
  updateCart(product) {
    var storage = require("react-native-local-storage");
    storage.get('cart_id').then((cartId) => {
      url = GET_CART_URL + cartId + JSON_FORMAT;
      if (this.state.quantity == 0) {
        this.setState({ loading: true });
      }
      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        },
      })
        .then(res => res.json())
        .then(resJson => {
          this.getCartBody(resJson, product);
        }).catch(error => {
          console.log(error);
          this.setState({ loading: false });
        })
    });
  }

  getCartBody(temp, product) {
    tempCartRow = [];

    for (let i = 0; i < temp.cart.associations.cart_rows.length; i++) {
      tempCartRow[i] = {};
      tempCartRow[i] = temp.cart.associations.cart_rows[i];
    };
    delete temp.cart.associations.cart_rows;

    temp.cart.associations.cart_rows = {};
    temp.cart.associations.cart_rows.cart_row = [];

    for (let i = 0; i < tempCartRow.length; i++) {
      if (tempCartRow[i].id_product == product.id_product) {
        if (this.state.quantity == 0) {
          if (temp.cart.associations.cart_rows.length == 1) {
            delete temp.cart.associations.cart_rows;
            temp.cart.associations.cart_rows = "";
            break;
          } else {
            continue;
          }
        } else {
          tempCartRow[i].quantity = this.state.quantity;
        }
      }
      temp.cart.associations.cart_rows.cart_row.push(tempCartRow[i]);
    };

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(temp);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
    this.putCartRequest(bodyXML);

    console.log(bodyXML);
  }

  putCartRequest(body) {
    url = POST_CART_URL;
    fetch(url, {
      method: "PUT",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
      body: body,
    })
      .then(res => res.json())
      .then(resJson => {
        var storage = require("react-native-local-storage");
        storage.save('cart', resJson);
        this.props.updateCartFromCartItem(this.props.rowKey, this.state.quantity, this.props.context);
        if (this.state.quantity == 0) {
          this.setState({ loading: false });
          this.props.deleteRowFromCartItem(this.props.rowMap, this.props.rowKey, this.props.context);
        }
      }).catch(error => {
        console.log(error);
        this.setState({ loading: false });
      })
  }
  // ------------------------------------------------------------------------------------------//

  // ------------------------ get size and color ----------------------------------------------//
  getSizeAndColor(product) {
    if (product.id_product_attribute != 0) {
      this.setState({ loading: true });
      url = GET_COMBINATIONS_URL + product.id_product_attribute + JSON_FORMAT;
      console.log("ddd", url);
      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED,
        },
      })
        .then(res => res.json())
        .then(resJson => {
          optionValue = resJson.combination.associations.product_option_values;
          console.log("optionvalue", optionValue);
          for (var i = 0; i < optionValue.length; i++) {
            url = GET_PRODUCT_OPTION_VALUES_URL + optionValue[i].id + JSON_FORMAT;
            console.log(url);
            fetch(url, {
              method: "GET",
              headers: {
                'Authorization': 'Basic ' + HEADER_ENCODED
              },
            })
              .then(res => res.json())
              .then(resJson => {
                if (resJson.product_option_value.color == "") {
                  this.setState({ size: resJson.product_option_value.name[0].value });
                } else {
                  this.setState({ color: resJson.product_option_value.name[0].value });
                }
                this.setState({ loading: false });
              }).catch(error => {
                console.log(error);
              })
          }
        }).catch(error => {
          this.setState({ loading: false });
          console.log(error);
        })
    }
  }
  // ------------------------------------------------------------------------------------------//

  // ------------------ get stocks - quantity --------------------------------------------------//
  getQuantityWithCombinationId(combinationId) {
    url = GET_STOCK_AVAILABLES_URL + "&filter[id_product_attribute]=[" + combinationId + "]" + JSON_FORMAT;
    console.log("combination", url);
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
    })
      .then(res => res.json())
      .then(resJson => {
        this.setState({ limitOfQuantity: resJson.stock_availables[0].quantity });
      }).catch(error => {
        console.log(error);
      })
  }

  // ------------------------------------------------------------------------------------------//

  onPressDelete(){
    this.props.deleteRow(this.props.rowMap, this.props.rowKey, this.props.context);
  }

  render() {
    const { quantity, productThumbUrl, productName } = this.state;
    const { RowKey, rowMap } = this.props;

    console.log("item's quantity", quantity);
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
        <ActivityIndicator style={{
          opacity: this.state.loading ? 1.0 : 0.0, alignItems: 'center', left: 0, right: 0, top: 0, bottom: 0,
          justifyContent: 'center', position: 'absolute'
        }} animating={true} size="large" />
        <TouchableOpacity
          style={[
            AppStyles.imageView,
            AppStyles.blockRadius,
            {
              width: HEIGHT_IMAGE - 60,
              height: HEIGHT_IMAGE - 10,
            }
          ]}
          onPress={() => { this.props.navigation.navigate("ProductDetail", { product: this.state.product }) }}
        >
          <Image
            resizeMode={"cover"}
            style={{
              width: HEIGHT_IMAGE - 60,
              height: HEIGHT_IMAGE - 10,
            }}
            // source={{ uri: "https://kitandyar.com/1122-medium_default/shirt-sss-w.jpg" }}
            source={{ uri: productThumbUrl }}
          />
        </TouchableOpacity>
        <View style={[
          styles.sectionDescription
        ]} >
          <Text style={styles.productName}>
            {productName}
          </Text>
          <Text style={styles.productPrice}>
            {this.state.currency}{ChangeCurrency(this.state.price, this.state.oldCurrency, this.state.currency, this.state.currencies)}
          </Text>
          <Text style={styles.productPrice}>
            Size: {this.state.size}
          </Text>
          <Text style={styles.productPrice}>
            Color: {this.state.color}
          </Text>
        </View>
        <View style={[AppStyles.right,{padding:10}]}>
        <Icon
            tintColor={Colors.white}
            image={require("../../resources/icons/cancel.png")}
            onPress={() => this.onPressDelete()}
            backgroundColor={Colors.red}
            borderRadius={true}
          />
        </View>
        <View style={[
          AppStyles.spaceBetween,
          styles.actionButton,
          { alignItems: "center" }
        ]}>
          <Icon
            width={40}
            tintColor={Colors.light_gray}
            image={require("../../resources/icons/top.png")}
            onPress={() => this.addQuantity()}
          />
          <Text style={styles.count}>
            {quantity}
          </Text>
          <Icon
            width={40}
            tintColor={Colors.light_gray}
            image={require("../../resources/icons/bottom.png")}
            onPress={() => this.subQuantity()}
          />
        </View>
        
      </View>
    );
  }
}

export default withNavigation(CartItem);

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