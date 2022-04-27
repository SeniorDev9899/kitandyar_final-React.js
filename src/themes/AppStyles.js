import Fonts from './Fonts';
import Metrics from './Metrics';
import Colors from './Colors';

const AppStyles = {
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 40
  },
  imageContainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  end: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  shadow: {
    elevation: 5,
    shadowColor: Colors.white,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 3
    },
  },
  imageView: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.image
  },
  imageContain: { 
    flex: 1,
    width: null,
    height: null,
  },
  imageContainFlex: {
    justifyContent: 'center', 
    flex: 1
  },
  imageCover: { 
    width: null,
    height: null,
    flex: 1
  },
  wrap: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  blockRadius: {
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 10
  },
  blockLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: "center"
  },
  blockRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: "center"
  },
  positionRightLeft: {
    position: "absolute",
    left: 0,
    right: 0
  },
  positionTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
    margin: Metrics.smallMargin
  },
  positionTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    margin: Metrics.smallMargin
  },
  positionBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 1,
    margin: Metrics.smallMargin
  },
  positionBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 1,
    margin: Metrics.smallMargin
  }
};

export default AppStyles;