var storage = require("react-native-local-storage");

export function ChangeCurrency(price, oldCurrency, currency, currencies, ){
  rate = 1;
    if (oldCurrency == '$') {oldCurrency = 'USD'}
    if (currency == '$') {currency = 'USD'}
    if(currencies != null){
      for(var i=0; i<currencies.length; i++){
        currencyKey = currencies[i].iso_code;
        if(currency == currencyKey){
          rate = currencies[i].conversion_rate;
        }
      };
    }
    return formatOfPrice(price * rate);
  }

  export function formatOfPrice(price){
    var formatedPrice = Math.round(price * 100) / 100;
    return formatedPrice;
  }
