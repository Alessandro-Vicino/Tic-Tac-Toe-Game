import { useState } from 'react';

import Player from './components/Player/Player.jsx';
import GameBoard from './components/Gameboard/GameBoard.jsx';
import Log from './components/Log/Log.jsx';
import GameOver from './components/GameOver/GameOver.jsx';
//Un import che rappresenta le combinazioni vincenti
import { WINNING_COMBINATIONS } from './winning-combinations.js';

//Constante generale dei giocatori.
const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
};

//Constante generale che indica l'inizializzazione del gioco
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

//Funzione che alterna giocatore X con il giocatore O
function deriveActivePlayer(gameTurns){
  let currentPlayer = 'X';
  if ( gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer;
}

function deriveGameBoard (gameTurns){
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];
  for (const turn of gameTurns){
      const { square, player } = turn;
      const { row, col } = square;
      gameBoard [row] [col] = player;
  }
  return gameBoard;
}


function deriveWinner(gameBoard, players){
  let winner;
  
  for (const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol =
    gameBoard[combination[0].row][combination[0].column]
    const secondSquareSymbol =
    gameBoard[combination[1].row][combination[1].column]
    const thirdSquareSymbol = 
    gameBoard[combination[2].row][combination[2].column]

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }
  return winner;
}

function App() {
  //Costante che serve per far apparire il nome del giocatore che vince.
  const [players, setplayers] = useState(PLAYERS);

  const [gameTurns, setGameTurns] = useState([]);
  
  const activePlayer = deriveActivePlayer(gameTurns);
  

//Costante che tiene traccia dei turni eseguiti.
const gameBoard = deriveGameBoard(gameTurns);

//Costante che ci fornirà il nome del vincitore e il suo simbolo.
const winner = deriveWinner(gameBoard, players);

//Costante che verifica il pareggio
const hasDraw = gameTurns.length === 9 && !winner;


  function handleSelectSquare(rowIndex, colIndex){
    setGameTurns(prevTurns => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      
      const updatedTurns = [
        { square: {row: rowIndex, col: colIndex}, player: currentPlayer },
        ...prevTurns,
      ];
      
      return updatedTurns;
    });
  }

  function handleRestart(){
    setGameTurns([]);
  }
  

  //Funzione per far apparire il nome del vincitore.
  function handlePlayerNameChange(symbol, newName){
    setplayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      };
    });
  }

  return (
    <main>
    <div id="game-container">
    <ol id="players" className="highlight-player">
    <Player 
    initialName={PLAYERS.X}
    symbol="X" 
    isActive={activePlayer === 'X'}
    onChangeName={handlePlayerNameChange}
    />
    <Player 
    initialName={PLAYERS.O} 
    symbol="O" 
    isActive={activePlayer === 'O'}
    onChangeName={handlePlayerNameChange}
    />
    </ol>
    {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
    <GameBoard 
    onSelectSquare={handleSelectSquare} 
    // activePlayerSymbol={activePlayer}
    board={gameBoard  }
    />
    </div>
    <Log turns={gameTurns}/>
    </main>
    
    );
  }
  
  export default App
  