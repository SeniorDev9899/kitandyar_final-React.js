import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import xml2js from 'react-native-xml2js'
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import FormInput from '../../components/common/FormInput';
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";
import SelectBox from "../../components/common/SelectBox";
import BackgroundGradient from "../../components/common/BackgroundGradient";

import {SinglePickerMaterialDialog} from 'react-native-material-dialog';
import { COUNTRY_LIST, COUNTRY_LIST_AR, POST_CART_URL, POST_ADDRESS_URL, HEADER_ENCODED, GET_ADDRESS_SCHEMA_URL, PRE_OF_BODY_XML, END_OF_BODY_XML } from '../../constants/constants';

var storage = require("react-native-local-storage");
export default class AddAddressScreen extends PureComponent {
  state = {
    selected: false,
    countryPickerVisible: false,
    countryPickerSelectedItem: undefined,

    customer_id: "",
    alias: "My Address",
    firstname: "",
    lastname: "",
    company: "",
    vatNumber: "",
    address: "",
    addressComplement: "",
    zipCode: "",
    city: "",
    country: "",
    phone: "",
    firstname_color:Colors.light_gray,
    lastname_color:Colors.light_gray,
    address_color:Colors.light_gray,
    zipCode_color:Colors.light_gray,
    city_color:Colors.light_gray,
    country_color:Colors.light_gray,
    addressSchema: "",
    preBody: "",

    bodyXML: "",
    lang: "",
    isRTL: false,

  }

