import Colors from "./Colors";
import Metrics from "./Metrics";

const type = {
  Light: 'Roboto-Light',
  Dash: 'Roboto-Light',
  Book: 'Roboto-Bold',
  Bold: 'Roboto-Bold'
};

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 24,
  h5: 20,
  h6: 19,
  large: 18,
  normal: 16,
  medium: 14,
  small: 12,
  tiny: 8,
};

const style = {
  h1: {
    fontFamily: type.Book,
    fontSize: size.h1,
    textAlign: 'left',
  },
  h2: {
    fontFamily: type.Book,
    fontSize: size.h2,
    textAlign: 'left',
  },
  h3: {
    fontFamily: type.Book,
    fontSize: size.h3,
    textAlign: 'left',
  },
  h4: {
    fontFamily: type.Book,
    fontSize: size.h4,
    textAlign: 'left',
  },
  h5: {
    fontFamily: type.Book,
    fontSize: size.h5,
    textAlign: 'left',
  },
  h6: {
    fontFamily: type.Book,
    fontSize: size.h6,
    textAlign: 'left',
  },
  description: {
    fontFamily: type.Book,
    fontSize: size.medium,
    textAlign: 'left',
  },
  small: {
    fontFamily: type.Book,
    fontSize: size.small,
    textAlign: 'left',
  },
  tiny: {
    fontFamily: type.Book,
    fontSize: size.tiny,
    textAlign: 'left',
  },
  medium: {
    fontFamily: type.Book,
    fontSize: size.medium,
    textAlign: 'left',
  },
  large: {
    fontFamily: type.Book,
    fontSize: size.large,
    textAlign: 'left',
  },
  normal: {
    fontFamily: type.Book,
    fontSize: size.normal,
    textAlign: 'left',
  },
  bold: {
    fontFamily: type.Bold,
    textAlign: 'left',
  },
  title: {
    fontFamily: type.Bold,
    fontSize: size.h4,
    textAlign: 'left',
    color: Colors.black,
    marginVertical: Metrics.baseMargin
  },
};

export default {
  type,
  size,
  style,
};
