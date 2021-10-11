import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import FeaturedBoard from "./FeaturedBoard";
import useFetch from "../hooks/useFetch";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  link: {
    textDecoration: "none",
  },
}));

const FeaturedBoards = (props) => {
  const classes = useStyles();

  //GET all articles for Home page
  let {
    data: featuredBoards,
    isPending,
    error,
  } = useFetch(`http://localhost:5000/api/boards/`);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        {error && <div>{error}</div>}
        {isPending && <div>Loading...</div>}
        <main>
          <Grid container spacing={4} direction="row">
            {featuredBoards &&
              featuredBoards.map((post) => (
                <FeaturedBoard key={post.board_id} post={post} />
              ))}
          </Grid>
        </main>
      </Container>
    </React.Fragment>
  );
};

export default FeaturedBoards;
