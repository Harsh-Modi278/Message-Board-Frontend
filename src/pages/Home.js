import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import FeaturedBoards from "../components/FeaturedBoards";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(12, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const Home = (props) => {
  const classes = useStyles();

  const [sort, setSort] = useState("best");

  const handleChange = (e) => {
    setSort(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: "1",
        padding: "2rem",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ minWidth: 50, paddingBottom: "1rem" }}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Sort by</InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sort}
              label="Sort By"
              onChange={handleChange}
            >
              <MenuItem value={"best"}>best</MenuItem>
              <MenuItem value={"new"}>new</MenuItem>
              <MenuItem value={"old"}>old</MenuItem>
              <MenuItem value={"comments count"}>comments count</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider />
        <FeaturedBoards sort={sort} />
      </Container>
    </div>
  );
};

export default Home;
