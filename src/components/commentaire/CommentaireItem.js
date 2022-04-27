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
import StarRating from 'react-native-star-rating';

import { AppStyles, Colors, Fonts, Metrics } from '../../themes';
import Profile from "../common/Profile";

class CommentaireItem extends PureComponent {

  static propTypes = {
    item: PropTypes.object
  };

  static defaultProps = {
    item: null
  };

  render() {

    const { item } = this.props;

    return (

      <View
        style={[
          styles.container,
          AppStyles.row
        ]}
      >
        <View style={[AppStyles.center, { flex: 1 }]}>
          <Profile
            width={60}
            color={Colors.light_gray}
            source={item.image} 
          />
        </View>
        <View style={{ flex: 4 }}>
          <View style={[
            AppStyles.row,
            AppStyles.spaceBetween
          ]}>
            <Text style={styles.name}>
              {item.name}
            </Text>
            <View style={{ width: Metrics.deviceWidth / 6 }}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={item.rating}
                starColor={'#eae678'}
                starSize={12}
              />
            </View>
          </View>
          <Text style={styles.subTitle}>
            {item.message}
          </Text>
          <Text style={styles.date}>
            Date : {item.date}
          </Text>
        </View>
      </View>
    );
  }
}

export default withNavigation(CommentaireItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 65,
    marginVertical: Metrics.smallMargin,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1
  }, 
  name: {
    ...Fonts.style.normal,
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
