import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView
} from 'react-native';
import Share from 'react-native-share';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import SettingItem from "../../components/common/SettingItem";
import HeaderProfile from "../../components/Header/HeaderProfile";

import Config from '../../config';

export default class SettingScreen extends PureComponent {

  share = () => {
    Share.open({
      url: Config.URL_PLAYSTORE
    })
  }
  
  render() {

    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar 
          title={"My Profile"}
        />
        <ScrollView style={{ flex: 1 }}>
          <HeaderProfile />
          <SettingItem
            icon={require('../../resources/icons/profile.png')}
            text={"Edit profile"}
            onPress={() => this.props.navigation.navigate("Profile")}
          />
          <SettingItem
            icon={require('../../resources/icons/address.png')}
            text={"My Address"}
            onPress={() => this.props.navigation.navigate("Address")}
          />
          <SettingItem
            icon={require('../../resources/icons/creditCard.png')}
            text={"My card credit"}
            onPress={() => this.props.navigation.navigate("CardCredit")}
          />
          <SettingItem
            icon={require('../../resources/icons/bell.png')}
            text={"Notification"}
            onPress={() => this.props.navigation.navigate("Notification")}
          />
          <SettingItem
            icon={require('../../resources/icons/order.png')}
            text={"My order"}
            onPress={() => this.props.navigation.navigate("Order")}
          />
          <SettingItem
            icon={require('../../resources/icons/share.png')}
            text={"App Share"}
            onPress={() => { this.share() }}
          />
          <SettingItem
            icon={require('../../resources/icons/star.png')}
            text={"Rate Us"}
            onPress={() => { alert("Lien Store Application - Start") }}
          />
          <SettingItem
            icon={require('../../resources/icons/terms.png')}
            text={"Terms & Conditions"}
            onPress={() => this.props.navigation.navigate("Terms")}
          />
          <SettingItem
            icon={require('../../resources/icons/contact.png')}
            text={"Contact Us"}
            onPress={() => { alert("Lien Store Application - Contact US") }}
          />
          <SettingItem
            icon={require('../../resources/icons/info.png')}
            text={"About Us"}
            onPress={() => this.props.navigation.navigate("About")}
          />
          <SettingItem
            icon={require('../../resources/icons/logout.png')}
            text={"Log out"}
            onPress={() => this.props.navigation.navigate("SignUpWith")}
          />
        </ScrollView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
});
