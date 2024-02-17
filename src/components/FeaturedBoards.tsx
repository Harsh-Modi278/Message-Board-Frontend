import CssBaseline from "@material-ui/core/CssBaseline";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { SortType } from "../common/sortingStates";
import { prefURL } from "../constants/backendURL";
import { useFetch } from "../hooks/useFetch";
import { Pagination as CustomPagination } from "../utils/Pagination";
import { ErrorState } from "./ErrorState/ErrorState";
import { FeaturedBoard, Post, PostResponse, toPost } from "./FeaturedBoard";
import { LoadingState } from "./LoadingState/LoadingState";

interface FeaturedBoardsProps {
  sort: SortType;
}

export const FeaturedBoards: React.FC<FeaturedBoardsProps> = (props) => {
  const { sort } = props;
  const [currentPage, setCurrentPage] = useState(
    CustomPagination.DEFAULT_FIRST_PAGE
  );

  //GET all articles for Home page
  const {
    data,
    isPending: isLoading,
    error: errorMessage,
  } = useFetch<PostResponse[]>(
    `${prefURL}/api/boards/` + (sort && `?sort=${sort}`)
  );

  const featuredBoards = toPost(data || []);
  console.log({ featuredBoards, isLoading, errorMessage });

  const filteredPages = new CustomPagination<Post>(
    featuredBoards || [],
    CustomPagination.DEFAULT_PAGE_SIZE
  );

  return (
    <div>
      <CssBaseline />
      {!!errorMessage && (
        <ErrorState
          errorMessage={"Error while loading the page, please try again"}
        />
      )}
      {isLoading && <LoadingState />}
      <main style={{ paddingTop: "1rem" }}>
        <Stack spacing={2} justifyContent="space-evenly">
          {filteredPages &&
            filteredPages
              .getPage(currentPage)
              ?.map((post: Post) => (
                <FeaturedBoard key={post.boardId} post={post} />
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
    </div>
  );
};
