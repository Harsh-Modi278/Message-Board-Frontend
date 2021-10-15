import { React, useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/core/styles";
import useFetch from "../hooks/useFetch.js";
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

import AccountCircle from "@mui/icons-material/AccountCircle";
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
import { style } from "@mui/system";

import ReactMarkdownWrapper from "../components/ReactMarkdownWrapper";

import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

import CommentIcon from "@mui/icons-material/Comment";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import { Redirect, useHistory } from "react-router-dom";

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
  const [alertOpen, setAlertOpen] = useState(false);

  const [commentBody, setCommentBody] = useState("");

  const history = useHistory();

  // request for board details from server using board id
  let {
    data: board,
    isPendingBoard,
    errorBoard,
  } = useFetch(`http://localhost:5000/api/boards/${boardId}`);

  // request for board comments from server using board id
  let {
    data: boardComments,
    isPendingBoardComments,
    errorBoardComments,
  } = useFetch(
    `http://localhost:5000/api/boards/${boardId}/comments/` +
      (filters && `?sort=${filters.sortComments}`)
  );

  const [commentsArray, setCommentsArray] = useState(boardComments);

  useEffect(() => {
    setCommentsArray(boardComments);
  }, [boardComments]);

  const handleDropDownChange = (e) => {
    setFilters({ ...filters, sortComments: e.target.value });
  };

  const handleCommentChange = (e) => {
    setCommentBody(e.target.value);
  };

  let alertStatus = "error",
    alertMsg = "Error in deleting the comment, please try again!";

  const handleCommentDelete = async (e, comment_id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/boards/${boardId}/comments/${comment_id}`,
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
        alertStatus = "error";
        alertMsg = "Error in deleting the comment, please try again!";
        setAlertOpen(true);
        throw new Error("Error when deleting a comment");
      } else {
        const jsonRes = await res.json();
        alertStatus = "success";
        alertMsg = "Comment successfully deleted, please refresh the page";
        setAlertOpen(true);
      }
    } catch (err) {
      alertStatus = "error";
      alertMsg = "Error in deleting the comment, please try again!";
      setAlertOpen(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const resp = await fetch(
        `http://localhost:5000/api/boards/${boardId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            user_id: user.user_id,
            comment: commentBody,
          }),
        }
      );
      if (!resp.ok) {
        throw new Error("Error in posting user auth data to backend");
      }
      const jsonRes = await resp.json();

      let updatedCommentsArray = Array.from(commentsArray);
      updatedCommentsArray.push(jsonRes);
      setCommentBody("");
      setCommentsArray(updatedCommentsArray);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBoardDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/boards", {
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
        const jsonRes = await res.json();
        history.push("/");
      }
    } catch (err) {
      console.log(err.message);
      alertStatus = "error";
      alertMsg = "Could not delete the post, please try again";
      setAlertOpen(true);
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
        {errorBoard && <div>{errorBoard}</div>}
        {errorBoardComments && <div>{errorBoardComments}</div>}

        {(isPendingBoard || isPendingBoardComments) && <div>Loading...</div>}

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
              <IconButton>
                <ArrowCircleUpRoundedIcon style={{ fontSize: "150%" }} />
              </IconButton>
              <Typography
                variant="h4"
                component="div"
                style={{ marginLeft: "1rem" }}
              >
                {board && board[0].upvotes}
              </Typography>
              <IconButton>
                <ArrowCircleDownRoundedIcon style={{ fontSize: "150%" }} />
              </IconButton>
            </div>
            {/* <Avatar
            alt={(board && board[0]?.username) || "X Y"}
            src={board && board[0]?.imageurl}
            sx={{ marginTop: 3 }}
          /> */}
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
                          <strong>{board && board[0]?.board_name}</strong>
                        </Typography>
                      </Link>
                      <Typography variant="subtitle2" component="span">
                        {`  submitted ${getTimeDiff(
                          board && board[0]?.time_created
                        )} by ${board && board[0]?.username}`}
                      </Typography>
                    </>
                  }
                  secondary={
                    <ReactMarkdownWrapper
                      body={board && board[0]?.board_description}
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
                {boardComments ? boardComments.length : 0}
              </Typography>
            </IconButton>
            {user.user_id === (board && board[0]?.user_id) && (
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
          <Comments
            comments={commentsArray || []}
            handleCommentDelete={handleCommentDelete}
          />
        </div>
      </div>
    </>
  );
};

export default Board;
