import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Alert,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Animatable from 'react-native-animatable';
import SettingsScreen from './SettingsScreen';
import StartScreen from './StartScreen';
import CuteLoader from './CuteLoader';
import MainScreen from './MainScreen';

const { width, height } = Dimensions.get('window');

// Questions database
const questionsData = {
  truth: [
    "What's the most embarrassing thing you've ever done?",
    "Who was your first crush?",
    "What's your biggest fear?",
    "What's the weirdest dream you've ever had?",
    "What's something you've never told your parents?",
    "What's your most embarrassing childhood memory?",
    "What's the worst lie you've ever told?",
    "What's something you're secretly proud of?",
    "What's your biggest pet peeve?",
    "What's the most childish thing you still do?",
    "What's something you've always wanted to try but haven't?",
    "What's your most irrational fear?",
    "What's the strangest food combination you enjoy?",
    "What's something you're terrible at but pretend you're good at?",
    "What's your most embarrassing social media post?",
    "What's something you do when no one's watching?",
    "What's the weirdest thing you believed as a child?",
    "What's your most embarrassing autocorrect fail?",
    "What's something you're afraid to admit?",
    "What's the most ridiculous thing you've cried over?"
  ],
  dare: [
    "Do 20 jumping jacks",
    "Sing your favorite song out loud",
    "Do your best impression of a famous person",
    "Dance for 30 seconds without music",
    "Tell a joke and make everyone laugh",
    "Do 10 push-ups",
    "Speak in an accent for the next 3 rounds",
    "Do a cartwheel or handstand",
    "Call someone and sing 'Happy Birthday' to them",
    "Do your best animal impression",
    "Do 15 squats",
    "Tell everyone your most embarrassing story",
    "Do a silly dance",
    "Speak only in rhymes for the next 2 rounds",
    "Do 20 sit-ups",
    "Act out a movie scene",
    "Do your best impression of a baby",
    "Do 10 burpees",
    "Tell a story using only gestures",
    "Do your best robot impression"
  ]
};

