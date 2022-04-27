import React, { PureComponent } from 'react';
import { NavigationActions } from 'react-navigation';

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

export default class LaunchScreen extends PureComponent {

  componentDidMount = () => {
    setTimeout(() => {
      this.goTo("Onboarding");
    }, 2000);
  }

  goTo = (routeName) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

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
        <ImageBackground
          resizeMode={'cover'}
          style={{ height: Metrics.deviceHeight }}
          source={require("../../resources/launch/spalsh.jpg")}
        >
          <View style={styles.containerImage}>
            <View style={{ flex: 4 }} />
            <View style={[
              { flex: 1 }
            ]}>
              <Text style={styles.text}>
                Kitandyar
              </Text> 
              <Text style={styles.subText}>
                v1.0
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  text: {
    ...Fonts.style.h2,
    color: Colors.white,
    textAlign: "center"
  },
  subText: {
    ...Fonts.style.normal,
    color: Colors.white,
    textAlign: "center"
  },
  containerImage: {
    flex: 1,
    backgroundColor: Colors.blackTransparent70
  }
});
