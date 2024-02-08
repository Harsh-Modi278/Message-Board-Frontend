import { makeStyles } from "@material-ui/core/styles";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import ArrowCircleDownTwoToneIcon from "@mui/icons-material/ArrowCircleDownTwoTone";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";
import ArrowCircleUpTwoToneIcon from "@mui/icons-material/ArrowCircleUpTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { SortType } from "../common/sortingStates";
import Comments, { Comment } from "../components/Comments";
import ReactMarkdownWrapper from "../components/ReactMarkdownWrapper";
import { prefURL } from "../constants/backendURL";
import { setSortComments } from "../redux/reducers/filtersSlice";
import { RootState } from "../redux/store";
import { Pagination as CustomPagination } from "../utils/Pagination";
import { getTimeDiff } from "../utils/miscUtilities";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarRoot: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  content: {
    flexGrow: 1,
    marginTop: "5rem",
    padding: theme.spacing(4),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

interface BoardProps {
  match: {
    params: {
      boardId: string;
    };
  };
}

type AlertType = "error" | "info" | "success" | "warning";

export const Board: React.FC<BoardProps> = (props) => {
  const classes = useStyles();
  const { boardId } = props.match.params;

  const user = useSelector((state: RootState) => state.user.value);
  const filters = useSelector((state: RootState) => state.filters.value);
  const dispatch = useDispatch();

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [isBoardUpvoted, setIsBoardUpvoted] = useState<boolean>(false);
  const [isBoardDownvoted, setIsBoardDownvoted] = useState<boolean>(false);
  const [board, setBoard] = useState<any>({}); // To-Do: define the type
  const [commentBody, setCommentBody] = useState<string>("");
  const [commentsArray, setCommentsArray] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(
    CustomPagination.DEFAULT_FIRST_PAGE
  );

  const history = useHistory();

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

  const fetchBoardDetails: () => Promise<void> = useCallback(async () => {
    const res = await fetch(`${prefURL}/api/boards/${boardId}`);
    const board = await res.json();
    setBoard(board);
  }, [boardId, setBoard]);

  const fetchBoardUpvoteStatus: () => Promise<void> = useCallback(async () => {
    if (!!user) {
      const res = await fetch(
        `${prefURL}/api/boards/${boardId}/users/${user.userId}/?operation=upvote`
      );
      const boardUpvoted = await res.json();
      setIsBoardUpvoted(boardUpvoted?.done);
    }
  }, [user, boardId]);

  const fetchBoardDownvoteStatus: () => Promise<void> =
    useCallback(async () => {
      if (!!user) {
        const res = await fetch(
          `${prefURL}/api/boards/${boardId}/users/${user?.userId}/?operation=downvote`
        );
        const boardDownvoted = await res.json();
        setIsBoardDownvoted(boardDownvoted?.done);
      }
    }, [user, boardId]);

  useEffect(() => {
    fetchComments();
    fetchBoardDetails();
    fetchBoardUpvoteStatus();
    fetchBoardDownvoteStatus();
  }, [
    boardId,
    filters,
    user,
    fetchBoardDetails,
    fetchBoardDownvoteStatus,
    fetchBoardUpvoteStatus,
    fetchComments,
  ]);

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

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentBody(e.target.value);
  };

  let alertStatus: AlertType = "error",
    alertMsg = "Error in deleting the comment, please try again!";

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

  const handleSubmit = async () => {
    if (!user) return;
    try {
      const resp = await fetch(`${prefURL}/api/boards/${boardId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          user_id: user.userId,
          comment: commentBody,
        }),
      });
      if (!resp.ok) {
        throw new Error("Error in sending new comment payload to backend");
      }
      const jsonRes = await resp.json();

      let updatedCommentsArray: Comment[] = Array.from(jsonRes);

      updatedCommentsArray.sort((comment1: Comment, comment2: Comment) => {
        if (filters.sortComments === SortType.BEST) {
          return parseInt(comment2.upvotes) - parseInt(comment1.upvotes);
        } else if (filters.sortComments === SortType.NEW) {
          return (
            new Date(comment2.time).valueOf() -
            new Date(comment1.time).valueOf()
          );
        }
        // 'old'
        return (
          new Date(comment1.time).valueOf() - new Date(comment2.time).valueOf()
        );
      });

      setCommentBody("");
      setCommentsArray(updatedCommentsArray);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBoardDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!user) return;
    e.preventDefault();
    try {
      const res = await fetch(`${prefURL}/api/boards`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.userId,
          board_id: boardId,
        }),
      });

      if (!res.ok) {
        alertStatus = "error";
        alertMsg = "Could not delete the post, please try again";
        throw new Error(alertMsg);
      } else {
        history.push("/");
      }
    } catch (err) {
      console.log((err as Error).message);
      alertStatus = "error";
      alertMsg = "Could not delete the post, please try again";
      setAlertOpen(true);
    }
  };

  const handleBoardDownvote = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${prefURL}/api/boards/${boardId}/downvote`, {
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
        throw new Error("Unable to downvote the board.");
      } else {
        const jsonRes = await res.json();
        if (jsonRes.upvotes !== 0) {
          setIsBoardDownvoted(!isBoardDownvoted);
        } else {
          setIsBoardDownvoted(false);
        }
        setIsBoardUpvoted(false);
        setBoard({ ...board, ...jsonRes });
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  };

  const handleBoardUpvote = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${prefURL}/api/boards/${boardId}/upvote`, {
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
        throw new Error("Unable to upvote the board.");
      } else {
        const jsonRes = await res.json();
        if (jsonRes.upvotes !== 0) {
          setIsBoardUpvoted(!isBoardUpvoted);
        } else {
          setIsBoardUpvoted(false);
        }
        setIsBoardDownvoted(false);
        setBoard({ ...board, ...jsonRes });
      }
    } catch (err) {
      console.log((err as Error).message);
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

  return (
    <>
      <Collapse in={alertOpen}>
        <Alert
          severity={alertStatus}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlertOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertMsg}
        </Alert>
      </Collapse>
      <div className={classes.root}>
        <div style={{ padding: "2rem", flexGrow: 1 }}>
          <Box sx={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                paddingRight: "2rem",
              }}
            >
              <IconButton onClick={handleBoardUpvote}>
                {isBoardUpvoted ? (
                  <ArrowCircleUpTwoToneIcon style={{ fontSize: "150%" }} />
                ) : (
                  <ArrowCircleUpRoundedIcon style={{ fontSize: "150%" }} />
                )}
              </IconButton>
              <Typography
                variant="h4"
                component="div"
                style={{ marginLeft: "1rem" }}
              >
                {board && board.upvotes}
              </Typography>
              <IconButton onClick={handleBoardDownvote}>
                {isBoardDownvoted ? (
                  <ArrowCircleDownTwoToneIcon style={{ fontSize: "150%" }} />
                ) : (
                  <ArrowCircleDownRoundedIcon style={{ fontSize: "150%" }} />
                )}
              </IconButton>
            </div>
            <List style={{ flexGrow: 1 }}>
              <ListItem>
                <br />
                <ListItemText
                  primary={
                    <>
                      <Link
                        to={`/boards/${boardId}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Typography variant="h5" component="h5" color="primary">
                          <strong>{board && board?.board_name}</strong>
                        </Typography>
                      </Link>
                      <Typography variant="subtitle2" component="span">
                        {`  submitted ${getTimeDiff(
                          board && board?.time_created
                        )} by ${board && board?.username}`}
                      </Typography>
                    </>
                  }
                  secondary={
                    <ReactMarkdownWrapper
                      body={board && board?.board_description}
                    />
                  }
                />
              </ListItem>
            </List>
          </Box>

          <div
            style={{
              display: "flex",
              flex: "1",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <IconButton>
              <CommentIcon />
              <Typography variant="h6">
                {commentsArray ? commentsArray.length : 0}
              </Typography>
            </IconButton>
            {user && board && user.userId === board.user_id && (
              <Button
                variant="contained"
                endIcon={<DeleteIcon />}
                color="error"
                onClick={handleBoardDelete}
              >
                Delete
              </Button>
            )}
          </div>
          <br />
          <Divider />
          <br />

          {user && (
            <>
              <Box
                sx={{
                  maxWidth: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                  // position: "fixed",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={user?.name || "John Does"}
                    src={user?.imageUrl}
                  />
                </ListItemAvatar>
                <TextField
                  fullWidth
                  multiline
                  label="Add a comment"
                  placeholder="Add a comment"
                  id="outlined-multiline-flexible"
                  maxRows={10}
                  value={commentBody}
                  onChange={handleCommentChange}
                />
                <IconButton color="inherit" onClick={handleSubmit}>
                  <SendSharpIcon />
                </IconButton>
              </Box>
              <br />
              <Divider />
            </>
          )}
          <br />
          <Box sx={{ minWidth: 50 }}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Sort by</InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filters.sortComments}
                label="Sort By"
                onChange={handleDropDownChange}
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
              <Typography
                gutterBottom
                variant="h6"
                align="center"
                color="primary"
              >
                Yay! You have seen it all
              </Typography>
            }
          >
            <Comments
              comments={commentsPages.getUptoPage(currentPage) || []}
              handleCommentDelete={(e, commentId) =>
                handleCommentDelete(commentId)
              }
              handleCommentUpvote={(e, commentId) =>
                handleCommentUpvote(commentId)
              }
              handleCommentDownvote={(e, commentId) =>
                handleCommentDownvote(commentId)
              }
            />
          </InfiniteScroll>
          <div id="bottom-detector"></div>
        </div>
      </div>
    </>
  );
};
