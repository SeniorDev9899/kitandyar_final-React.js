import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import Button from "../../components/common/Button";
import AddressItem from "../../components/address/AddressItem";
import Icon from "../../components/common/Icon";
import Config from '../../config';
import { GET_COUNTRY_URL, DISPLAY_FULL, JSON_FORMAT, HEADER_ENCODED, GET_ADDRESS_URL } from '../../constants/constants';
import {LABELS, LABELS_AR} from '../../constants/constants';

var storage = require("react-native-local-storage");
const LEFT_ICON = require("../../resources/icons/left-arrow.png");
const RIGHT_ICON = require("../../resources/icons/right-arrow.png");

export default class DeliveryScreen extends PureComponent {
  constructor(props) {
    super(props);
    // Listen to all events for screen B
    this.props.navigation.addListener(
      'willFocus',
      () => {
        console.log("will focus..");
        this.forceUpdate(null);
        storage.get('delivery_address').then((deliveryAddress) => {
          if (deliveryAddress) {
            this.setState({ address: deliveryAddress });
            console.log(" will focus delivery init address = ", this.state.address);
          } else {
            return;
          }
        });
        
        storage.get('invoice_address').then((invoiceAddress) => {
          if (invoiceAddress) {
            this.setState({ invoice_address: invoiceAddress });
            console.log("invoice init address = ", this.state.invoice_address);
            this.loadCountryList();
          } else {
            return;
          }
        });
        
      }
    )
  }

  state = {
    currentPosition: 1,
    address: "",
    delivery_address: "",
    invoice_address: "",
    data: "",
    countries: "",
    loading: false,
    flatlistRefresh: false,
    customerId: null,
    modalVisible: false,
    billingaddress_show: false,
    lang: "",
    isRTL: false,
  };

  componentDidMount() {

    storage.get('lang').then((lang) => {
      if (lang != null) {
        this.setState({lang: lang});
        if (lang == 'ar') {
          this.setState({isRTL: true});
        }
      }
    });

    storage.get('customer_id').then((customerId) => {
      this.setState({ customerId: customerId })
    });

    storage.get('delivery_address').then((deliveryAddress) => {
      if (deliveryAddress) {
        this.setState({ address: deliveryAddress });
        console.log("delivery init address = ", this.state.address);
      } else {
        return;
      }
    });
    storage.get('invoice_address').then((invoiceAddress) => {
      if (invoiceAddress) {
        this.setState({ invoice_address: invoiceAddress });
        console.log("invoice init address = ", this.state.invoice_address);
      } else {
        return;
      }
    });
    storage.get('billingaddress_show').then((billingaddress_show) => {
      if (billingaddress_show) {
        this.setState({ billingaddress_show: billingaddress_show });
        // console.log("invoice init address = ", this.state.invoice_address);
      } else {
        return;
      }
    });

    this.loadCountryList();

  }

  refresh() {
    console.log("refreshing..");
    this.loadAddressList();
  }

  onItemPress(address) {
    countryId = address.id_country;
    console.log("selected address = ", address);
    storage.save('country_id', countryId);
    storage.save('delivery_address', address);
    if(this.state.billingaddress_show == false)
    {
      storage.save('invoice_address', address);
    }
  }

  onItemPress_invoice(address) {
    // countryId = address.id_country;
    // console.log("selected address = ", address);
    // storage.save('country_id', countryId);
    storage.save('invoice_address', address);
  }

  onPressShow() {
    this.setState({ billingaddress_show: true });
    storage.save('billingaddress_show', true);
  }

