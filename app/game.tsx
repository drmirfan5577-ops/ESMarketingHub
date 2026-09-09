import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TextInput, Modal, Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useAlert } from '@/template';

interface LeaderboardEntry {
  name: string;
  score: number;
  game: string;
  date: string;
  medal: 'gold' | 'silver' | 'bronze' | null;
}

const GAME_GENRES = [
  { id: 'puzzle', name: 'Puzzle', icon: 'extension', color: '#00D4FF', desc: 'Tap to match colored tiles' },
  { id: 'runner', name: 'Endless Runner', icon: 'directions-run', color: '#00C853', desc: 'Tap to jump over obstacles' },
  { id: 'clicker', name: 'Idle Clicker', icon: 'touch-app', color: '#FFD700', desc: 'Tap to earn coins' },
  { id: 'quiz', name: 'Quiz Game', icon: 'quiz', color: '#7B2FBE', desc: 'Answer marketing questions' },
  { id: 'memory', name: 'Memory Match', icon: 'grid-view', color: '#FF6B35', desc: 'Find matching pairs' },
  { id: 'trivia', name: 'Trivia Challenge', icon: 'lightbulb', color: '#FF1744', desc: 'Test your knowledge' },
];

const QUIZ_QUESTIONS = [
  { q: 'What does ROI stand for?', options: ['Rate of Interest', 'Return on Investment', 'Revenue Over Income', 'Risk of Investment'], correct: 1 },
  { q: 'Which platform is best for B2B marketing?', options: ['TikTok', 'Instagram', 'LinkedIn', 'Snapchat'], correct: 2 },
  { q: 'What is the optimal email subject line length?', options: ['10-15 chars', '40-50 chars', '80-100 chars', '120+ chars'], correct: 1 },
  { q: 'ROAS of 3x means?', options: ['3% profit', '$3 revenue per $1 spent', '$3 saved per ad', '3 clicks per view'], correct: 1 },
  { q: 'Best time to post on Instagram?', options: ['6-8 AM', '12-2 PM', '6-9 PM', '11 PM'], correct: 2 },
  { q: 'What is CTR?', options: ['Cost to Revenue', 'Click Through Rate', 'Customer Total Rate', 'Content Traffic Rank'], correct: 1 },
];

const MEMORY_ITEMS = [
  { id: 1, icon: 'search', color: '#00D4FF', label: 'SEO' },
  { id: 2, icon: 'email', color: '#FF6B35', label: 'Email' },
  { id: 3, icon: 'people', color: '#1877F2', label: 'Social' },
  { id: 4, icon: 'bar-chart', color: '#FFD700', label: 'Analytics' },
  { id: 5, icon: 'movie', color: '#FF1744', label: 'Video' },
  { id: 6, icon: 'location-on', color: '#7B2FBE', label: 'Local' },
];

