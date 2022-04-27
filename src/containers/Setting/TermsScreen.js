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

export default class TermsScreen extends PureComponent {
  
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
          title={"Terms & Conditions"}
          back={true}
        />
        <View style={styles.container}>
          <FlatList
            style={{ paddingHorizontal: Metrics.baseMargin }}
            data={Terms}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) => <TitleDescription
              title={item.title}
              description={item.description}
            />
            }
            keyExtractor={(item, i) => i}
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black
  },
});
