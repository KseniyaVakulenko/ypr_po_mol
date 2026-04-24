import { useState } from 'react';

// ==================== Типы ====================
type SquareValue = 'X' | 'O' | null;
type SquaresArray = SquareValue[];

// ==================== Вспомогательные функции ====================
function calculateWinner(squares: SquaresArray) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

// ==================== Компонент Square ====================
function Square({
  value,
  onSquareClick,
  isWinning,
}: {
  value: SquareValue;
  onSquareClick: () => void;
  isWinning: boolean;
}) {
  // 2. Крестики красные, нолики зеленые
  const colorClass =
    value === 'X'
      ? 'text-red-600'
      : value === 'O'
      ? 'text-green-600'
      : '';

  // 5. Подсветка победной комбинации
  const winClass = isWinning
    ? 'bg-yellow-200 border-yellow-400 shadow-lg scale-105'
    : 'bg-white border-gray-300 hover:bg-gray-100';

  return (
    <button
      className={`w-20 h-20 sm:w-24 sm:h-24 border-2 rounded-xl text-4xl sm:text-5xl font-bold 
        flex items-center justify-center transition-all duration-200 ${colorClass} ${winClass}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// ==================== Компонент Board ====================
function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: SquaresArray;
  onPlay: (nextSquares: SquaresArray) => void;
}) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  let status;

  // 1. Поддержка русского языка
  if (winner) {
    status = `Победитель: ${winner}`;
  } else if (squares.every((s) => s !== null)) {
    status = 'Ничья!';
  } else {
    status = `Следующий ход: ${xIsNext ? 'X' : 'O'}`;
  }

  const winningLine = winnerInfo?.line || [];

  return (
    <div>
      {/* Статус игры */}
      <div
        className={`text-xl sm:text-2xl font-semibold mb-6 text-center px-4 py-2 rounded-full
          ${winner ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
      >
        {status}
      </div>

      {/* Игровое поле */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-100 rounded-2xl shadow-inner">
        {squares.map((value, i) => (
          <Square
            key={i}
            value={value}
            onSquareClick={() => handleClick(i)}
            isWinning={winningLine.includes(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ==================== Компонент Game ====================
export default function Game() {
  const [history, setHistory] = useState<SquaresArray[]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: SquaresArray) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    let description;
    // 1. Русский язык в истории ходов
    if (move === currentMove) {
      description = `Вы на ходе № ${move}`;
    } else if (move > 0) {
      description = `Перейти к ходу № ${move}`;
    } else {
      description = 'К началу игры';
    }

    return (
      <li key={move} className="mb-1">
        <button
          className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors
            ${
              move === currentMove
                ? 'bg-blue-500 text-white font-semibold shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    // 4. Красивый заголовок + 3. Расположение: поле слева, история справа
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* 4. Большой красивый заголовок */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-500 mb-8 sm:mb-12 text-center drop-shadow-lg">
        Крестики-Нолики
      </h1>

      {/* 3. Поле слева, история справа */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-6 sm:gap-10 w-full max-w-2xl">
        {/* Левая часть — игровое поле */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>

        {/* Правая часть — история */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 w-full md:w-56">
          <h2 className="text-lg font-bold text-gray-700 mb-3 text-center">
            История ходов
          </h2>
          <ol className="list-none space-y-1">{moves}</ol>
        </div>
      </div>
    </div>
  );
}