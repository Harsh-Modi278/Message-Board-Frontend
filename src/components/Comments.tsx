import Typography from "@material-ui/core/Typography";
import Divider from "@mui/material/Divider";
import React, { useContext } from "react";

import { IconButton } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import ReactMarkdownWrapper from "../components/ReactMarkdownWrapper";
import { UserContext } from "../contexts/UserContext";

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
  comments: Comment[];
  handleCommentDelete: (
    e: React.MouseEvent<HTMLButtonElement>,
    commentId: string
  ) => void;
  handleCommentUpvote: (
    e: React.MouseEvent<HTMLButtonElement>,
    commentId: string
  ) => void;
  handleCommentDownvote: (
    e: React.MouseEvent<HTMLButtonElement>,
    commentId: string
  ) => void;
}

const Comments: React.FC<CommentsProps> = ({
  comments,
  handleCommentDelete,
  handleCommentUpvote,
  handleCommentDownvote,
}) => {
  const { user } = useContext(UserContext);

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
          {comments.map((currComment: Comment) => (
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
                      <ReactMarkdownWrapper body={currComment.commentText} />
                    }
                  />
                </ListItem>
              </div>
              <ListItem style={{ display: "flex", justifyContent: "flex-end" }}>
                {user && user.userId === currComment.userId && (
                  <IconButton
                    onClick={(e) =>
                      handleCommentDelete(e, currComment.commentId)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
                <IconButton
                  onClick={(e) => {
                    handleCommentUpvote(e, currComment.commentId);
                  }}
                >
                  <ThumbUpAltOutlinedIcon />
                </IconButton>
                <Typography variant="h6" component="span">
                  {currComment.upvotes}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    handleCommentDownvote(e, currComment.commentId);
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
