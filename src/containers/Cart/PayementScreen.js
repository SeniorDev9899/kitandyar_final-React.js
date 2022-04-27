import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import xml2js from 'react-native-xml2js'
import Spinner from 'react-native-loading-spinner-overlay';
import i18n from '../../helpers/I18n/I18n';
import Modal from 'react-native-modal';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";
import RowText from "../../components/common/RowText";

import { Cards, CardsAR } from '../../data/Cards';
import Config from '../../config';
import PaymentItem from '../../components/card/PaymentItem';
import { GET_TAXRULE_URL, HEADER_ENCODED, GET_TAX_URL, PRODUCT_URL, JSON_FORMAT, Paypal_HEADER_ENCODED, GET_SPECIFIC_PRICE_URL, FULL_JSON_FORMAT, GET_COMBINATIONS_URL, GET_WEIGHT_RAGNES_URL, GET_DELIVERIES_URL } from '../../constants/constants';
import { ChangeCurrency } from '../../constants/helper';
import {LABELS, LABELS_AR} from '../../constants/constants';

const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

var storage = require("react-native-local-storage");
export default class PayementScreen extends PureComponent {

  state = {
    loading: false,
    currentPosition: 3, 
    card: "",
    taxRate: 0,
    cartQuantity: 0,
    subTotal: 0,
    showProductInCart: [],
    isShowDetail: false,
    isShowItems: false,
    currency: "BHD",
    oldCurrency: "BHD",
    currencies: null,
    weightRangeId: null,
    shipping: 0,
    cart_rule:{},
    promo: 0,
    showPromo: false,
    lang: "",
    isRTL: false,
    approval_url: "",
    AccessToken: "",
    cart: "",
    product: "",
    price: "",
    cart_items: [],
    Tax: 0,
    Shipping_discount: 0,
    Subtotal: 0,
    Shipping: 0,
    shipping_address:"",
    modalVisible: false
  };

  componentDidMount(){
    this.setState({card: Cards[0]});
    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
          this.setState({card: CardsAR[0]});
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

    storage.get('cart_rule').then((cart_rule) => {
      if (cart_rule != null) {
        this.setState({ cart_rule: cart_rule });
        this.setState({promo: cart_rule.reduction_percent});
        this.setState({ showPromo: true });
      }
    });

    storage.get('country_id').then((country_id) => {
      this.getTaxRuleWithCountryId(country_id)
    });
    storage.get('delivery_address').then((delivery_address)=> {
      this.setState({shipping_address: delivery_address});
    })
    this.getCartQuantity();
    storage.get('cart').then((cart) => {
      this.setState({ cart: cart });
      cart_rows = this.state.cart.cart.associations.cart_rows;
      for (i = 0; i < cart_rows.length; i++) {
        console.log("id", cart_rows[i].id_product)
        this.getProductWithId(cart_rows[i].id_product, i, cart_rows[i].quantity);
      }
      console.log("cart", cart)
    })


    this.setState({modalVisible: true});
  }

