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
  Platform
} from 'react-native';

import FormInput from '../../components/common/FormInput';
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";
import Hr from "../../components/common/Hr";

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

export default class SignUpWithScreen extends PureComponent {

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
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <View style={{ height: 100, justifyContent: "center" }}>
              <Text style={styles.title}>
                Sign Up With
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.text}>
                Sign In
              </Text>
              <Text style={styles.text}>
                with your social account
              </Text>
              <View style={[
                { marginVertical: Metrics.baseMargin }
              ]}>
                <Button
                  iconLeft={require("../../resources/icons/facebook.png")}
                  widthIcon={(Platform.OS === 'ios') ? 50 : 30}
                  styleButton={{
                    backgroundColor: Colors.facebook,
                    borderRadius: Metrics.borderRadius,
                    borderWidth: 1,
                    borderColor: Colors.facebook,
                    marginTop: Metrics.baseMargin
                  }}
                  styleText={{ color: Colors.white, fontWeight: "bold" }}
                  text={"FACEBOOK"}
                  onPress={() => { alert("SignUp with Facebook") }}
                />
                <Button
                  iconLeft={require("../../resources/icons/google.png")}
                  widthIcon={(Platform.OS === 'ios') ? 50 : 30}
                  styleButton={{
                    backgroundColor: Colors.google,
                    borderRadius: Metrics.borderRadius,
                    borderWidth: 1,
                    borderColor: Colors.google,
                    marginTop: Metrics.baseMargin
                  }}
                  styleText={{ color: Colors.white, fontWeight: "bold" }}
                  text={"GOOGLE"}
                  onPress={() => { alert("SignUp with Google") }}
                />
                <Button
                  iconLeft={require("../../resources/icons/twitter.png")}
                  widthIcon={(Platform.OS === 'ios') ? 50 : 30}
                  styleButton={{
                    backgroundColor: Colors.twitter,
                    borderRadius: Metrics.borderRadius,
                    borderWidth: 1,
                    borderColor: Colors.twitter,
                    marginTop: Metrics.baseMargin
                  }}
                  styleText={{ color: Colors.white, fontWeight: "bold" }}
                  text={"TWITTER"}
                  onPress={() => { alert("SignUp with Twitter") }}
                />
                <Text style={styles.description}>
                  Signing up with social is super quick. No extra passwords to remember - no brain fail.
                  Don't worry, we'd never share any of your data or post anything on your behalf.
                </Text>
              </View>
              <Hr />
            </View>
            <TouchableOpacity
              style={[
                AppStyles.center,
                { marginVertical: Metrics.baseMargin }
              ]}
              onPress={() => { this.props.navigation.navigate("SignUpWithEmail") }}
            >
              <Text style={[
                styles.text,
                { fontWeight: "bold" }
              ]}>
                SIGN UP USING WITH
              </Text>
              <Text style={[
                styles.text,
                { fontWeight: "bold" }
              ]}>
                EMAIL ADDRESS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                AppStyles.center,
                { marginVertical: Metrics.baseMargin }
              ]}
              onPress={() => { this.props.navigation.navigate("SignIn") }}
            >
              <Text style={styles.subText}>
                Have an account ?
              </Text>
              <Text style={[
                styles.subText,
                { fontWeight: "bold" }
              ]}>
                Sign In
            </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  description: {
    ...Fonts.style.medium,
    color: Colors.black,
    marginVertical: Metrics.baseMargin
  },
});
