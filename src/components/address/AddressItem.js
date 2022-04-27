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

import { AppStyles, Colors, Fonts, Metrics } from '../../themes';
import RowText from "../common/RowText";
import BackgroundGradient from "../common/BackgroundGradient";
import Icon from "../common/Icon";

class AddressItem extends PureComponent {

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
    visible: false
  }

  changeVisible = () => {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const { item, height, selected, onPress } = this.props;
    console.log(" select item= ", item.id)
    console.log(" select = ", selected)
    return (
      <BackgroundGradient
        color={selected === true ? Colors.address : Colors.other}
        styleBackground={[
          styles.container,
          AppStyles.row,
          {
            padding: Metrics.baseMargin,
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
              image={require("../../resources/icons/location-pin.png")}
              onPress={onPress}
            />
          </View>
          <View style={[AppStyles.center, { flex: 4 }]}>
            <Text style={styles.number}>
              {item.country_name}
            </Text>
            <Text style={styles.date}>
              {item.city}
            </Text>
            {/* <Text style={styles.date}>
              {item.latitude}  -  {item.longitude}
            </Text> */}
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
              onPress={() => { this.props.navigation.navigate("AddressDetail", {address_item : item,  onGoBack: this.props.onGoBack }) }}
            />
          </View>
        </TouchableOpacity>
      </BackgroundGradient>
    );
  }
}

export default withNavigation(AddressItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: Metrics.smallMargin
  },
  number: {
    ...Fonts.style.h6,
    color: Colors.white
  },
  date: {
    ...Fonts.style.small,
    color: Colors.white
  }
});
