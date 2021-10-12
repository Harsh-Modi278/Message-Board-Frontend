import { Route, Switch } from "react-router-dom";
import Home from "../pages/Home";
import Board from "../pages/Board.js";
// import WriteStory from "../pages/WriteStory.js";

const Main = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/boards/:boardId" component={Board} />
      {/* <Route exact path="/writestory" component={WriteStory} /> */}
    </Switch>
  );
};

export default Main;
