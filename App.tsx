/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Trophy,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Languages,
  ChevronRight,
  ChevronLeft,
  Flame,
  Award,
  CircleDot,
  Type
} from 'lucide-react';
import { DIALOGUES, SECRET_WORD, SPANISH_ALPHABET, DialogueQuestion } from './dialogues.ts';
import { sounds, speakSpanish } from './sounds.ts';

// Wheel sectors for authentic "Поле чудес" wheel
interface WheelSector {
  label: string;
  subLabel?: string;
  value: number; // points or special
  isSpecial?: 'plus' | 'prize' | 'double' | 'bankrupt';
  color: string;
}

const WHEEL_SECTORS: WheelSector[] = [
  { label: '500', value: 500, color: '#0284c7' }, // Sky blue
  { label: '250', value: 250, color: '#16a34a' }, // Emerald green
  { label: '750', value: 750, color: '#d97706' }, // Amber
  { label: '+', subLabel: 'Сектор +', value: 300, isSpecial: 'plus', color: '#9333ea' }, // Purple bonus
  { label: '1000', value: 1000, color: '#dc2626' }, // Red
  { label: '300', value: 300, color: '#0d9488' }, // Teal
  { label: 'x2', subLabel: 'Двойные очки', value: 0, isSpecial: 'double', color: '#ea580c' }, // Orange
  { label: '1500', value: 1500, color: '#4f46e5' }, // Indigo
  { label: '400', value: 400, color: '#059669' }, // Green
  { label: '★', subLabel: 'Приз', value: 1000, isSpecial: 'prize', color: '#eab308' }, // Gold
  { label: '2000', value: 2000, color: '#be123c' }, // Rose
  { label: '600', value: 600, color: '#2563eb' }, // Blue
];

type TextSizeMode = 'normal' | 'large' | 'xlarge';