const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game config
  const [gameName, setGameName] = useState('Marketing Master');
  const [primaryColor, setPrimaryColor] = useState('#FFD700');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { name: 'ProMarketer', score: 60, game: 'Quiz', date: '2025-07-01', medal: 'gold' },
    { name: 'SocialPro', score: 50, game: 'Quiz', date: '2025-07-01', medal: 'silver' },
    { name: 'AdExpert', score: 40, game: 'Quiz', date: '2025-06-30', medal: 'bronze' },
    { name: 'ContentKing', score: 1240, game: 'Clicker', date: '2025-06-30', medal: null },
    { name: 'ViralGrowth', score: 312, game: 'Runner', date: '2025-06-29', medal: null },
  ]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('You');

  // Quiz state
  const [qIndex, setQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Clicker state
  const [clicks, setClicks] = useState(0);
  const [clickerCoins, setClickerCoins] = useState(0);
  const clickAnim = useRef(new Animated.Value(1)).current;

  // Memory state
  const [memCards, setMemCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [memMoves, setMemMoves] = useState(0);

  // Runner state
  const [runnerScore, setRunnerScore] = useState(0);
  const [jumping, setJumping] = useState(false);
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const runnerInterval = useRef<any>(null);

  const startGame = (genreId: string) => {
    setSelectedGenre(genreId);
    setGameActive(true);
    setScore(0);

    if (genreId === 'quiz') {
      setQIndex(0); setSelectedAnswer(null); setQuizScore(0); setQuizDone(false);
    } else if (genreId === 'clicker') {
      setClicks(0); setClickerCoins(0);
    } else if (genreId === 'memory') {
      const doubled = shuffle([...MEMORY_ITEMS, ...MEMORY_ITEMS].map((item, i) => ({ ...item, uid: i })));
      setMemCards(doubled); setFlipped([]); setMatched([]); setMemMoves(0);
    } else if (genreId === 'runner') {
      setRunnerScore(0);
      runnerInterval.current = setInterval(() => {
        setRunnerScore(prev => prev + 1);
      }, 200);
    }
  };

  const endGame = (finalScore: number) => {
    if (runnerInterval.current) { clearInterval(runnerInterval.current); runnerInterval.current = null; }
    setGameActive(false);
    const newHigh = Math.max(highScore, finalScore);
    setHighScore(newHigh);
    // Add to leaderboard
    const newEntry: LeaderboardEntry = {
      name: playerName || 'Player',
      score: finalScore,
      game: genre?.name || 'Game',
      date: new Date().toISOString().split('T')[0],
      medal: null,
    };
    setLeaderboard(prev => {
      const updated = [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
      return updated.map((e, i) => ({ ...e, medal: i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : null }));
    });

  // Leaderboard Modal
  const renderLeaderboard = () => (
    <Modal visible={showLeaderboard} animationType="slide" onRequestClose={() => setShowLeaderboard(false)}>
      <View style={[styles.leaderModal, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.leaderModalHeader}>
          <Pressable onPress={() => setShowLeaderboard(false)} style={styles.backBtn}>
            <MaterialIcons name="close" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.leaderModalTitle}>Leaderboard</Text>
          <Pressable onPress={() => { showAlert('Reset', 'Clear all scores?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear', style: 'destructive', onPress: () => { setLeaderboard([]); setShowLeaderboard(false); } }]); }}>
            <MaterialIcons name="delete-outline" size={20} color={Colors.textMuted} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
          {leaderboard.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <MaterialIcons name="leaderboard" size={48} color={Colors.textMuted} />
              <Text style={{ color: Colors.textSecondary, marginTop: 12, fontSize: FontSize.md }}>No scores yet — play a game!</Text>
            </View>
          ) : leaderboard.map((entry, i) => (
            <View key={i} style={[styles.leaderRow, entry.name === (playerName || 'Player') && { borderColor: Colors.primary }]}>
              <View style={styles.rankWrap}>
                <Text style={styles.rankText}>{i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.leaderName, entry.name === (playerName || 'Player') && { color: Colors.primary }]}>{entry.name}</Text>
                <Text style={styles.leaderMeta}>{entry.game} · {entry.date}</Text>
              </View>
              <Text style={[styles.leaderScore, { color: i === 0 ? Colors.primary : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : Colors.text }]}>
                {entry.score.toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
    showAlert('Game Over!', `Score: ${finalScore}\nHigh Score: ${newHigh}\n\nAdded to leaderboard!`);
  };

  const jump = () => {
    if (jumping) return;
    setJumping(true);
    Animated.sequence([
      Animated.timing(jumpAnim, { toValue: -60, duration: 300, useNativeDriver: true }),
      Animated.timing(jumpAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setJumping(false));
  };

  const handleClick = () => {
    setClicks(prev => prev + 1);
    setClickerCoins(prev => prev + 1);
    Animated.sequence([
      Animated.timing(clickAnim, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(clickAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const answerQuiz = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = QUIZ_QUESTIONS[qIndex].correct === answerIndex;
    if (correct) setQuizScore(prev => prev + 10);
    setTimeout(() => {
      if (qIndex < QUIZ_QUESTIONS.length - 1) {
        setQIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizDone(true);
        const finalScore = quizScore + (correct ? 10 : 0);
        setHighScore(prev => Math.max(prev, finalScore));
      }
    }, 1000);
  };

  const flipMemCard = (uid: number) => {
    if (flipped.includes(uid) || matched.includes(uid) || flipped.length >= 2) return;
    const newFlipped = [...flipped, uid];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMemMoves(prev => prev + 1);
      const [a, b] = newFlipped.map(u => memCards.find((c: any) => c.uid === u));
      if (a && b && a.id === b.id) {
        const newMatched = [...matched, ...newFlipped];
        setMatched(newMatched);
        setFlipped([]);
        setScore(prev => prev + 10);
        if (newMatched.length === memCards.length) {
          showAlert('Congratulations!', `Memory game complete!\nMoves: ${memMoves + 1}\nScore: ${score + 10}`);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const genre = GAME_GENRES.find(g => g.id === selectedGenre);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {renderLeaderboard()}
      <View style={styles.header}>
        <Pressable onPress={() => { if (gameActive) { if (runnerInterval.current) clearInterval(runnerInterval.current); setGameActive(false); } else router.back(); }} style={styles.backBtn}>
          <MaterialIcons name={gameActive ? 'close' : 'arrow-back'} size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{gameActive ? `${genre?.name} - ${gameName}` : 'Game Generator'}</Text>
          <Text style={styles.headerSub}>{gameActive ? `Score: ${selectedGenre === 'quiz' ? quizScore : selectedGenre === 'clicker' ? clickerCoins : selectedGenre === 'runner' ? runnerScore : score}` : 'Build & test marketing games'}</Text>
        </View>
        {highScore > 0 && !gameActive && (
          <View style={styles.highScoreBadge}>
            <MaterialIcons name="emoji-events" size={14} color={Colors.primary} />
            <Text style={styles.highScoreText}>Best: {highScore}</Text>
          </View>
        )}
      </View>

      {!gameActive ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Game Config */}
          <View style={styles.configCard}>
            <Text style={styles.configTitle}>Game Configuration</Text>
            <Text style={styles.fieldLabel}>Game Name</Text>
            <TextInput style={styles.field} value={gameName} onChangeText={setGameName}
              placeholder="e.g. Marketing Master" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.fieldLabel}>Your Player Name</Text>
            <TextInput style={styles.field} value={playerName} onChangeText={setPlayerName}
              placeholder="e.g. MarketingPro" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.fieldLabel}>Brand Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {['#FFD700', '#00D4FF', '#7B2FBE', '#FF1744', '#00C853', '#FF6B35'].map(color => (
                <Pressable key={color} onPress={() => setPrimaryColor(color)}
                  style={[styles.colorBtn, { backgroundColor: color }, primaryColor === color && styles.colorBtnSelected]}>
                  {primaryColor === color && <MaterialIcons name="check" size={18} color="#000" />}
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Leaderboard Button */}
          <Pressable style={styles.leaderboardBtn} onPress={() => setShowLeaderboard(true)}>
            <MaterialIcons name="leaderboard" size={20} color={Colors.primary} />
            <Text style={styles.leaderboardBtnText}>View Leaderboard ({leaderboard.length} entries)</Text>
            <MaterialIcons name="chevron-right" size={18} color={Colors.primary} />
          </Pressable>

          {/* Genre Selection */}
          <Text style={styles.sectionTitle}>Select Game Type</Text>
          <View style={styles.genreGrid}>
            {GAME_GENRES.map(genre => (
              <Pressable key={genre.id}
                style={({ pressed }) => [styles.genreCard, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
                onPress={() => startGame(genre.id)}>
                <View style={[styles.genreIcon, { backgroundColor: genre.color + '22' }]}>
                  <MaterialIcons name={genre.icon as any} size={32} color={genre.color} />
                </View>
                <Text style={styles.genreName}>{genre.name}</Text>
                <Text style={styles.genreDesc}>{genre.desc}</Text>
                <View style={[styles.playBtnSmall, { backgroundColor: genre.color }]}>
                  <Text style={styles.playBtnSmallText}>Play & Test</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Top 3 Leaderboard Preview */}
          {leaderboard.length > 0 && (
            <View style={styles.miniLeaderboard}>
              <Text style={styles.miniLeaderTitle}>🏆 Top Players</Text>
              {leaderboard.slice(0, 3).map((entry, i) => (
                <View key={i} style={styles.miniLeaderRow}>
                  <Text style={styles.miniMedal}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</Text>
                  <Text style={styles.miniName}>{entry.name}</Text>
                  <Text style={styles.miniGame}>{entry.game}</Text>
                  <Text style={[styles.miniScore, { color: i === 0 ? Colors.primary : i === 1 ? '#C0C0C0' : '#CD7F32' }]}>{entry.score}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Test Report */}
          {highScore > 0 && (
            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>Game Test Report</Text>
              <View style={styles.reportRow}>
                <MaterialIcons name="emoji-events" size={20} color={Colors.primary} />
                <Text style={styles.reportLabel}>Best Score</Text>
                <Text style={styles.reportValue}>{highScore} pts</Text>
              </View>
              <View style={styles.reportRow}>
                <MaterialIcons name="gamepad" size={20} color={Colors.accent2} />
                <Text style={styles.reportLabel}>Last Game</Text>
                <Text style={styles.reportValue}>{genre?.name || 'N/A'}</Text>
              </View>
              <Pressable style={styles.publishBtn}
                onPress={() => showAlert('Publish Game', `"${gameName}" is ready to publish!\nPlatforms: iOS App Store, Google Play Store\nMonetization: Rewarded Ads, In-App Purchases\n\nFull publish workflow coming soon!`)}>
                <MaterialIcons name="rocket-launch" size={18} color={Colors.background} />
                <Text style={styles.publishBtnText}>Ready to Publish</Text>
              </Pressable>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        /* GAME AREA */
        <View style={styles.gameArea}>
          {/* QUIZ GAME */}
          {selectedGenre === 'quiz' && !quizDone && (
            <View style={styles.quizGame}>
              <View style={styles.quizProgress}>
                <Text style={styles.quizProgressText}>Question {qIndex + 1} of {QUIZ_QUESTIONS.length}</Text>
                <View style={styles.quizProgressBar}>
                  <View style={[styles.quizProgressFill, { width: `${((qIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }]} />
                </View>
              </View>
              <Text style={styles.quizScore}>Score: {quizScore}</Text>
              <View style={styles.quizCard}>
                <Text style={styles.quizQ}>{QUIZ_QUESTIONS[qIndex].q}</Text>
              </View>
              <View style={styles.quizOptions}>
                {QUIZ_QUESTIONS[qIndex].options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = QUIZ_QUESTIONS[qIndex].correct === i;
                  let cardStyle = styles.optionCard;
                  let optColor = Colors.text;
                  let cardBg = Colors.surfaceCard;
                  if (selectedAnswer !== null && isSelected && isCorrect) { cardBg = Colors.success + '22'; optColor = Colors.success; }
                  if (selectedAnswer !== null && isSelected && !isCorrect) { cardBg = Colors.error + '22'; optColor = Colors.error; }
                  return (
                    <Pressable key={i} style={[cardStyle, { backgroundColor: cardBg }]}
                      onPress={() => selectedAnswer === null && answerQuiz(i)} disabled={selectedAnswer !== null}>
                      <Text style={[styles.optionLetter, { color: optColor }]}>{['A', 'B', 'C', 'D'][i]}</Text>
                      <Text style={[styles.optionText, { color: optColor }]}>{opt}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {selectedGenre === 'quiz' && quizDone && (
            <View style={styles.gameOverScreen}>
              <MaterialIcons name="emoji-events" size={72} color={Colors.primary} />
              <Text style={styles.gameOverTitle}>Quiz Complete!</Text>
              <Text style={styles.gameOverScore}>{quizScore}/{QUIZ_QUESTIONS.length * 10}</Text>
              <Text style={styles.gameOverSub}>{quizScore >= 50 ? 'Marketing Expert!' : quizScore >= 30 ? 'Good knowledge!' : 'Keep learning!'}</Text>
              <Pressable style={styles.restartBtn} onPress={() => startGame('quiz')}>
                <MaterialIcons name="refresh" size={20} color={Colors.background} />
                <Text style={styles.restartBtnText}>Play Again</Text>
              </Pressable>
              <Pressable style={styles.exitBtn} onPress={() => { setGameActive(false); }}>
                <Text style={styles.exitBtnText}>Exit Game</Text>
              </Pressable>
            </View>
          )}

          {/* CLICKER GAME */}
          {selectedGenre === 'clicker' && (
            <View style={styles.clickerGame}>
              <Text style={styles.clickerCoins}>${clickerCoins.toLocaleString()}</Text>
              <Text style={styles.clickerLabel}>Marketing Budget</Text>
              <Pressable onPress={handleClick}>
                <Animated.View style={[styles.clickerBtn, { backgroundColor: primaryColor }, { transform: [{ scale: clickAnim }] }]}>
                  <MaterialIcons name="touch-app" size={56} color="#000" />
                  <Text style={styles.clickerBtnText}>TAP!</Text>
                </Animated.View>
              </Pressable>
              <Text style={styles.clickerTaps}>{clicks} taps</Text>
              <View style={styles.clickerUpgrades}>
                {[{ name: 'Email Campaign', cost: 50, icon: 'email' }, { name: 'Social Ad', cost: 200, icon: 'people' }, { name: 'Google Ads', cost: 500, icon: 'search' }].map((item, i) => (
                  <Pressable key={i} style={[styles.upgradeBtn, clickerCoins < item.cost && { opacity: 0.5 }]}
                    onPress={() => { if (clickerCoins >= item.cost) { setClickerCoins(prev => prev - item.cost); setScore(prev => prev + item.cost * 2); showAlert('Upgrade!', `${item.name} activated! +${item.cost * 2} coins.`); } else { showAlert('Not enough coins', `Need $${item.cost}`); } }}>
                    <MaterialIcons name={item.icon as any} size={18} color={Colors.primary} />
                    <Text style={styles.upgradeName}>{item.name}</Text>
                    <Text style={styles.upgradeCost}>${item.cost}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable style={styles.endGameBtn} onPress={() => endGame(clickerCoins)}>
                <Text style={styles.endGameBtnText}>End Game</Text>
              </Pressable>
            </View>
          )}

          {/* RUNNER GAME */}
          {selectedGenre === 'runner' && (
            <View style={styles.runnerGame}>
              <Text style={styles.runnerScore}>Score: {runnerScore}</Text>
              <View style={styles.runnerTrack}>
                <Animated.View style={[styles.runnerCharacter, { transform: [{ translateY: jumpAnim }] }]}>
                  <MaterialIcons name="directions-run" size={40} color={Colors.primary} />
                </Animated.View>
                <View style={styles.runnerGround} />
                <View style={styles.obstaclesRow}>
                  {[...Array(3)].map((_, i) => (
                    <View key={i} style={[styles.obstacle, { backgroundColor: Colors.error, left: `${33 * i + 10}%` as any }]}>
                      <MaterialIcons name="close" size={16} color={Colors.text} />
                    </View>
                  ))}
                </View>
              </View>
              <Pressable style={styles.jumpBtn} onPress={jump}>
                <MaterialIcons name="keyboard-arrow-up" size={28} color={Colors.background} />
                <Text style={styles.jumpBtnText}>JUMP!</Text>
              </Pressable>
              <Text style={styles.runnerHint}>Tap JUMP to avoid bad reviews!</Text>
              <Pressable style={styles.endGameBtn} onPress={() => endGame(runnerScore)}>
                <Text style={styles.endGameBtnText}>End Game</Text>
              </Pressable>
            </View>
          )}

          {/* MEMORY GAME */}
          {selectedGenre === 'memory' && (
            <View style={styles.memoryGame}>
              <View style={styles.memStats}>
                <Text style={styles.memStat}>Score: {score}</Text>
                <Text style={styles.memStat}>Moves: {memMoves}</Text>
                <Text style={styles.memStat}>Matched: {matched.length / 2}/{MEMORY_ITEMS.length}</Text>
              </View>
              <View style={styles.memGrid}>
                {memCards.map((card: any) => {
                  const isFlipped = flipped.includes(card.uid) || matched.includes(card.uid);
                  return (
                    <Pressable key={card.uid} style={[styles.memCard, isFlipped && { backgroundColor: card.color + '22', borderColor: card.color }]}
                      onPress={() => flipMemCard(card.uid)}>
                      {isFlipped ? (
                        <>
                          <MaterialIcons name={card.icon} size={28} color={card.color} />
                          <Text style={[styles.memLabel, { color: card.color }]}>{card.label}</Text>
                        </>
                      ) : (
                        <MaterialIcons name="help-outline" size={28} color={Colors.textMuted} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
              <Pressable style={styles.endGameBtn} onPress={() => endGame(score)}>
                <Text style={styles.endGameBtnText}>End Game</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceElevated, justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text },
  headerSub: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },
  highScoreBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary + '22', paddingHorizontal: 10, paddingVertical: 5, borderRadius: BorderRadius.full,
  },
  highScoreText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.bold },
  scroll: { paddingHorizontal: Spacing.md },
  configCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  configTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 4 },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginBottom: 6, marginTop: 12 },
  field: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, height: 48, fontSize: FontSize.md,
    color: Colors.text, borderWidth: 1, borderColor: Colors.border,
  },
  colorBtn: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  colorBtnSelected: { borderWidth: 3, borderColor: Colors.text },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: Spacing.lg },
  genreCard: {
    width: '47%', backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  genreIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  genreName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 4 },
  genreDesc: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', marginBottom: 12 },
  playBtnSmall: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full },
  playBtnSmallText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.background },
  reportCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '44',
  },
  reportTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary, marginBottom: Spacing.md },
  reportRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reportLabel: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
  reportValue: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  publishBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, height: 48, borderRadius: BorderRadius.lg, marginTop: Spacing.md,
  },
  publishBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.background },
  gameArea: { flex: 1 },
  quizGame: { flex: 1, padding: Spacing.md },
  quizProgress: { marginBottom: Spacing.md },
  quizProgressText: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 6 },
  quizProgressBar: { height: 6, backgroundColor: Colors.surfaceElevated, borderRadius: 3 },
  quizProgressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  quizScore: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.primary, textAlign: 'right', marginBottom: Spacing.md },
  quizCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border, minHeight: 100, justifyContent: 'center',
  },
  quizQ: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, textAlign: 'center', lineHeight: 26 },
  quizOptions: { gap: 10 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.border,
  },
  optionLetter: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, width: 24 },
  optionText: { flex: 1, fontSize: FontSize.md },
  gameOverScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  gameOverTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text, marginTop: 16 },
  gameOverScore: { fontSize: 52, fontWeight: FontWeight.extrabold, color: Colors.primary, marginVertical: 8 },
  gameOverSub: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: 32 },
  restartBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: BorderRadius.full, marginBottom: 12,
  },
  restartBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.background },
  exitBtn: { paddingHorizontal: 24, paddingVertical: 10 },
  exitBtnText: { fontSize: FontSize.md, color: Colors.textSecondary },
  clickerGame: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.md },
  clickerCoins: { fontSize: 48, fontWeight: FontWeight.extrabold, color: Colors.primary },
  clickerLabel: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.lg },
  clickerBtn: {
    width: 160, height: 160, borderRadius: 80,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  clickerBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: '#000' },
  clickerTaps: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.lg },
  clickerUpgrades: { gap: 8, width: '100%', marginBottom: Spacing.lg },
  upgradeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: 12, borderWidth: 1, borderColor: Colors.border,
  },
  upgradeName: { flex: 1, fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.medium },
  upgradeCost: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.bold },
  runnerGame: { flex: 1, alignItems: 'center', padding: Spacing.md },
  runnerScore: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.primary, marginBottom: Spacing.lg },
  runnerTrack: {
    width: '100%', height: 140, backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.lg, overflow: 'hidden', position: 'relative', justifyContent: 'flex-end',
  },
  runnerCharacter: { position: 'absolute', bottom: 20, left: 20, zIndex: 2 },
  runnerGround: { height: 20, backgroundColor: Colors.surfaceElevated, width: '100%' },
  obstaclesRow: { position: 'absolute', bottom: 20, width: '100%', height: 24 },
  obstacle: { position: 'absolute', width: 24, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  jumpBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: BorderRadius.full, marginBottom: 10,
  },
  jumpBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.background },
  runnerHint: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.lg },
  memoryGame: { flex: 1, padding: Spacing.md },
  memStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.md },
  memStat: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  memGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: Spacing.lg },
  memCard: {
    width: 80, height: 80, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceCard, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  memLabel: { fontSize: 9, fontWeight: FontWeight.bold, marginTop: 2 },
  endGameBtn: {
    alignSelf: 'center', paddingHorizontal: 28, paddingVertical: 12,
    backgroundColor: Colors.error + '22', borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.error,
  },
  endGameBtnText: { fontSize: FontSize.md, color: Colors.error, fontWeight: FontWeight.bold },
  leaderboardBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.primary + '11', borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '44',
  },
  leaderboardBtnText: { flex: 1, fontSize: FontSize.md, color: Colors.primary, fontWeight: FontWeight.semibold },
  miniLeaderboard: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '44',
  },
  miniLeaderTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm },
  miniLeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
  miniMedal: { fontSize: 20, width: 28 },
  miniName: { flex: 1, fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.semibold },
  miniGame: { fontSize: FontSize.xs, color: Colors.textMuted, marginRight: 8 },
  miniScore: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold },
  leaderModal: { flex: 1, backgroundColor: Colors.background },
  leaderModalHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  leaderModalTitle: { flex: 1, fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text },
  leaderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
  },
  rankWrap: { width: 36, alignItems: 'center' },
  rankText: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: Colors.text },
  leaderName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  leaderMeta: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  leaderScore: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
});
