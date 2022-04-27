import React, { PureComponent } from 'react';
import { NavigationActions } from 'react-navigation';

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import xml2js from 'react-native-xml2js'
import Moment from 'moment';
import i18n from '../../helpers/I18n/I18n';

import FormInput from '../../components/common/FormInput';
import Button from "../../components/common/Button";
import SelectBox from "../../components/common/SelectBox";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Modal from 'react-native-modal';
import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import { GET_CUSTOMER_SCHEMA_URL, HEADER_ENCODED, POST_CUSTOMER_URL, PRE_OF_BODY_XML, END_OF_BODY_XML, GET_GUEST_URL, JSON_FORMAT, GET_CART_URL, POST_CART_URL, POST_GUEST_URL } from '../../constants/constants';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Spinner from 'react-native-loading-spinner-overlay';

var storage = require("react-native-local-storage");
var dateFormat = require('dateformat');

const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

export default class GuestSignUpScreen extends PureComponent {

  state = {
    loading:false,
    selectedTerm1: false,
    selectedTerm2: false,
    socialTitle: 'Mr',
    isDateTimePickerVisible: false,
    modalVisible: false,
    customerSchema: "",
    guestSchema:"",
    customerId: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    birthDate: "",
    lang: "",
    isRTL: false,
  }

  
  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  componentDidMount(){
    this.setState({lang:"en"})
    // storage.get('lang').then((lang) => {
    //   if (lang != null) {
    //     this.setState({lang: lang});
    //     if (lang == 'ar') {
    //       this.setState({isRTL: true});
    //     }
    //   }
    // });
  }

  changeStateTerm1(value) {
    this.setState({ selectedTerm1: value });
  }

  changeStateTerm2(value) {
    this.setState({ selectedTerm2: value });
  }

  _showDateTimePicker()
  {
    this.setState({ isDateTimePickerVisible: true });
  }
 
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
 
  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);     
    this.setState({birthDate:dateFormat(date, "mm/dd/yyyy").toString()});
    this._hideDateTimePicker();
  };

  onPressSignupButton(){
    this.getCustomerSchema();
  }
  onPressSuccessButton(){
    this.setState({modalVisible: false});
    this.updateCartWithCustomerId(this.state.customerId);

  }
  getGuestSchema(customerId){
      storage.get('guest_id').then((guestId) => {
          url = GET_GUEST_URL + guestId + "/?"+ JSON_FORMAT;
          fetch(url, {
            method: "GET",
            headers: {
              'Authorization': 'Basic ' + HEADER_ENCODED
            },
          })
          .then(res => res.json())
          .then(resJson => { 
              this.getGuestBodyForUpdate(resJson, customerId);
              // storage.save('guest', resJson.guest);
              // this.props.navigation.navigate("Delivery" );
          }).catch(error => {
            this.setState({loading:false});
            console.log(error);
          })
      
    });
  }

  getGuestBodyForUpdate(temp, customerId){
    temp.guest.id_customer = customerId;

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(temp);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
    console.log("bodyxml",bodyXML)
    this.putGuestRequest(bodyXML);
  }

  putGuestRequest(body) {

    console.log("body",body);
    url = POST_GUEST_URL;
    fetch(url, {
      method: "PUT",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
      body: body,
    })
      .then(res => res.json())
      .then(resJson => {
        // storage.save('guest', resJson.guest);
        console.log("updated guest = ", resJson);
        // this.setState({loading: false });

      }).catch(error => {
        this.setState({loading: false });
        console.log(error);
      })
  }

  getCustomerSchema(){

    if (!this.validateEmail(this.state.email)) {
      alert(i18n.t('signup_screen.invalid_email_address', { locale: lang } ));
      return;
    }

    if (this.state.selectedTerm1 == false || this.state.selectedTerm1 == ""){
      return;
    }

    if (this.state.selectedTerm2 == false || this.state.selectedTerm2 == ""){
      return;
    }
    this.setState({loading:true});
    url = GET_CUSTOMER_SCHEMA_URL;
    console.log(url);
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
    })
    .then(res => res.json())
    .then(resJson => { 
        this.setState({customerSchema: resJson});
        this.postCustomer();
    }).catch(error => {
      this.setState({loading:false});
      console.log(error);
    });
    //   storage.get('guest_id').then((guestId) => {
    //       alert(guestId);
    //       url = GET_GUEST_URL + guestId + "/?"+ JSON_FORMAT;
    //       console.log("get_Guest",url);
    //       fetch(url, {
    //         method: "GET",
    //         headers: {
    //           'Authorization': 'Basic ' + HEADER_ENCODED
    //         },
    //       })
    //       .then(res => res.json())
    //       .then(resJson => { 
    //           this.setState({customerSchema: resJson});
    //           storage.save('guest', resJson.guest);
              
    //           // storage.save('cart_id', null);
    //           // storage.save('cart_price', null);
    //           // storage.save('cart', null);
    //           // storage.save('addresses', null);
    //           // storage.save('guest', null);
    //           // storage.save('guest_id', null);

    //           // please add put guest part.
    //           // seem like signin already. on UI.

    //           // this.props.navigation.navigate("Delivery" );
    //       }).catch(error => {
    //         console.log(error);
    //       })
      
    // });
  }

  postCustomer(){
    body = this.getCustomerBody()
    console.log(body);
    url = POST_CUSTOMER_URL;
    fetch(url, {
      method: "POST",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
      body: body,
    })
    .then(res => res.json())
    .then(resJson => { 
        customer = resJson.customer;
        storage.save('customer_id', customer.id);
        storage.save('secure_key', customer.secure_key);
        storage.save('email', customer.email);
        storage.save('customer_firstname',customer.firstname);
        storage.save('customer_lastname',customer.lastname);
        // storage.save('cart_id', null);
        // storage.save('cart_price', null);
        // storage.save('cart', null);
        // storage.save('addresses', null);
        // storage.save('guest', null);
        // storage.save('guest_id', null);

          // this.getGuestSchema(customer.id);
          this.setState({customerId: customer.id});
          this.setState({modalVisible: true});
          // this.updateCartWithCustomerId(customerId);

        // this.postCart();
        // this.props.navigation.dispatch(NavigationActions.reset({
        //     index: 0,
        //     key: null,
        //     actions: [NavigationActions.navigate({ routeName: 'Home' })]

        // }))

        // this.props.navigation.navigate('DrawerClose');
        // this.props.navigation.navigate("OutHome");

    }).catch(error => {
      this.setState({loading:false});
      console.log(error);
    })
}

