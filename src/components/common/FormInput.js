import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image
} from 'react-native';

import { AppStyles, Metrics, Images, Colors, Fonts } from '../../themes';

var storage = require("react-native-local-storage");
export default class FormInput extends PureComponent {
  state = {
    backgroundColor: Colors.white,
    isRTL: false,
  }
  // onFocus() {
  //   this.setState({
  //     backgroundColor: 'green'
  //   })
  // }

  onBlur() {
    this.setState({
      backgroundColor: '#ededed',
    })
  }

  static propTypes = {
    keyboardType: PropTypes.any,
    placeholder: PropTypes.string,
    styleInput: PropTypes.any,
    returnKeyType: PropTypes.any,
    autoFocus: PropTypes.bool,
    secureTextEntry: PropTypes.bool,
    onSubmitEditing: PropTypes.func 
  };

  static defaultProps = {
    keyboardType: '',
    placeholder: '',
    secureTextEntry: false,
    styleInput: {},
    returnKeyType: null,
    autoFocus: false,
    secureTextEntry: false,
    onSubmitEditing: () => { } 
  };

  componentDidMount(){
    storage.get('lang').then((lang) => {
      if (lang != null) {
        if (lang == 'ar') {
            this.setState({isRTL: true});
        }
      }
    });
  }

  inputRef() {
    return this.refs.input;
  }

  focus() {
    this.inputRef().focus();
  }

  blur() {
    this.inputRef().blur();
  }

  isFocused() {
    return this.inputRef().isFocused();
  }

  clear() {
    this.inputRef().clear();
  }

  render() {

    const {
      placeholder,
      value,
      onChangeText,
      secureTextEntry,
      keyboardType,
      onPress,
      editable,
      styleInput,
      returnKeyType,
      autoFocus,
      onSubmitEditing 
    } = this.props;

    return (
      <View style={[
        AppStyles.row,
        styles.container,
        styleInput
      ]}
      >
        <TextInput
          style={[styles.formInput, {textAlign: this.state.isRTL ? 'right' : 'left'}]}
          placeholder={placeholder}
          underlineColorAndroid='transparent'
          secureTextEntry={secureTextEntry}
          onBlur={() => this.onBlur()}
          onFocus={() => {
            if(this.props.identify == 'true'){
             this.props.onFocus()}
            }
          }
          selectionColor={Colors.appColor}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={editable}
          returnKeyType={returnKeyType}
          autoFocus={autoFocus}
          onSubmitEditing={onSubmitEditing}
          ref='input'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
  container: {
    height: Metrics.buttonHeight,
    alignItems: 'center',
    borderWidth: 1, 
    marginVertical: Metrics.smallMargin, 
    borderRadius: Metrics.radius,
    paddingHorizontal: Metrics.smallMargin,
    backgroundColor: Colors.gray99,
    borderColor: Colors.light_gray,
  },
  formInput: {
    height: Metrics.buttonHeight,
    paddingVertical: 10,
    marginVertical: 5, 
    flex: 1,
    fontSize: 14,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 8,
    fontFamily: Fonts.type.Book,
    color: Colors.black,
  } 
});