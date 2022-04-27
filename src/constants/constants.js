import utf8 from 'utf8'
import base64 from 'base-64'


export const LANG_LIST = ['English', 'عربى'];
export const CURRENTCY_LIST = ['AED', 'BHD', 'KWD', 'OMR', 'QAR', 'SAR', 'USD'];
export const CURRENTCY_LIST_AR = ['AED', 'BHD', 'KWD', 'OMR', 'QAR', 'SAR', 'USD'];
export const COUNTRY_LIST = ['Bahrain', 'Egypt', 'France', 'Germany', 'Iraq', 'Italy', 'Jordan', 'Kuwait', 'Lebanon', 'Oman', 'Qatar', 'Saudi Arabia', 'United Arab Emirates'];
export const COUNTRY_LIST_AR = ['Bahrain', 'Egypt', 'France', 'Germany', 'Iraq', 'Italy', 'Jordan', 'Kuwait', 'Lebanon', 'Oman', 'Qatar', 'Saudi Arabia', 'United Arab Emirates'];
export const  LABELS = ["Cart", "Delivery", "Carrier", "Payment", "Order"];
export const  LABELS_AR = ["Cart", "Delivery", "Carrier", "Payment", "Order"];
// Action Constants
export const SET_LANGUAGE_ACTION = 'CHANGE_LANGUAGE_ACTION';
export const SET_CURRENCY_ACTION = "CHANGE_CURRENCY_ACTION";

// export const Get_CURRENCIES_URL = "http://www.apilayer.net/api/live?access_key=8fab1e09ee171ab9ee7bb7262b6af4ee&format=1";

export const HTTP_SCHEM = "http://";
export const SERVER_DOMAIN = "kitandyar.com";
export const API_KEY = "DHY1T9TJIZ75LRVX612I1NHF88YVU2ZM";
export const FULL_JSON_FORMAT = "?display=full&output_format=JSON";
export const DISPLAY_FULL = "&display=full";
export const JSON_FORMAT = "&output_format=JSON";
export const BASE_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN;
export const IMAGE_WS_KEY = "&ws_key=" + API_KEY;
export const SCHEMA_SYNOPSIS = "schema=synopsis";
export const SCHEMA_BLANK = "schema=blank";

export const SIGNIN_URL = HTTP_SCHEM + SERVER_DOMAIN + "/api/customers/";
export const GET_CUSTOMER_SCHEMA_URL = HTTP_SCHEM + SERVER_DOMAIN + "/api/customers/?" + SCHEMA_SYNOPSIS + JSON_FORMAT;
export const POST_CUSTOMER_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/customers/ ?" + SCHEMA_SYNOPSIS + JSON_FORMAT;
export const HOME_URL = BASE_URL + "/api/categories/" + FULL_JSON_FORMAT;
export const PRODUCT_URL = BASE_URL + "/api/products/";
export const THUMB_IMAGE_URL = BASE_URL + "/api/images/products/";
export const GET_PROFILE_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/customers/?display=full&";
export const GET_ADDRESS_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/addresses/";
export const GET_ADDRESS_SCHEMA_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/addresses/?" + SCHEMA_BLANK + JSON_FORMAT;
export const POST_ADDRESS_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/addresses/?" + SCHEMA_SYNOPSIS + JSON_FORMAT;
export const GET_COUNTRY_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/countries/";
export const GET_CATRULE_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/cart_rules/";
export const POST_CART_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/carts/?" + SCHEMA_SYNOPSIS + JSON_FORMAT;
export const GET_CART_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/carts/";
export const GET_PRODUCT_OPTION_VALUES_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/product_option_values/";
export const GET_COMBINATIONS_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/combinations/";
export const GET_STOCK_AVAILABLES_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/stock_availables/?display=full";
export const GET_CATEGORY_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/categories/";
export const GET_ORDER_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/orders/";
export const GET_ORDER_STATES_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/order_states/?display=full&output_format=JSON";
export const GET_ORDER_SCHEMA_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/orders/?" + SCHEMA_BLANK + JSON_FORMAT;
export const POST_ORDER_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/orders/?" + SCHEMA_SYNOPSIS + JSON_FORMAT;
export const GET_CARRIER_SCHEMA_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/carriers/?" + SCHEMA_BLANK + JSON_FORMAT;
export const POST_CARRIER_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/carriers/?" + SCHEMA_SYNOPSIS + JSON_FORMAT;
export const GET_SPECIFIC_PRICE_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/specific_prices/";
export const GET_SEARCH_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/search/";
export const POST_GUEST_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/guests/?" + SCHEMA_SYNOPSIS + JSON_FORMAT;
export const GET_GUEST_SCHEMA_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/guests/?" + SCHEMA_BLANK + JSON_FORMAT;
export const GET_GUEST_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/guests/";
export const GET_CURRENCIES_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/currencies/";
export const GET_TAXRULE_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/tax_rules/";
export const GET_TAX_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/taxes/";
export const GET_WEIGHT_RAGNES_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/weight_ranges/";
export const GET_ZONES_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/zones/";
export const GET_DELIVERIES_URL = HTTP_SCHEM + API_KEY + "@" + SERVER_DOMAIN + "/api/deliveries/";

// Encoded of Http Header String
var binaryToBase64 = require('binaryToBase64');
var username = API_KEY;
var pwd = "";
var authToBytes = username + ":" + "";
var bytes = utf8.encode(authToBytes);
var encoded = binaryToBase64(bytes);
export const HEADER_ENCODED = encoded;

var paypal_username = "AYFFCwYMThDBnEqgNdlxj_dEHDfpSLBHOYEiawk4Ca67TItML3ZNYfkbgn2zzKrDESmOQ4YijKE2LZwv";
var paypal_pwd = "ENFfCxIko0owTBLj0VWymc7IZJk2rqfgzUJ2_dfWvxxk0J7sve2RBA5hdlm9Wz0KftMsWe7w2tjQpxdO";
var paypal_authToBytes = paypal_username + ":" + paypal_pwd;
var paypal_bytes = utf8.encode(paypal_authToBytes);
var paypal_encoded = binaryToBase64(paypal_bytes);
export const Paypal_HEADER_ENCODED = paypal_encoded;

// Templete of Body for Post&Put Method
export const CART_TEMP = {"cart":{
    "id": "",
    "id_address_delivery": "",
    "id_address_invoice": "",
    "id_currency": "",
    "id_customer": "",
    "id_guest": "",
    "id_lang": "",
    "id_shop_group": "",
    "id_shop": "",
    "id_carrier": "",
    "recyclable": "",
    "gift": "",
    "gift_message": "",
    "mobile_theme": "",
    "delivery_option": "",
    "secure_key": "",
    "allow_seperated_package": "",
    "date_add": "",
    "date_upd": "",
    "associations":{
    "cart_rows":{}
    
    }
    }
};

export const PRE_OF_BODY_XML = '<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">';
export const END_OF_BODY_XML = '</prestashop>';