  getAccessToken() {
    this.setState({ loading: true });
    url = "https://api.sandbox.paypal.com/v1/oauth2/token";
    let details = {
      'grant_type': 'client_credentials'
    };

    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    console.log("a", Paypal_HEADER_ENCODED);
    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Paypal_HEADER_ENCODED,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    })
      .then(res => res.json())
      .then(resJson => {

        this.setState({ AccessToken: resJson.access_token });
        url = "https://api.sandbox.paypal.com/v1/payments/payment";

        console.log("cart_rows", cart_rows);
        this.setState({ Tax: ChangeCurrency(this.state.subTotal * (1 - (1 + parseFloat(this.state.taxRate) / 100) * this.state.promo / 100) * parseFloat(this.state.taxRate) / 100, this.state.oldCurrency, "USD", this.state.currencies) });
        this.setState({ Shipping_discount: ChangeCurrency(this.state.subTotal * (1 + parseFloat(this.state.taxRate) / 100) * parseFloat(this.state.promo) / 100, this.state.oldCurrency, "USD", this.state.currencies) });
        this.setState({ Subtotal: ChangeCurrency(this.state.subTotal, this.state.oldCurrency, this.state.currency, this.state.currencies) });
        this.setState({ Shipping: ChangeCurrency(this.state.shipping, this.state.oldCurrency, "USD", this.state.currencies) });
        Paypal_url = "https://api.sandbox.paypal.com/v1/payments/payment";
        var detail = JSON.stringify({
          "intent": "sale",
          "payer": {
            "payment_method": "paypal"
          },
          "transactions": [
            {
              "amount": {
                "total": Math.round((this.state.Subtotal + this.state.Shipping + this.state.Tax + this.state.Shipping_discount) * 100) / 100,
                "currency": "USD",
                "details": {
                  "subtotal": this.state.Subtotal,
                  "tax": this.state.Tax,
                  "shipping": this.state.Shipping,
                  "handling_fee": "0.00",
                  "shipping_discount": this.state.Shipping_discount,
                  "insurance": "0.00"
                }
              },
              // "description": "The payment transaction description.",
              // "custom": "EBAY_EMS_90048630024435",
              // "invoice_number": "48787589672",
              // "payment_options": {
              //   "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
              // },
              // "soft_descriptor": "ECHI5786786",
              "item_list": {
                "items": this.state.cart_items
                // "shipping_address": {
                //   "recipient_name": "Brian Robinson",
                //   "line1": "4th Floor",
                //   "line2": "Unit #34",
                //   "city": "San Jose",
                //   "country_code": "US",
                //   "postal_code": "95131",
                //   "phone": "011862212345678",
                //   "state": "CA"
                // }
              }
            }
          ],
          "note_to_payer": "Contact us for any questions on your order.",
          "redirect_urls": {
            "return_url": "https://success",
            "cancel_url": "https://cancel"
          }
        });
        console.log(detail)
        fetch(Paypal_url, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer  ' + this.state.AccessToken,
            'Content-Type': 'application/json'
          },
          body: detail
        })
          .then(res => res.json())
          .then(resJson => {
            console.log("approval", resJson.links[1].href);
            this.setState({ approval_url: resJson.links[1].href, loading: false });
            this.props.navigation.navigate('Paypal', {
              approvalUrl: this.state.approval_url,
              AccessToken: this.state.AccessToken,
              paymentId: resJson.id,
              card: this.state.card, 
              carrierId: this.props.navigation.state.params.carrierId, 
              address: this.props.navigation.state.params.address
              // payerId:this.state.payerId
            });

          }).catch(error => {
            console.log(error);
            this.setState({ loading: false });
          })

      }).catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  getProductWithId = (productId, index, quantity) => {
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
            this.setState({ product: product, price: product.real_price });
            cart_item = {
              "name": product.name[0].value,
              "description": "",
              "quantity": quantity,
              "price": ChangeCurrency(product.real_price, this.state.oldCurrency, this.state.currency, this.state.currencies),
              "currency": "USD"
            }
            cart_items = this.state.cart_items;
            cart_items.push(cart_item);
            this.setState({ cart_items: cart_items });
            console.log("ghgh", cart_items);
            // if (index == this.state.cart.cart.associations.cart_rows.length - 1) {

            // }
          }).catch(error => {
            console.log(error);
            this.setState({ loading: false })
          })
      })
  }


  onPresspayment() {
    this.getAccessToken();
  }

  getTaxRuleWithCountryId(countryId){
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
        if(resJson.hasOwnProperty("tax_rules")) {
          tax_rules = resJson.tax_rules;
          tax_rule = tax_rules[0];
          console.log("tax rule = ", tax_rule);
          this.getTaxWithTaxId(tax_rule.id_tax);
        } else {
          this.setState({taxRate: 0});
          storage.save('tax_rate', 0);
        }

      }).catch(error => {
        console.log(error);
      })
}

getTaxWithTaxId(taxId){
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
      if(taxes != []) {
        tax = taxes[0];
        this.setState({taxRate: tax.rate});
        storage.save('tax_rate', tax.rate);
        console.log("tax rate = ", tax.rate);
      } else {
        this.setState({taxRate: 0});
        storage.save('tax_rate', 0);
      }

    }).catch(error => {
      console.log(error);
    })
}

getCartQuantity(){
  combinationIDs = ""
  storage.get('cart').then((cart) => {
    cartQuantity = 0;
    if (cart.cart.associations.cart_rows.length == 0) {
      this.setState({cartQuantity: 0});
    } else{
      for(var i=0; i<cart.cart.associations.cart_rows.length; i++){
        cartQuantity = cartQuantity + parseInt(cart.cart.associations.cart_rows[i].quantity);
        this._getProductWithId(cart.cart.associations.cart_rows[i].id_product, i, cart.cart.associations.cart_rows[i].quantity);
        if(combinationIDs == "") combinationIDs = "[" + cart.cart.associations.cart_rows[i].id_product_attribute;
        else combinationIDs = combinationIDs + "|" + cart.cart.associations.cart_rows[i].id_product_attribute;
        
      }
      
      this.setState({cartQuantity: cartQuantity});
      combinationIDs = combinationIDs + "]";
      this.getWeightWithCombinationIDs(combinationIDs, cart);
      
    }
    console.log("show_cart combinationIDs = ", combinationIDs);
  });
}

// ----------------------------------  shipping calculation --------------------------------------//
getWeightWithCombinationIDs(combinationIDs, cart){
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

getWeights(combinations, cart){
  weights = 0;
  for(var i=0; i<combinations.length; i++){
    for(var j=0; j<cart.cart.associations.cart_rows.length; j++){
      if(combinations[i].id == cart.cart.associations.cart_rows[j].id_product_attribute){
        itemWeight = parseFloat(combinations[i].weight)*cart.cart.associations.cart_rows[j].quantity;
        weights = weights + itemWeight;
      }
    }
  }
  console.log("weights = ", weights);

  this.getWeightRangesWithWeights(weights);
}

getWeightRangesWithWeights(weights){
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

getWeightRangeId(weightRanges, weights){
  weightRangeId = null;
  for(var i=0; i<weightRanges.length; i++){
    if(weights < parseFloat(weightRanges[i].delimiter2)) 
    {
      weightRangeId = weightRanges[i].id;
      break;
    }
  }
  this.setState({weightRangeId: weightRangeId});
  console.log("weight range id = ", weightRangeId);
  this.getZoneIdWith(weightRangeId);
}

getZoneIdWith(weightRangeId){
  storage.get('countries').then((countries) => {
    storage.get('country_id').then((countryId) => {
      for(var i=0; i<countries.length; i++){
        if(countries[i].id == countryId){
          this.getShippingPriceWithZoneId(countries[i].id_zone, weightRangeId);
          break;
        }
      }
    });
  });
}

getShippingPriceWithZoneId(zoneId, weightRangeId){
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
        this.setState({shipping: parseFloat(resJson.deliveries[0].price)})
        storage.save('shipping', parseFloat(resJson.deliveries[0].price));
    }).catch(error => {
      console.log(error);
    })
}
// -------------------------------------------------------------------------------//


_getProductWithId = (productId, index, quantity) =>{
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
          for(var k=0; k<specificPrices.length; k++){
            if(product.id == specificPrices[k].id_product){
              product.specific_price = specificPrices[k];
              product.reduction_price = (1 - specificPrices[k].reduction) * product.price; 
              product.reduction = specificPrices[k].reduction; 
              product.promo = true;
              product.real_price = product.reduction_price;
              break;
            } 
          }
          if(!product.promo){
            product.real_price = product.price;
          }
          product._quantity = quantity;
          _showProductInCart = this.state.showProductInCart;
          _showProductInCart[index] = product;
          this.setState({showProductInCart: _showProductInCart});

          _subTotal = 0;
          for(let i=0; i<_showProductInCart.length; i++){
            _subTotal = _subTotal + _showProductInCart[i]._quantity * _showProductInCart[i].real_price
          }
          this.setState({subTotal: _subTotal});

      }).catch(error => {
        console.log(error);
      })  
  })
}

