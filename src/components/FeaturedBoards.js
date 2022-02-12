import { React, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Stack from "@mui/material/Stack";
import FeaturedBoard from "./FeaturedBoard";
import useFetch from "../hooks/useFetch";
import { prefURL } from "../constants/backendURL";
import {
  PageNavigation,
  Pagination as CustomPagination,
} from "../utils/Pagination";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";

const FeaturedBoards = (props) => {
  const { sort } = props;

  const [currentPage, setCurrentPage] = useState(1);

  //GET all articles for Home page
  let {
    data: featuredBoards,
    isPending,
    error,
  } = useFetch(`${prefURL}/api/boards/` + (sort && `?sort=${sort}`));
  const filteredPages = new CustomPagination(featuredBoards, 5);

  return (
    <>
      <CssBaseline />
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      <main style={{ paddingTop: "1rem" }}>
        <Stack spacing={2} justifyContent="space-evenly">
          {filteredPages &&
            filteredPages
              .getPage(currentPage)
              ?.map((post) => (
                <FeaturedBoard key={post.board_id} post={post} />
              ))}
        </Stack>
        <Stack spacing={1}>
          <Typography ml={1} mt={1}>
            Page: {currentPage}
          </Typography>
          <Pagination
            count={filteredPages.getTotalPages()}
            page={currentPage}
            color="primary"
            size="large"
            onChange={(event, value) => {
              setCurrentPage(value);
            }}
          />
        </Stack>
      </main>
    </>
  );
};

export default FeaturedBoards;
