import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@mui/material/Divider";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { getTimeDiff } from "../utils/functions";

const Comments = (props) => {
  const { comments } = props;
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
            <React.Fragment key={currComment.comment_id}>
              <ListItem alignItems="center">
                <ListItemAvatar>
                  <Avatar
                    alt={currComment.username}
                    src={currComment.imageurl}
                  />
                </ListItemAvatar>
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
                  secondary={currComment["comment"]}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </>
  );
};

export default Comments;
