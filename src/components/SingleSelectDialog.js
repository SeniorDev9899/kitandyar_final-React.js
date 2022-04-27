import React, { Component } from 'react';
import { connect } from 'react-redux'
import { changeLang, changeCur } from '../redux/actions'

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    PixelRatio,
    I18nManager,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import {
    DrawerItems
} from 'react-navigation';
import RNRestart from 'react-native-restart';  
import i18n from '../helpers/I18n/I18n';

import Icon from "../components/common/Icon";
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { LANG_LIST, CURRENTCY_LIST, CURRENTCY_LIST_AR, COUNTRY_LIST, GET_CATEGORY_URL, HEADER_ENCODED } from '../constants/constants';
import ImagePicker from 'react-native-image-picker';
import { AppStyles } from '../themes';

var storage = require("react-native-local-storage");
var status = true;
class SingleSelectDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRTL: false,
            lang: "en",
            loading:false,
            langPickerVisible: false,
            langPickerSelectedItem: {value: 0},

            currencyPickerVisible: false,
            currencyPickerSelectedItem: {value:1},
            
            title: "",
            signState: false,

            defautlCurrency: "BHD",
            customerFirstname: null,
            customerId:null,
            customerProfile:[],
            // ImageSource: {uri: '../../resources/images/blank.png'}
            ImageSource: {uri: ''},
            isShowWomenClothing: false,
            isShowTops: false,
            isShowDresses: false,
            isShowEvening: false
        };
    }
    componentDidMount() {
        console.log("Single Selecte Dialog");
        this.setState({loading:true});

        storage.get('lang').then((lang) => {
            if (lang != null) {
              this.setState({lang: lang});
            }
        });

        status = true;
        storage.get('customer_id').then((customerId) => {
            console.log("Single Selecte Dialog1");
            if(customerId != null) {
                console.log("Single Selecte Dialog2");
                if(status == true){
                    status = false;
                    console.log("Single Selecte Dialog3");
                    storage.get('customer_firstname').then((customerFirstname) => {
                        // status = false;
                        console.log("Single Selecte Dialog4");
                        this.setState({customerFirstname: customerFirstname,loading:false, signState: true});
                    });
                }
            } 
        });

        storage.get('currency_selected').then((currencySelected) => {
            if(currencySelected != null){
                this.setState({currencyPickerSelectedItem: currencySelected});
            }
        });

        storage.get('lang_selected').then((langSelected) => {
            if(langSelected != null){
                this.setState({langPickerSelectedItem: langSelected});
            }
        });

        storage.get('customer_id').then((customerId) => {
            this.setState({customerId: customerId});
            storage.get('customer_profile').then((customerProfile) => {
                if(customerProfile != null)
                {
                    for(i=0;i<customerProfile.length;i++)
                    {
                        item = customerProfile[i].split(",");
    
                        if(item[0] == this.state.customerId){
                            this.setState({ImageSource: {uri: item[1]}});
                            console.log(this.state.ImageSource);
                        }
                    }
                    
                }
            })
        });
        this.setState({loading:false}); 
    }

    onPressSign(){
        
        if(this.state.signState) {
            storage.save('customer_id', null);
            storage.save('cart_id', null);
            storage.save('cart_price', null);
            storage.save('cart', null);
            storage.save('addresses', null);
            storage.save('guest', null);
            storage.save('guest_id', null);
            storage.save('email', null);
            storage.save('customer_firstname', null);
            storage.save('customer_lastname', null);
            storage.save('country_id', null);
            storage.save('shipping', null);
            storage.save('delivery_address', null);
            storage.save('invoice_address', null);
            storage.save('billingaddress_show', false);
            storage.save('tax_rate', null);
            storage.save('cart_rule',null);
            this.setState({customerFirstname: "", signState: false});
            this.props.navigation.navigate('DrawerClose');
            this.props.navigation.dispatch(NavigationActions.reset({
              index: 0,
              key: null,
              actions: [NavigationActions.navigate({ routeName: 'OutHome' })]
            }))
            
        } else {
            this.props.navigation.navigate('DrawerClose');
            this.props.navigation.navigate("SignIn", {fromPage:'Home'});
        }
    }
    selectPhotoTapped() {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled photo picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          }
          else {
            let source = { uri: response.uri };
    
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
    
            this.setState({
   
              ImageSource: source
   
            });
            customer_profile = this.state.customerId + "," + response.uri;
            storage.get('customer_profile').then((customerProfile) => {
                console.log(customerProfile);
                if(customerProfile != null)
                {
                    for(i=0;i<customerProfile.length;i++)
                    {
                        item = customerProfile[i].split(",");

                        if(item[0] == this.state.customerId){

                            item[1] = response.uri;
                            
                            customerProfile[i] = item[0] + "," + item[1];
                        }
                        else
                        {
                            customerProfile.push(customer_profile);
                        }
                        
                    }
                    this.setState({customerProfile: customerProfile});
                }
                else{
                    newcustomerProfile = [];
                    newcustomerProfile.push(customer_profile);
                    this.setState({customerProfile:newcustomerProfile});
                }
                 storage.save('customer_profile',this.state.customerProfile);
            })
          }
        });
      }

      navigationToListProductWithCategoryId(id){
        url = GET_CATEGORY_URL + "?display=full&output_format=JSON&filter[id]=" + id;
        fetch(url, {
          method: "GET",
          headers: {
            'Authorization': 'Basic ' + HEADER_ENCODED
          }
        })
          .then(res => res.json())
          .then(resJson => {
            this.props.navigation.navigate("ListProduct", { categorie: resJson.categories[0]} );
          }).catch(error => {
            this.setState({ loading: false });
            console.log(error);
          })
      }

    render() {
        isRTL = false;
        currency_list = CURRENTCY_LIST;
        storage.get('lang').then((lang) => {
            if (lang != null) {
              if (lang == 'ar') {
                isRTL = true;
                currency_list = CURRENTCY_LIST_AR
              }
            }
          });

        if(this.state.signState) {
            title = i18n.t('single_select_dialog.logout', { locale: this.state.lang });
        } else{
            title = i18n.t('single_select_dialog.login', { locale: this.state.lang });
        }
        
        return (
            <ScrollView>
                <View style={styles.container}>
                {this.state.signState ?
                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}> 
                        <View style={styles.ImageContainer}>        
                        { this.state.ImageSource.uri == "" ? <Text style = {{color : 'white'}}>{i18n.t('single_select_dialog.select_photo', { locale: this.state.lang })}</Text> :
                        <Image style={styles.backdrop} source={this.state.ImageSource} />
                        }        
                        </View>    
                    </TouchableOpacity>:<View style={styles.ImageContainer}><Image style={styles.backdrop} source={this.state.ImageSource} /></View>
               }
                    {/* <Image
                        style={styles.backdrop}
                        source={{ uri: 'https://unsplash.com/photos/JWiMShWiF14/download' }}>
                    </Image> */}
                    {/* <Text style={styles.headline}>WebDesignBahrain</Text> */}
                    <Text style={styles.headline}> {i18n.t('single_select_dialog.welcome', { locale: this.state.lang })} {this.state.customerFirstname}</Text>

                    <SinglePickerMaterialDialog
                        title={ i18n.t('single_select_dialog.select_language', { locale: this.state.lang })}
                        items={LANG_LIST.map((row, index) => ({ value: index, label: row }))}
                        visible={this.state.langPickerVisible}
                        selectedItem={this.state.langPickerSelectedItem}
                        onCancel={() => this.setState({ langPickerVisible: false })}
                        onOk={result => {
                            this.setState({ langPickerVisible: false });
                            storage.save('lang_selected', result.selectedItem);
                            this.setState({ langPickerSelectedItem: result.selectedItem });
                            this.props.changeLanguage(result.selectedItem.label)

                            if(result.selectedItem.label == 'English') {
                                I18nManager.forceRTL(false);
                                RNRestart.Restart();
                                storage.save('lang', "en");
                            } else{
                                I18nManager.forceRTL(true);
                                RNRestart.Restart();
                                storage.save('lang', "ar");
                            }
                        }}
                    />

                    <SinglePickerMaterialDialog
                        title={ i18n.t('single_select_dialog.select_currency', { locale: this.state.lang })}
                        scrolled={true}
                        items={currency_list.map((row, index) => ({ value: index, label: row }))}
                        visible={this.state.currencyPickerVisible}
                        selectedItem={this.state.currencyPickerSelectedItem}
                        onCancel={() => this.setState({ currencyPickerVisible: false })}
                        onOk={result => {
                            this.setState({ currencyPickerVisible: false });
                            // this.setState({ currencyPickerSelectedItem: result.selectedItem });
                            storage.save('currency_selected', result.selectedItem);
                            console.log("selected_item", result.selectedItem);
                    
                            this.props.changeCurrency(result.selectedItem.label);
                            oldCurrency = this.state.defautlCurrency;
                            storage.get('new_currency').then((newCurrency) => {
                                if (newCurrency == null) {
                                    storage.save('old_currency', defautlCurrency);
                                } else{
                                    storage.save('old_currency', newCurrency);
                                }
                            });
                            if(result.selectedItem.label == 'USD') {
                                storage.save('new_currency', '$');
                            } else{
                                storage.save('new_currency', result.selectedItem.label);
                            }
                        
                            // this.props.navigation.navigate('DrawerClose');
                            this.props.navigation.dispatch(NavigationActions.reset({
                              index: 0,
                              key: null,
                              actions: [NavigationActions.navigate({ routeName: 'OutHome' })]
                            }))

                        }}
                    />
                </View>

                <View  style={[AppStyles.row, {alignItems: 'center', height:40}]}>
                    {this.state.isShowWomenClothing ? (
                        <Icon width={30} image={require("../resources/icons/bottom.png")} onPress={() => this.setState({isShowWomenClothing: !this.state.isShowWomenClothing})}/>
                    ): (
                        <Icon width={30} image={require("../resources/icons/right.png")} onPress={() => this.setState({isShowWomenClothing: !this.state.isShowWomenClothing})}/>
                    )}
                    <TouchableOpacity onPress={() => this.navigationToListProductWithCategoryId(3)} style={[AppStyles.row, {alignItems: 'center'}]}>
                        <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold',
                             textAlign: this.state.isRTL ? 'right' : 'left'}}>
                            {'WOMEN CLOTHING'}
                        </Text>
                    </TouchableOpacity> 
                </View>
                {this.state.isShowWomenClothing && (
                <View>
                    <View  style={[AppStyles.row, {alignItems: 'center', height:40, marginLeft: 30}]}>
                        {this.state.isShowTops ? (
                            <Icon width={30} image={require("../resources/icons/bottom.png")} onPress={() => this.setState({isShowTops: !this.state.isShowTops})}/>
                        ): (
                            <Icon width={30} image={require("../resources/icons/right.png")} onPress={() => this.setState({isShowTops: !this.state.isShowTops})}/>
                        )}
                        <TouchableOpacity onPress={() => this.navigationToListProductWithCategoryId(4)} style={[AppStyles.row, {alignItems: 'center'}]}>
                            <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold',
                                textAlign: this.state.isRTL ? 'right' : 'left'}}>
                                {'TOPS & BOTTOMS'}
                            </Text>
                        </TouchableOpacity> 
                    </View>
                        {this.state.isShowTops && (
                            <View>
                                <TouchableOpacity style={{ height: 40, flexDirection: 'row', alignItems: 'center'}} onPress={() => this.navigationToListProductWithCategoryId(107)}>
                                    <Text style={{fontSize: 14, color: 'black', fontWeight: 'bold', marginLeft: 75,
                                        textAlign: this.state.isRTL ? 'right' : 'left'}}>
                                        {'Tops & Bottoms'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{height: 40, flexDirection: 'row', alignItems: 'center'}} onPress={() => this.navigationToListProductWithCategoryId(27)}>
                                    <Text style={{fontSize: 14, color: 'black', fontWeight: 'bold', marginLeft: 75,
                                        textAlign: this.state.isRTL ? 'right' : 'left'}}>
                                        {'Jumpsuit'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    <View  style={[AppStyles.row, {alignItems: 'center', height:40, marginLeft: 60}]}>
                        <TouchableOpacity onPress={() => this.navigationToListProductWithCategoryId(8)} style={[AppStyles.row, {alignItems: 'center'}]}>
                            <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold',
                                textAlign: this.state.isRTL ? 'right' : 'left'}}>
                                {'DRESSES'}
                            </Text>
                        </TouchableOpacity> 
                    </View>
                    <View  style={[AppStyles.row, {alignItems: 'center', height:40, marginLeft: 30}]}>
                        {this.state.isShowEvening ? (
                            <Icon width={30} image={require("../resources/icons/bottom.png")} onPress={() => this.setState({isShowEvening: !this.state.isShowEvening})}/>
                        ): (
                            <Icon width={30} image={require("../resources/icons/right.png")} onPress={() => this.setState({isShowEvening: !this.state.isShowEvening})}/>
                        )}
                        <TouchableOpacity onPress={() => this.navigationToListProductWithCategoryId(95)} style={[AppStyles.row, {alignItems: 'center'}]}>
                            <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold',
                                textAlign: this.state.isRTL ? 'right' : 'left'}}>
                                {'EVENING & COCKTAIL DRESSES'}
                            </Text>
                        </TouchableOpacity> 
                    </View>
                        {this.state.isShowEvening && (
                            <View>
                                <TouchableOpacity style={{height: 40, flexDirection: 'row', alignItems: 'center'}} onPress={() => this.navigationToListProductWithCategoryId(10)}>
                                    <Text style={{fontSize: 14, color: 'black', fontWeight: 'bold', marginLeft: 75,
                                        textAlign: this.state.isRTL ? 'right' : 'left'}}>
                                        {'Evening & Cocktail Dresses'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                </View>
                )}
                   
                <TouchableOpacity style={{height: 40, marginTop: 10}} onPress={() => this.navigationToListProductWithCategoryId(13)}>
                    <Text style={{fontSize: 14, color: 'black', fontWeight: 'bold', marginLeft: 30,
                         textAlign: this.state.isRTL ? 'right' : 'left'}}>
                        {'NEW ARRIVAL'}
                     </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{height: 40}} onPress={() => this.navigationToListProductWithCategoryId(14)}>
                    <Text style={{height: 40, fontSize: 14, color: 'black', fontWeight: 'bold', marginLeft: 30,
                         textAlign: this.state.isRTL ? 'right' : 'left'}}>
                        {'TOP TRENDS'}
                     </Text>
                </TouchableOpacity>
                
                <DrawerItems
                    {...this.props}
                    onItemPress={          ///////////   customize item
                        ({ route, focused }) => {
                            console.log("route object = ", route);
                            console.log("focused object = ", focused);
                            if (route.routeName === 'Language' || route.routeName == "لغة") {
                                this.setState({ langPickerVisible: true });
                            }
                            else if (route.routeName === 'CurrencyType' || route.routeName == "نوعالعملة") {
                                //this.props.navigation.navigate('DrawerClose');
                                this.setState({ currencyPickerVisible: true });
                            }
                            else if (route.routeName === 'MyAccount' || route.routeName == "حسابي"){
                                storage.get('customer_id').then((customerId) => {         
                                    if(customerId != null) {
                                        this.props.onItemPress({ route, focused });
                                    }else{
                                        this.onPressSign();
                                    }
                                });
                            }
                            else {
                                this.props.onItemPress({ route, focused });
                            }
                        }
                    }
                />
                
                <TouchableOpacity
                    onPress={() => this.onPressSign()}>
                    <Text style={{fontSize: 14, color: 'black', fontWeight: 'bold', marginLeft: 15,
                        marginTop: 20, textAlign: this.state.isRTL ? 'right' : 'left'}}>
                        {title}
                     </Text>
                </TouchableOpacity>
                <Spinner visible={this.state.loading} textContent={i18n.t('global.connecting', { locale: this.state.lang })} textStyle={{ color: '#FFF' }} />
            </ScrollView>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        //width: 320
        margin: 10
    },
    backdrop: {
        paddingTop: 60,
        width: 150,
        height: 150,
        borderRadius: 150 / 2
    },
    backdropView: {
        height: 100,
        width: 320,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    headline: {
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        color: '#000'
    },
    ImageContainer: {
        borderRadius: 150 / 2,
        width: 150,
        height: 150,
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#CDDC39',
        backgroundColor:"#343434"
        
      },
});

const mapStateToProps = state => ({
    // langName: state['0'],
    langName: state.languageReducer,
    currencyName : state.currencyReducer
})

const mapDispatchToProps = dispatch => ({
    changeLanguage: value => dispatch(changeLang(value)),
    changeCurrency: value => dispatch(changeCur(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleSelectDialog)