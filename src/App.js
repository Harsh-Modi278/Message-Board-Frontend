import { BrowserRouter as Router } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";
import { React, useState } from "react";
import Main from "./components/Main.js";
import Header from "./components/Header";
import { makeStyles } from "@material-ui/core/styles";
import Footer from "./components/Footer";
import { UserContext } from "./contexts/UserContext";
import { FilterContexts } from "./contexts/FilterContexts";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  const [user, setUser] = useState(
    JSON.parse(localStorage?.getItem("userObj"))?.profileObj
  );

  const [filters, setFilters] = useState({
    sortBoards: "best",
    sortComments: "best",
  });

  return (
    <div className={classes.root}>
      <UserContext.Provider value={{ user, setUser }}>
        <FilterContexts.Provider value={{ filters, setFilters }}>
          <CssBaseline />
          <Router>
            <Header />
            <Main />
            <Footer />
          </Router>
        </FilterContexts.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
