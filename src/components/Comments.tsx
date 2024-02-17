import Typography from "@material-ui/core/Typography";
import Divider from "@mui/material/Divider";
import React, { useCallback, useEffect, useState } from "react";

import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { Comment as CommentIcon } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { SelectChangeEvent } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { SortType } from "../common/sortingStates";
import ReactMarkdownWrapper from "../components/ReactMarkdownWrapper";
import { prefURL } from "../constants/backendURL";
import { Filters, setSortComments } from "../redux/reducers/filtersSlice";
import { User } from "../redux/reducers/userSlice";
import { RootState } from "../redux/store";
import { Pagination as CustomPagination } from "../utils/Pagination";

export interface Comment {
  commentId: string;
  username: string;
  imageurl: string;
  time: string;
  commentText: string;
  upvotes: string;
  userId: string;
}

interface CommentsProps {
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type AlertType = "error" | "info" | "success" | "warning";

let alertStatus: AlertType = "error",
  alertMsg = "Error in deleting the comment, please try again!";

export const Comments: React.FC<CommentsProps> = ({ setAlertOpen }) => {
  const dispatch = useDispatch();
  const user: User | null = useSelector((state: RootState) => state.user.value);
  const filters: Filters = useSelector(
    (state: RootState) => state.filters.value
  );
  const boardId = window.location.pathname.split("/")[2];
  const [commentsArray, setCommentsArray] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(
    CustomPagination.DEFAULT_FIRST_PAGE
  );

  let commentsPages = new CustomPagination(
    commentsArray,
    CustomPagination.DEFAULT_PAGE_SIZE
  );

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const fetchComments: () => Promise<void> = useCallback(async () => {
    const res = await fetch(
      `${prefURL}/api/boards/${boardId}/comments/` +
        (filters && `?sort=${filters.sortComments}`)
    );
    const boardComments = await res.json();
    setCommentsArray(boardComments);
  }, [boardId, filters, setCommentsArray]);

  const handleCommentDelete = async (comment_id: string) => {
    if (!user) return;
    try {
      const res = await fetch(
        `${prefURL}/api/boards/${boardId}/comments/${comment_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            user_id: user.userId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error when deleting a comment");
      } else {
        let updatedCommentsArray = commentsArray;
        updatedCommentsArray = updatedCommentsArray.filter((commentItem) => {
          return commentItem.commentId !== comment_id;
        });

        setCommentsArray(updatedCommentsArray);
      }
    } catch (err) {
      alertStatus = "error";
      alertMsg = "Error in deleting the comment, please try again!";
      setAlertOpen(true);
    }
  };

  const handleCommentUpvote = async (commentId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${prefURL}/api/comments/${commentId}/upvote`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.userId,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to upvote the comment.");
      } else {
        const jsonRes = await res.json();
        let updatedCommentsArray = [...commentsArray];

        updatedCommentsArray = updatedCommentsArray.map((item) => {
          if (item.commentId !== jsonRes.comment_id) return item;
          item.upvotes = jsonRes.upvotes;
          return item;
        });

        setCommentsArray(updatedCommentsArray);
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };

  const handleCommentDownvote = async (commentId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${prefURL}/api/comments/${commentId}/downvote`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.userId,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to downvote the comment.");
      } else {
        const jsonRes = await res.json();
        let updatedCommentsArray = [...commentsArray];
        updatedCommentsArray = updatedCommentsArray.map((item) => {
          if (item.commentId !== jsonRes.comment_id) return item;
          item.upvotes = jsonRes.upvotes;
          return item;
        });
        setCommentsArray(updatedCommentsArray);
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };

  const handleDropDownChange = (e: SelectChangeEvent<SortType>) => {
    dispatch(setSortComments(e.target.value as SortType));
    let updatedCommentsArray: Comment[] = [...commentsArray];
    updatedCommentsArray.sort((comment1: Comment, comment2: Comment) => {
      if (e.target.value === SortType.BEST) {
        return parseInt(comment2.upvotes) - parseInt(comment1.upvotes);
      } else if (e.target.value === SortType.NEW) {
        return (
          new Date(comment2.time).valueOf() - new Date(comment1.time).valueOf()
        );
      }
      // OLD since COMMENTS_COUNT isn't applicable here
      return (
        new Date(comment1.time).valueOf() - new Date(comment2.time).valueOf()
      );
    });

    setCommentsArray(updatedCommentsArray);
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <>
      <Box sx={{ minWidth: 50 }}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Sort by</InputLabel>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filters.sortComments}
            label="Sort By"
            onChange={(e) =>
              handleDropDownChange(e as SelectChangeEvent<SortType>)
            }
          >
            <MenuItem value={"best"}>best</MenuItem>
            <MenuItem value={"new"}>new</MenuItem>
            <MenuItem value={"old"}>old</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <InfiniteScroll
        dataLength={commentsPages.getUptoPage(currentPage).length}
        next={nextPage}
        hasMore={currentPage <= commentsArray.length}
        loader={<h4>Loading...</h4>}
        endMessage={
          <Typography gutterBottom variant="h6" align="center" color="primary">
            Yay! You have seen it all
          </Typography>
        }
      >
        <br />
        {commentsArray.length === 0 ? (
          <Typography gutterBottom variant="h5" align="center" color="primary">
            There are no replies on this thread! You can be the first one to
            contribute.
          </Typography>
        ) : (
          <>
            <IconButton>
              <CommentIcon />
              <Typography variant="h6">
                {commentsArray ? commentsArray.length : 0}
              </Typography>
            </IconButton>
            <List
              sx={{ width: "100%", bgcolor: "background.paper" }}
              component="div"
              aria-label="mailbox folders"
            >
              {commentsArray.map((currComment: Comment) => (
                <div key={currComment.commentId}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Avatar
                      alt={currComment.username}
                      src={currComment.imageurl}
                      sx={{ margin: 1 }}
                    />
                    <ListItem alignItems="center">
                      <ListItemText
                        primary={
                          <>
                            <Typography
                              variant="h5"
                              component="span"
                              color="secondary"
                            >
                              <strong>{currComment.username}</strong>
                            </Typography>
                            <Typography variant="subtitle2" component="span">
                              {`  | submitted ${currComment.time}`}
                            </Typography>
                          </>
                        }
                        secondary={
                          <ReactMarkdownWrapper
                            body={currComment.commentText}
                          />
                        }
                      />
                    </ListItem>
                  </div>
                  <ListItem
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {user && user.userId === currComment.userId && (
                      <IconButton
                        onClick={() =>
                          handleCommentDelete(currComment.commentId)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => {
                        handleCommentUpvote(currComment.commentId);
                      }}
                    >
                      <ThumbUpAltOutlinedIcon />
                    </IconButton>
                    <Typography variant="h6" component="span">
                      {currComment.upvotes}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        handleCommentDownvote(currComment.commentId);
                      }}
                    >
                      <ThumbDownAltOutlinedIcon />
                    </IconButton>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              ))}
            </List>
          </>
        )}
      </InfiniteScroll>
    </>
  );
};
