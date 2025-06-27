/* eslint-disable no-case-declarations */
import { useState, useReducer } from "react";

function generateSecretNumber(): number {
  return Math.floor(Math.random() * 100);
}

type GameState = {
  newGameButtonDisabled: boolean;
  inputReadOnly: boolean;
  guessButtonDisabled: boolean;
  result: string;
  numTrials: number;
  secretNumber: number;
};

type GameAction =
  | { type: "NEW_GAME" }
  | { type: "PLAYER_GUESS"; payload: string };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "NEW_GAME":
      return {
        ...state,
        newGameButtonDisabled: true,
        inputReadOnly: false,
        guessButtonDisabled: false,
        result: "Secret number generated. Good luck guessing!",
        numTrials: 10,
        secretNumber: generateSecretNumber(),
      };

    case "PLAYER_GUESS":
      const playerGuess = Number(action.payload);
      const numTrialsLeft = state.numTrials - 1;

      if (playerGuess === state.secretNumber) {
        return {
          ...state,
          result: `You win! Your score is ${state.numTrials * 10}%`,
          newGameButtonDisabled: false,
          inputReadOnly: true,
          guessButtonDisabled: true,
          numTrials: numTrialsLeft,
        };
      }
      if (numTrialsLeft === 0) {
        return {
          ...state,
          result: `You lost! The secret number was ${state.secretNumber}`,
          newGameButtonDisabled: false,
          inputReadOnly: true,
          guessButtonDisabled: true,
          numTrials: 0,
        };
      }
      return {
        ...state,
        result:
          playerGuess < state.secretNumber
            ? `${playerGuess} is less than the secret number`
            : `${playerGuess} is greater than the secret number`,
        numTrials: numTrialsLeft,
      };
    default:
      return state;
  }
}

const App = () => {
  const [guess, setGuess] = useState("");

  const [state, dispatch] = useReducer(gameReducer, {
    newGameButtonDisabled: false,
    inputReadOnly: true,
    guessButtonDisabled: true,
    result: "",
    numTrials: 10,
    secretNumber: generateSecretNumber(),
  });

  function handleNewGame() {
    setGuess("");
    dispatch({ type: "NEW_GAME" });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = guess.trim();
    if (!trimmed) {
      alert("Guess cannot be empty.");
      return;
    }
    const num = Number(trimmed);
    if (num < 0 || num > 99) {
      alert("Guess must be between 0 and 99.");
      return;
    }
    if (num) {
      dispatch({ type: "PLAYER_GUESS", payload: guess });
      setGuess("");
    }
  }

  return (
    <div className="container">
      <header>
        <h2 className="title">Number guessing game</h2>
        <button onClick={handleNewGame} disabled={state.newGameButtonDisabled}>
          New Game
        </button>
      </header>
      <form onSubmit={handleSubmit}>
        <h2 className="trials">
          {state.inputReadOnly
            ? "Click the New Game Button"
            : `${state.numTrials} trials remaining`}
        </h2>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          readOnly={state.inputReadOnly}
        />
        <p className="result">{state.result}</p>
        <button disabled={state.guessButtonDisabled}>Guess</button>
      </form>
    </div>
  );
};

export default App;
