import "./App.css";
import ChessBoard from "./ChessBoard/ChessBoard";

const App = () => {
  return (
    <div className="app">
      <ChessBoard timeType={"3+5"}></ChessBoard>
    </div>
  );
};

export default App;