  onPressNextButton() {
    if (this.state.address != "") {
      this.props.navigation.navigate("Carrier", { address: this.state.address });
    }
    else {
      this.setState({ modalVisible: true });
    }
  }
  onPressOkButton() {
    this.setState({ modalVisible: false });
    // this.props.navigation.navigate("AddAddress", {onGoBack: () => this.refresh()});
  }
  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  loadCountryList = () => {

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

    storage.get('guest').then((guest) => {
      storage.get('customer_id').then((customer_id) => {
        if (customer_id != null) {
          this.setState({ loading: true });
          url = GET_ADDRESS_URL + "?" + "filter[id_customer]=" + customer_id + DISPLAY_FULL + JSON_FORMAT;
          fetch(url, {
            method: "GET",
            headers: {
              'Authorization': 'Basic ' + HEADER_ENCODED
            }
          })
            .then(res => res.json())
            .then(resJson => {

              addresses = resJson.addresses;
              // if(addresses == null)
              // {
              //   this.setState({modalVisible: true});
              // }
              if (resJson.hasOwnProperty('addresses')) {
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
              else {
                this.setState({loading: false,});
                this.props.navigation.navigate("AddAddress", {onGoBack: () => this.refresh()});
              }


            }).catch(error => {
              this.setState({ error, loading: false });
              console.log(error);
            })

        } else {
          if (guest != null) {
            storage.get('addresses').then((addresses) => {
              if (addresses != null) {
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
                    address: addresses[0],
                    data: addresses,
                  })

                });
              }
            })
          }
        }
      });
    })

  }


  render() {

    const { currentPosition, address, invoice_address, lang, isRTL } = this.state;
    let nextButtonIcon =  isRTL ? LEFT_ICON : RIGHT_ICON;
    let backButtonIcon =  isRTL ? RIGHT_ICON : LEFT_ICON;

    if(lang == 'ar') labels = LABELS;
    else labels = LABELS_AR;

    return (
      <View style={[AppStyles.mainContainer]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          title={i18n.t('delivery_screen.address_delivery', { locale: lang } )}
          back={true}
        />
        <View style={styles.container}>
          <StepIndicator
            customStyles={Config.StepIndicator}
            stepCount={5}
            currentPosition={currentPosition}
            labels={labels}
          />
          <View style={[
            AppStyles.row,
            AppStyles.spaceBetween,
            styles.containerHeader
          ]}>
            {this.state.billingaddress_show == false &&
              <Text style={styles.title}> 
                { i18n.t('delivery_screen.address_description_content', { locale: lang } )}:
              </Text>
            }
          </View>
          <ScrollView style={{ flex: 1 }}>
            {this.state.billingaddress_show == true &&
              <Text style={styles.title}>{ i18n.t('delivery_screen.shipping_address', { locale: lang } )}</Text>
            }
            <FlatList
              extraData={this.state}
              style={{
                marginTop: Metrics.baseMargin,
                backgroundColor: Colors.transparent,
                paddingHorizontal: Metrics.baseMargin
              }}
              data={this.state.data}
              renderItem={({ item }) =>
                <AddressItem
                  onGoBack={() => this.refresh()}
                  item={item}
                  selected={address.id == item.id}
                  onPress={() => { this.setState({ address: item }); this.onItemPress(item) }}
                />
              }
              keyExtractor={(item, i) => i}
            />
            {this.state.billingaddress_show == false ?
              <Text onPress={() => { this.onPressShow() }}> { i18n.t('delivery_screen.billing_address_differs', { locale: lang } )}</Text>
              :
              <View>
                <Text style={styles.title}>{ i18n.t('delivery_screen.invoice_address', { locale: lang } )}</Text>
                <FlatList
                  extraData={this.state}
                  style={{
                    marginTop: Metrics.baseMargin,
                    backgroundColor: Colors.transparent,
                    paddingHorizontal: Metrics.baseMargin
                  }}
                  data={this.state.data}
                  renderItem={({ item }) =>
                    <AddressItem
                      onGoBack={() => this.refresh()}
                      item={item}
                      selected={invoice_address.id == item.id}
                      onPress={() => { this.setState({ invoice_address: item }); this.onItemPress_invoice(item) }}
                    />
                  }
                  keyExtractor={(item, i) => i}
                />
              </View>
            }
          </ScrollView>
        </View>
        {/* {this.state.customerId == null && ( */}
        <View
          style={[AppStyles.center, { marginBottom: Metrics.baseMargin }]}
        >
          <Icon
            width={40}
            tintColor={Colors.black}
            image={require("../../resources/icons/addQuantity.png")}
            onPress={() => { this.props.navigation.navigate("AddAddress", { onGoBack: () => this.refresh() }) }}
          />
          <Text style={styles.title}>
            { i18n.t('delivery_screen.add_new_address', { locale: lang } )}
              </Text>
          <Text style={styles.description}>
            { i18n.t('delivery_screen.complete_information', { locale: lang } )}
              </Text>
          <Text style={styles.description}>
            { i18n.t('delivery_screen.your_address', { locale: lang } )}
              </Text>
        </View>
        {/* )} */}

        <View style={[
          AppStyles.row,
          {
          }
        ]}>
          <Button
            iconLeft={backButtonIcon}
            colorIcon={Colors.dark_gray}
            styleButton={styles.buttonBack}
            styleText={{ color: Colors.dark_gray }}
            text={i18n.t('delivery_screen.back', { locale: lang } )}
            onPress={() => { this.props.navigation.goBack() }}
          />
          <Button
            iconRight={nextButtonIcon}
            colorIcon={Colors.white}
            styleButton={{ flex: 1, backgroundColor: Colors.appColor }}
            styleText={{ color: Colors.white }}
            text={i18n.t('delivery_screen.next_step', { locale: lang } )}
            onPress={() => { this.onPressNextButton() }}
          />
        </View>
        <Modal
          isVisible={this.state.modalVisible}
          animationIn={'bounceInUp'}
          animationOut={'fadeOutUpBig'}
          animationInTiming={1200}
          animationOutTiming={900}
          backdropTransitionInTiming={1200}
          backdropTransitionOutTiming={900}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.modalContent}>
            <Text style={{ textAlign: 'center', marginTop: 40, marginLeft: 30, marginRight: 30, fontSize: 16 }}> { i18n.t('delivery_screen.add_your_address', { locale: lang } )}</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={() => this.onPressOkButton()}>
                <View style={styles.button}>
                  <Text> { i18n.t('delivery_screen.ok', { locale: lang } )}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Spinner visible={this.state.loading} />

      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Metrics.baseMargin,
    marginTop: (Platform.OS === 'ios') ? 30 : Metrics.doubleBaseMargin
  },
  containerHeader: {
    height: Metrics.navBarHeight,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray
  },
  buttonBack: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    backgroundColor: Colors.lightBg_gray
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black
  },
  total: {
    ...Fonts.style.normal,
    fontFamily: Fonts.type.Bold,
    color: Colors.appColor
  },
  modalContent: {
    alignSelf: 'center',
    alignItems: 'center',
    height: 200,
    width: 400,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: 'white',
  },

  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
