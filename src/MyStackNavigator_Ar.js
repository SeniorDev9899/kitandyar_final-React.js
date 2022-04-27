import {
    Platform,
    ScrollView,
    Text,
    View,
    Image,
    StyleSheet
  } from 'react-native';
  
  import {
    StackNavigator,
  } from 'react-navigation';
  
  //Intro
  import LaunchScreen from "./containers/Intro/LaunchScreen";
  import OnboardingScreen from "./containers/Intro/OnboardingScreen";
  
  //authentication
  import NewsLetterScreen from "./containers/Authentication/NewsLetterScreen";
  import SignInScreen from "./containers/Authentication/SignInScreen";
  import SignUpWithScreen from "./containers/Authentication/SignUpWithScreen";
  import PasswordForgotScreen from "./containers/Authentication/PasswordForgotScreen";
  import SignUpWithEmailScreen from "./containers/Authentication/SignUpWithEmailScreen";
  import GuestSignUpScreen from "./containers/Authentication/GuestSignUpScreen";
  
  //Home
  import HomeScreen from "./containers/Home/HomeScreen";
  
  //Map
  import MapScreen from "./containers/Map/MapScreen";
  
  //Product
  import ProductDetailScreen from "./containers/Product/ProductDetailScreen";
  import ListProductScreen from "./containers/Product/ListProductScreen";
  import SearchProductScreen from "./containers/Product/SearchProductScreen";
  import CommentaireScreen from "./containers/Product/CommentaireScreen";
  import AddCommenterScreen from "./containers/Product/AddCommenterScreen";
  
  //Cart 
  import CartScreen from "./containers/Cart/CartScreen";
  import DeliveryScreen from "./containers/Cart/DeliveryScreen";
  import CarrierScreen from "./containers/Cart/CarrierScreen";
  import PayementScreen from "./containers/Cart/PayementScreen";
  import ThankScreen from "./containers/Cart/ThankScreen";
  import OrderDetailScreen from "./containers/Cart/OrderDetailScreen";
  import PaypalScreen from "./containers/Cart/PaypalScreen";
  
  //Setting
  import ProfileScreen from "./containers/Setting/ProfileScreen";
  import OrderScreen from "./containers/Setting/OrderScreen";
  import TermsScreen from "./containers/Setting/TermsScreen";
  import AboutScreen from "./containers/Setting/AboutScreen";
  import CardCreditScreen from "./containers/Setting/CardCreditScreen";
  import AddCardCreditScreen from "./containers/Setting/AddCardCreditScreen";
  import UpdateCardCreditScreen from "./containers/Setting/UpdateCardCreditScreen";
  import NotificationScreen from "./containers/Setting/NotificationScreen";
  import AddressScreen from "./containers/Setting/AddressScreen";
  import AddAddressScreen from "./containers/Setting/AddAddressScreen";
  import AddressDetailScreen from "./containers/Setting/AddressDetailScreen";