onPressConfirmButton(){
  this.setState({modalVisible: false});
}

 
  render() {

    const {
      currentPosition, card, lang, isRTL
    } = this.state;

    let nextButtonIcon =  isRTL ? LEFT_ICON : RIGHT_ICON;
    let backButtonIcon =  isRTL ? RIGHT_ICON : LEFT_ICON;

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
          title={i18n.t('payment_Screen.mode_payment', { locale: lang } )}
          back={true}
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
            <Text style={styles.title}>{i18n.t('payment_Screen.your_mode_payment', { locale: lang } )}</Text>
          </View>

          {/* show detail part */}
        <View style={{ marginTop: 10, padding: 10, backgroundColor: Colors.gray, borderRadius:5,}}> 
        <TouchableOpacity
            style={[
              AppStyles.row,
              AppStyles.spaceBetween,
              { height: 40, backgroundColor: Colors.white }
            ]}
            onPress={() => this.setState({ isShowDetail: !this.state.isShowDetail })}>

            <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', color: Colors.black, alignSelf: 'center', textAlign: 'center' }}>
             {i18n.t('payment_Screen.show_detail', { locale: lang } )}
              </Text>
            {this.state.isShowDetail ?
              <Icon
                width={35}
                image={require("../../resources/icons/top.png")}
                onPress={() => this.setState({ isShowDetail: !this.state.isShowDetail })}
              />
              : <Icon
                width={35}
                image={require("../../resources/icons/bottom.png")}
                onPress={() => this.setState({ isShowDetail: !this.state.isShowDetail })}
              />
            }
          </TouchableOpacity>
          {this.state.isShowDetail &&
          <View>
          <RowText
            bgColor={true}
            title={this.state.cartQuantity + i18n.t('payment_Screen.items', { locale: lang } )}
            description={""}
          />
          <TouchableOpacity         
            style={[
              AppStyles.row,
              AppStyles.spaceBetween,
              { height: 40, backgroundColor: Colors.white}
            ]}
            onPress={() => this.setState({isShowItems: !this.state.isShowItems})}>

              <Text style={{alignSelf: 'flex-start', fontWeight: 'bold', color: Colors.black, alignSelf: 'center', textAlign: 'center'}}>
                 {i18n.t('payment_Screen.show_items', { locale: lang } )}
              </Text>
              <Icon
                width={35}
                image={require("../../resources/icons/bottom.png")}
              />

          </TouchableOpacity>
          {this.state.isShowItems && (
            console.log("showProductinCart", this.state.showProductInCart),
            <FlatList
              data={this.state.showProductInCart}
              renderItem={({item}) =>
                <RowText
                   bgColor={true}
                   height={20}
                   title={item.name[0].value + " X" + item._quantity}
                   description={this.state.currency + ChangeCurrency(item.real_price * item._quantity, this.state.oldCurrency, this.state.currency, this.state.currencies)}
                 />}
            />
          )}
           <RowText
              bgColor={true}
              height={30}
              title={i18n.t('payment_Screen.subtotal', { locale: lang } )}
              description={this.state.currency + ChangeCurrency(this.state.subTotal, this.state.oldCurrency, this.state.currency, this.state.currencies)}
            />
            {this.state.showPromo == true &&
                <RowText
                  bgColor={true}
                  height={30}
                  title={i18n.t('payment_Screen.discount', { locale: lang } )}
                  description={this.state.currency + ChangeCurrency(this.state.subTotal *(1 + parseFloat(this.state.taxRate)/100) * parseFloat(this.state.promo) / 100, this.state.oldCurrency, this.state.currency, this.state.currencies)}
                />
              }
            {this.state.shipping !=0 ? 
              <RowText
                bgColor={true}
                height={30}
                title={ i18n.t('payment_Screen.shipping', { locale: lang } )}
                description={this.state.currency + ChangeCurrency(this.state.shipping, this.state.oldCurrency, this.state.currency, this.state.currencies)}
              />
            :
            <RowText
              bgColor={true}
              height={30}
              title={i18n.t('payment_Screen.shipping', { locale: lang } )}
              description={ i18n.t('payment_Screen.free', { locale: lang } )}
            />
            }
            
            {/* <TouchableOpacity         
            style={[
              { height: 40, marginTop: 20, backgroundColor: Colors.white}
            ]}
            onPress={() => this.setState({isPromoDetail: !this.state.isPromoDetail})}>
              <Text style={{alignSelf: 'flex-start', fontWeight: 'bold', color: Colors.black}}>
                have a promo code?
              </Text>
          </TouchableOpacity> */}
          {this.state.isPromoDetail && (
              <View
              style={[
                AppStyles.row,
                { height: 30}
              ]}>
                  <TextInput
                    style={{height: 30, width: 150, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({addPromoText: text})}
                    value={this.state.text}
                  />
                  <Button
                    styleButton={{height:30, width: 70, backgroundColor: Colors.appColor }}
                    styleText={{ color: Colors.white }}
                    text={i18n.t('payment_Screen.add', { locale: lang } )}
                    onPress={() =>  this.onPressPromoButton() }
                  />
              </View>
          )}
          <RowText
                bgColor={true}
                height={30}
                title={i18n.t('payment_Screen.total_tax_incl', { locale: lang } )}
                description={this.state.currency + ChangeCurrency(this.state.subTotal + this.state.shipping - this.state.subTotal * this.state.promo/100, this.state.oldCurrency, this.state.currency, this.state.currencies)}
          />
            </View>
          }
          
        </View>
        {/* show detail part end */}
          <View style={{ flex: 1 }}>
            <FlatList
              style={{
                marginTop: Metrics.baseMargin,
                backgroundColor: Colors.transparent
              }}
              data={Cards}
              keyExtractor={this._keyExtractor}
              renderItem={({ item }) => <PaymentItem
                selected={card.id === item.id} 
                item={item}
                // height={60}
                onPress={() => { this.setState({ card: item }) }}
              />
              }
              keyExtractor={(item, i) => i}
            />
          </View>
        </View>
        <View style={[
          AppStyles.row,
          {
          }
        ]}>
          <Button
            iconLeft={backButtonIcon}
            colorIcon={Colors.dark_gray}
            styleButton={styles.buttonBack}
            styleText={{ color: Colors.dark_gray }}
            text={i18n.t('payment_Screen.back', { locale: lang } )}
            onPress={() => { this.props.navigation.goBack() }}
          />
          <Button
            iconRight={nextButtonIcon}
            colorIcon={Colors.white}
            styleButton={{ flex: 1, backgroundColor: Colors.appColor }}
            styleText={{ color: Colors.white }}
            text={i18n.t('payment_Screen.next_step', { locale: lang } )}
            // onPress={() => { this.props.navigation.navigate("OrderDetail", {card: this.state.card, carrierId: this.props.navigation.state.params.carrierId, address: this.props.navigation.state.params.address} ); }}
            onPress={() => { this.onPresspayment() }}
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
            <Text style={{ textAlign: 'center', marginTop: 40, marginLeft: 30, marginRight: 30, fontSize: 16 }}> To order, please select Payment method and click Next Step button. </Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={() => this.onPressConfirmButton()}>
                <View style={styles.button}>
                  <Text> {i18n.t('payment_Screen.confirm', { locale: lang } )}</Text>
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
    marginHorizontal: Metrics.baseMargin,
    marginTop: (Platform.OS === 'ios') ? 30 : Metrics.doubleBaseMargin
  },
  buttonBack: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    backgroundColor: Colors.lightBg_gray
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
