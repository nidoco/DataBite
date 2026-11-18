import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import loadQuiz from '../data/loadQuiz';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export function QuizScreen({ navigation }: Props) {
  const quiz = loadQuiz();

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Preguntas cargadas: {quiz.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  texto: {
    color: '#cbd5e0',
    fontSize: 18,
  },
});