import AppNavigator_Ar from './AppNavigator_Ar';
  
  const Routes = {
    Launch: {
      name: 'Launch',
      navigationOptions: {
        header: null,
      },
      screen: LaunchScreen,
    },
    Onboarding: {
      name: 'Onboarding',
      navigationOptions: {
        header: null,
      },
      screen: OnboardingScreen,
    },
    NewsLetter: {
      name: 'NewsLetter',
      navigationOptions: {
        header: null,
      },
      screen: NewsLetterScreen,
    },
    SignIn: {
      name: 'SignIn',
      navigationOptions: {
        header: null,
      },
      screen: SignInScreen,
    },
    SignUpWith: {
      name: 'SignUpWith',
      navigationOptions: {
        header: null,
      },
      screen: SignUpWithScreen
    },
    PasswordForget: {
      name: 'PasswordForget',
      navigationOptions: {
        header: null,
      },
      screen: PasswordForgotScreen
    },
    SignUpWithEmail: {
      name: 'SignUpWithEmail',
      navigationOptions: {
        header: null,
      },
      screen: SignUpWithEmailScreen
    },
    GuestSignUp: {
      name: 'GuestSignUp',
      navigationOptions: {
        header: null,
      },
      screen: GuestSignUpScreen
    },
    Home: {
      name: 'Home',
      navigationOptions: {
        header: null,
      },
      screen: HomeScreen,
    },
    ProductDetail: {
      name: 'ProductDetail',
      navigationOptions: {
        header: null,
      },
      screen: ProductDetailScreen,
    },
    ListProduct: {
      name: 'ListProduct',
      navigationOptions: {
        header: null,
      },
      screen: ListProductScreen,
    },
    SearchProduct: {
      name: 'SearchProduct',
      navigationOptions: {
        header: null,
      },
      screen: SearchProductScreen,
    },
    Commentaire: {
      name: 'Commentaire',
      navigationOptions: {
        header: null,
      },
      screen: CommentaireScreen,
    },
    AddCommenter: {
      name: 'AddCommenter',
      navigationOptions: {
        header: null,
      },
      screen: AddCommenterScreen,
    },
    Cart: {
      name: 'Cart',
      navigationOptions: {
        header: null,
      },
      screen: CartScreen,
    },
    Payement: {
      name: 'Payement',
      navigationOptions: {
        header: null,
      },
      screen: PayementScreen,
    },
    Paypal: {
      name: 'Paypal',
      navigationOptions: {
        header: null,
      },
      screen: PaypalScreen,
    },
    Delivery: {
      name: 'Delivery',
      navigationOptions: {
        header: null,
      },
      screen: DeliveryScreen,
    },
    Carrier: {
      name: 'Carrier',
      navigationOptions: {
        header: null,
      },
      screen: CarrierScreen,
    },
    Thank: {
      name: 'Thank',
      navigationOptions: {
        header: null,
      },
      screen: ThankScreen,
    },
    OrderDetail: {
      name: 'ORderDetail',
      navigationOptions: {
        header: null,
      },
      screen: OrderDetailScreen,
    },
    Profile: {
      name: "Profile",
      navigationOptions: {
        header: null,
      },
      screen: ProfileScreen
    },
    Order: {
      name: "Order",
      navigationOptions: {
        header: null,
      },
      screen: OrderScreen
    },
    Terms: {
      name: "Terms",
      navigationOptions: {
        header: null,
      },
      screen: TermsScreen
    },
    About: {
      name: "About",
      navigationOptions: {
        header: null,
      },
      screen: AboutScreen
    },
    AddCardCredit: {
      name: "AddCardCredit",
      navigationOptions: {
        header: null,
      },
      screen: AddCardCreditScreen
    },
    UpdateCardCredit : {
      name: "UpdateCardCredit",
      navigationOptions: {
        header: null,
      },
      screen: UpdateCardCreditScreen
    },
    CardCredit: {
      name: "CardCredit",
      navigationOptions: {
        header: null,
      },
      screen: CardCreditScreen
    },
    Notification: {
      name: "Notification",
      navigationOptions: {
        header: null,
      },
      screen: NotificationScreen
    },
    Address: {
      name: "Address",
      navigationOptions: {
        header: null,
      },
      screen: AddressScreen
    },
    AddAddress: {
      name: "AddAddress",
      navigationOptions: {
        header: null,
      },
      screen: AddAddressScreen
    },
    AddressDetail: {
      name: "AddressDetail",
      navigationOptions: {
        header: null,
      },
      screen: AddressDetailScreen
    },
    Map: {
      name: "Map",
      navigationOptions: {
        header: null,
      },
      screen: MapScreen
    }
  };

  export default MyStackNavigator_Ar = StackNavigator(
    {
        OutHome: {screen: AppNavigator_Ar},
      ...Routes,
    },
    {
      headerMode: 'none',
      mode: 'card',
      navigationOptions: {
        headerTitleStyle: {
          color: "#FF0000",
          alignSelf: 'center',
          fontSize: 16,
        },
        headerStyle: {
          borderBottomWidth: 0,
          borderBottomColor: "#00FF00",
        },
      },
      
    },
    {
      initialRouteName: 'OutHome',
    }
  );
  