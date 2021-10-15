import { React, useContext } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Stack from "@mui/material/Stack";
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
        <Stack spacing={2} justifyContent="space-evenly">
          {featuredBoards &&
            featuredBoards.map((post) => (
              <FeaturedBoard key={post.board_id} post={post} />
            ))}
        </Stack>
      </main>
    </React.Fragment>
  );
};

export default FeaturedBoards;
