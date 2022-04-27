import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ListView,
  TouchableOpacity,
  BackHandler 
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { SwipeListView } from 'react-native-swipe-list-view';
import xml2js from 'react-native-xml2js'
import Modal from 'react-native-modal';
import { NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Metrics, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";
import Config from '../../config';
import { POST_CART_URL, HEADER_ENCODED, CART_TEMP, PRE_OF_BODY_XML, END_OF_BODY_XML, GET_ORDER_URL, JSON_FORMAT, GET_ORDER_SCHEMA_URL, POST_ORDER_URL, GET_CART_URL } from '../../constants/constants';
import OrderDetailItem from '../../components/order/OrderDetailItem';
import {ChangeCurrency} from '../../constants/helper'
import {LABELS, LABELS_AR} from '../../constants/constants';

var storage = require("react-native-local-storage");
const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

export default class OrderDetailScreen extends PureComponent {

  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      currentPosition: 4,
      listProducts: [], 
      totalPrice: "",
      modalVisible: false,
      orderSchema: "",
      customerId: "",
      cart_id: "",
      cart: "",
      card: "",
      emptyOrderBody: "",
      secureKey: "",
      currency: "BHD",
      oldCurrency: "BHD",
      currencies: null,
      cart_rule:{},
      promo:0,
      invoice_address:"",
      delivery_address:"",
      taxRate:0,
      shipping:0,
      lang: "",
      isRTL: false,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount(){
    storage.get('cart_rule').then((cart_rule) => {
      if (cart_rule != null) {
        this.setState({ cart_rule: cart_rule });
        this.setState({promo: cart_rule.reduction_percent});
      }
    });
    storage.getSet(['new_currency', 'old_currency', 'currencies', 'customer_id', 'secure_key', 'cart_price', 'cart_id', 'cart', 'tax_rate', 'shipping'], 
    this.storageSet.bind(this)).then(()=>{
      console.log("set temp = ", this.state);
      this.setState({currency: this.state.new_currency});
      this.setState({oldCurrency: this.state.old_currency});
      this.setState({currencies: this.state.currencies});
      this.setState({customerId: this.state.customer_id});
      this.setState({secureKey: this.state.secure_key});
      this.setState({totalPrice: this.state.cart_price});
      this.setState({cart_id: this.state.cart_id});
      this.setState({cart: this.state.cart});
      this.setState({taxRate: this.state.tax_rate});
      this.setState({shipping: this.state.shipping});

      var card = this.props.navigation.state.params.card;
      this.setState({card: card});
      console.log("cart_id", this.state.cart_id);
      this.updateCart(this.state.cart_id);
      this.postEmptyOrder(this.state.cart);
    })
    storage.get('delivery_address').then((deliveryAddress) => {
      if(deliveryAddress){
        this.setState({ delivery_address: deliveryAddress });
        console.log("delivery init address = ", this.state.delivery_address.id);
      } else {
        return;
      }
    });
    storage.get('invoice_address').then((invoiceAddress) => {
      if(invoiceAddress){
        this.setState({ invoice_address: invoiceAddress });
        console.log("invoice init address = ", this.state.invoice_address.id);
      } else {
        return;
      }
    });

    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });

  }

  storageSet(key, val){
    this.setState({[key]: val});
  };

  handleBackButtonClick() {
      console.log("handle Back Button Clicking..");
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'OutHome' })]
      }))
      return true;
  }

  _formatOfPrice(price) {
    var formatedPrice = Math.floor(price * 100) / 100;
    return formatedPrice;
  }

  updateCart(cartId){
    url = GET_CART_URL + cartId + JSON_FORMAT;
        console.log("update_cart_url", url);
        fetch(url, {
          method: "GET",
          headers: {
            'Authorization': 'Basic ' + HEADER_ENCODED
          },
        })
        .then(res => res.json())
        .then(resJson => {
          console.log("signin_cart_detail",resJson);
           this.getCartBodyForUpdate(resJson);

        }).catch(error => {
          console.log(error);
        })
  }
  getCartBodyForUpdate(temp){
    // temp.cart.id_address_delivery = this.props.navigation.state.params.address.id;
    // temp.cart.id_address_invoice = this.props.navigation.state.params.address.id;
    temp.cart.id_address_delivery = this.state.delivery_address.id;
    temp.cart.id_address_invoice = this.state.invoice_address.id;
    temp.cart.id_carrier = this.props.navigation.state.params.carrierId;

    tempCartRow = [];
    if(temp.cart.associations.cart_rows.length > 0) {
      for(let i=0; i<temp.cart.associations.cart_rows.length; i++){
        tempCartRow[i] = {};
        tempCartRow[i] = temp.cart.associations.cart_rows[i];
      };
      delete temp.cart.associations.cart_rows;

      temp.cart.associations.cart_rows = {};
      temp.cart.associations.cart_rows.cart_row = [];
      for(let i=0; i<tempCartRow.length; i++){
        temp.cart.associations.cart_rows.cart_row.push(tempCartRow[i]);
      };
    } else {
      delete temp.cart.associations.cart_rows;
      temp.cart.associations.cart_rows = "";
    }
    console.log("update_cart ===", temp);

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(temp);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
    console.log("bodyxml",bodyXML)
    this.putCartRequest(bodyXML);
  }

  putCartRequest(body) {
    console.log("body",body);
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
        console.log(resJson);
      }).catch(error => {
        this.setState({loading: false });
        console.log(error);
      })
  }
  // -------------------- post empty order ---------------------//
  postEmptyOrder(cart){
      this.setState({loading: true});

      url = GET_ORDER_SCHEMA_URL;
      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        },
      })
      .then(res => res.json())
      .then(resJson => { 
          console.log("orderschema",resJson);
          this.setState({orderSchema: resJson});
          this.getOrderEmptyBody(cart);
      }).catch(error => {
        this.setState({loading: false});
        console.log(error);
      })
  }

  getOrderEmptyBody(cart){
    // console.log("customer_id" + this.state.customerId);
    console.log("address_id" + this.props.navigation.state.params.address.id);
    console.log("carrier_id" + this.props.navigation.state.params.carrierId);
    
    

    preBody = this.state.orderSchema;
    preBody.order.id_customer = this.state.customerId;
    // preBody.order.id_address_delivery = this.props.navigation.state.params.address.id;
    // preBody.order.id_address_invoice = this.props.navigation.state.params.address.id;
    preBody.order.id_address_delivery = this.state.delivery_address.id;
    preBody.order.id_address_invoice = this.state.invoice_address.id;
    preBody.order.id_carrier = this.props.navigation.state.params.carrierId;
    preBody.order.id_cart = this.state.cart_id;
    preBody.order.id_lang = 1;
    preBody.order.id_currency = 3;
    preBody.order.current_state = 3
    preBody.order.module = "ps_cashondelivery";
    preBody.order.secure_key = this.state.secureKey;
    preBody.order.payment = this.state.card.methodPayement;
    // preBody.order.total_discounts = ChangeCurrency(this.state.subTotal *(1 + parseFloat(this.state.taxRate)/100) * parseFloat(this.state.promo) / 100, this.state.oldCurrency, this.state.currency, this.state.currencies);
    preBody.order.total_paid = ChangeCurrency(this.state.totalPrice, this.state.oldCurrency, this.state.currency, this.state.currencies);
    preBody.order.total_paid_tax_incl = ChangeCurrency(this.state.totalPrice, this.state.oldCurrency, this.state.currency, this.state.currencies);
    preBody.order.total_paid_tax_excl = ChangeCurrency(this.state.totalPrice - this.state.totalPrice * this.state.taxRate/100 , this.state.oldCurrency, this.state.currency, this.state.currencies);
    preBody.order.total_paid_real = ChangeCurrency(this.state.totalPrice, this.state.oldCurrency, this.state.currency, this.state.currencies);
    preBody.order.total_products = ChangeCurrency(this.state.totalPrice - this.state.shipping - this.state.totalPrice * this.state.taxRate/100, this.state.oldCurrency, this.state.currency, this.state.currencies);
    preBody.order.total_products_wt = ChangeCurrency(this.state.totalPrice - this.state.shipping, this.state.oldCurrency, this.state.currency, this.state.currencies);
    preBody.order.total_shipping = this.state.shipping;
    preBody.order.total_shipping_tax_incl = this.state.shipping;
    preBody.order.total_shipping_tax_excl = this.state.shipping;
    preBody.order.conversion_rate = 1;
    // preBody.order.reference = "KQAPTSLNR";

    delete preBody.order.associations.order_rows;
    preBody.order.associations.order_rows = {};
    preBody.order.associations.order_rows.order_row = [];

    tempOrderRow = [];
    // for (let i = 0; i < cart.cart.associations.cart_rows.length; i++) {
    //   tempOrderRow[i] = {};
    //   tempOrderRow[i] = cart.cart.associations.cart_rows[i];
    // };

    listRows = [];
    for(var i=0; i<tempOrderRow.length; i++){
      
      tempOrderRow[i].product_name = "Black Cut Out Bandage Dress";
      tempOrderRow[i].product_reference = "";  // consider
      tempOrderRow[i].product_price = 11.95;        // consider
      tempOrderRow[i].unit_price_tax_incl = 4.016801; // consider
      tempOrderRow[i].unit_price_tax_excl = 4.016801; // consider

      preBody.order.associations.order_rows.order_row.push(tempOrderRow[i]);
      listRows.push(tempOrderRow[i]);
    }

      console.log("empty order body");
      console.log(preBody);
      this.setState({emptyOrderBody: preBody});

      if (this.state.customerId != null) {
        this.postRealOrder();
        // this.initialCart();
      } else{
       this.setState({listProducts: listRows})
        this.setState({loading: false});
        this.initialCart();
        //this.postRealOrder();
      }
  }
