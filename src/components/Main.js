import { Route, Switch } from "react-router-dom";
import Home from "../pages/Home";
import Board from "../pages/Board.js";
import SignIn from "../pages/SignIn.js";
import Contact from "../pages/Contact";
import NewBoard from "../pages/NewBoard.js";

const Main = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/boards/:boardId" component={Board} />
      <Route exact path="/login" component={SignIn} />
      <Route exact path="/contact" component={Contact} />
      <Route exact path="/NewBoard" component={NewBoard} />
    </Switch>
  );
};

export default Main;
