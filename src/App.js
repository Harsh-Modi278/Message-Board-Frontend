import { BrowserRouter as Router } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";
import Main from "./components/Main.js";
import HomeHeader from "./components/Header";
import { makeStyles } from "@material-ui/core/styles";
import Footer from "./components/Footer";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Router>
        <HomeHeader />
        <Main />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
