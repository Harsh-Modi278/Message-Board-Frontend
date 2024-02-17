import { makeStyles } from "@material-ui/core/styles";
import {
  ArrowCircleDownRounded as ArrowCircleDownRoundedIcon,
  ArrowCircleDownTwoTone as ArrowCircleDownTwoToneIcon,
  ArrowCircleUpRounded as ArrowCircleUpRoundedIcon,
  ArrowCircleUpTwoTone as ArrowCircleUpTwoToneIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  SendSharp as SendSharpIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SortType } from "../common/sortingStates";
import { Comment, Comments } from "../components/Comments";
import ReactMarkdownWrapper from "../components/ReactMarkdownWrapper";
import { prefURL } from "../constants/backendURL";
import routes from "../constants/route.json";
import { User } from "../redux/reducers/userSlice";
import { RootState } from "../redux/store";
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

// TO-DO: Remove this duplication of code
type AlertType = "error" | "info" | "success" | "warning";

let alertStatus: AlertType = "error",
  alertMsg = "Error in deleting the comment, please try again!";

export const Board: React.FC<BoardProps> = (props) => {
  const classes = useStyles();
  const { boardId } = props.match.params;

  const user: User | null = useSelector((state: RootState) => state.user.value);
  const filters: Filters = useSelector(
    (state: RootState) => state.filters.value
  );

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [isBoardUpvoted, setIsBoardUpvoted] = useState<boolean>(false);
  const [isBoardDownvoted, setIsBoardDownvoted] = useState<boolean>(false);
  const [board, setBoard] = useState<any>({}); // To-Do: define the type
  const [commentBody, setCommentBody] = useState<string>("");

  const navigate = useNavigate();

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
  ]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentBody(e.target.value);
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
      // setCommentsArray(updatedCommentsArray);
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
        navigate(routes.HOME);
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

          <Comments setAlertOpen={setAlertOpen} />
          <div id="bottom-detector"></div>
        </div>
      </div>
    </>
  );
};
