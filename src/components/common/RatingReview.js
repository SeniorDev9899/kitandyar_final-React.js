import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import i18n from '../../helpers/I18n/I18n';
 
import {
  AppStyles,
  Colors,
  Metrics,
  Fonts,
} from '../../themes';
import Icon from "../common/Icon";
import RatingLigne from './RatingLigne';

class RatingReview extends PureComponent {

  static propTypes = {
    value: PropTypes.number,
  };

  static defaultProps = {
    value: 0
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
      value,
    } = this.props;

    const { lang, isRTL } = this.state;

    return (
      <View style={[
        styles.container,
        AppStyles.row,
      ]} >
        <View style={[
          AppStyles.center,
          { flex: 1 }
        ]}>
          <View style={[
            AppStyles.row,
            AppStyles.center 
          ]}>
            <Text style={[
              styles.title,
            ]}>
              4.3
            </Text>
            <Icon
              width={25}
              tintColor={Colors.black}
              image={require("../../resources/icons/star2.png")}
            />
          </View>
          <Text style={[
            styles.subTitle,
          ]}>
            4 {i18n.t('rating_review_component.rating', { locale: lang } )}
          </Text>
        </View>

        <View style={{
          flex: 1,
          borderLeftWidth: 1,
          borderLeftColor: Colors.gray,
          padding: Metrics.baseMargin
        }}>
          <RatingLigne number={5} value={4} />
          <RatingLigne number={4} value={5}/>
          <RatingLigne number={3} value={1}/>
          <RatingLigne number={2} value={3} />
          <RatingLigne number={1} value={1}/>
        </View>
      </View>
    );
  }
}
export default (RatingReview);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    ...Fonts.style.normal,
    ...Fonts.style.bold,
    color: Colors.black
  },
  subTitle: {
    ...Fonts.style.normal,
    color: Colors.black
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
  },
})
