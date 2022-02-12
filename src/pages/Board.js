import { React, useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Comments from "../components/Comments.js";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import TextField from "@mui/material/TextField";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import IconButton from "@mui/material/IconButton";

import { UserContext } from "../contexts/UserContext";
import { FilterContexts } from "../contexts/FilterContexts.js";
import { getTimeDiff } from "../utils/functions";

import ArrowCircleUpTwoToneIcon from "@mui/icons-material/ArrowCircleUpTwoTone";
import ArrowCircleDownTwoToneIcon from "@mui/icons-material/ArrowCircleDownTwoTone";

import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";

import ReactMarkdownWrapper from "../components/ReactMarkdownWrapper";

import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

import CommentIcon from "@mui/icons-material/Comment";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import { useHistory } from "react-router-dom";
import { prefURL } from "../constants/backendURL";

import InfiniteScroll from "react-infinite-scroll-component";
import { Pagination as CustomPagination } from "../utils/Pagination";

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

const Board = (props) => {
  const classes = useStyles();
  const { boardId } = props.match.params;
  const { user, setUser } = useContext(UserContext);
  const { filters, setFilters } = useContext(FilterContexts);

  // for alertt opening and closing when deleting or posting a comment to indicate user feedback
  const [alertOpen, setAlertOpen] = useState(false);

  const [isBoardUpvoted, setIsBoardUpvoted] = useState(false);
  const [isBoardDownvoted, setIsBoardDownvoted] = useState(false);

  // board details
  const [board, setBoard] = useState({});

  // comment boady - form control element
  const [commentBody, setCommentBody] = useState("");

  // comments on the current board
  const [commentsArray, setCommentsArray] = useState([]);

  // current page state for comments array
  const [currentPage, setCurrentPage] = useState(1);

  let commentsPages = new CustomPagination(commentsArray, 1);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const history = useHistory();

  useEffect(() => {
    // request for board comments from server using board id
    fetch(
      `${prefURL}/api/boards/${boardId}/comments/` +
        (filters && `?sort=${filters.sortComments}`)
    )
      .then((res) => res.json())
      .then((boardComments) => {
        setCommentsArray(boardComments);
      });

    // request for board details from server using board id
    fetch(`${prefURL}/api/boards/${boardId}`)
      .then((res) => res.json())
      .then((board) => {
        setBoard(board);
      });

    // check if current board is upvoted by user or not
    fetch(
      `${prefURL}/api/boards/${boardId}/users/${user?.user_id}/?operation=upvote`
    )
      .then((res) => res.json())
      .then((boardUpvoted) => {
        setIsBoardUpvoted(boardUpvoted?.done);
      });

    // check if current board is downvoted by user or not
    fetch(
      `${prefURL}/api/boards/${boardId}/users/${user?.user_id}/?operation=downvote`
    )
      .then((res) => res.json())
      .then((boardDownvoted) => {
        setIsBoardDownvoted(boardDownvoted?.done);
      });
  }, []);

  const handleDropDownChange = (e) => {
    setFilters({ ...filters, sortComments: e.target.value });
    let updatedCommentsArray = commentsArray;
    updatedCommentsArray.sort((comment1, comment2) => {
      if (e.target.value === "best") {
        return parseInt(comment2["upvotes"]) - parseInt(comment1["upvotes"]);
      } else if (e.target.value === "new") {
        return new Date(comment2["time"]) - new Date(comment1["time"]);
      }
      // 'old'
      return new Date(comment1["time"]) - new Date(comment2["time"]);
    });

    setCommentsArray(updatedCommentsArray);
  };

  const handleCommentChange = (e) => {
    setCommentBody(e.target.value);
  };

  let alertStatus = "error",
    alertMsg = "Error in deleting the comment, please try again!";

  const handleCommentDelete = async (e, comment_id) => {
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
            user_id: user.user_id,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error when deleting a comment");
      } else {
        // const jsonRes = await res.json();
        let updatedCommentsArray = commentsArray;
        updatedCommentsArray = updatedCommentsArray.filter((commentItem) => {
          return commentItem.comment_id !== comment_id;
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
          user_id: user.user_id,
          comment: commentBody,
        }),
      });
      if (!resp.ok) {
        throw new Error("Error in sending new comment payload to backend");
      }
      const jsonRes = await resp.json();

      let updatedCommentsArray = Array.from(jsonRes);

      updatedCommentsArray.sort((comment1, comment2) => {
        if (filters.sortComments === "best") {
          return parseInt(comment2["upvotes"]) - parseInt(comment1["upvotes"]);
        } else if (filters.sortComments === "new") {
          return new Date(comment2["time"]) - new Date(comment1["time"]);
        }
        // 'old'
        return new Date(comment1["time"]) - new Date(comment2["time"]);
      });

      setCommentBody("");
      setCommentsArray(updatedCommentsArray);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBoardDelete = async (e) => {
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
          user_id: user.user_id,
          board_id: boardId,
        }),
      });

      if (!res.ok) {
        alertStatus = "error";
        alertMsg = "Could not delete the post, please try again";
        throw new Error(alertMsg);
      } else {
        // const jsonRes = await res.json();
        history.push("/");
      }
    } catch (err) {
      console.log(err.message);
      alertStatus = "error";
      alertMsg = "Could not delete the post, please try again";
      setAlertOpen(true);
    }
  };

  const handleBoardDownvote = async (e) => {
    if (!user) return;
    try {
      const res = await fetch(`${prefURL}/api/boards/${boardId}/downvote`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
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
      console.log(err.message);
    }
  };

  const handleBoardUpvote = async (e) => {
    if (!user) return;
    try {
      const res = await fetch(`${prefURL}/api/boards/${boardId}/upvote`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
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
      console.log(err.message);
    }
  };

  const handleCommentUpvote = async (e, commentId) => {
    if (!user) return;
    try {
      const res = await fetch(`${prefURL}/api/comments/${commentId}/upvote`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to upvote the comment.");
      } else {
        const jsonRes = await res.json();
        let updatedCommentsArray = commentsArray;

        updatedCommentsArray = updatedCommentsArray.map((item) => {
          if (item.comment_id !== jsonRes.comment_id) return item;
          item.upvotes = jsonRes.upvotes;
          return item;
        });

        setCommentsArray(updatedCommentsArray);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleCommentDownvote = async (e, commentId) => {
    if (!user) return;
    try {
      const res = await fetch(`${prefURL}/api/comments/${commentId}/downvote`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to downvote the comment.");
      } else {
        const jsonRes = await res.json();
        let updatedCommentsArray = commentsArray;
        updatedCommentsArray = updatedCommentsArray.map((item) => {
          if (item.comment_id !== jsonRes.comment_id) return item;
          item.upvotes = jsonRes.upvotes;
          return item;
        });
        setCommentsArray(updatedCommentsArray);
      }
    } catch (err) {
      console.log(err.message);
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
        <div style={{ padding: "2rem", flexGrow: "1" }}>
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
            {user && board && user.user_id === board.user_id && (
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
                <IconButton size="40px" color="inherit" onClick={handleSubmit}>
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
              handleCommentDelete={handleCommentDelete}
              handleCommentUpvote={handleCommentUpvote}
              handleCommentDownvote={handleCommentDownvote}
            />
          </InfiniteScroll>
          <div id="bottom-detector"></div>
        </div>
      </div>
    </>
  );
};

export default Board;