getCustomerBody(){
 
  preBody = this.state.customerSchema;
  if (this.state.socialTitle == 'Mr') {
    preBody.customer.id_gender = 1;
  } else {
    preBody.customer.id_gender = 2;
  }

  birthdate = this.state.birthDate;
  words = birthdate.split("/");
  birthdate = words[2] + "-" + words[0] + "-" + words[1];

  preBody.customer.email = this.state.email;
  preBody.customer.firstname = this.state.firstName;
  preBody.customer.lastname = this.state.lastName;
  preBody.customer.birthday = birthdate;
  preBody.customer.passwd = this.state.password;
  preBody.customer.optin = 1;
  preBody.customer.active = 1;
  preBody.customer.id_default_group = 2;
  preBody.customer.is_guest=1;
  // preBody.customer.passwd = "$2y$10$TSlBKfgPAgBEOXpcqtoVHemhtzx6gHptpYuxiUjwy92daKCdrJSMy";
  delete preBody.customer.associations.groups[0];

  var builder = new xml2js.Builder();
  var xml = builder.buildObject(preBody);
  xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
  const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;

  return bodyXML;
}

updateCartWithCustomerId(customerId) {
  console.log("updatecartwithcustomer ...");
  storage.get('cart_id').then((cartId) => {
    console.log("cartId= " + cartId);
    if(cartId != null) {
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
         this.getCartBodyForUpdate(resJson, customerId);
        
      }).catch(error => {
        this.setState({loading:false});
        console.log(error);
      })
    } else {
     // this.postCart();
      this.setState({loading:false});
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

  console.log("temp",temp);
  console.log("length",temp.cart.associations.cart_rows.length);
  existCartRow = false;
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
  temp.cart.id_customer = customerId;

  var builder = new xml2js.Builder();
  var xml = builder.buildObject(temp);
  xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
  const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
  console.log("bodyxml",bodyXML)
  this.putCartRequest(bodyXML);

}

putCartRequest(body) {
  this.setState({loading: false });
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
      storage.save('cart', resJson);
      console.log("updated cart = ", resJson);
      this.setState({loading: false });
      this.navigationFromSign();


    }).catch(error => {
      this.setState({loading: false });
      console.log(error);
    })
    this.setState({loading:false});
}

