import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Image
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import xml2js from 'react-native-xml2js'
import Spinner from 'react-native-loading-spinner-overlay';
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import Button from "../../components/common/Button";
import FormInput from '../../components/common/FormInput';
import CardItem from "../../components/card/CardItem";

import { Carriers } from '../../data/Carriers';
import Config from '../../config';
import { HEADER_ENCODED, POST_ORDER_URL, GET_ORDER_SCHEMA_URL, PRE_OF_BODY_XML, END_OF_BODY_XML, GET_Carrier_SCHEMA_URL, GET_CARRIER_SCHEMA_URL, POST_CARRIER_URL } from '../../constants/constants';
import CarrierItem from '../../components/cart/CarrierItem';
import {LABELS, LABELS_AR} from '../../constants/constants';

var storage = require("react-native-local-storage");
const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

export default class CarrierScreen extends PureComponent {

  state = {
    currentPosition: 2, 
    carrier: "",
    carrierSchema: JSON,
    lang: "",
    isRTL: false,
  };

  componentDidMount(){
    this.getCarrierSchema();
    this.setState({carrier: Carriers[0]});
    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });
  }

  getCarrierSchema(){
    this.setState({loading: true});
    url = GET_CARRIER_SCHEMA_URL;
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      },
    })
    .then(res => res.json())
    .then(resJson => { 
        this.setState({loading: false});
        this.setState({carrierSchema: resJson});
    }).catch(error => {
      console.log(error);
    })

  }

  postCarrier(){

      // this.props.navigation.navigate("Payement", {carrierId: 20, address: this.props.navigation.state.params.address});
      this.props.navigation.navigate("Payement", {carrierId: 215, address: this.props.navigation.state.params.address});

      ///------- please add delay item in body.
    //  body = this.getCarrierBody()
    //   console.log('carrier body = ');
    //   console.log(body);

    //   this.setState({loading: true});
    //   url = POST_CARRIER_URL;
    //   console.log('carrier_order_url = ' + url);
    //   this.setState({loading: true});
    //   fetch(url, {
    //     method: "POST",
    //     headers: {
    //       'Authorization': 'Basic ' + HEADER_ENCODED
    //     },
    //     body: body,
    //   })
    //   .then(res => res.json())
    //   .then(resJson => { 
    //     console.log('success.. carrier_id = ', resJson);
    //     this.setState({loading: false});
    //     this.props.navigation.navigate("Payement", {carrierId: resJson.carrier.id, address: this.props.navigation.state.params.address});
    //   }).catch(error => {
    //     this.setState({loading: false});
    //     console.log(error);
    //   })
  }

  getCarrierBody(){
    
    preBody = this.state.carrierSchema;
    preBody.carrier.name = this.state.carrier.name;
    preBody.carrier.deleted = 1;
    preBody.carrier.is_module = 0;
    preBody.carrier.id_tax_rules_group = 0;
    preBody.carrier.id_reference = 2;
    preBody.carrier.shipping_handling = 1;
    preBody.carrier.active = 1;
   
    delete  preBody.carrier.delay;
    preBody.carrier.delay = {};
    preBody.carrier.delay.language = [];

    language1 = {}
    language1['$'] = {id: 1}
    language1['_'] = this.state.carrier.delay;
    language2 = {}
    language2['$'] = {id: 4};
    language2['_'] = this.state.carrier.delay;

    preBody.carrier.delay.language.push(language1);
    preBody.carrier.delay.language.push(language2);

    console.log(preBody);

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(preBody);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '').trim();
    const bodyXML = PRE_OF_BODY_XML + xml + END_OF_BODY_XML;
    
   console.log(bodyXML);
    return bodyXML;
  }

 
  render() {

    const {
      currentPosition = 2, 
      carrier,
      lang,
      isRTL
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
          title={ i18n.t('carrier_screen.mode_payment', { locale: lang } )}
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
            <Text style={styles.title}>{i18n.t('carrier_screen.your_carrier', { locale: lang } )}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              style={{
                marginTop: Metrics.baseMargin,
                backgroundColor: Colors.transparent
              }}
              data={Carriers}
              keyExtractor={this._keyExtractor}
              renderItem={({ item }) => <CarrierItem
                selected={carrier.id === item.id} 
                item={item}
                // height={60}
                onPress={() => { this.setState({ carrier: item }) }}
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
            text={i18n.t('carrier_screen.back', { locale: lang } )}
            onPress={() => { this.props.navigation.goBack() }}
          />
          <Button
            iconRight={nextButtonIcon}
            colorIcon={Colors.white}
            styleButton={{ flex: 1, backgroundColor: Colors.appColor }}
            styleText={{ color: Colors.white }}
            text={i18n.t('carrier_screen.next_step', { locale: lang } )}
            onPress={() => { this.postCarrier() }}
          />
        </View>
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
  }
});