  componentDidMount(){
    this.getAddressSchema();

    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });

    storage.get('customer_id').then((customer_id) => {
        this.setState({customer_id: customer_id});
    });
    storage.get('customer_firstname').then((customer_firstname) => {
      this.setState({firstname: customer_firstname});
    });
    storage.get('customer_lastname').then((customer_lastname) => {
      this.setState({lastname: customer_lastname});
    });
  }

  componentDidFocus(){
    console.log("component Did Focus calling...");
  }

  getAddressSchema(){

    url = GET_ADDRESS_SCHEMA_URL;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
    })
    .then(res => res.json())
    .then(resJson => { 
        this.setState({addressSchema: resJson});
    }).catch(error => {
      console.log(error);
    })

  }

  postAddress(){

    // if (this.state.alias == "") {
    //   alert("Please add your address's alias!");
    //   return;
    // };
    if (this.state.firstname == "") {
      // alert("Please add your First Name!");
      this.setState({firstname_color:Colors.red,
        lastname_color:Colors.light_gray,
        address_color:Colors.light_gray,
        zipCode_color:Colors.light_gray,
        city_color:Colors.light_gray,
        country_color:Colors.light_gray,});
      return;
    };
    if (this.state.lastname == "") {
      // alert("Please add your Last Name!");
      this.setState({lastname_color:Colors.red,
        lastname_color:Colors.light_gray,
        address_color:Colors.light_gray,
        zipCode_color:Colors.light_gray,
        city_color:Colors.light_gray,
        country_color:Colors.light_gray,});
      return;
    };
    // if (this.state.company == "") {
    //   alert("Please add your Company!");
    //   return;
    // };
    // if (this.state.vatNumber == "") {
    //   alert("Please add your address's VAT number!");
    //   return;
    // };
    if (this.state.address == "") {
      // alert("Please add your Address!");
      this.setState({address_color:Colors.red,
        firstname_color:Colors.light_gray,
        lastname_color:Colors.light_gray,
        zipCode_color:Colors.light_gray,
        city_color:Colors.light_gray,
        country_color:Colors.light_gray,});
      return;
    };
    // if (this.state.addressComplement == "") {
    //   alert("Please add your Address Complete!");
    //   return;
    // };
    if (this.state.zipCode == "") {
      // alert("Please add your address's Zip code!");
      this.setState({zipCode_color:Colors.red,
        firstname_color:Colors.light_gray,
        lastname_color:Colors.light_gray,
        address_color:Colors.light_gray,
        city_color:Colors.light_gray,
        country_color:Colors.light_gray,});
      return;
    };
    if (this.state.city == "") {
      // alert("Please add your city!");
      this.setState({city_color:Colors.red,
        firstname_color:Colors.light_gray,
        lastname_color:Colors.light_gray,
        address_color:Colors.light_gray,
        zipCode_color:Colors.light_gray,
        country_color:Colors.light_gray,});
      return;
    };
    if (this.state.country == "") {
      // alert("Please select your country!");
      this.setState({country_color:Colors.red,
        firstname_color:Colors.light_gray,
        lastname_color:Colors.light_gray,
        address_color:Colors.light_gray,
        zipCode_color:Colors.light_gray,
        city_color:Colors.light_gray});
      return;
    };
    // if (this.state.phone == "") {
    //   alert("Please add your phone number!");
    //   return;
    // };
    let num = this.state.phone.replace(".", '');
    if(isNaN(num)){
         alert( i18n.t('add_address_screen.incorrect_password', { locale: this.state.lang } ));
         return;
    }
    
    preBody = this.state.addressSchema;
    if (this.state.customer_id != null){
      preBody.address.id_customer = this.state.customer_id;
    } else {
      preBody.address.id_customer = 0;
    }

    storage.get('countries').then((countries) => {
      for (let cn of countries) {
        if (this.state.country == cn.name[0].value) {
          preBody.address.id_country = cn.id;
          break;
        }
      }

      preBody.address.alias = this.state.alias;
      preBody.address.firstname = this.state.firstname;
      preBody.address.lastname = this.state.lastname;
      preBody.address.company = this.state.company;
      preBody.address.vat_number = this.state.vatNumber;
      preBody.address.address1 = this.state.address;
      preBody.address.address2 = this.state.addressComplement;
      preBody.address.postcode = this.state.zipCode;
     
      preBody.address.city = this.state.city;
      preBody.address.phone = this.state.phone;
  
      this.setState({preBody: preBody});
  
      var builder = new xml2js.Builder();
      var xml = builder.buildObject(preBody);
      xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
      const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
      console.log("address_post_body", bodyXML);
      if(this.state.customer_id != null) {
        url = POST_ADDRESS_URL;
        console.log("address url = " + url);
        fetch(url, {
          method: "POST",
          headers: {
            'Authorization': 'Basic ' + HEADER_ENCODED
          },
          body: bodyXML,
        })
        .then(res => res.json())
        .then(resJson => { 
          console.log("addaddress",resJson);
          storage.save('delivery_address', resJson.address);
          storage.save('invoice_address', resJson.address);
          storage.save('country_id', resJson.address.id_country);
          this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack();
        }).catch(error => {
          console.log(error);
        })
      } else {
        storage.get('addresses').then((addresses) => {
          if(addresses != null) {
            addresses.push(this.state.preBody.address);
            storage.save('addresses', addresses);
          } else {
            _addresses = [];
            _addresses.push(this.state.preBody.address);
            storage.save('addresses', _addresses);
          }
          this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack();
         
        });
      }
    });
  }

  changeState(value) {
    this.setState({ selected: value });
  }

  shwoSelectCountryDlg() {
    this.setState({ countryPickerVisible: true });
  }

  render() {
    const {lang, isRTL} = this.state;
    
    if(lang == 'ar') country_list = COUNTRY_LIST;
    else country_list = COUNTRY_LIST_AR;

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
          title={i18n.t('add_address_screen.add_new_address', { locale: lang } )}
          back={true}
        />
        <View style={[
          styles.containerHeader,
          AppStyles.center
        ]}>
        </View>
        {/* <View style={[
          AppStyles.center,
          { flex: 1 }
        ]}>
          <Icon
            width={80}
            tintColor={Colors.black}
            image={require("../../resources/icons/address.png")}
          />
          <Text style={styles.title}>
            Address Details
          </Text>
        </View> */}

        <ScrollView
        keyboardShouldPersistTaps={true}>
          <View style={styles.containerForm}>

            <FormInput
              placeholder={i18n.t('add_address_screen.alias', { locale: lang } )}
              onChangeText={(text) => this.setState({alias: text})}
            />
            <FormInput
              placeholder={i18n.t('add_address_screen.first_name', { locale: lang } )}
              value = {this.state.firstname}
              styleInput={{borderColor: this.state.firstname_color}}
              onChangeText={(text) => this.setState({firstname: text})}
            />
            <FormInput
              placeholder={ i18n.t('add_address_screen.last_name', { locale: lang } )}
              value = {this.state.lastname}
              styleInput={{borderColor: this.state.lastname_color}}
              onChangeText={(text) => this.setState({lastname: text})}
            />
            <FormInput
              placeholder={ i18n.t('add_address_screen.company', { locale: lang } )}
              onChangeText={(text) => this.setState({company: text})}
            />
            <FormInput
              placeholder={ i18n.t('add_address_screen.vat_number', { locale: lang } )}
              onChangeText={(text) => this.setState({vatNumber: text})}
            />
            <FormInput
              placeholder={ i18n.t('add_address_screen.address', { locale: lang } )}
              styleInput={{borderColor: this.state.address_color}}
              onChangeText={(text) => this.setState({address: text})}
            />
            <FormInput
              keyboardType={'numeric'}
              placeholder={ i18n.t('add_address_screen.address_complement', { locale: lang } )}
              onChangeText={(text) => this.setState({addressComplement: text})}
            />
            <FormInput
              placeholder={i18n.t('add_address_screen.zip_code', { locale: lang } )}
              styleInput={{borderColor: this.state.zipCode_color}}
              onChangeText={(text) => this.setState({zipCode: text})}
            />
            <FormInput
              placeholder={i18n.t('add_address_screen.city', { locale: lang } )}
              styleInput={{borderColor: this.state.city_color}}
              onChangeText={(text) => this.setState({city: text})}
            />

            <FormInput
              identify={"true"}
              placeholder={ i18n.t('add_address_screen.country', { locale: lang } )}
              styleInput={{borderColor: this.state.country_color}}
              onFocus = {()=>{this.shwoSelectCountryDlg()}}
              value = {this.state.country}
            />
            <FormInput
              keyboardType={'numeric'}
              placeholder={ i18n.t('add_address_screen.phone', { locale: lang } )}
              onChangeText={(text) => this.setState({phone: text})}
            />

            <SinglePickerMaterialDialog
                // title={'Select Country'}
                items={country_list.map((row, index) => ({ value: index, label: row }))}
                visible={this.state.countryPickerVisible}
                selectedItem={this.state.countryPickerSelectedItem}
                onCancel={() => this.setState({ countryPickerVisible: false })}
                onOk={result => {
                    this.setState({ countryPickerVisible: false });
                    this.setState({ countryPickerSelectedItem: result.selectedItem });
                    this.setState({country: result.selectedItem.label});
                }}
                scrolled={true}
            />  
          
            {/* <View style={[
              AppStyles.row,
              { marginVertical: Metrics.smallMargin }
            ]}>
              <SelectBox
                selected={selected === true}
                onPress={() => this.changeState(!selected)}
              />
              <Text style={styles.description}>
                Default Address
              </Text>
            </View> */}

          </View>
        </ScrollView>

        <View style={[
          AppStyles.row,
          {
          
          }
          ]}>
          <Button
            styleButton={{ flex: 1, backgroundColor: Colors.appColor }}
            text={i18n.t('add_address_screen.add_address', { locale: lang } )}
            styleText={{ color: Colors.white }}
            onPress={() => { this.postAddress() }}
          />
          <Button
            styleButton={styles.buttonBack}
            styleText={{ color: Colors.black }}
            text={ i18n.t('add_address_screen.cancel', { locale: lang } )}
            onPress={() => { this.props.navigation.goBack() }}
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  containerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    paddingVertical: 30
  },
  containerForm: {
    flex: 2,
    marginHorizontal: Metrics.baseMargin
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black,
    marginTop: Metrics.baseMargin
  },
  buttonBack: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    backgroundColor: Colors.lightBg_gray
  },
  description: {
    ...Fonts.style.medium,
    color: Colors.black,
  },
});