navigationFromSign(){
    this.setState({loading:false});
    console.log("success from home");
    this.props.navigation.navigate('DrawerClose');
    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'OutHome' })]
    }))
}

  render() {

    const { selectedTerm1, selectedTerm2, lang, isRTL } = this.state;
    var radio_props = [
      {label: 'Mr.', value: 0 },
      {label: 'Mrs.', value: 1 }
    ];

    let nextButtonIcon =  isRTL ? LEFT_ICON : RIGHT_ICON;

    return (
      <ScrollView
        keyboardShouldPersistTaps={true}
        style={[
          AppStyles.mainContainer,
          { paddingTop: 0 }
        ]}
      >
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <View style={{ height: 100, justifyContent: "center" }}>
              <Text style={styles.title}>
                {i18n.t('signup_guest_screen.signup_as', { locale: lang } )}
              </Text>
              <Text style={styles.title}>
                {i18n.t('signup_guest_screen.a_guest', { locale: lang } )}
              </Text>
            </View>
            <View style={[
              {
                flex: 1,
                marginVertical: Metrics.baseMargin
              }
            ]}>
              <Text style={styles.description}>
                {i18n.t('signup_guest_screen.signup_using_email_address', { locale: lang } )}
              </Text>
            </View>

            <View>
              <View style={{flexDirection: 'row', marginLeft: 20}}>
                <Text style={{fontWeight: 'bold', color: Colors.black, marginTop: 5}}>Social Title</Text>
                <RadioForm
                  style={{marginLeft: 20}}
                  radio_props={radio_props}
                  initial={0}
                  formHorizontal={true}
                  buttonColor={'#000000'}
                  selectedButtonColor={'#000000'}
                  onPress={(value) => this.setState({socialTitle: value})}
                />
              </View>
              <FormInput
                placeholder={i18n.t('signup_guest_screen.email_address', { locale: lang } )}
                styleInput={{ marginTop: Metrics.smallMargin }}
                onChangeText={(text) => this.setState({email: text})}
              />
              <FormInput
                placeholder={i18n.t('signup_guest_screen.first_name', { locale: lang } )}
                styleInput={{ marginVertical: Metrics.smallMargin }}
                onChangeText={(text) => this.setState({firstName: text})}
              />
              <FormInput
                placeholder={i18n.t('signup_guest_screen.last_name', { locale: lang } )}
                styleInput={{ marginVertical: Metrics.smallMargin }}
                onChangeText={(text) => this.setState({lastName: text})}
              />
              <FormInput
                secureTextEntry={true}
                placeholder={i18n.t('signup_guest_screen.password', { locale: lang } )}
                styleInput={{ marginVertical: Metrics.smallMargin }}
                onChangeText={(text) => this.setState({password: text})}
              />
              <FormInput
                // identify={"true"}
                placeholder={i18n.t('signup_guest_screen.birthdate', { locale: lang } )}
                styleInput={{ marginVertical: Metrics.smallMargin }}
                // onFocus = {()=> {this._showDateTimePicker()}}
                onChangeText={(text) => this.setState({birthDate: text})}
                value = {this.state.birthDate}
              />
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                format='DD/MM/YYYY'
              />
              <Text style={styles.titleBlock}>
                {i18n.t('signup_guest_screen.contact_preferences', { locale: lang } )}:
              </Text>
              <View style={[
                AppStyles.row,
                { marginVertical: Metrics.smallMargin }
              ]}>
                <SelectBox
                  selected={selectedTerm1 === true}
                  onPress={() => this.changeStateTerm1(!selectedTerm1)}
                />
                <Text style={[styles.description, {paddingRight: 20}]}>
                  {i18n.t('signup_guest_screen.contact_preferences_content_1', { locale: lang } )}
                </Text>
              </View>

              <View style={[
                AppStyles.row,
                { marginVertical: Metrics.smallMargin }
              ]}>
                <SelectBox
                  selected={selectedTerm2 === true}
                  onPress={() => this.changeStateTerm2(!selectedTerm2)}
                />
                <Text style={[styles.description, {paddingRight: 20}]}>
                  {i18n.t('signup_guest_screen.contact_preferences_content_2', { locale: lang } )}
                </Text>

              </View>

              <Button
                iconRight={nextButtonIcon}
                colorIcon={Colors.white}
                styleButton={{
                  backgroundColor: Colors.appColor,
                  borderRadius: Metrics.borderRadius,
                  marginVertical: Metrics.smallMargin
                }}
                styleText={{ color: Colors.white }}
                text={i18n.t('signup_guest_screen.join_kitandyar', { locale: lang } )}
                // onPress={() => { this.props.navigation.navigate("Tab") }}
                // reset navigation stack
                onPress={() => this.onPressSignupButton()}
              />
            </View>
          </View>
        </View>
        <Spinner visible={this.state.loading} />
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
            <Text style={{textAlign: 'center', marginTop: 40, marginLeft: 30, marginRight: 30, fontSize: 16}}> You are Registered successfully. </Text>
            <View style={{flexDirection: 'row',marginTop: 20}}>
              <TouchableOpacity onPress={() => this.onPressSuccessButton()}>
                <View style={styles.button}>
                <Text>
                {i18n.t('signup_guest_screen.success', { locale: lang } )}
                </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView >
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
  titleBlock: {
    ...Fonts.style.medium,
    ...Fonts.style.bold,
    color: Colors.dark_gray
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
  description: {
    ...Fonts.style.medium,
    color: Colors.black,
     marginRight: 20
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
