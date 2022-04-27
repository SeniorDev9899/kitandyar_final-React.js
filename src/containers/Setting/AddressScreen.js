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
import AddressItem from "../../components/address/AddressItem";
import Icon from "../../components/common/Icon";

import { Address } from '../../data/Address';
import { GET_ADDRESS_URL, GET_COUNTRY_URL, HEADER_ENCODED, FULL_JSON_FORMAT, JSON_FORMAT, DISPLAY_FULL } from "../../constants/constants"

var storage = require("react-native-local-storage");
export default class AddressScreen extends PureComponent {

  state = {
    address: 1,
    data: "",
    countries: "",
    loading: false,
    flatlistRefresh: false,
    lang: "",
    isRTL: false,
  };

  componentDidMount() {
    // this.loadAddressList();
    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });

    this.loadCountryList();
    
  }

  refresh(){
    this.loadAddressList();
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  loadCountryList = () => {
    var storage = require("react-native-local-storage");
    let url;

    storage.get('countries').then((countryList) => {

      if (countryList == null) {
        // Load country list from server
        url = GET_COUNTRY_URL + "?display=full&output_format=JSON";
        this.setState({ loading: true });

        fetch(url, {
          method: "GET",
          headers: {
            'Authorization': 'Basic ' + HEADER_ENCODED
          }
        })
          .then(res => res.json())
          .then(resJson => {
            this.setState({
              error: resJson.error || null,
              loading: false,
            })

            countries = resJson.countries;
            if (countries.length > 0) {
              // Save country list to local storage for using in future
              storage.save('countries', resJson.countries);
            }

            this.loadAddressList();
          }).catch(error => {
            this.setState({ error, loading: false });
            console.log(error);
          })
      }
      else {
        this.loadAddressList();
      }
    });
  }

  loadAddressList = () => {
    var storage = require("react-native-local-storage");
    let url;

    storage.get('customer_id').then((customer_id) => {
      url = GET_ADDRESS_URL + "?" + "filter[id_customer]=" + customer_id + DISPLAY_FULL + JSON_FORMAT;

      this.setState({ loading: true });

      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        }
      })
        .then(res => res.json())
        .then(resJson => {
          if(resJson.hasOwnProperty('addresses'))
          {
            addresses = resJson.addresses;
            if (addresses.length > 0) {
              storage.get('countries').then((countryList) => {
                for (let address of addresses) {
                  for (let country of countryList) {
                    if (address.id_country == country.id) {
                      address.country_name = country.name[0].value;
                      break;
                    }
                  }
                }
  
                this.setState({
                  data: resJson.addresses,
                  error: resJson.error || null,
                  loading: false,
                })
  
              });
            }
          }
          

        }).catch(error => {
          this.setState({ error, loading: false });
          console.log(error);
        })
    });
  }

  render() {
    const { address, lang, isRTL} = this.state;

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
          title={i18n.t('address_screen.my_address', { locale: lang } )}
          back={true}
        />
        <View style={styles.container}>
          <FlatList
            extraData={this.state}
            style={{
              marginTop: Metrics.baseMargin,
              backgroundColor: Colors.transparent,
              paddingHorizontal: Metrics.baseMargin
            }}
            data={this.state.data}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) => <AddressItem
              onGoBack = {() => this.refresh()}
              item={item}
              selected={address === item.id}
              onPress={() => { this.setState({ address: item.id }) }}
            />
            }
            keyExtractor={(item, i) => i}
          />
          <View
            style={[AppStyles.center, { marginBottom: Metrics.baseMargin + 56 }]}
          >
            <Icon
              width={40}
              tintColor={Colors.black}
              image={require("../../resources/icons/addQuantity.png")}
              onPress={() => { this.props.navigation.navigate("AddAddress", {onGoBack: () => this.refresh()} )}}
            />
            <Text style={styles.title}>
              {i18n.t('address_screen.add_new_address', { locale: lang } )}
            </Text>
            <Text style={styles.description}>
              {i18n.t('address_screen.', { locale: lang } )}
            </Text>
            <Text style={styles.description}>
              {i18n.t('address_screen.your_address', { locale: lang } )}
            </Text>
          </View>
        </View>

      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30
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
