import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import Button from "../../components/common/Button";
import TitleDescription from "../../components/common/TitleDescription";

import { Terms } from '../../data/Terms';

export default class AboutScreen extends PureComponent {

  render() {

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
          title={"About US"}
          back={true}
        />
        <View style={styles.container}>
          <TitleDescription
            title={"About US"}
            description={"All right, title and interest in the Mobile Application is owned by or licensed by Example. The materials provided on the Application Mobile including, without limitation, all content, site design, text, graphics are protected by copyright. Any unauthorized use of the materials is strictly prohibited."}
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.baseMargin,
    paddingVertical: 30
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black
  },
});
