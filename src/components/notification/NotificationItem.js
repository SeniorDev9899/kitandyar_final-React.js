import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  ImageBackground,
  Text,
  FlatList
} from 'react-native';
import { withNavigation } from 'react-navigation';
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Colors, Fonts, Metrics } from '../../themes';
import Icon from "../common/Icon";

var storage = require("react-native-local-storage");
class NotificationItem extends PureComponent {

  static propTypes = {
    item: PropTypes.object
  };

  static defaultProps = {
    item: null
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

  renderImage = (type) => {
    //Received /Shipped /OutDelivery /Gift /Coupon
    if (type === "Received") {
      return (require("../../resources/notifications/choices.png"));
    } else if (type === "Shipped") {
      return (require("../../resources/notifications/shipped.png"));
    } else if (type === "OutDelivery") {
      return (require("../../resources/notifications/fast-delivery.png"));
    } else if (type === "Gift") {
      return (require("../../resources/notifications/gift.png"));
    } else {
      return (require("../../resources/notifications/coupon.png"));
    }
  }

  render() {

    const { item } = this.props;
    const { lang, isRTL } = this.state;

    return (

      <View
        style={[
          styles.container,
          AppStyles.row
        ]}
      >
        <View style={[AppStyles.center, { flex: 1 }]}>
          <Icon
            width={50}
            backgroundColor={Colors.appColor}
            tintColor={Colors.white}
            borderRadius={true}
            image={this.renderImage(item.type)}
          />
        </View>
        <View style={{ flex: 4 }}>
          <Text style={styles.title}>
            {item.type}
          </Text>
          <Text style={styles.subTitle}>
           {item.message}
          </Text>
          <Text style={styles.date}>
            {i18n.t('notification_item_component.date', { locale: lang } )} {item.date}
          </Text>
        </View>
      </View>
    );
  }
}

export default withNavigation(NotificationItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 80,
    marginVertical: Metrics.smallMargin, 
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1
  },
  title: {
    ...Fonts.style.large,
    ...Fonts.style.bold,
    color: Colors.black
  },
  subTitle: {
    ...Fonts.style.normal,
    color: Colors.black
  },
  date: {
    ...Fonts.style.small,
    color: Colors.dark_gray,
    marginTop: Metrics.smallMargin
  }
});
