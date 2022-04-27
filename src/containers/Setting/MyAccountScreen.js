import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView
} from 'react-native';
import Share from 'react-native-share';
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import SettingItem from "../../components/common/SettingItem";
import HeaderProfile from "../../components/Header/HeaderProfile";

import Config from '../../config';

var storage = require("react-native-local-storage");
export default class MyAccountScreen extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      lang: "",
      isRTL: false,
    };
  }

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
  
  share = () => {
    Share.open({
      url: Config.URL_PLAYSTORE
    })
  }

  render() {
    const {lang, isRTL} = this.state;
    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar 
          title={i18n.t('myaccount_screen.my_profile', { locale: lang })}
        />
        <ScrollView style={{ flex: 1,marginTop:15 }}>
          {/* <HeaderProfile /> */}
          <SettingItem
            icon={require('../../resources/icons/profile.png')}
            text={i18n.t('myaccount_screen.infomation', { locale: lang })}
            onPress={() => this.props.navigation.navigate("Profile")}
          />
          <SettingItem
            icon={require('../../resources/icons/address.png')}
            text={ i18n.t('myaccount_screen.addresses', { locale: lang })}
            onPress={() => this.props.navigation.navigate("Address")}
          />
          {/* <SettingItem
            icon={require('../../resources/icons/creditCard.png')}
            text={"Credit slips"}
            onPress={() => this.props.navigation.navigate("CardCredit")}
          /> */}
          <SettingItem
            icon={require('../../resources/icons/bell.png')}
            text={ i18n.t('myaccount_screen.my_alerts', { locale: lang })}
            onPress={() => this.props.navigation.navigate("Notification")}
          />
          <SettingItem
            icon={require('../../resources/icons/order.png')}
            text={ i18n.t('myaccount_screen.order_history', { locale: lang })}
            onPress={() => this.props.navigation.navigate("Order")}
          />
          
        </ScrollView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
});