export default function App() {
  // Game State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [revealedLetters, setRevealedLetters] = useState<Set<string>>(new Set());
  const [guessedWrongLetters, setGuessedWrongLetters] = useState<Set<string>>(new Set());
  const [totalScore, setTotalScore] = useState<number>(0);
  const [canPickLetter, setCanPickLetter] = useState<boolean>(false);
  const [sectorPoints, setSectorPoints] = useState<number>(500);
  const [activeSector, setActiveSector] = useState<WheelSector>(WHEEL_SECTORS[0]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);

  // Font size setting (requested: "шрифт чут побоьше")
  const [textSizeMode, setTextSizeMode] = useState<TextSizeMode>('large');

  // Question Answer states
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Translation reveal states
  const [showCoachTrans, setShowCoachTrans] = useState<boolean>(false);
  const [showPlayerTrans, setShowPlayerTrans] = useState<boolean>(false);
  const [showQuestionTrans, setShowQuestionTrans] = useState<boolean>(false);
  const [revealedOptionsTrans, setRevealedOptionsTrans] = useState<Set<number>>(new Set());
  const [alwaysShowArmenian, setAlwaysShowArmenian] = useState<boolean>(false);

  // Sound and Modal states
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSolvedWord, setIsSolvedWord] = useState<boolean>(false);
  const [showSolveModal, setShowSolveModal] = useState<boolean>(false);
  const [solveInput, setSolveInput] = useState<string>('');
  const [solveError, setSolveError] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ textHy: string; textEs: string; type: 'success' | 'info' | 'error' } | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);

  const currentDialogue: DialogueQuestion = DIALOGUES[currentQuestionIndex];
  const totalLettersInWord = SECRET_WORD.length; // 10
  const uniqueLettersInWord = new Set(SECRET_WORD.split(''));

  // Check if word is fully revealed
  useEffect(() => {
    const allFound = SECRET_WORD.split('').every((char) => revealedLetters.has(char));
    if (allFound && !isSolvedWord && revealedLetters.size > 0) {
      triggerVictory();
    }
  }, [revealedLetters]);

  // Reset dialogue-specific view toggles when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setIsAnswerCorrect(null);
    setShowCoachTrans(false);
    setShowPlayerTrans(false);
    setShowQuestionTrans(false);
    setRevealedOptionsTrans(new Set());
  }, [currentQuestionIndex]);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
  };

  // Trigger grand victory
  const triggerVictory = () => {
    setIsSolvedWord(true);
    sounds.playVictoryFanfare();
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      confetti({
        particleCount: 120,
        angle: 60,
        spread: 75,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 120,
        angle: 120,
        spread: 75,
        origin: { x: 1 }
      });
    }, 400);
  };

  // Spin Wheel of Fortune
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    sounds.playClick();

    // Random sector & full rotations (between 4 and 7 full rotations)
    const extraRotations = 360 * (4 + Math.floor(Math.random() * 3));
    const randomSectorIdx = Math.floor(Math.random() * WHEEL_SECTORS.length);
    const sectorAngle = 360 / WHEEL_SECTORS.length;
    // Align wheel indicator to top
    const targetAngle = extraRotations + (WHEEL_SECTORS.length - randomSectorIdx) * sectorAngle;

    const newTotalRotation = wheelRotation + targetAngle;
    setWheelRotation(newTotalRotation);

    // Realistic tick sounds during spin
    let tickCount = 0;
    const maxTicks = 26;
    const tickInterval = setInterval(() => {
      tickCount++;
      sounds.playTick(450 + (tickCount % 5) * 40);
      if (tickCount >= maxTicks) {
        clearInterval(tickInterval);
      }
    }, 130);

    setTimeout(() => {
      setIsSpinning(false);
      const chosenSector = WHEEL_SECTORS[randomSectorIdx];
      setActiveSector(chosenSector);
      if (chosenSector.isSpecial === 'double') {
        setSectorPoints((prev) => prev * 2);
      } else {
        setSectorPoints(chosenSector.value);
      }
      sounds.playCorrect();

      setFeedbackMessage({
        textHy: `Թմբուկը կանգնեց «${chosenSector.label} ${chosenSector.subLabel || ''}» սեկտորի վրա։`,
        textEs: `La ruleta se detuvo en: ${chosenSector.label} ${chosenSector.subLabel || ''}.`,
        type: 'info'
      });
    }, 3800);
  };

  // Submit Answer to Dialogue Quiz
  const handleSelectAnswer = (optionIdx: number) => {
    if (answerSubmitted) return;
    setSelectedAnswer(optionIdx);
    setAnswerSubmitted(true);

    const isCorrect = optionIdx === currentDialogue.correctAnswer;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      sounds.playCorrect();
      setTotalScore((prev) => prev + sectorPoints);
      setCanPickLetter(true);
      setFeedbackMessage({
        textHy: `Ճիշտ պատասխան է (+${sectorPoints} միավոր)! Այժմ ընտրեք տառը ստորև նշված այբուբենից։`,
        textEs: `¡Respuesta correcta (+${sectorPoints} pts)! Ahora elige una letra del alfabeto abajo.`,
        type: 'success'
      });
    } else {
      sounds.playWrong();
      setCanPickLetter(false);
      setFeedbackMessage({
        textHy: `Ոչ ճիշտ։ Ճիշտ պատասխանն էր՝ տարբերակ ${['A', 'B', 'C', 'D'][currentDialogue.correctAnswer]}։ Կարող եք շարունակել խաղը հաջորդ հարցով։`,
        textEs: `Incorrecto. La respuesta correcta era: ${['A', 'B', 'C', 'D'][currentDialogue.correctAnswer]}. ¡Puedes continuar con el siguiente diálogo!`,
        type: 'error'
      });
    }
  };

  // Pick Letter from Alphabet
  const handleLetterPick = (letter: string) => {
    if (revealedLetters.has(letter) || guessedWrongLetters.has(letter)) {
      return;
    }

    if (SECRET_WORD.includes(letter)) {
      sounds.playLetterReveal();
      const occurrences = SECRET_WORD.split('').filter((c) => c === letter).length;
      const pointsEarned = occurrences * sectorPoints;
      setTotalScore((prev) => prev + pointsEarned);

      const nextRevealed = new Set(revealedLetters);
      nextRevealed.add(letter);
      setRevealedLetters(nextRevealed);

      // Consume letter pick
      setCanPickLetter(false);

      setFeedbackMessage({
        textHy: `Հիանալի է! «${letter}» տառը կա գաղտնի բառում (${occurrences} հատ, +${pointsEarned} միավոր)!`,
        textEs: `¡Excelente! La letra "${letter}" está en la palabra secreta (${occurrences} veces, +${pointsEarned} pts)!`,
        type: 'success'
      });
    } else {
      sounds.playLetterMiss();
      const nextWrong = new Set(guessedWrongLetters);
      nextWrong.add(letter);
      setGuessedWrongLetters(nextWrong);

      // Consume letter pick
      setCanPickLetter(false);

      setFeedbackMessage({
        textHy: `Ափսոս, «${letter}» տառը գաղտնի բառում չկա։ Շարունակեք խաղալ հաջորդ հարցով։`,
        textEs: `La letra "${letter}" no está en la palabra secreta. ¡Continúa jugando el siguiente diálogo!`,
        type: 'info'
      });
    }
  };

  // Sector "+" - Open any letter of choice
  const handleSectorPlusOpen = () => {
    const unrevealedLetters = Array.from(uniqueLettersInWord).filter((l) => !revealedLetters.has(l));
    if (unrevealedLetters.length === 0) return;
    const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
    handleLetterPick(randomLetter);
  };

  // Move to Next Dialogue
  const handleNextDialogue = () => {
    sounds.playClick();
    if (currentQuestionIndex < DIALOGUES.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
    setFeedbackMessage(null);
  };

  // Move to Previous Dialogue
  const handlePrevDialogue = () => {
    sounds.playClick();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
    setFeedbackMessage(null);
  };

  // Guess whole word
  const handleSolveWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = solveInput.trim().toUpperCase();
    if (cleaned === SECRET_WORD) {
      const allChars = new Set(SECRET_WORD.split(''));
      setRevealedLetters(allChars);
      setTotalScore((prev) => prev + 5000);
      setShowSolveModal(false);
      setSolveInput('');
      setSolveError('');
      triggerVictory();
    } else {
      sounds.playWrong();
      setSolveError('Այդ բառը չէ։ Փորձեք կրկին կամ բացեք տառերը հարցերի միջոցով։ / ¡Palabra incorrecta! Sigue jugando.');
    }
  };

  // Restart Game
  const handleRestartGame = () => {
    sounds.playClick();
    setCurrentQuestionIndex(0);
    setRevealedLetters(new Set());
    setGuessedWrongLetters(new Set());
    setTotalScore(0);
    setCanPickLetter(false);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setIsAnswerCorrect(null);
    setIsSolvedWord(false);
    setFeedbackMessage(null);
  };

  // Calculate opened count
  const openedLettersCount = SECRET_WORD.split('').filter((c) => revealedLetters.has(c)).length;

  // Font size responsive classes
  const dialogueTextClass =
    textSizeMode === 'xlarge'
      ? 'text-xl sm:text-2xl font-medium'
      : textSizeMode === 'large'
      ? 'text-lg sm:text-xl font-medium'
      : 'text-base sm:text-lg font-medium';

  const transTextClass =
    textSizeMode === 'xlarge'
      ? 'text-base sm:text-lg'
      : textSizeMode === 'large'
      ? 'text-sm sm:text-base'
      : 'text-xs sm:text-sm';

  const optionTitleClass =
    textSizeMode === 'xlarge'
      ? 'text-lg sm:text-xl font-bold'
      : textSizeMode === 'large'
      ? 'text-base sm:text-lg font-bold'
      : 'text-sm sm:text-base font-semibold';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                  ПОЛЕ ЧУДЕС
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Հայերեն ➔ Español
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">
                Ֆուտբոլային երկխոսություններ · Diálogos de fútbol
              </p>
            </div>
          </div>

          {/* Quick HUD Score, Font Resizer & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Score */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60 shadow-sm">
              <Flame className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <div className="text-[10px] text-slate-400 leading-none">ՄԻԱՎՈՐՆԵՐ / PUNTOS</div>
                <div className="text-lg font-black font-mono tabular-nums text-amber-400 leading-tight">
                  {totalScore}
                </div>
              </div>
            </div>

            {/* Font Size Selector (A- / A / A+) */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              <span className="px-2 text-slate-400 hidden md:flex items-center gap-1 font-medium">
                <Type className="w-3.5 h-3.5" />
                <span>Տառաչափ</span>
              </span>
              <button
                onClick={() => setTextSizeMode('normal')}
                className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                  textSizeMode === 'normal'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Նորմալ տառաչափ"
              >
                A
              </button>
              <button
                onClick={() => setTextSizeMode('large')}
                className={`px-2 py-1 rounded-lg font-bold text-sm transition-colors ${
                  textSizeMode === 'large'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Մեծ տառաչափ"
              >
                A+
              </button>
              <button
                onClick={() => setTextSizeMode('xlarge')}
                className={`px-2 py-1 rounded-lg font-bold text-base transition-colors ${
                  textSizeMode === 'xlarge'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Շատ մեծ տառաչափ"
              >
                A++
              </button>
            </div>

            {/* Translation switch */}
            <button
              onClick={() => {
                sounds.playClick();
                setAlwaysShowArmenian(!alwaysShowArmenian);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-colors ${
                alwaysShowArmenian
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Միացնել/Անջատել մշտական հայերեն թարգմանությունը"
            >
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">
                {alwaysShowArmenian ? 'Թարգմանությունը բաց է' : 'Թարգմանություն'}
              </span>
            </button>

            {/* Mute button */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              aria-label={isMuted ? 'Ձայնն անջատված է' : 'Ձայնը միացված է'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Restart button */}
            <button
              onClick={handleRestartGame}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Վերսկսել խաղը / Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Arena */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* POLE CHUDES LETTER DISPLAY BOARD */}
        <section className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-5 sm:p-7 rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-950/20 relative overflow-hidden">
          {/* Ambient studio lights */}
          <div className="absolute top-0 left-1/4 w-96 h-28 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute top-0 right-1/4 w-96 h-28 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

          {/* Board Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
            <div>
              <div className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>ԳԱՂՏՆԻ ԳԼԽԱՎՈՐ ԲԱՌԸ · PALABRA SECRETA (10 ՏԱՌ)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                {isSolvedWord ? 'Բառը գուշակված է! ¡Palabra descubierta!' : 'Գուշակիր գլխավոր բառը՝ առանց հուշումների'}
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-1">
                Պատասխանիր ֆուտբոլային երկխոսությունների հարցին ճիշտ, որպեսզի ստանաս այբուբենից տառ բացելու իրավունք։
              </p>
            </div>

            {/* Actions: Guess Word Button */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowSolveModal(true);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 text-sm sm:text-base font-black rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <Award className="w-5 h-5" />
                <span>Ասել ամբողջ բառը / Resolver palabra</span>
              </button>
            </div>
          </div>

          {/* The 10 Letter Tiles of ASISTENCIA (Enlarged) */}
          <div className="py-6 flex flex-wrap justify-center items-center gap-2.5 sm:gap-3.5 perspective-1000">
            {SECRET_WORD.split('').map((letter, idx) => {
              const isRevealed = revealedLetters.has(letter) || isSolvedWord;
              return (
                <div
                  key={idx}
                  className={`w-12 h-16 sm:w-18 sm:h-24 md:w-22 md:h-28 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-3xl sm:text-5xl md:text-6xl transition-all duration-500 select-none shadow-xl ${
                    isRevealed
                      ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-500 text-slate-950 border-2 border-yellow-200 shadow-amber-500/40 transform scale-100'
                      : 'bg-gradient-to-b from-slate-800 to-slate-900 text-slate-500 border-2 border-slate-700/80 hover:border-amber-500/40'
                  }`}
                >
                  {isRevealed ? (
                    <span className="drop-shadow-sm animate-in fade-in zoom-in duration-300">{letter}</span>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-slate-600 text-2xl sm:text-3xl font-black">?</span>
                      <span className="text-[10px] sm:text-xs text-slate-500 font-sans mt-0.5 font-medium">#{idx + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Letters Progress */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/80">
            <div>
              Բացված տառեր՝ <span className="font-bold text-amber-400 font-mono text-base">{openedLettersCount}</span> / {totalLettersInWord}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>Սեկտորի արժեքը՝</span>
              <span className="text-amber-400 font-bold font-mono text-base">+{sectorPoints} միավոր</span>
            </div>
          </div>
        </section>

        {/* FEEDBACK BANNER */}
        {feedbackMessage && (
          <div
            className={`px-5 py-3.5 rounded-2xl border flex items-start justify-between gap-3 animate-in slide-in-from-top-2 duration-200 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                : feedbackMessage.type === 'error'
                ? 'bg-rose-950/50 border-rose-500/60 text-rose-200'
                : 'bg-amber-950/50 border-amber-500/60 text-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {feedbackMessage.type === 'success' && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />}
              {feedbackMessage.type === 'error' && <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />}
              {feedbackMessage.type === 'info' && <CircleDot className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold text-base sm:text-lg leading-snug">{feedbackMessage.textHy}</p>
                <p className="text-sm sm:text-base opacity-90 mt-0.5 leading-snug">{feedbackMessage.textEs}</p>
              </div>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-sm opacity-60 hover:opacity-100 p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* TWO-COLUMN LAYOUT: Left = Dialogue Card & Quiz, Right = Wheel & Alphabet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: DIALOGUE CARD & QUIZ (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-xl relative">
              
              {/* Question Navigation & Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                    ԵՐԿԽՈՍՈՒԹՅՈՒՆ {currentQuestionIndex + 1} / {DIALOGUES.length}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 hidden sm:inline">
                    Diálogo #{currentQuestionIndex + 1}
                  </span>
                </div>

                {/* Prev / Next buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevDialogue}
                    disabled={currentQuestionIndex === 0}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 transition-colors"
                    title="Նախորդ երկխոսությունը"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextDialogue}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-bold"
                    title="Հաջորդ երկխոսությունը"
                  >
                    <span>Հաջորդը</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Task Question Prompt (Click on Spanish reveals Armenian) */}
              <div className="mt-4">
                <div
                  onClick={() => setShowQuestionTrans(!showQuestionTrans)}
                  className="group cursor-pointer p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <HelpCircle className="w-4 h-4" />
                      Սեղմիր իսպաներեն տեքստին՝ հայերեն թարգմանության համար
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-amber-400 transition-colors font-medium">
                      {showQuestionTrans || alwaysShowArmenian ? 'Փակել' : 'Կտտացրու'}
                    </span>
                  </div>
                  {/* Spanish Prompt */}
                  <p className="text-base sm:text-lg font-bold text-white leading-snug">
                    {currentDialogue.es.question}
                  </p>
                  {/* Armenian Translation */}
                  {(showQuestionTrans || alwaysShowArmenian) && (
                    <p className="text-sm sm:text-base text-amber-300 mt-2.5 pt-2 border-t border-slate-700/60 font-semibold leading-relaxed">
                      {currentDialogue.hy.question}
                    </p>
                  )}
                </div>
              </div>

              {/* COACH & PLAYER DIALOGUE BOX (Enlarged and Clear) */}
              <div className="mt-5 space-y-3.5">
                
                {/* 1. Entrenador line */}
                <div
                  onClick={() => setShowCoachTrans(!showCoachTrans)}
                  className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/30 to-slate-800/40 border border-blue-500/25 hover:border-blue-400/60 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-black text-xs sm:text-sm border border-blue-500/30">
                        Entrenador · Մարզիչ
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakSpanish(currentDialogue.es.coach);
                        }}
                        className="text-slate-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors"
                        title="Լսել իսպաներեն արտասանությունը"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-blue-300 font-medium">
                      {showCoachTrans || alwaysShowArmenian ? 'Հայերեն թարգմանություն' : 'Սեղմիր թարգմանության համար'}
                    </span>
                  </div>

                  {/* Spanish */}
                  <p className={`${dialogueTextClass} text-slate-100 leading-relaxed`}>
                    — {currentDialogue.es.coach}
                  </p>

                  {/* Armenian */}
                  {(showCoachTrans || alwaysShowArmenian) && (
                    <div className={`mt-3 pt-3 border-t border-blue-500/20 ${transTextClass} text-blue-200 leading-relaxed font-normal`}>
                      — {currentDialogue.hy.coach}
                    </div>
                  )}
                </div>

                {/* 2. Jugador line */}
                <div
                  onClick={() => setShowPlayerTrans(!showPlayerTrans)}
                  className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-slate-800/40 border border-emerald-500/25 hover:border-emerald-400/60 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-xs sm:text-sm border border-emerald-500/30">
                        Jugador · Խաղացող
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakSpanish(currentDialogue.es.player);
                        }}
                        className="text-slate-400 hover:text-emerald-300 p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors"
                        title="Լսել իսպաներեն արտասանությունը"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-emerald-300 font-medium">
                      {showPlayerTrans || alwaysShowArmenian ? 'Հայերեն թարգմանություն' : 'Սեղմիր թարգմանության համար'}
                    </span>
                  </div>

                  {/* Spanish */}
                  <p className={`${dialogueTextClass} text-slate-100 leading-relaxed`}>
                    — {currentDialogue.es.player}
                  </p>

                  {/* Armenian */}
                  {(showPlayerTrans || alwaysShowArmenian) && (
                    <div className={`mt-3 pt-3 border-t border-emerald-500/20 ${transTextClass} text-emerald-200 leading-relaxed font-normal`}>
                      — {currentDialogue.hy.player}
                    </div>
                  )}
                </div>
              </div>

              {/* OPTIONS: A, B, C, D (Enlarged) */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-slate-300">
                    Ընտրիր ճիշտ տարբերակը · Elige la opción:
                  </span>
                  <span className="text-xs text-slate-400">
                    Սեղմիր պատասխանին
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentDialogue.es.options.map((optionEs, idx) => {
                    const optionHy = currentDialogue.hy.options[idx];
                    const letterTag = ['A', 'B', 'C', 'D'][idx];
                    const isSelected = selectedAnswer === idx;
                    const isCorrectAnswer = idx === currentDialogue.correctAnswer;
                    const showOptionTrans = revealedOptionsTrans.has(idx) || alwaysShowArmenian;

                    let btnStyles = 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200';
                    if (answerSubmitted) {
                      if (isCorrectAnswer) {
                        btnStyles = 'bg-emerald-950/70 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/50';
                      } else if (isSelected && !isCorrectAnswer) {
                        btnStyles = 'bg-rose-950/70 border-rose-500 text-rose-100';
                      } else {
                        btnStyles = 'bg-slate-800/40 border-slate-700/40 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <div
                        key={idx}
                        className={`relative rounded-2xl border p-4 transition-all text-left flex flex-col justify-between shadow-sm ${btnStyles}`}
                      >
                        {/* Option Top row */}
                        <div
                          className="cursor-pointer"
                          onClick={() => handleSelectAnswer(idx)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-sm text-amber-400">
                              {letterTag}
                            </span>
                            {answerSubmitted && isCorrectAnswer && (
                              <span className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Ճիշտ
                              </span>
                            )}
                            {answerSubmitted && isSelected && !isCorrectAnswer && (
                              <span className="text-xs sm:text-sm font-bold text-rose-400 flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                Սխալ
                              </span>
                            )}
                          </div>

                          {/* Spanish Option Text */}
                          <div className={`${optionTitleClass} text-white leading-snug`}>
                            {optionEs}
                          </div>
                        </div>

                        {/* Armenian translation toggle button */}
                        <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const next = new Set(revealedOptionsTrans);
                              if (next.has(idx)) {
                                next.delete(idx);
                              } else {
                                next.add(idx);
                              }
                              setRevealedOptionsTrans(next);
                            }}
                            className="text-xs sm:text-sm text-amber-400/90 hover:text-amber-300 transition-colors flex items-center gap-1.5 font-medium"
                          >
                            <Languages className="w-3.5 h-3.5" />
                            <span>{showOptionTrans ? 'Փակել' : 'Թարգմանել հայերեն'}</span>
                          </button>
                        </div>

                        {/* Armenian translation display */}
                        {showOptionTrans && (
                          <div className={`mt-1.5 ${transTextClass} text-amber-300 font-semibold leading-relaxed`}>
                            {optionHy}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Dialogue Actions: Continue playing if wrong, next dialog, question picker */}
              <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-slate-400 font-medium">Գնալ հարցին՝</span>
                  <div className="flex flex-wrap gap-1.5 max-w-sm">
                    {DIALOGUES.map((d, i) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          sounds.playClick();
                          setCurrentQuestionIndex(i);
                        }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all ${
                          currentQuestionIndex === i
                            ? 'bg-amber-500 text-slate-950 scale-110 shadow-md shadow-amber-500/20'
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        {d.id}
                      </button>
                    ))}
                  </div>
                </div>

                {answerSubmitted && (
                  <button
                    onClick={handleNextDialogue}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 rounded-xl text-sm font-black shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-102 ml-auto"
                  >
                    <span>Հաջորդ հարցը (Շարունակել խաղը)</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT: WHEEL OF FORTUNE & ALPHABET KEYBOARD (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 1. WHEEL OF FORTUNE (ԲԱՐԱԲԱՆ) */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col items-center relative overflow-hidden">
              <div className="w-full flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400">
                    ՊՏՏԻ՛Ր ԹՄԲՈՒԿԸ · RULETA
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-400">
                  Սեկտոր՝ <span className="font-bold text-amber-400 font-mono text-base">{activeSector.label}</span>
                </div>
              </div>

              {/* The Rotating Wheel Graphic */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-2 flex items-center justify-center">
                {/* Pointer Arrow at top */}
                <div className="absolute -top-3 z-20 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 drop-shadow-md" />
                </div>

                {/* Outer rim */}
                <div className="w-full h-full rounded-full border-4 border-amber-500/40 p-1.5 shadow-2xl bg-slate-950">
                  {/* Wheel canvas container */}
                  <div
                    ref={wheelRef}
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                    className="w-full h-full rounded-full relative overflow-hidden wheel-transition border-2 border-slate-700"
                  >
                    {/* SVG Wheel segments */}
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {WHEEL_SECTORS.map((sec, idx) => {
                        const total = WHEEL_SECTORS.length;
                        const angle = 360 / total;
                        const startAngle = idx * angle;
                        const endAngle = (idx + 1) * angle;

                        const x1 = 100 + 100 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                        const y1 = 100 + 100 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                        const x2 = 100 + 100 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                        const y2 = 100 + 100 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                        const midAngle = startAngle + angle / 2 - 90;
                        const textX = 100 + 68 * Math.cos((Math.PI * midAngle) / 180);
                        const textY = 100 + 68 * Math.sin((Math.PI * midAngle) / 180);

                        return (
                          <g key={idx}>
                            <path
                              d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                              fill={sec.color}
                              stroke="#0f172a"
                              strokeWidth="1.5"
                            />
                            <text
                              x={textX}
                              y={textY}
                              fill="#ffffff"
                              fontSize="12"
                              fontWeight="bold"
                              fontFamily="monospace"
                              textAnchor="middle"
                              dominantBaseline="central"
                              transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                            >
                              {sec.label}
                            </text>
                          </g>
                        );
                      })}
                      {/* Center Hub */}
                      <circle cx="100" cy="100" r="26" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />
                      <circle cx="100" cy="100" r="14" fill="#f59e0b" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Spin Wheel Button */}
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="mt-3 w-full max-w-xs py-3 px-5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isSpinning ? 'Թմբուկը պտտվում է...' : 'ՊՏՏԵԼ ԹՄԲՈՒԿԸ · GIRAR RULETA'}</span>
              </button>

              {/* Special Sector '+' shortcut */}
              {activeSector.isSpecial === 'plus' && (
                <button
                  onClick={handleSectorPlusOpen}
                  className="mt-2 text-xs sm:text-sm text-purple-300 bg-purple-950/70 border border-purple-500/40 px-3.5 py-1.5 rounded-lg hover:bg-purple-900 transition-colors font-medium"
                >
                  Բացել ցանկացած տառ (Սեկտոր +)
                </button>
              )}
            </div>

            {/* 2. ALPHABET KEYBOARD (Enlarged) */}
            <div className={`bg-slate-900 rounded-2xl border p-5 sm:p-6 shadow-xl transition-all ${
              canPickLetter
                ? 'border-amber-500 ring-2 ring-amber-500/30'
                : 'border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400">
                    ԻՍՊԱՆԱԿԱՆ ԱՅԲՈՒԲԵՆ · ALFABETO
                  </span>
                </div>
                {canPickLetter ? (
                  <span className="text-xs sm:text-sm font-bold text-emerald-400 animate-pulse">
                    Ընտրիր տառը! ¡Elige una letra!
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm text-slate-400">
                    Բացվում է ճիշտ պատասխանից հետո
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-3.5 leading-relaxed">
                {canPickLetter
                  ? 'Դու ճիշտ ես պատասխանել! Սեղմիր ցանկացած տառի վրա, որպեսզի ստուգես՝ կա՞ արդյոք այն գաղտնի բառում։'
                  : 'Հարցին ճիշտ պատասխանելուց հետո ակտիվանում է տառ ընտրելու հնարավորությունը։'}
              </p>

              {/* Keyboard Grid */}
              <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2">
                {SPANISH_ALPHABET.map((letter) => {
                  const isRevealed = revealedLetters.has(letter);
                  const isWrong = guessedWrongLetters.has(letter);
                  const isGuessed = isRevealed || isWrong;

                  let keyStyle = 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700 hover:border-amber-400';
                  if (isRevealed) {
                    keyStyle = 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md shadow-amber-500/20';
                  } else if (isWrong) {
                    keyStyle = 'bg-slate-950/80 text-slate-600 border-slate-800 line-through opacity-50 cursor-not-allowed';
                  } else if (canPickLetter) {
                    keyStyle = 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white border-amber-500/50 animate-pulse font-bold';
                  }

                  return (
                    <button
                      key={letter}
                      onClick={() => handleLetterPick(letter)}
                      disabled={isGuessed}
                      className={`h-10 sm:h-12 rounded-xl border font-mono font-bold text-base sm:text-lg flex items-center justify-center transition-all ${keyStyle}`}
                      title={isRevealed ? 'Տառը գտնված է' : isWrong ? 'Այս տառը բառում չկա' : `Ընտրել «${letter}» տառը`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              {/* Solved letters summary */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm text-slate-400">
                <span>Գտնված տառեր՝</span>
                <span className="font-mono text-amber-400 font-bold text-base">
                  {Array.from(revealedLetters).join(', ') || 'Դեռ չկա'}
                </span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* MODAL: GUESS FULL WORD */}
      {showSolveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => {
                setShowSolveModal(false);
                setSolveError('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Նշել ամբողջ բառը</h3>
                <p className="text-xs sm:text-sm text-slate-400">Adivinar la palabra completa</p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 mb-4 leading-relaxed">
              Եթե գիտես, թե որն է 10 տառից բաղկացած գլխավոր ֆուտբոլային տերմինը, գրիր այն այստեղ (իսպաներեն մեծատառերով)՝
            </p>

            <form onSubmit={handleSolveWordSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={solveInput}
                  onChange={(e) => {
                    setSolveInput(e.target.value);
                    setSolveError('');
                  }}
                  placeholder="ASISTENCIA..."
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl font-mono text-center text-2xl font-black uppercase tracking-widest text-amber-400 outline-none"
                  autoFocus
                />
              </div>

              {solveError && (
                <p className="text-xs sm:text-sm text-rose-400 font-medium">
                  {solveError}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSolveModal(false);
                    setSolveError('');
                  }}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                >
                  Չեղարկել / Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-400 transition-all"
                >
                  Ստուգել / Comprobar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VICTORY MODAL: WORD SOLVED! */}
      {isSolvedWord && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

            <div className="w-18 h-18 mx-auto rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 mb-4 animate-bounce">
              <Trophy className="w-9 h-9" />
            </div>

            <div className="text-xs sm:text-sm uppercase tracking-widest text-amber-400 font-bold mb-1">
              ՇՆՈՐՀԱՎՈՐՈՒՄ ԵՆՔ! ¡ENHORABUENA!
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              ԲԱՌԸ ԳՈՒՇԱԿՎԱԾ Է!
            </h2>

            {/* Revealed word highlight */}
            <div className="py-4 my-3 bg-slate-950/80 rounded-2xl border border-amber-500/40">
              <div className="text-3xl sm:text-5xl font-mono font-black tracking-widest text-amber-400">
                ASISTENCIA
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">
                [ ասիստենսիա ]
              </div>
            </div>

            {/* Educational meaning in Football and Language */}
            <div className="text-left bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-700/60 text-sm text-slate-300 space-y-2.5 mb-6">
              <p className="font-bold text-amber-300 text-base flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                Ի՞նչ է նշանակում «ASISTENCIA»-ն ֆուտբոլում և իսպաներենում․
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300 text-xs sm:text-sm">
                <li>
                  <strong className="text-white">Գոլային փոխանցում (ասիստ)՝</strong> «dar una asistencia de gol» — փոխանցում, որից հետո գոլ է խփվում։
                </li>
                <li>
                  <strong className="text-white">Մասնակցություն / Ներկայություն՝</strong> «asistencia al entrenamiento» — մարզմանը ներկա գտնվելը։
                </li>
                <li>
                  <strong className="text-white">Օգնություն դաշտում՝</strong> «asistencia médica / defensiva» — բժշկական կամ պաշտպանական աջակցություն։
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-4 text-slate-400 text-sm mb-6">
              <div>Վաստակած միավորներ՝ <strong className="text-amber-400 font-mono text-lg">{totalScore}</strong></div>
              <div>·</div>
              <div>Երկխոսություններ՝ <strong className="text-white font-mono text-lg">20/20</strong></div>
            </div>

            <button
              onClick={handleRestartGame}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/30 text-base tracking-wide transition-all active:scale-95"
            >
              ԽԱՂԱԼ ԿՐԿԻՆ · JUGAR DE NUEVO
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs sm:text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            «Поле чудес» — Իսպաներենի ուսուցում հայերենից ֆուտբոլային երկխոսությունների միջոցով
          </div>
          <div className="text-slate-400">
            Կտտացրու ցանկացած իսպաներեն տողի վրա՝ հայերեն թարգմանությունը տեսնելու համար
          </div>
        </div>
      </footer>
    </div>
  );
}
