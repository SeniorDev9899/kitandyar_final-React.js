import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  ImageBackground,
  Text,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Colors, Fonts, Metrics } from '../../themes';
import Profile from "../common/Profile";

class HeaderProfile extends PureComponent {

  static propTypes = {
    item: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    onPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    width: 0,
    height: 0
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

    const {
      item,
      width,
      height,
      onPress,
    } = this.props;

    const { lang, isRTL } = this.state;

    return (
      <View
        style={[
          styles.container,
        ]}
      >
        <ImageBackground
          resizeMode={'cover'}
          style={styles.containerImage}
          source={require("../../resources/images/headerProfile.jpg")}
        >
          <View style={[
            AppStyles.center,
            styles.containerProfile
          ]}>
            <Profile
              width={80}
              name={i18n.t('header_profile_component.user_name', { locale: lang } )}
              camera={true}
              gallery={true}
              source={require('../../resources/icons/imageProfileW.png')}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default withNavigation(HeaderProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerImage: {
    width: Metrics.deviceWidth,
    height: 200,
  },
  containerProfile: {
    flex: 1,
    backgroundColor: Colors.blackTransparent50
  },
  text: {
    ...Fonts.style.Bold,
    color: Colors.white
  },
});
