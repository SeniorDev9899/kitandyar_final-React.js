import React, { PureComponent } from 'react';
import { NavigationActions } from 'react-navigation';

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
  Image,
  Platform
} from 'react-native';
import xml2js from 'react-native-xml2js'
import Moment from 'moment';

import FormInput from '../../components/common/FormInput';
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import { SIGNIN_URL, SCHEMA_BLANK, JSON_FORMAT, FULL_JSON_FORMAT, HEADER_ENCODED, PRE_OF_BODY_XML, END_OF_BODY_XML } from '../../constants/constants';

var sha1 = require('sha1');
const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");
const LEFT_BACK_ICON = require("../../resources/icons/back-left-arrow.png");
const RIGHT_BACK_ICON = require("../../resources/icons/back-right-arrow.png");

export default class PasswordForgotScreen extends PureComponent {

  state = {
    email: "",
    lang: "",
    isRTL: false,
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  componentDidMount(){
    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });
  }

  onPressSendEmailButton(){
    if (!this.validateEmail(this.state.email)) {
      alert(i18n.t('forgot_password_screen.invalid_email_address', { locale: lang } ));
      return;
    }

    const url = SIGNIN_URL + "?display=full&filter[email]=" + this.state.email + "&output_format=JSON";
    // this.setState({ loading: true });

    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
    .then(res => res.json())
    .then(resJson => {
      console.log("customer schema = ", resJson);
      this.updatePassword(resJson);
      
    }).catch(error => {
      this.setState({ error, loading: false });
      console.log("schema error of customer = ", error);
    })

  }

  updatePassword(schema){
    body = this.getCustomerBodyForUpdatePassword(schema);
    console.log("body xml = ", body);

    const url = SIGNIN_URL + schema.id + FULL_JSON_FORMAT;
    fetch(url, {
      method: "PUT",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
      body: body,
    })
    .then(res => res.json())
    .then(resJson => {

      console.log("customer updated password = ",resJson);
      //this.props.navigation.navigate("SignIn");
      
    }).catch(error => {
      this.setState({ error, loading: false });
      console.log("updated password customer error  = ",error);
    })
  }

  getCustomerBodyForUpdatePassword(schema){
    preBody = schema.customers[0];

    currentTime =  new Date().toLocaleString();
    preBody.reset_password_token = sha1(currentTime + preBody.secure_key);

    Moment.locale('en');
    validateTime = new Date();
    validateTime.setHours(validateTime.getHours() + 24);
    validateTimeWithFormat = Moment(validateTime).format('YYYY-MM-DD HH:mm:ss');
    preBody.reset_password_validity = validateTimeWithFormat;

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(preBody);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
 
    return bodyXML;
  }

  render() {

    const {lang, isRTL} = this.state;
    let nextButtonIcon =  isRTL ? LEFT_ICON : RIGHT_ICON;
    let backButtonIcon = isRTL ? RIGHT_BACK_ICON : LEFT_BACK_ICON;

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
        <Icon
          width={40}
          tintColor={Colors.black}
          image={backButtonIcon}
          styleIcon={{ position: "absolute", zIndex: 1, top: Metrics.baseMargin, left: Metrics.baseMargin }}
          onPress={() => { this.props.navigation.goBack() }}
        />
        <View style={styles.container}>
          <Image
            resizeMode={'cover'}
            style={[
              {
                width: Metrics.deviceWidth - Metrics.baseMargin * 2,
                height: (Metrics.deviceHeight * 0.6) - Metrics.smallMargin
              }
            ]}
            source={require("../../resources/launch/forgetPassword.jpg")}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={styles.title}>
                { i18n.t('forgot_password_screen.create_new_password', { locale: lang }) }
             </Text>
            </View>
            <Text style={styles.description}>
              { i18n.t('forgot_password_screen.reset_password_content', { locale: lang }) }
            </Text>
            <FormInput
              placeholder={i18n.t('forgot_password_screen.enter_email_address', { locale: lang })}
              styleInput={{ marginVertical: Metrics.baseMargin }}
              onChangeText={(text) => this.setState({email: text})}
            />
          </View>
          <Button
            iconRight={nextButtonIcon}
            colorIcon={Colors.white}
            styleButton={{
              backgroundColor: Colors.appColor,
              borderRadius: Metrics.borderRadius
            }}
            styleText={{ color: Colors.white }}
            text={ i18n.t('forgot_password_screen.send_reset_link', { locale: lang }) }
            // onPress={() => this.onPressSendEmailButton()}
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Metrics.baseMargin,
    marginVertical: Metrics.doubleBaseMargin
  },
  title: {
    ...Fonts.style.h3,
    ...Fonts.style.bold,
    color: Colors.black
  },
  description: {
    ...Fonts.style.medium,
    color: Colors.black,
    marginVertical: Metrics.baseMargin
  },
});