export default function App() {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameMode, setGameMode] = useState(null); // 'truth' or 'dare'
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [players, setPlayers] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMain, setShowMain] = useState(true);
  const [showStart, setShowStart] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [loadingLabel, setLoadingLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getRandomQuestion = (mode) => {
    const questionList = questionsData[mode];
    const randomIndex = Math.floor(Math.random() * questionList.length);
    return questionList[randomIndex];
  };

  const handleTruth = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsLoading(true);
    setLoadingLabel('Picking a juicy truth...');
    setTimeout(() => {
      setGameMode('truth');
      const question = getRandomQuestion('truth');
      setCurrentQuestion(question);
      setShowQuestion(true);
      setIsLoading(false);
      animateQuestion();
    }, 600);
  };

  const handleDare = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsLoading(true);
    setLoadingLabel('Finding a spicy dare...');
    setTimeout(() => {
      setGameMode('dare');
      const question = getRandomQuestion('dare');
      setCurrentQuestion(question);
      setShowQuestion(true);
      setIsLoading(false);
      animateQuestion();
    }, 600);
  };

  const animateQuestion = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const nextPlayer = () => {
    setCurrentPlayer((prev) => (prev % players.length) + 1);
    setShowQuestion(false);
    setGameMode(null);
    setCurrentQuestion('');
    scaleAnim.setValue(1);
  };

  const completeChallenge = () => {
    setScores(prev => {
      const newScores = [...prev];
      newScores[currentPlayer - 1] += 1;
      return newScores;
    });
    Alert.alert(
      "Great job!",
      `${players[currentPlayer - 1]} completed the challenge!`,
      [{ text: "Next Player", onPress: nextPlayer }]
    );
  };

  const skipChallenge = () => {
    Alert.alert(
      "Challenge Skipped",
      `${players[currentPlayer - 1]} skipped the challenge.`,
      [{ text: "Next Player", onPress: nextPlayer }]
    );
  };

  const resetGame = () => {
    setCurrentPlayer(1);
    setGameMode(null);
    setCurrentQuestion('');
    setShowQuestion(false);
    setScores([0, 0, 0, 0]);
    scaleAnim.setValue(1);
  };

  const goHome = () => {
    setShowQuestion(false);
    setShowStart(false);
    setShowSettings(false);
    setShowMain(true);
  };

  const handleUpdatePlayers = (newPlayers, newScores = null) => {
    setPlayers(newPlayers);
    if (newScores) {
      setScores(newScores);
    } else {
      // Adjust scores array if needed
      const updatedScores = [...scores];
      while (updatedScores.length < newPlayers.length) {
        updatedScores.push(0);
      }
      setScores(updatedScores.slice(0, newPlayers.length));
    }
  };

  const handleStartGame = (setupPlayers) => {
    const sanitized = setupPlayers.map((p, i) => (p && p.trim() ? p.trim() : `Player ${i + 1}`));
    setPlayers(sanitized);
    setScores(new Array(sanitized.length).fill(0));
    setCurrentPlayer(1);
    setShowStart(false);
    setShowMain(false);
  };

  const openStartFromMain = () => {
    setShowMain(false);
    setShowStart(true);
  };

  const backToMain = () => {
    setShowStart(false);
    setShowMain(true);
  };

  if (showSettings) {
    return (
      <SettingsScreen
        onBack={() => setShowSettings(false)}
        onUpdatePlayers={handleUpdatePlayers}
        players={players}
        scores={scores}
      />
    );
  }

  if (showQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#E91E63" />
        <LinearGradient
          colors={gameMode === 'truth' ? ['#ff6b6b', '#ff8e8e'] : ['#4ecdc4', '#44a08d']}
          style={styles.container}
        >
          <View style={styles.questionContainer}>
            <Animatable.Text 
              animation="pulse" 
              iterationCount="infinite" 
              style={styles.playerText}
            >
              {players[currentPlayer - 1]}'s Turn
            </Animatable.Text>
            
            <Animated.View style={[styles.questionBox, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.questionType}>
                {gameMode === 'truth' ? 'TRUTH' : 'DARE'}
              </Text>
              <Text style={styles.questionText}>{currentQuestion}</Text>
            </Animated.View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]} 
                onPress={completeChallenge}
              >
                <Text style={styles.buttonText}>✓ Completed</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.skipButton]} 
                onPress={skipChallenge}
              >
                <Text style={styles.buttonText}>✗ Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (showMain) {
    return (
      <MainScreen onPlay={openStartFromMain} onOpenSettings={() => setShowSettings(true)} />
    );
  }

  if (showStart) {
    return (
      <StartScreen onStart={handleStartGame} onBack={backToMain} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E91E63" />
        <LinearGradient
          colors={['#E91E63', '#9C27B0', '#673AB7', '#3F51B5']}
          style={styles.container}
        >
        <View style={styles.header}>
          <Text style={styles.title}>Truth or Dare</Text>
          <Text style={styles.subtitle}>Choose your challenge!</Text>
        </View>

        <View style={styles.playerInfo}>
          <Text style={styles.currentPlayerText}>
            {players[currentPlayer - 1]}'s Turn
          </Text>
          <View style={styles.scoresContainer}>
            {players.map((player, index) => (
              <View key={index} style={styles.scoreItem}>
                <Text style={styles.scoreText}>{player}: {scores[index]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.choiceButton, styles.truthButton]} 
            onPress={handleTruth}
          >
            <Text style={styles.choiceButtonText}>TRUTH</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.choiceButton, styles.dareButton]} 
            onPress={handleDare}
          >
            <Text style={styles.choiceButtonText}>DARE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetButtonText}>Reset Game</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.resetButton, styles.settingsButton]} 
            onPress={() => setShowSettings(true)}
          >
            <Text style={styles.resetButtonText}>⚙️ Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.resetButton, styles.settingsButton]} 
            onPress={goHome}
          >
            <Text style={styles.resetButtonText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>
      {isLoading && <CuteLoader label={loadingLabel || 'Loading...'} />}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.9,
  },
  playerInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  currentPlayerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  scoreItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 5,
  },
  scoreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  choiceButton: {
    width: width * 0.7,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  truthButton: {
    backgroundColor: '#E91E63',
  },
  dareButton: {
    backgroundColor: '#9C27B0',
  },
  choiceButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  playerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  questionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 40,
    width: width * 0.9,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  questionType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    letterSpacing: 2,
  },
  questionText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
  },
  actionButton: {
    width: width * 0.4,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  completeButton: {
    backgroundColor: '#E91E63',
  },
  skipButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomButtons: {
    alignItems: 'center',
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
