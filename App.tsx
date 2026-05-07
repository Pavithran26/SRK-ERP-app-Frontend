import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This Software Developed and Managed by{' '}
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Pavithran26')}>
          <Text style={styles.linkText}>Pavithran S</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
  linkText: {
    fontSize: 12,
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
});
