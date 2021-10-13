import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import FeaturedBoard from "./FeaturedBoard";
import useFetch from "../hooks/useFetch";

const FeaturedBoards = (props) => {
  const { sort } = props;

  //GET all articles for Home page
  let {
    data: featuredBoards,
    isPending,
    error,
  } = useFetch(`http://localhost:5000/api/boards/` + (sort && `?sort=${sort}`));

  return (
    <React.Fragment>
      <CssBaseline />
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      <main style={{ paddingTop: "1rem" }}>
        <Grid container spacing={4} direction="row">
          {featuredBoards &&
            featuredBoards.map((post) => (
              <FeaturedBoard key={post.board_id} post={post} />
            ))}
        </Grid>
      </main>
    </React.Fragment>
  );
};

export default FeaturedBoards;
