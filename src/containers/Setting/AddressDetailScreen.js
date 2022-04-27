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
import { GET_COUNTRY_URL, JSON_FORMAT, HEADER_ENCODED, COUNTRY_LIST, COUNTRY_LIST_AR, GET_ADDRESS_URL, PRE_OF_BODY_XML, END_OF_BODY_XML, POST_ADDRESS_URL } from '../../constants/constants';


var storage = require("react-native-local-storage");
export default class AddressDetailScreen extends PureComponent {
  state = {
    selected: false,
    countryPickerVisible: false,
    countryPickerSelectedItem: undefined,
    address: "",
    country: "",
    customer_id: "",

    alias: "",
    firstname: "",
    lastname: "",
    company: "",
    vatNumber: "",
    address1: "",
    address2: "",
    zipCode: "",
    city: "",
    phone: "",
    lang: "",
    isRTL: false,
  }

  componentDidMount(){
    address = this.props.navigation.state.params.address_item;
   this.setState({address : address});
   this.setState({
       alias: address.alias,
       firstname: address.firstname,
       lastname: address.lastname,
       company: address.company,
       vatNumber: address.vat_number,
       address1: address.address1,
       address2: address.address2,
       zipCode: address.postcode,
       city: address.city,
       country: address.country,
       phone: address.phone
   })
   this.getCountryName()


    storage.get('customer_id').then((customer_id) => {
        this.setState({customer_id: customer_id});
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

  getCountryName(){
    countryId = this.props.navigation.state.params.address_item.id_country;
    url = GET_COUNTRY_URL + countryId + JSON_FORMAT;
    this.setState({ loading: true });
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
    .then(res => res.json())
    .then(resJson => {
    this.setState({
        loading: false,
    })
        this.setState({country: resJson.country.name[0].value});

    }).catch(error => {
        this.setState({ error, loading: false });
        console.log(error);
    })
  }

  changeState(value) {
    this.setState({ selected: value });
  }

  shwoSelectCountryDlg() {
    this.setState({ countryPickerVisible: true });
    
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

  updateAddress(){

    if (this.state.alias == "") {
      alert( i18n.t('address_detail_screen.alias_valid', { locale: this.state.lang } ));
      return;
    };
    if (this.state.firstname == "") {
      alert( i18n.t('address_detail_screen.first_name_valid', { locale: this.state.lang } ));
      return;
    };
    if (this.state.lastname == "") {
      alert( i18n.t('address_detail_screen.last_name_valid', { locale: this.state.lang } ));
      return;
    };
    if (this.state.company == "") {
      alert( i18n.t('address_detail_screen.company_valid', { locale: this.state.lang } ));
      return;
    };
    if (this.state.vatNumber == "") {
      alert( i18n.t('address_detail_screen.vat_number_valid', { locale: this.state.lang } ));
      return;
    };
    if (this.state.address == "") {
      alert( i18n.t('address_detail_screen.adress_valid', { locale: this.state.lang } ));
      return;
    };
    if (this.state.addressComplement == "") {
      alert( i18n.t('address_detail_screen.address_complete_valid', { locale: this.state.lang } ));
      return;
    };
    if (this.state.zipCode == "") {
      alert( i18n.t('address_detail_screen.zip_code_valid', { locale: this.state.lang } ));
      return;
    };
    if (this.state.city == "") {
      alert( i18n.t('address_detail_screen.city_valid', { locale: this.state.lang } ));
      return;
    };
    if (this.state.country == "") {
      alert( i18n.t('address_detail_screen.contry_valid', { locale: this.state.lang } ));
      return;
    };
    if (this.state.phone == "") {
      alert( i18n.t('address_detail_screen.alias_valid', { locale: this.state.lang } ));
      return;
    };
    let num = this.state.phone.replace(".", '');
    if(isNaN(num)){
      alert( i18n.t('address_detail_screen.validate_phone_number', { locale: this.state.lang } ));
         return;
    }

      url = GET_ADDRESS_URL + this.state.address.id + JSON_FORMAT;
      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        },
      })
      .then(res => res.json())
      .then(resJson => { 
        this.getAddressBody(resJson);
      }).catch(error => {
        console.log(error);
      })
  }

  getAddressBody(address){
    preBody = address

    storage.get('countries').then((countries) => {
      console.log("selected country name = " + this.state.country);
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
      preBody.address.address1 = this.state.address1;
      preBody.address.address2 = this.state.address2;
      preBody.address.postcode = this.state.zipCode;
      preBody.address.city = this.state.city;
      preBody.address.phone = this.state.phone;
  
      var builder = new xml2js.Builder();
      var xml = builder.buildObject(preBody);
      xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
      const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
  
      this.putAddressRequest(bodyXML);

    });
  }

  putAddressRequest(body) {
      url = POST_ADDRESS_URL;
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
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
      }).catch(error => {
        console.log(error);
      })
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
          title={i18n.t('address_detail_screen.add_new_address', { locale: lang } )}
          back={true}
        />
        <View style={[
          AppStyles.center,
        ]}>
          <Icon
            width={80}
            tintColor={Colors.black}
            image={require("../../resources/icons/address.png")}
          />
          <Text style={styles.title}>
            {i18n.t('address_detail_screen.address_detail', { locale: lang } )}
          </Text>
        </View>

        <ScrollView
          keyboardShouldPersistTaps={true}>
          <View style={styles.containerForm}>
            <FormInput
              value = {this.state.alias}
              onChangeText={(text) => this.setState({alias: text})}
            />
            <FormInput
              value = {this.state.firstname}
              onChangeText={(text) => this.setState({firstname: text})}
            />
            <FormInput
              value = {this.state.lastname}
              onChangeText={(text) => this.setState({lastname: text})}
            />
            <FormInput
              value = {this.state.company}
              onChangeText={(text) => this.setState({company: text})}
            />
            <FormInput
              value = {this.state.vatNumber}
              onChangeText={(text) => this.setState({vatNumber: text})}
            />
            <FormInput
              value = {this.state.address1}
              onChangeText={(text) => this.setState({address1: text})}
            />
            <FormInput
              value = {this.state.address2}
              onChangeText={(text) => this.setState({address2: text})}
            />
            <FormInput
              keyboardType={'numeric'}
              value = {this.state.zipCode}
              onChangeText={(text) => this.setState({zipCode: text})}
            />
            <FormInput
              value = {this.state.city}
              onChangeText={(text) => this.setState({city: text})}
            />
            <FormInput
              identify={"country"}
              onFocus = {()=> {this.shwoSelectCountryDlg()}}
              value = {this.state.country}
            />
            <FormInput
                keyboardType={'numeric'}
                value = {this.state.phone}
                onChangeText={(text) => this.setState({phone: text})}
            />

            <SinglePickerMaterialDialog
                // title={'Select Country'}
                items={country_list.map((row, index) => ({ value: index, label: row }))}
                visible={this.state.countryPickerVisible}
                selectedItem={this.state.countryPickerSelectedItem}
                onCancel={() => {
                    this.setState({ countryPickerVisible: false });
                }}
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
            width: Metrics.deviceWidth,
            height: Metrics.navBarHeight
          }
          ]}>
          <Button
            styleButton={{ flex: 1, backgroundColor: Colors.appColor }}
            text={i18n.t('address_detail_screen.update_address', { locale: lang } )}
            styleText={{ color: Colors.white }}
            onPress={() => { this.updateAddress() }}
          />
          <Button
            styleButton={styles.buttonBack}
            styleText={{ color: Colors.black }}
            text={i18n.t('address_detail_screen.cancel', { locale: lang } )}
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
    marginHorizontal: Metrics.baseMargin,
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
