import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  Image
} from 'react-native';

import i18n from '../../helpers/I18n/I18n';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';
import HeaderBar from "../../components/Header/HeaderBar";
import FormInput from '../../components/common/FormInput';
import Button from "../../components/common/Button";
import Profile from "../../components/common/Profile";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import CheckBox from 'react-native-check-box'
import { GET_PROFILE_URL, HEADER_ENCODED } from "../../constants/constants"
import DateTimePicker from 'react-native-modal-datetime-picker';

var dateFormat = require('dateformat');
let radio_props = [
  { label: 'Mr', value: 0 },
  { label: 'Mrs', value: 1 }
];

var storage = require("react-native-local-storage");
export default class ProfileScreen extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isCheckReceiveOffer: false,
      isSignupNewsletter: true,
      firstName: "",
      lastName: "",
      email: "",
      birthday: "",
      data: "",
      loading: false,
      isDateTimePickerVisible: false,
      lang: "",
      isRTL: false,
    }
  }

  componentDidMount() {
    this.makeRequest();
  }
  _showDateTimePicker()
  {
    this.setState({ isDateTimePickerVisible: true });
  }
 
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
 
  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);     
        // return date.toLocaleDateString( date.getTimezoneOffset(), options );
    this.setState({birthday:dateFormat(date, "mm/dd/yyyy").toString()});
    this._hideDateTimePicker();
  };
  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  makeRequest = () => {
    var storage = require("react-native-local-storage");
    let url;
    storage.get('customer_id').then((customer_id) => {
      url = GET_PROFILE_URL + "filter[id]=" + customer_id + "&output_format=JSON";

      this.setState({ loading: true });
      console.log(url);

      fetch(url, {
        method: "GET",
        headers: {
          'Authorization': 'Basic ' + HEADER_ENCODED
        }
      })
        .then(res => res.json())
        .then(resJson => {
          this.setState({
            data: resJson,
            error: resJson.error || null,
            loading: false,
          })

          customers = this.state.data.customers;
          if (customers.length > 0) {
            customer = customers[0];
            
            this.setState({firstName : customer.firstname});
            this.setState({lastName : customer.lastname});    
            this.setState({email : customer.email});
            words = customer.birthday.split("-");
            birthdate = words[1] + "/" + words[2] + "/" + words[0];
            this.setState({birthday : birthdate});

            console.log("customer.optin : " + customer.optin);
            if(customer.optin === "1") {
              this.setState({isCheckReceiveOffer : true});
              console.log("customer.optin : true" );
            }
            else {
              this.setState({isCheckReceiveOffer : false});
              console.log("customer.optin : false");
            }
          }
          
        }).catch(error => {
          this.setState({ error, loading: false });
          console.log(error);
          alert(i18n.t('global.server_connect_failed', { locale: lang }));
        })
    });
  }

  render() {

    const {lang, isRTL} = this.state;

    return (
      <View style={[AppStyles.mainContainer, { margintop: (Platform.OS === 'ios') ? 60 : 0 }]}>
        <StatusBar
          backgroundColor="black"
          barStyle="light-content"
          hidden={false}
        />
        <HeaderBar
          title={ i18n.t('profile_screen.personal_information', { locale: lang })}
          back={true}
        />
        <View style={[
          styles.containerHeader,
          AppStyles.center
        ]}>
          {/* <Profile
            width={70}
            color={Colors.light_gray}
            name={"Username"}
          /> */}
        </View>

        <View style={styles.containerForm}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text style={styles.socialLabel}>
              {i18n.t('profile_screen.social_title', { locale: lang })}
            </Text> 

            <SocialRadioButtonGroup />
          </View>

          <FormInput
            placeholder={ i18n.t('profile_screen.first_name', { locale: lang })}
            value={this.state.firstName}
          />
          <FormInput
            placeholder={ i18n.t('profile_screen.last_name', { locale: lang })}
            value={this.state.lastName}
          />
          <FormInput
            placeholder={ i18n.t('profile_screen.email', { locale: lang })}
            value={this.state.email}
          />
          <FormInput
            placeholder={ i18n.t('profile_screen.password', { locale: lang })}
            secureTextEntry={true}
          />
          <FormInput
            placeholder={ i18n.t('profile_screen.new_password', { locale: lang })}
            secureTextEntry={true}
          />
          {/* <FormInput
            placeholder={"MM/DD/YYYY"}
            value={this.state.birthday}
          /> */}
          <FormInput
            // identify={"true"}
            placeholder={ i18n.t('profile_screen.date_placeholder', { locale: lang })}
            styleInput={{ marginVertical: Metrics.smallMargin }}
            // onFocus = {()=> {this._showDateTimePicker()}}
            value = {this.state.birthday}
            onChangeText={(text) => this.setState({birthday: text})}

          />          
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            format='MM/DD/YYYY'
          />
          <CheckBox
            style={{ padding: 10 }}
            onClick={() => this.onClickCheckReceive(this.state.isCheckReceiveOffer)}
            isChecked={this.state.isCheckReceiveOffer}
            rightText={ i18n.t('profile_screen.radio_text_1', { locale: lang })}
            checkBoxColor={Colors.black}
          />

          <CheckBox
            style={{ padding: 10 }}
            onClick={() => this.onClickNewsletter(this.state.isSignupNewsletter)}
            isChecked={this.state.isSignupNewsletter}
            rightText={ i18n.t('profile_screen.radio_text_2', { locale: lang })}
            checkBoxColor={Colors.black}
          />

        </View>
        <View style={[
          AppStyles.row,
          {
            
          }
        ]}>
          <Button
            styleButton={{ flex: 1, backgroundColor: Colors.appColor }}
            text={ i18n.t('profile_screen.update', { locale: lang })}
            styleText={{ color: Colors.white }}
            onPress={() => { alert("Update") }}
          />
          <Button
            styleButton={styles.buttonBack}
            styleText={{ color: Colors.dark_gray }}
            text={ i18n.t('profile_screen.cancel', { locale: lang })}
            onPress={() => { this.props.navigation.goBack() }}
          />
        </View>
      </View >
    );
  }

  onClickCheckReceive(data) {
    let tmp = this.state.isCheckReceiveOffer
    tmp = !tmp
    this.setState({ tmp })
  }

  onClickNewsletter(data) {
    let tmp = this.state.isSignupNewsletter
    tmp = !data
    this.setState({ data })
  }
}


var createReactClass = require('create-react-class');

var SocialRadioButtonGroup = createReactClass({
  getInitialState: function () {
    return {
      value: 0,
    }
  },
  render: function () {
    return (
      <View>
        <RadioForm
          radio_props={radio_props}
          initial={0}
          animation={true}
          formHorizontal={true}
          buttonWrapStyle={{ marginLeft: 10 }}
          idSeparator="  "
          onPress={(value) => { this.setState({ value: value }) }}
        />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  containerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    paddingVertical: 30
  },
  containerForm: {
    flex: 1,
    marginHorizontal: Metrics.baseMargin
  },
  title: {
    ...Fonts.style.bold,
    color: Colors.black
  },
  buttonBack: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    backgroundColor: Colors.lightBg_gray
  },
  socialLabel: {
    fontSize: 14,
    fontFamily: Fonts.type.Book,
    color: Colors.black,
    marginRight: 10
  }
});
