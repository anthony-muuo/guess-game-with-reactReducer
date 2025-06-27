const App = () => {
  return (
    <div className="container">
      <header>
        <h2 className="title">Number guessing game</h2>
        <button>New Game</button>
      </header>
      <form>
        <h2 className="trials">10 trials remaining</h2>
        <input type="text" />
        <p className="result">YOu win blah blah blah....</p>
        <button>Guess</button>
      </form>
    </div>
  );
};

export default App;
