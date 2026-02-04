import { View, Image, StyleSheet, Platform } from 'react-native';
import { style as themeStyle } from  "../constants/theme";

interface HeaderProps {
    style?: object;
}

export default function Header({ style: customStyle }: HeaderProps) {
    return (
        // Merging themeStyle with any customStyle passed via props
        // We ensure a default height and alignment if themeStyle isn't loaded
        <View style={[styles.defaultContainer, themeStyle.heada, customStyle]}>
            <Image
                source={require('../assets/images/LiquidCrest_Logo.png')}
                style={[styles.defaultLogo, themeStyle.headaLogo]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    defaultContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'ios' ? 10 : 20, // Proper spacing for status bars
        backgroundColor: 'transparent',
    },
    defaultLogo: {
        width: 180, // Fallback width
        height: 60,  // Fallback height
    }
});