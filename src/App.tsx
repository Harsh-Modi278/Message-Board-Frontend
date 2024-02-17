import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Main } from "./components/Main";
import { setUser } from "./redux/reducers/userSlice";
interface AppProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
}));

const App: React.FC<AppProps> = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  // TO-DO: what is the type here?
  const localUserObj: any = localStorage?.getItem("userObj");
  if (!!localUserObj) {
    dispatch(setUser(JSON.parse(localUserObj).profileObj));
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Router>
        <Header />
        <Main />
        <Footer />
      </Router>
    </div>
  );
};

export default App;
