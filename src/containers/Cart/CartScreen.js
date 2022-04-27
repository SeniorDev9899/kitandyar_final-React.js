import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ListView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { SwipeListView } from 'react-native-swipe-list-view';
import xml2js from 'react-native-xml2js'
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import Button from "../../components/common/Button";
import CartItem from "../../components/cart/CartItem";
import Icon from "../../components/common/Icon";
import RowText from "../../components/common/RowText";

import Config from '../../config';
import { GET_CART_URL, JSON_FORMAT, HEADER_ENCODED, POST_CART_URL, PRE_OF_BODY_XML, END_OF_BODY_XML, PRODUCT_URL, GET_SPECIFIC_PRICE_URL, FULL_JSON_FORMAT, GET_TAXRULE_URL, GET_TAX_URL, GET_COMBINATIONS_URL, GET_WEIGHT_RAGNES_URL, GET_ZONES_URL, GET_DELIVERIES_URL, GET_CATRULE_URL } from '../../constants/constants';
import { ChangeCurrency } from '../../constants/helper';
import {LABELS, LABELS_AR} from '../../constants/constants';

var storage = require("react-native-local-storage");
const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

export default class CartScreen extends PureComponent {

  constructor(props) {
    super(props);

    this.props.navigation.addListener(
      'willFocus',
      () => {
        this.forceUpdate(null);
        console.log("will focus..");
        storage.get('cart_rule').then((cart_rule) => {
          if (cart_rule != null) {
            this.setState({ cart_rule: cart_rule });
            this.setState({ showPromo: true });
          }
        });

        storage.get('country_id').then((country_id) => {
          if (country_id != null) {
            this.getTaxRuleWithCountryId(country_id)
          }
          this.getCartQuantity();
        });

      }
    )

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      currentPosition: 0,
      listProducts: [],
      tempListProducts: [],
      cartPrice: 0,
      listRef: null,
      modalVisible: false,
      hashTable: [],
      isFirstDeleteItem: true,
      cartQuantity: 0,
      currency: "BHD",
      oldCurrency: "BHD",
      currencies: null,
      isShowDetail: false,
      isShowItem: false,
      isPromoDetail: false,
      haspromocode: false,
      existError: false,
      expiredError: false,
      showPromo: false,
      cart_rule: {},
      promo:0,
      addPromoText: "",
      showProductInCart: [],
      weightArray: [],
      subTotal: 0,
      taxRate: 0,
      weightRangeId: null,
      shipping: 0,
      lang: "",
      isRTL: false,
    };
  }

  componentWillMount() {
    storage.get('cart_price').then((cart_price) => {
      this.setState({cartPrice: cart_price});
    });
    storage.getSet(['lang','new_currency', 'old_currency', 'currencies', 'cart', 'cart_price', 'cart_rule', 'country_id'], 
    this.storageSet.bind(this)).then(()=>{
      this.setState({lang: this.state.lang, currency: this.state.currency, oldCurrency: this.state.oldCurrency, currencies: this.state.currencies});

      if (this.state.lang == 'ar') {
        this.setState({isRTL: true});
      }

      list = this.state.cart.cart.associations.cart_rows;
      var listProducts = list.map(function (item, i) {
        return {
          key: i.toString(),
          data: item
        };
      });
      this.setState({ listProducts: listProducts, tempListProducts: listProducts });
      if (this.state.cartPrice < 0) {
        this.setState({ cartPrice: 0 });
      } else {
        this.setState({ cartPrice: this.state.cartPrice });
      }

      if (this.state.cart_rule != null) {
        this.setState({ cart_rule: this.state.cart_rule, promo: this.state.cart_rule.reduction_percent, showPromo: true });
      }

      if (this.state.country_id != null) {
        this.getTaxRuleWithCountryId(this.state.country_id);
      }
      this.getCartQuantity();

    });
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~", this.state.cart_price);
  }

  storageSet(key, val){
    this.setState({[key]: val});
  };

  // ------------------------- tax calculation --------------------------------//
  getTaxRuleWithCountryId(countryId) {
    console.log("getTaxRuleWithCountryId = ", countryId);
    url = GET_TAXRULE_URL + "?display=full&output_format=JSON&filter[id_country]=" + countryId;

    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
      .then(res => res.json())
      .then(resJson => {
        this.setState({
          error: resJson.error || null,
        })
        console.log("tax rules = ", resJson);
        tax_rule = "";
        if (resJson.hasOwnProperty("tax_rules")) {
          tax_rules = resJson.tax_rules;
          tax_rule = tax_rules[0];
          console.log("tax rule = ", tax_rule);
          this.getTaxWithTaxId(tax_rule.id_tax);
        } else {
          this.setState({ taxRate: 0 });
        }

      }).catch(error => {
        console.log(error);
      })
  }

  getTaxWithTaxId(taxId) {
    url = GET_TAX_URL + "?display=full&output_format=JSON&filter[id]=" + taxId;

    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
      .then(res => res.json())
      .then(resJson => {
        this.setState({
          error: resJson.error || null,
        })

        taxes = resJson.taxes;
        tax = "";
        if (taxes != []) {
          tax = taxes[0];
          this.setState({ taxRate: tax.rate });
          console.log("tax rate = ", tax.rate);
        } else {
          this.setState({ taxRate: 0 });
        }

      }).catch(error => {
        console.log(error);
      })
  }

  getCartQuantity() {
    combinationIDs = ""
    this.setState({ showProductInCart: [] });
    storage.get('cart').then((cart) => {
      cartQuantity = 0;
      console.log("updated cart = ", cart);
      if (cart.cart.hasOwnProperty('associations') == 0) {
        console.log("has own property");
        this.setState({ cartQuantity: 0, tax: 0, shipping: 0, subTotal: 0 });
      } else if (cart.cart.associations.cart_rows.length == 0) {
        console.log(" row length = 0");
        this.setState({ cartQuantity: 0, tax: 0, shipping: 0, subTotal: 0 });
      } else {
        for (var i = 0; i < cart.cart.associations.cart_rows.length; i++) {
          cartQuantity = cartQuantity + parseInt(cart.cart.associations.cart_rows[i].quantity);
          this._getProductWithId(cart.cart.associations.cart_rows[i].id_product, i, cart.cart.associations.cart_rows[i].quantity);
          if (combinationIDs == "") combinationIDs = "[" + cart.cart.associations.cart_rows[i].id_product_attribute;
          else combinationIDs = combinationIDs + "|" + cart.cart.associations.cart_rows[i].id_product_attribute;
        }
        this.setState({ cartQuantity: cartQuantity });
        combinationIDs = combinationIDs + "]";
        this.getWeightWithCombinationIDs(combinationIDs, cart);
      }
      console.log("show_cart combinationIDs = ", combinationIDs);
    });
  }

  // ----------------------------------  shipping calculation --------------------------------------//
  getWeightWithCombinationIDs(combinationIDs, cart) {
    url = GET_COMBINATIONS_URL + "?display=full&output_format=JSON&filter[id]=" + combinationIDs;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
      .then(res => res.json())
      .then(resJson => {
        this.getWeights(resJson.combinations, cart);
      }).catch(error => {
        console.log(error);
      })
  }

  getWeights(combinations, cart) {
    weights = 0;
    for (var i = 0; i < combinations.length; i++) {
      for (var j = 0; j < cart.cart.associations.cart_rows.length; j++) {
        if (combinations[i].id == cart.cart.associations.cart_rows[j].id_product_attribute) {
          itemWeight = parseFloat(combinations[i].weight) * cart.cart.associations.cart_rows[j].quantity;
          weights = weights + itemWeight;
        }
      }
    }
    console.log("weights = ", weights);

    this.getWeightRangesWithWeights(weights);
  }

  getWeightRangesWithWeights(weights) {
    url = GET_WEIGHT_RAGNES_URL + "?display=full&output_format=JSON&filter[id_carrier]=215";
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
      .then(res => res.json())
      .then(resJson => {
        this.getWeightRangeId(resJson.weight_ranges, weights)
      }).catch(error => {
        console.log(error);
      })
  }

  getWeightRangeId(weightRanges, weights) {
    weightRangeId = null;
    for (var i = 0; i < weightRanges.length; i++) {
      if (weights < parseFloat(weightRanges[i].delimiter2)) {
        weightRangeId = weightRanges[i].id;
        break;
      }
    }
    this.setState({ weightRangeId: weightRangeId });
    console.log("weight range id = ", weightRangeId);
    this.getZoneIdWith(weightRangeId);
  }

  getZoneIdWith(weightRangeId) {
    storage.get('countries').then((countries) => {
      storage.get('country_id').then((countryId) => {
        if (countryId != null) {
          for (var i = 0; i < countries.length; i++) {
            if (countries[i].id == countryId) {
              this.getShippingPriceWithZoneId(countries[i].id_zone, weightRangeId);
              break;
            }
          }
        }
      });
    });
  }

  getShippingPriceWithZoneId(zoneId, weightRangeId) {
    url = GET_DELIVERIES_URL + "?display=full&output_format=JSON&filter[id_carrier]=215&filter[id_range_weight]=" + weightRangeId + "&filter[id_zone]=" + zoneId;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
      .then(res => res.json())
      .then(resJson => {
        console.log("shipping = ", resJson.deliveries[0].price);
        this.setState({ shipping: parseFloat(resJson.deliveries[0].price) })
      }).catch(error => {
        console.log(error);
      })
  }
  // -------------------------------------------------------------------------------//

  _getProductWithId = (productId, index, quantity) => {
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
            product.quantity2 = quantity;
            _showProductInCart = this.state.showProductInCart;
            _showProductInCart[index] = product;
            this.setState({ showProductInCart: _showProductInCart });
            _subTotal = 0;
            for (let i = 0; i < _showProductInCart.length; i++) {
              _subTotal = _subTotal + _showProductInCart[i].quantity2 * _showProductInCart[i].real_price
            }
            this.setState({ subTotal: _subTotal });

          }).catch(error => {
            console.log(error);
          })
      })
  }

  deleteRowFromCartItem = (rowMap, rowKey, context) => {
    context.closeRow(rowMap, rowKey);
    const newData = [...context.state.listProducts];
    const prevIndex = context.state.listProducts.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    context.setState({ listProducts: newData });
    context.getCartQuantity();
  }

  updateCartFromCartItem = (index, quantity, context) => {
    this.getCartQuantity();
    storage.get('cart_price').then((cart_price) => {
      cartPrice = cart_price;
      if (cartPrice < 0) {
        this.setState({ cartPrice: 0 });
      } else {
        this.setState({ cartPrice: cartPrice });
      }

    });
    this.state.listProducts[index].data.quantity = quantity;
    _listproducts = this.state.listProducts;
    console.log("_listpro", _listproducts);
    this.setState({ listProducts: _listproducts });
    console.log("quantity", index, this.state.listProducts[index].data.quantity);

  }

  closeRow(rowMap, rowKey) {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
      // console.log(rowMap);
    }
  }

  deleteRow(rowMap, rowKey, context) {

    const newData = [...context.state.listProducts];
    const prevIndex = context.state.listProducts.findIndex(item => item.key === rowKey);
    console.log("product = ", context.state.listProducts[prevIndex].data);
    context.deleteProductInCart(context.state.listProducts[prevIndex].data, rowMap, rowKey);
    console.log("del_pro", context.state.listProducts[prevIndex].data);
    context.getCartPriceWithDeletedProduct(context.state.listProducts[prevIndex].data)

    newData.splice(prevIndex, 1);
    context.setState({ listProducts: newData });

  }

  onPressNextButton() {
    if (this.state.listProducts.length == 0) {
      return;
    }
    storage.get('customer_id').then((customerId) => {
      storage.get('guest').then((guest) => {
        if (customerId === null && guest === null) {
          this.setState({ modalVisible: true });
          // this.props.navigation.navigate("Delivery");
        } else {
          this.props.navigation.navigate("Delivery");
        }
      })
    });

  }

  onPressPromoButton() {
    url = GET_CATRULE_URL + FULL_JSON_FORMAT;
    this.setState({ existError: false, expiredError: false })
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
      .then(res => res.json())
      .then(resJson => {
        console.log("promo list = ", resJson);
        if (resJson.hasOwnProperty('cart_rules')) {
          cartRules = resJson.cart_rules;
          var haspromocode = false;
          for (i = 0; i < cartRules.length; i++) {
            if (cartRules[i].code == this.state.addPromoText) {
              haspromocode = true;
              date_to = new Date(cartRules[i].date_to);
              now = new Date();
              console.log("now",now);
              console.log("date_to", date_to)
              if (now < date_to) {
                storage.save("cart_rule", cartRules[i]);
                this.setState({ cart_rule: cartRules[i] });
                this.setState({promo: cartRules[i].reduction_percent});
                this.setState({ showPromo: true });
                this.setState({ isPromoDetail: false })
              }
              else {
                this.setState({ expiredError: true })
              }

            }
          }
          if (haspromocode == false) {
            this.setState({ existError: true })
          }
        }
      }).catch(error => {
        console.log(error);
      })
  }

  onPressGuestButton() {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate("GuestSignUp");
  }

  onPressOkButton() {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate("SignIn", { fromPage: 'cartPage' });
  }

  _formatOfPrice(price) {
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }

  getCartPriceWithDeletedProduct(product) {
    const url = PRODUCT_URL + product.id_product + JSON_FORMAT;
    console.log("sel_product", product.quantity);
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
            _product = resJson.product;
            _product.promo = false;
            for (var k = 0; k < specificPrices.length; k++) {
              if (_product.id == specificPrices[k].id_product) {
                _product.specific_price = specificPrices[k];
                _product.reduction_price = (1 - specificPrices[k].reduction) * _product.price;
                _product.reduction = specificPrices[k].reduction;
                _product.promo = true;
                _product.real_price = _product.reduction_price;
                break;
              }
            }
            if (!_product.promo) {
              _product.real_price = _product.price;
            }
            storage.get('cart_price').then((cartPrice) => {
              newCartPrice = cartPrice - parseFloat(_product.real_price * product.quantity);
              if (newCartPrice < 0) {
                storage.save('cart_price', 0);
                this.setState({ cartPrice: 0 })
              } else {
                storage.save('cart_price', newCartPrice);
                this.setState({ cartPrice: newCartPrice })
              }

            });

          }).catch(error => {
            console.log(error);
          })
      })
  }

  // -------------------  update cart whenever increasing quantity ------------//
  deleteProductInCart(product, rowMap, rowKey) {
    this.setState({ loading: true });
    storage.get('cart_id').then((cartId) => {
      url = GET_CART_URL + cartId + JSON_FORMAT;
      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        },
      })
        .then(res => res.json())
        .then(resJson => {
          this.getCartBody(resJson, product, rowMap, rowKey);
        }).catch(error => {
          this.setState({ loading: false });
          console.log(error);
        })
    });
  }

  getCartBody(temp, product, rowMap, rowKey) {

    tempCartRow = [];
    if (temp.cart.associations.cart_rows.length > 1) {
      for (let i = 0; i < temp.cart.associations.cart_rows.length; i++) {
        tempCartRow[i] = {};
        tempCartRow[i] = temp.cart.associations.cart_rows[i];
      };
      delete temp.cart.associations.cart_rows;

      temp.cart.associations.cart_rows = {};
      temp.cart.associations.cart_rows.cart_row = [];
      for (let i = 0; i < tempCartRow.length; i++) {
        if (tempCartRow[i].id_product != product.id_product) {
          temp.cart.associations.cart_rows.cart_row.push(tempCartRow[i]);
        }
      };
    } else {
      delete temp.cart.associations.cart_rows;
      temp.cart.associations.cart_rows = "";
    }
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(temp);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;

    console.log("bodyXml", bodyXML);
    this.putCartRequest(bodyXML, product, rowMap, rowKey);

  }

  putCartRequest(body, product, rowMap, rowKey) {
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
        storage.save('cart', resJson);
        this.getCartQuantity();
        this.setState({ loading: false });
        this.closeRow(rowMap, rowKey);

      }).catch(error => {
        console.log(error);
        this.setState({ loading: false });
      })
  }


  // _renderItem( data, rowMap) {
  //   return (<CartItem product={data.item.data} index={data.index} deleteRowFromCartItem={this.deleteRowFromCartItem} updateCartFromCartItem={this.updateCartFromCartItem}/>)
  // }

  render() {
    const { back, currentPosition, lang, isRTL} = this.state;
    let nextButtonIcon =  isRTL ? LEFT_ICON : RIGHT_ICON;
    if(lang == 'ar') labels = LABELS;
    else labels = LABELS_AR;
    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          title={i18n.t('cart_screen.my_cart', { locale: lang } )}
          back={true}
          isOnGoBack={true}
        />
        <View style={styles.container}>
          <StepIndicator
            customStyles={Config.StepIndicator}
            stepCount={5}
            currentPosition={currentPosition}
            labels={labels}
          />
          <View style={[
            AppStyles.row,
            AppStyles.spaceBetween,
            styles.containerHeader
          ]}>
            <Text style={styles.title}>{i18n.t('cart_screen.total_price', { locale: lang } )}</Text>
            <Text style={styles.total}> {this.state.currency}{ChangeCurrency(this.state.cartPrice, this.state.oldCurrency, this.state.currency, this.state.currencies)} </Text>
          </View>
          <SwipeListView
            useFlatList
            ref={(ref) => this.setState({ listRef: ref })}
            // removeClippedSubviews={true}
            contentContainerStyle={{ paddingHorizontal: Metrics.baseMargin, }}
            data={this.state.listProducts}
            // renderItem={(data, rowMap) => this._renderItem((data, rowMap))}
            renderItem={(data, rowMap) => (
              <CartItem product={data.item.data} rowKey={data.item.key} rowMap={rowMap} context={this} deleteRow={this.deleteRow} deleteRowFromCartItem={this.deleteRowFromCartItem} updateCartFromCartItem={this.updateCartFromCartItem} />
            )}
            renderHiddenItem={(data, rowMap) => (
              <View style={styles.rowBack}>
                <TouchableOpacity
                  style={[
                    styles.backRightBtn,
                    styles.backRightBtnRight
                  ]}
                >
                  <Icon
                    width={40}
                    tintColor={Colors.white}
                    image={require("../../resources/icons/deleteItem.png")}
                    onPress={_ => this.deleteRow(rowMap, data.item.key)}
                  />
                </TouchableOpacity>
              </View>
            )}
            disableLeftSwipe={true}
            disableRightSwipe={true}
            rightOpenValue={-75}

          />
        </View>
        {/* show detail part */}
        <View style={{ margin: 20, padding: 10, backgroundColor: Colors.gray, borderRadius: 5, }}>
          <TouchableOpacity
            style={[
              AppStyles.row,
              AppStyles.spaceBetween,
              { height: 40, backgroundColor: Colors.white }
            ]}
            onPress={() => this.setState({ isShowDetail: !this.state.isShowDetail })}>

            <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', color: Colors.black, alignSelf: 'center', textAlign: 'center' }}>
              {i18n.t('cart_screen.show_detail', { locale: lang } )}
              </Text>
            {this.state.isShowDetail ?
              <Icon
                width={35}
                image={require("../../resources/icons/bottom.png")}
                onPress={() => this.setState({ isShowDetail: !this.state.isShowDetail })}
              />
              : <Icon
                width={35}
                image={require("../../resources/icons/top.png")}
                onPress={() => this.setState({ isShowDetail: !this.state.isShowDetail })}
              />
            }


          </TouchableOpacity>
          {this.state.isShowDetail && (
            <View>
              <RowText
                bgColor={true}
                title={this.state.cartQuantity + i18n.t('cart_screen.items', { locale: lang } )}
                description={""}
              />
              <TouchableOpacity
                style={[
                  AppStyles.row,
                  AppStyles.spaceBetween,
                  { height: 40, backgroundColor: Colors.white }
                ]}
                onPress={() => this.setState({ isShowItem: !this.state.isShowItem })}>

                <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', color: Colors.black, alignSelf: 'center', textAlign: 'center' }}>
                  {i18n.t('cart_screen.show_items', { locale: lang } )}
                </Text>
                <Icon
                  width={35}
                  image={require("../../resources/icons/bottom.png")}
                />

              </TouchableOpacity>
              {this.state.isShowItem && (
                <FlatList
                  data={this.state.showProductInCart}
                  renderItem={({ item }) =>
                    <RowText
                      bgColor={true}
                      height={20}
                      title={item.name[0].value + " X" + item.quantity2}
                      description={this.state.currency + ChangeCurrency(item.real_price * item.quantity2, this.state.oldCurrency, this.state.currency, this.state.currencies)}
                    />}
                />
              )}
              <RowText
                bgColor={true}
                height={30}
                title={i18n.t('cart_screen.subtotal', { locale: lang } )}
                description={this.state.currency + ChangeCurrency(this.state.subTotal, this.state.oldCurrency, this.state.currency, this.state.currencies)}
              />
              {this.state.showPromo == true &&
                <RowText
                  bgColor={true}
                  height={30}
                  title={i18n.t('cart_screen.discount', { locale: lang } )}
                  description={this.state.currency + ChangeCurrency(this.state.subTotal *(1 + parseFloat(this.state.taxRate)/100) * parseFloat(this.state.promo) / 100, this.state.oldCurrency, this.state.currency, this.state.currencies)}
                />
              }

              {this.state.shipping != 0 ?
                <RowText
                  bgColor={true}
                  height={30}
                  title={i18n.t('cart_screen.shipping', { locale: lang } )}
                  description={this.state.currency + ChangeCurrency(this.state.shipping, this.state.oldCurrency, this.state.currency, this.state.currencies)}
                />
                :
                <RowText
                  bgColor={true}
                  height={30}
                  title={i18n.t('cart_screen.shipping', { locale: lang } )}
                  description={i18n.t('cart_screen.free', { locale: lang } )}
                />
              }
              {this.state.showPromo == true &&
                <View style={[AppStyles.row, AppStyles.spaceBetween]}>
                  <Text style={{ color: "#ff9a52", fontSize: 18, fontWeight: "bold" }}>{this.state.cart_rule.name[0].value}</Text>
                  <Text style={{ color: "#ff9a52", fontSize: 18, fontWeight: "bold" }}>-{this.state.cart_rule.reduction_percent}%</Text>
                </View>
              }
              <TouchableOpacity
                style={[
                  { height: 40, marginTop: 20, backgroundColor: Colors.white }
                ]}
                onPress={() => this.setState({ isPromoDetail: !this.state.isPromoDetail, existError:false, expiredError: false })}>
                <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', color: Colors.black }}>
                  {i18n.t('cart_screen.have_promo_code', { locale: lang } )}
              </Text>
              </TouchableOpacity>
              {this.state.isPromoDetail && (
                <View>
                  <View
                    style={[
                      AppStyles.row,
                      { height: 30 }
                    ]}>
                    <TextInput
                      style={{ height: 30, width: 150, borderColor: 'gray', borderWidth: 1 }}
                      onChangeText={(text) => this.setState({ addPromoText: text })}
                      value={this.state.text}
                    />
                    <Button
                      styleButton={{ height: 30, width: 70, backgroundColor: Colors.appColor }}
                      styleText={{ color: Colors.white }}
                      text={i18n.t('cart_screen.add', { locale: lang } )}
                      onPress={() => this.onPressPromoButton()}
                    />
                  </View>
                  {this.state.expiredError == true && <Text style={{ color: Colors.red }}>{i18n.t('cart_screen.voucher_has_expired', { locale: lang } )}</Text>}
                  {this.state.existError == true && <Text style={{ color: Colors.red }}>{i18n.t('cart_screen.voucher_does_not_exist', { locale: lang } )}</Text>}

                </View>
              )}
              <RowText
                bgColor={true}
                height={30}
                title={i18n.t('cart_screen.total_tax_incl', { locale: lang } )}
                description={this.state.currency + ChangeCurrency(this.state.subTotal + this.state.shipping - this.state.subTotal * this.state.promo/100, this.state.oldCurrency, this.state.currency, this.state.currencies)}
              />
              <RowText
                bgColor={true}
                height={30}
                title={i18n.t('cart_screen.taxes', { locale: lang } )}
                description={this.state.currency + ChangeCurrency(this.state.subTotal *(1-(1 + parseFloat(this.state.taxRate) / 100)*this.state.promo/100) * parseFloat(this.state.taxRate) / 100, this.state.oldCurrency, this.state.currency, this.state.currencies)}
              />
            </View>

          )}
        
        </View>
        {/* show detail part end */}
        <View style={{

        }}>
          <Button
            iconRight={nextButtonIcon}
            colorIcon={Colors.white}
            styleButton={{ backgroundColor: Colors.appColor }}
            styleText={{ color: Colors.white }}
            text={i18n.t('cart_screen.next_step', { locale: lang } )}
            onPress={() => this.onPressNextButton()}
          />
        </View>
        <Modal
          isVisible={this.state.modalVisible}
          animationIn={'bounceInUp'}
          animationOut={'fadeOutUpBig'}
          animationInTiming={1200}
          animationOutTiming={900}
          backdropTransitionInTiming={1200}
          backdropTransitionOutTiming={900}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.modalContent}>
            <Text style={{ textAlign: 'center', marginTop: 40, marginLeft: 30, marginRight: 30, fontSize: 16 }}> You should sign in if you want to buy them. </Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={() => this.onPressGuestButton()}>
                <View style={styles.button}>
                  <Text>{i18n.t('cart_screen.guest', { locale: lang } )}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onPressOkButton()}>
                <View style={styles.button}>
                  <Text> {i18n.t('cart_screen.signin', { locale: lang } )}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Spinner visible={this.state.loading} />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: (Platform.OS === 'ios') ? 30 : Metrics.doubleBaseMargin
  },
  containerHeader: {
    height: Metrics.navBarHeight,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    marginHorizontal: Metrics.baseMargin,
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black
  },
  total: {
    ...Fonts.style.normal,
    fontFamily: Fonts.type.Bold,
    color: Colors.appColor
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    backgroundColor: 'red',
  },
  backTextWhite: {
    color: '#FFF',
    fontSize: 25,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0
  },

  containerItem: {
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

  modalContent: {
    alignSelf: 'center',
    alignItems: 'center',
    height: 200,
    width: 400,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: 'white',
  },

  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },

});
