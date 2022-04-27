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

import FormInput from '../../components/common/FormInput';
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

export default class NewsLetterScreen extends PureComponent {

  render() {
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
          image={require("../../resources/icons/back-right-arrow.png")}
          styleIcon={{ position: "absolute", zIndex: 1, top: Metrics.baseMargin, right: Metrics.baseMargin }}
          onPress={() => { this.props.navigation.navigate("SignIn") }}
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
            source={require("../../resources/launch/newsLetter.jpg")}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={styles.title}>
                NewsLetter
              </Text>
            </View>
            <Text style={styles.text}>
              Sign Up for newsletter,
            </Text>
            <Text style={styles.text}>
              tips, coupons, and more.
            </Text>
            <FormInput
              placeholder={"Enter email address"}
              styleInput={{ marginVertical: Metrics.baseMargin }}
            />
          </View>
          <Button
            iconRight={require("../../resources/icons/right-arrow.png")}
            colorIcon={Colors.white}
            styleButton={{
              backgroundColor: Colors.appColor,
              borderRadius: Metrics.borderRadius
            }}
            styleText={{ color: Colors.white }}
            text={"SUBSCRIBE"}
            onPress={() => { this.props.navigation.navigate("SignIn") }}
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
  text: {
    ...Fonts.style.large,
    color: Colors.black
  },
  subText: {
    ...Fonts.style.medium,
    color: Colors.black
  },
});
