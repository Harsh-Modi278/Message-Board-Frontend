import { React, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@mui/material/Divider";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { getTimeDiff } from "../utils/functions";
import DeleteIcon from "@mui/icons-material/Delete";

import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";

import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";

import { IconButton } from "@material-ui/core";

import { UserContext } from "../contexts/UserContext";
import ReactMarkdownWrapper from "../components/ReactMarkdownWrapper";

const Comments = (props) => {
  const { user, setUser } = useContext(UserContext);
  const {
    comments,
    handleCommentDelete,
    handleCommentUpvote,
    handleCommentDownvote,
  } = props;

  return (
    <>
      <br />
      {comments.length === 0 ? (
        <Typography gutterBottom variant="h5" align="center" color="primary">
          There are no replies on this thread! You can be the first one to
          contribute.
        </Typography>
      ) : (
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          component="div"
          aria-label="mailbox folders"
        >
          {comments.map((currComment) => (
            <div key={currComment.comment_id}>
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
                          {`  | submitted ${getTimeDiff(currComment.time)}`}
                        </Typography>
                      </>
                    }
                    secondary={
                      <ReactMarkdownWrapper body={currComment["comment"]} />
                    }
                  />
                </ListItem>
              </div>
              <ListItem style={{ display: "flex", justifyContent: "flex-end" }}>
                {user && user.user_id === currComment.user_id && (
                  <IconButton
                    onClick={(e) =>
                      handleCommentDelete(e, currComment.comment_id)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
                <IconButton
                  onClick={(e) => {
                    handleCommentUpvote(e, currComment.comment_id);
                  }}
                >
                  <ThumbUpAltOutlinedIcon />
                </IconButton>
                <Typography variant="h6" component="span">
                  {currComment.upvotes}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    handleCommentDownvote(e, currComment.comment_id);
                  }}
                >
                  <ThumbDownAltOutlinedIcon />
                </IconButton>
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          ))}
        </List>
      )}
    </>
  );
};

export default Comments;