// -----------------------------------------------------------//

// ------------------- post real order -----------------------//
  postRealOrder(){

    preBody = this.state.emptyOrderBody;
    preBody.order.id_customer = this.state.customerId;

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(preBody);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;

    // post real order
    url = POST_ORDER_URL;
    console.log(' real post body xml  = ' + bodyXML);
    fetch(url, {
      method: "POST",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
      body: bodyXML,
    })
    .then(res => res.json())
    .then(resJson => { 
      console.log('posting for real order is successed.. order_id = ', resJson);
      this.setState({listProducts: resJson.order.associations.order_rows});
      this.setState({loading: false});
      this.initialCart();
    }).catch(error => {
      this.setState({loading: false});
      console.log(" order with error!");
      console.log(error);
    })
  }

  // // --- get order from order id after posting order -----------//
  // getOrderWithId(orderId){
  //   url = GET_ORDER_URL + orderId + JSON_FORMAT;
  //   fetch(url, {
  //     method: "GET",
  //     headers: {
  //       'Authorization': 'Basic ' + HEADER_ENCODED
  //     },

  //   })
  //   .then(res => res.json())
  //   .then(resJson => { 
  //       console.log("get order .. ");
  //       console.log(resJson);
  //       this.setState({listProducts: resJson.order.associations.order_rows});
  //   }).catch(error => {
  //     console.log(error);
  //   })  
  // }

  // ------------------ create new cart - initialize new cart ----------------//
  initialCart(){
    storage.save('cart_id', null);
    storage.save('cart_price',null);
    storage.save('cart', null);
    storage.save('billingaddress_show', false);
    // const body = this.getCartBody();
    // url = POST_CART_URL;
    // fetch(url, {
    //   method: "POST",
    //   headers: {
    //     'Authorization': 'Basic ' + HEADER_ENCODED
    //   },
    //   body: body,
    // })
    // .then(res => res.json())
    // .then(resJson => { 
    //   storage.save('cart_id', resJson.cart.id);
    //   storage.get('cart_id').then((cartId) => {console.log("cart_id : "); console.log(cartId)});
    //   storage.save('cart_price',null);
    //   storage.save('cart', null);
    // }).catch(error => {
    //   console.log(error);
    // })

  }

  getCartBody(){

    const temp = CART_TEMP;
    temp.cart.associations.cart_rows = [];
    temp.cart.id_currency = 3;
    storage.get('customer_id').then((tmp) => { temp.cart.id_customer = tmp});
    
    temp.cart.id_lang = 1;
    temp.cart.secure_key = "ef19e7b5c32a541511bc54c520e6fc22"; // please consider when post cart.

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(temp);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
    return bodyXML;
  }

  // -------------------------------------------------------------------------------------//

  onPressHomeButton(){
    storage.get('customer_id').then((customerId) => {
      if(customerId == null) {
        this.setState({modalVisible: true});
      } else {
       
        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'OutHome' })]
        }))
        //this.props.navigation.navigate("Home");
      }
    });
    
  }

  onPressIgnorButton(){
    this.setState({modalVisible: false});
    //this.props.navigation.navigate("Home");
    
    this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'OutHome' })]
    }))
  }

  onPressOkButton(){
    this.setState({modalVisible: false});
    this.props.navigation.navigate("SignUpWithEmail");
  }


  _renderItem(item) {
    return (<OrderDetailItem product={item} deleteRowFromCartItem={this.deleteRowFromCartItem}/>)
  }

  render() {
    const {
      currentPosition, lang, isRTL
    } = this.state;

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
           hideIcon={true}
           title={i18n.t('order_detail_screen.order', { locale: lang } )}
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
            <Text style={styles.title}>{i18n.t('order_detail_screen.total_price', { locale: lang } )}</Text>
            <Text style={styles.total}>{this.state.currency}{ChangeCurrency(this.state.totalPrice + this.state.shipping, this.state.oldCurrency, this.state.currency, this.state.currencies)} </Text>
          </View>
          <SwipeListView
            removeClippedSubviews={true}
            contentContainerStyle={{ paddingHorizontal: Metrics.baseMargin, }}
            dataSource={this.ds.cloneWithRows(this.state.listProducts)}
            renderRow={(item) => this._renderItem(item)}
            renderHiddenRow={(item, secId, rowId, rowMap) => (
              <View style={styles.rowBack}>
                <TouchableOpacity
                  style={[
                    styles.backRightBtn,
                    styles.backRightBtnRight
                  ]}
                //   onPress={() => this.deletProduct(secId, rowId, rowMap)}
                 >
                  <Icon
                    width={40}
                    tintColor={Colors.white}
                    image={require("../../resources/icons/deleteItem.png")}
                    onPress={_ => this.deleteRow(secId, rowId, rowMap)}
                  />
                </TouchableOpacity>
              </View>
            )}
            disableRightSwipe={true}
            disableLeftSwipe={true}
            stopRightSwipe={-75}
          />

        </View>
        <View style={{
        }}>
          <Button
            iconRight={nextButtonIcon}
            colorIcon={Colors.white}
            styleButton={{ backgroundColor: Colors.appColor }}
            styleText={{ color: Colors.white }}
            text={i18n.t('order_detail_screen.go_home', { locale: lang } )}
            onPress={() => this.onPressHomeButton()}
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
          onRequestClose={() => this.setState({modalVisible: false})}
        >
            <View style={styles.modalContent}>
              <Text style={{textAlign: 'center', marginTop: 40, marginLeft: 30, marginRight: 30, fontSize: 16}}> {i18n.t('order_detail_screen.modal_text', { locale: lang } )} </Text>
              <View style={{flexDirection: 'row',marginTop: 20}}>
                <TouchableOpacity onPress={() => this.onPressIgnorButton()}>
                  <View style={styles.button}>
                    <Text>{i18n.t('order_detail_screen.ingnor', { locale: lang } )}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onPressOkButton()}>
                  <View style={styles.button}>
                    <Text>{i18n.t('order_detail_screen.ok', { locale: lang } )}</Text>
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

