import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
} from 'react-native';

import i18n from '../../helpers/I18n/I18n';

import Icon from "../common/Icon";
import FormInput from "../common/FormInput";
import {
  AppStyles,
  Colors,
  Fonts,
  Metrics,
  Images
} from '../../themes';

var storage = require("react-native-local-storage");
export default class NewsLetter extends PureComponent {

  static propTypes = {
    store: PropTypes.any,
  };

  static defaultProps = {
    store: null,
  };

  state = {
    lang: "",
    isRTL: false,
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

    const { store, } = this.props;
    const { lang, isRTL } = this.state;

    return (
      <View
        style={[
          AppStyles.center,
          styles.container,
        ]}
      >
        <Text style={styles.title}>
          {i18n.t('newsletter_component.welcome_to', { locale: lang } )} {store.name}
        </Text>
        <Text style={styles.text}>
          {store.street1}
        </Text>
        <Text style={styles.text}>
          {store.street2}
        </Text>

        <View style={AppStyles.row}>
          <Text style={styles.text}>
            {store.phone1}
          </Text>
          <Text style={styles.text}>
             {store.phone2}
          </Text>
        </View>
        {/* <Text style={styles.text}>
          {store.website}
        </Text>

        <Text style={styles.text}>
          {store.email}
        </Text>

        <Text style={styles.text}>
          Stay up to date on the best deals & latest trends!
        </Text> */}

        {/* <View style={[
          AppStyles.row,
          AppStyles.center,
          { marginVertical: Metrics.baseMargin }
        ]}>
          <FormInput
            placeholder={"Enter email address"}
            styleInput={{ marginVertical: Metrics.baseMargin }}
            styleInput={{
              height: 30,
              width: Metrics.deviceWidth * 2 / 3
            }}
          />
          <Icon
            width={33}
            tintColor={Colors.white}
            styleIcon={{ marginHorizontal: Metrics.smallMargin / 2 }}
            image={require("../../resources/icons/back-right-arrow.png")}
          />
        </View> */}

        <View style={[
          AppStyles.row,
          AppStyles.center,
          { marginVertical: Metrics.smallMargin }
        ]}>
          <Icon
            width={30}
            tintColor={Colors.white}
            styleIcon={{ marginHorizontal: Metrics.smallMargin / 2 }}
            image={require("../../resources/social/facebook.png")}
            onPress={ ()=>{ Linking.openURL(store._links.facebook)}}
          />
          <Icon
            width={30}
            tintColor={Colors.white}
            styleIcon={{ marginHorizontal: Metrics.smallMargin / 2 }}
            image={require("../../resources/social/twitter.png")}
            onPress={ ()=>{ Linking.openURL(store._links.twitter)}}
          />
          <Icon
            width={30}
            tintColor={Colors.white}
            styleIcon={{ marginHorizontal: Metrics.smallMargin / 2 }}
            image={require("../../resources/social/instagram.png")}
            onPress={ ()=>{ Linking.openURL(store._links.instagram)}}
          />
          {/* <Icon
            width={30}
            tintColor={Colors.white}
            styleIcon={{ marginHorizontal: Metrics.smallMargin / 2 }}
            image={require("../../resources/social/youtube.png")}
            onPress={ ()=>{ Linking.openURL(store._links.youtube)}}
          /> */}
          <Icon
            width={30}
            tintColor={Colors.white}
            styleIcon={{ marginHorizontal: Metrics.smallMargin / 2 }}
            image={require("../../resources/social/google-plus.png")}
            onPress={ ()=>{ Linking.openURL(store._links.google)}}
          />
          <Icon
            width={30}
            tintColor={Colors.white}
            styleIcon={{ marginHorizontal: Metrics.smallMargin / 2 }}
            image={require("../../resources/social/youtube.png")}
            onPress={ ()=>{ Linking.openURL(store._links.youtube)}}
          />
        </View>

        <Text style={styles.text}>
          {i18n.t('newsletter_component.copyright', { locale: lang } )}
        </Text>

      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Metrics.baseMargin,
    backgroundColor: Colors.appColor
  },
  title: {
    ...Fonts.style.large,
    color: Colors.white,
    marginVertical: Metrics.baseMargin
  },
  text: {
    ...Fonts.style.small,
    color: Colors.white,
  }
});                               