/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform, StyleSheet } from 'react-native';
// import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  
  container: {
        flex: 1,
        backgroundColor:'rgba(118, 172, 216, 1)',
        marginVertical: 35,
    },
    headaLogo: {
        width: 200,
        fontSize: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heada: {
        marginTop: 0,
        marginBottom: 40,
        //backgroundColor: 'red',
        alignSelf: 'center',
    },
  greetText: {
    fontSize: 28,
    fontWeight: 'condensedBold',
  },

  greetTextDive:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animateContainer:{
    justifyContent: 'center',
    alignItems: 'center',
  },
    logContainer: {
      flex: 1,
      backgroundColor:'rgba(118, 172, 216, 1)',
      marginVertical: 35,
      justifyContent: 'center',
      alignItems: 'center',
    },

  logGreetText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },

  citizenship:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  yesBtn:{
    backgroundColor: 'rgba(12, 66, 110, 1)',
    padding: 10,
    width: 60,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },

    noBtn:{
    backgroundColor: 'rgba(12, 66, 110, 1)',
    padding: 10,
    width: 60,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },

  ctzTextOpt:{
    color: 'white',
    fontSize: 18,
  },
  //bvn_validation page style
    bvnlogContainer: {
        flex: 1,
        backgroundColor:'rgba(118, 172, 216, 1)',
        marginVertical: 35,
        justifyContent: 'center',
        alignItems: 'center',

    },
  bvnlogGreetText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  bvnctzTextOpt:{
    color: 'white',
    fontSize: 18,
  },

    bvnnoBtn:{
    backgroundColor: 'rgba(13, 146, 235, 1)',
    padding: 10,
    width: '95%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  labFname: {
    alignSelf: 'flex-start',
    marginLeft: 27,
    marginTop: 20,
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
    labLname: {
    //alignSelf: 'flex-start',
    marginLeft: -230,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bvnFname: {
    borderBottomColor: 'rgba(118, 172, 216, 1)',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    width: '85%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
    bvnLname: {
    borderBottomColor: 'rgba(118, 172, 216, 1)',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    width: '85%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  //Non Nigerian onboarding page style
   non_container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  selection: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },


});
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
