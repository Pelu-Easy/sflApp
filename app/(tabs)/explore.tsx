import {View, Text, StyleSheet, Button } from 'react-native';
import {router} from 'expo-router';

export default function TabTwoScreen() {

    const handleNavigationToRoot = () => {
    router.dismissAll();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.exploreTextDive}>
        <Text style={styles.exploreText}>Welcome to Explore tab</Text>
      </View>
      <Button title='Main Page' onPress={handleNavigationToRoot} />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
        flex: 1,
        backgroundColor:'rgba(118, 172, 216, 1)',
        marginVertical: 35,
    },
  exploreText: {
    fontSize: 28,
    fontWeight: 'condensedBold',
  },

  exploreTextDive:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
