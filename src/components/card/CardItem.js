import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  ImageBackground,
  Text,
  FlatList,
  Platform
} from 'react-native';
import { withNavigation } from 'react-navigation';
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Colors, Fonts, Metrics } from '../../themes';
import RowText from "../common/RowText";
import BackgroundGradient from "../common/BackgroundGradient";
import Icon from "../common/Icon";

var storage = require("react-native-local-storage");
class CardItem extends PureComponent {

  static propTypes = {
    item: PropTypes.object,
    height: PropTypes.number,
    selected: PropTypes.bool,
    onPress: PropTypes.func
  };

  static defaultProps = {
    item: null,
    height: 80,
    selected: false,
    onPress: () => { }
  };

  state = {
    visible: false,
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

  changeVisible = () => {
    this.setState({ visible: !this.state.visible });
  }

  render() {

    const { item, height, selected, onPress } = this.props;
    const { visible, lang, isRTL } = this.state;

    return (
      <BackgroundGradient
        color={selected === true ? item.color : Colors.other}
        styleBackground={[
          styles.container,
          AppStyles.row,
          {
            borderColor: Colors.transparent,
            borderWidth: 1,
            borderRadius: 10,
            height: height
          }
        ]}
      >
        <TouchableOpacity
          style={[AppStyles.row,
          {
            flex: 1,
            padding: (Platform.OS === 'ios') ? Metrics.smallMargin : Metrics.baseMargin
          }
          ]}
          onPress={onPress}
        >
          <View style={[AppStyles.center, { flex: 1 }]}>
            <Icon
              width={40}
              tintColor={Colors.white}
              image={item.icon}
            />
          </View>
          <View style={{ flex: 4 }}>
            <Text style={styles.number}>
              {item.number}
            </Text>
            {
              item.expDate !== "" &&
              <Text style={styles.date}>
                {i18n.t('card_item_component.exp_date', { locale: lang } )} {item.expDate}
              </Text>
            }
          </View>
          <View style={{
            flex: 0.5,
            justifyContent: "center",
            paddingRight: Metrics.smallMargin
          }}>
            <Icon
              width={30}
              tintColor={Colors.white}
              image={require("../../resources/icons/edit.png")}
              onPress={() => { this.props.navigation.navigate("AddCardCredit") }}
            />
          </View>
        </TouchableOpacity>
      </BackgroundGradient>
    );
  }
}

export default withNavigation(CardItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: Metrics.smallMargin
  },
  number: {
    ...Fonts.style.h4,
    color: Colors.white
  },
  date: {
    ...Fonts.style.small,
    color: Colors.white
  }
});
