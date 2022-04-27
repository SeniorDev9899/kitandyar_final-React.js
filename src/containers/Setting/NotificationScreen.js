import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity
} from 'react-native';

import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import Button from "../../components/common/Button";
import NotificationItem from "../../components/notification/NotificationItem";
import Icon from "../../components/common/Icon";

import { Notifications } from '../../data/Notifications';

var storage = require("react-native-local-storage");
export default class NotificationScreen extends PureComponent {

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

  render() {
    const {lang, isRTL} = this.state;
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
          title={i18n.t('notification_screen.notification', { locale: lang })}
          back={true}
        />
        <View style={styles.container}>
          <FlatList
            style={{
              marginTop: Metrics.baseMargin,
              backgroundColor: Colors.transparent
            }}
            data={Notifications}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) => <NotificationItem
              item={item}
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
    marginHorizontal: Metrics.baseMargin,
    marginTop:15
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black
  },
  description: {
    ...Fonts.style.bold,
    color: Colors.light_gray
  },
});
