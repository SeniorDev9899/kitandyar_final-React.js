import React, { PureComponent } from 'react';
import { NavigationActions } from 'react-navigation';

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import xml2js from 'react-native-xml2js'
import i18n from '../../helpers/I18n/I18n';

import FormInput from '../../components/common/FormInput';
import Button from "../../components/common/Button";
import Password from "../../components/common/bcrypt";

import { AppStyles, Metrics, Colors, Fonts } from '../../themes';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, { DURATION } from 'react-native-easy-toast';
import { SIGNIN_URL, HEADER_ENCODED, CART_TEMP, PRE_OF_BODY_XML, END_OF_BODY_XML, POST_CART_URL, GET_CART_URL, JSON_FORMAT } from "../../constants/constants"

const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

var storage = require("react-native-local-storage");
export default class SignInScreen extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      data: "",
      loading: false,
      email: "",
      password: null,
      lang: "en",
      isRTL: false,
      test:"test"
    };
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  componentWillMount(){
    storage.get('lang').then((lang_) => {
      if (lang_ != null) {
        this.setState({lang: lang_});
        if (lang_ == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });
  }

  postCart() {
    const body = this.getCartBodyForPost();
    url = POST_CART_URL;
    fetch(url, {
      method: "POST",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
      body: body,
    })
      .then(res => res.json())
      .then(resJson => {
        this.setState({ loading: false });
        storage.save('cart_id', resJson.cart.id);
        storage.get('cart_id').then((tmp1) => { });
        storage.save('cart_price', 0);
        storage.save('cart', "");
        storage.get('cart_price').then((tmp1) => {  });
        this.props.navigation.goBack();
      }).catch(error => {
        this.setState({ loading: false });
      })

  }

  getCartBodyForPost() {
    const temp = CART_TEMP;
    temp.cart.associations.cart_rows = [];
    temp.cart.id_currency = 3;
    storage.get('customer_id').then((tmp) => { temp.cart.id_customer = tmp });

    temp.cart.id_lang = 1;
    temp.cart.secure_key = "ef19e7b5c32a541511bc54c520e6fc22";

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(temp);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
    return bodyXML;
  }


  // -------------------  update cart with customer id------------//
  updateCartWithCustomerId(customerId) {
    storage.get('cart_id').then((cartId) => {
      if (cartId != null) {

        url = GET_CART_URL + cartId + JSON_FORMAT;
        fetch(url, {
          method: "GET",
          headers: {
            'Authorization': 'Basic ' + HEADER_ENCODED
          },
        })
          .then(res => res.json())
          .then(resJson => {
          
            this.getCartBodyForUpdate(resJson, customerId);

          }).catch(error => {
          })
      } else {
        // this.postCart();
        this.props.navigation.navigate('DrawerClose');
        this.props.navigation.dispatch(NavigationActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'OutHome' })]
        }))

      }
    });

  }

  getCartBodyForUpdate(temp, customerId) {
    existCartRow = false;
    tempCartRow = [];

    if (!temp.cart.hasOwnProperty('associations')) {
      temp.cart.associations = "";
      temp.cart.associations.cart_rows = "";
    } else if (temp.cart.associations.cart_rows.length > 0) {
      for (let i = 0; i < temp.cart.associations.cart_rows.length; i++) {
        tempCartRow[i] = {};
        tempCartRow[i] = temp.cart.associations.cart_rows[i];
      };
      delete temp.cart.associations.cart_rows;

      temp.cart.associations.cart_rows = {};
      temp.cart.associations.cart_rows.cart_row = [];
      for (let i = 0; i < tempCartRow.length; i++) {
        temp.cart.associations.cart_rows.cart_row.push(tempCartRow[i]);
      };
    } else {
      delete temp.cart.associations.cart_rows;
      temp.cart.associations.cart_rows = "";
    }
    temp.cart.id_customer = customerId;

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(temp);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
    this.putCartRequest(bodyXML);

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
        storage.save('cart', resJson);
        this.navigationFromSign();
        this.setState({ loading: false });

      }).catch(error => {
        this.setState({ loading: false });
      })
  }

  navigationFromSign() {
    
    if (this.props.navigation.state.params.fromPage == 'cartPage') {

      // this.props.navigation.navigate("Delivery" );
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'OutHome' })]
      }))
    } else if (this.props.navigation.state.params.fromPage == "Home") {
      this.props.navigation.navigate('DrawerClose');
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'OutHome' })]
      }))
    }
  }

  makeRequest = () => {
    // const url = SIGNIN_URL + "?display=full&filter[email]=" + this.state.email + "&filter[passwd]=" + this.state.password + "&output_format=JSON";
    const url = SIGNIN_URL + "?display=full&filter[email]=" + this.state.email + "&output_format=JSON";

    this.setState({ loading: true });
    fetch(url, {
      method: "GET",
      headers: {
        // 'Authorization': 'Basic REhZMVQ5VEpJWjc1TFJWWDYxMkkxTkhGODhZVlUyWk06'
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
      .then(res => res.json())
      .then(resJson => {
        this.setState({
          data: resJson,
          error: resJson.error || null,
          loading: false,
        })

        password = this.state.data.customers[0].passwd;
        if (Password.verify(this.state.password, password)) {
          this.refs.toast.show('Successfully Sign In', DURATION.LENGTH_LONG);
          //save login information
          customers = this.state.data.customers;

          if (customers.length > 0) {
            customer = customers[0];
            storage.save('customer_id', customer.id);

            storage.get('customer_id').then((customerID) => {
              // status = false;
              console.log("customerID = ", customerID);
              
          });

            storage.save('customer_firstname',customer.firstname);
            storage.save('customer_lastname',customer.lastname);
            storage.save('secure_key', customer.secure_key);
            storage.save('email', customer.email);
            // storage.save(['customer_id', 'customer_firstname', 'customer_lastname', 'secure_key', 'email'],
            //   [customer.id, customer.firstname, customer.lastname, customer.secure_key, customer.email]);
            this.updateCartWithCustomerId(customer.id);
          }
        } else {
          alert(i18n.t('signin_screen.incorrect_password', { locale: this.state.lang } ));
        }

      }).catch(error => {
        this.setState({ error, loading: false });
        // alert("Server connect failed.");
        alert(i18n.t('signin_screen.incorrect_email', { locale: lang } ));
      })
  }

  render() {
    const {lang, isRTL} = this.state;
    let nextButtonIcon =  isRTL ? LEFT_ICON : RIGHT_ICON;
   
    return (
      <View style={[
        AppStyles.mainContainer,
        { paddingTop: 0 }
      ]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <View style={{ height: 100, justifyContent: "center" }}>
              <Text style={styles.title}>
              { i18n.t('signin_screen.signin', { locale: lang }) }
              </Text>
            </View>
            {/* <View style={{ flex: 1 }}> */}
            {/* <Text style={styles.text}>
                Sign In
              </Text>
              <Text style={styles.text}>
                with your social account
              </Text> */}
            {/* <View style={[
                AppStyles.center,
                AppStyles.row,
                { marginVertical: Metrics.baseMargin }
              ]}>
                <Icon
                  width={50}
                  image={require("../../resources/icons/facebook.png")}
                  onPress={() => { alert("Facebook") }}
                />
                <Icon
                  width={50}
                  image={require("../../resources/icons/google.png")}
                  onPress={() => { alert("Google") }}
                />
                <Icon
                  width={50}
                  image={require("../../resources/icons/twitter.png")}
                  onPress={() => { alert("Twitter") }}
                />
              </View> */}
            {/* <Hr /> */}
            {/* </View> */}
            <View style={{ paddingTop: Metrics.deviceHeight / 6, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.text}>
                { i18n.t('signin_screen.signin_with_email', { locale: lang }) }
              </Text>
              <FormInput 
                placeholder={ i18n.t('signin_screen.email_address', { locale: lang } ) }
                styleInput={{ marginTop: Metrics.baseMargin }}
                onChangeText={value => this.setState({ email: value })}
              // for test
              // onChangeText={value => this.setState({ email: "grishamarkov1188@gmail.com" })}
              // end
              />
              <FormInput
                placeholder={ i18n.t('signin_screen.password', { locale: lang } )}
                secureTextEntry={true}
                styleInput={{ marginVertical: Metrics.baseMargin }}
                // onChangeText={value => this.setState({ password: value })}
                // for test
                onChangeText={value => this.setState({ password: value })}
              // end
              />
              <Button
                iconRight={nextButtonIcon}
                colorIcon={Colors.white}
                styleButton={{
                  backgroundColor: Colors.appColor,
                  borderRadius: Metrics.borderRadius
                }}
                styleText={{ color: Colors.white }}
                text={i18n.t('signin_screen.signin', { locale: lang } )}
                onPress={() => {
                  if (!this.validateEmail(this.state.email)) {
                    alert(i18n.t('signin_screen.invalid_email_address', { locale: lang } ));
                    return;
                  }
                  if (this.state.password == null || this.state.password == "") {
                    alert(i18n.t('signin_screen.password_empty', { locale: lang } ));
                    return;
                  }
                    this.makeRequest();
                }}
              />
              
              <TouchableOpacity
                style={[
                  AppStyles.center,
                  { marginVertical: Metrics.baseMargin }
                ]}
                onPress={() => { this.props.navigation.navigate("SignUpWithEmail") }}
              >
                <Text style={styles.subText}>
                {i18n.t('signin_screen.dont_have_an_account', { locale: lang } )}
              </Text>
                <Text style={[
                  styles.subText,
                  { fontWeight: "bold" }
                ]}>
                 {i18n.t('signin_screen.signup', { locale: lang } )}
              </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Spinner visible={this.state.loading} textContent={i18n.t('global.connecting', { locale: lang } )} textStyle={{ color: '#FFF' }} />
        <Toast ref="toast" />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Metrics.baseMargin
  },
  title: {
    ...Fonts.style.h3,
    ...Fonts.style.bold,
    color: Colors.black
  },
  text: {
    ...Fonts.style.large,
    color: Colors.black,
    textAlign: "center"
  },
  subText: {
    ...Fonts.style.medium,
    color: Colors.black,
    textAlign: "center"
  },
});
