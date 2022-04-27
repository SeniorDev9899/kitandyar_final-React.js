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

class CategorieItem extends PureComponent {

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
      <TouchableOpacity
        style={[
          AppStyles.imageView,
          AppStyles.blockRadius,
          AppStyles.center,
          styles.container,
        ]} 
        onPress={() => { this.props.navigation.navigate("ListProduct", { categorie: item }) }}
      >
        <ImageBackground
          resizeMode={'cover'}
          style={[
            AppStyles.center,
            {
              width: Metrics.deviceWidth,
              height: (Metrics.deviceHeight / 4)
            }
          ]}
          source={{ uri: item.image + '?random_number=' + new Date().getTime() }}
        >
          <View style={[ 
            styles.border,
            {
              justifyContent: "center",
              paddingLeft: Metrics.doubleBaseMargin *2
            }
          ]}>
            <Text style={[
              Fonts.style.bold,
              {
                fontSize: Fonts.size.h4,
                color: Colors.white
              }
            ]}>
              {item.name}
            </Text>
            <Text style={[
              Fonts.style.medium,
              {
                color: Colors.white
              }
            ]}>
              {item.count} {i18n.t('categorie_item_component.products', { locale: lang } )}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(CategorieItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Metrics.smallMargin
  },
  border: {
    width: Metrics.deviceWidth,
    height: Metrics.deviceHeight / 3.5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
});
