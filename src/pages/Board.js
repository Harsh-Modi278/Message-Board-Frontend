import { React, useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/core/styles";
import useFetch from "../hooks/useFetch.js";
import Comments from "../components/Comments.js";
import Divider from "@mui/material/Divider";

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

import { UserContext } from "../UserContext";
import { getTimeDiff } from "../utils/functions";

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
  const [sort, setSort] = useState("best");

  const [commentBody, setCommentBody] = useState("");

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
      (sort && `?sort=${sort}`)
  );
  const len = boardComments ? boardComments.length : 0;

  const [commentsArray, setCommentsArray] = useState(boardComments);

  useEffect(() => {
    setCommentsArray(boardComments);
  }, [boardComments]);

  const handleDropDownChange = (e) => {
    setSort(e.target.value);
  };

  const handleCommentChange = (e) => {
    setCommentBody(e.target.value);
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

  return (
    <div className={classes.root}>
      {errorBoard && <div>{errorBoard}</div>}
      {errorBoardComments && <div>{errorBoardComments}</div>}

      {(isPendingBoard || isPendingBoardComments) && <div>Loading...</div>}

      <div style={{ padding: "2rem" }}>
        <Typography variant="h6" component="h6" align="left" color="primary">
          <a
            href={`/boards/${boardId}`}
            style={{
              color: "#0000ff",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <strong>Board Name:{board && board[0]?.board_name}</strong>
          </a>
        </Typography>
        <List
          sx={{
            width: "auto",
            bgcolor: "background.paper",
          }}
        >
          <ListItem alignItems="center">
            <ListItemAvatar>
              <Avatar
                alt={(board && board[0]?.username) || "X Y"}
                src={board && board[0]?.imageurl}
              />
            </ListItemAvatar>

            <br />
            <ListItemText
              primary={
                <>
                  <Typography variant="h5" component="span" color="primary">
                    <strong>
                      {(board && board[0]?.username) || "John Doe"}
                    </strong>
                  </Typography>
                  <Typography variant="subtitle2" component="span">
                    {`  | submitted ${getTimeDiff(
                      board && board[0]?.time_created
                    )}`}
                  </Typography>
                </>
              }
              secondary={board && board[0]?.board_description}
            />
          </ListItem>
        </List>
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
                <Avatar alt={user?.name || "John Does"} src={user?.imageUrl} />
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
              value={sort}
              label="Sort By"
              onChange={handleDropDownChange}
            >
              <MenuItem value={"best"}>best</MenuItem>
              <MenuItem value={"new"}>new</MenuItem>
              <MenuItem value={"old"}>old</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Comments comments={commentsArray || []} />
      </div>
    </div>
  );
};

export default Board;
