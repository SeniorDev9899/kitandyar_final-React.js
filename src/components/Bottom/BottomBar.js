import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';

import i18n from '../../helpers/I18n/I18n';
import Cart from '../common/Cart';
import {
  AppStyles,
  Colors,
  Fonts,
  Metrics,
  Images
} from '../../themes';
import { withNavigation,Navigation  } from 'react-navigation';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation-performance'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { GET_CATEGORY_URL, HEADER_ENCODED } from '../../constants/constants';

const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

var storage = require("react-native-local-storage");
class BottomBar extends PureComponent {
  static propTypes = {

  };

  static defaultProps = {
 
  };

  state = {
    tab_index: 0
  }

  componentWillMount() {
   
    storage.get('bottom_index').then((bottom_index) => {
      console.log("bottom bar component will mount");
      if(bottom_index != null) this.setState({tab_index: bottom_index});
    });
  }

  getWomenClothingCategory(){
    url = GET_CATEGORY_URL + "?display=full&output_format=JSON&filter[id]=3";
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + HEADER_ENCODED
      }
    })
      .then(res => res.json())
      .then(resJson => {
        this.props.navigation.navigate("ListProduct", { categorie: resJson.categories[0]} )
      }).catch(error => {
        this.setState({ loading: false });
        console.log(error);
      })
  }

  onTabChange(newTabIndex){
    console.log("new tab index = ", newTabIndex);
    storage.save('bottom_index', newTabIndex);
    // this.setState({tab_index: newTabIndex});
    
    switch (newTabIndex){
      case 0: { this.props.navigation.navigate("Home"); break;}
      case 1: { this.getWomenClothingCategory(); break;}
      case 2: { this.props.navigation.navigate("Cart"); break;}
      case 3: { this.props.navigation.navigate("Signin"); break;}
    }
  }

  render() {
    console.log("state tab index = ", this.state.tab_index);
    return (
        <BottomNavigation
            // activeTab={this.state.tab_index}
            labelColor="black"
            rippleColor="black"
            style={{ height: 56, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
            onTabChange={(newTabIndex) => this.onTabChange(newTabIndex)}>
            <Tab
            // barBackgroundColor="#37474F"
            label="Home"
            icon={<Icon size={24} color="black" name={"home"} />}
            />
            <Tab
            // barBackgroundColor="#00796B"
            label="Category"
            icon={<Icon size={24} color="black" name={"list"} />} />
            <Tab
            // barBackgroundColor="#5D4037"
            label="Cart"
            icon={<Icon size={24} color="black" name="shopping-cart" />}
            />
            <Tab
            // barBackgroundColor="#3E2723"
            label="Logout"
            icon={<Icon size={24} color="black" name="exit-to-app" />}
            />
        </BottomNavigation>
    );
  }
}

export default withNavigation(BottomBar);

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    height: Metrics.navBarHeight,
    width: Metrics.deviceWidth,
    backgroundColor: Colors.white,
    paddingHorizontal: Metrics.smallMargin
  },
  text: {
    ...Fonts.style.normal,
    color: Colors.black
  },
});