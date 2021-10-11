import { Route, Switch } from "react-router-dom";
import Home from "../pages/Home";
// import Blog from "../pages/Blog.js";
// import WriteStory from "../pages/WriteStory.js";

const Main = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      {/* <Route exact path="/article/:articleId" component={Blog} />
      <Route exact path="/writestory" component={WriteStory} /> */}
    </Switch>
  );
};

export default Main;
