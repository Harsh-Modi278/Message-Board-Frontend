import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@mui/material/Divider";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(8),
  },
  card: {
    // height: "140%",
    // width: "120%",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const Comments = (props) => {
  const { comments } = props;
  const classes = useStyles();
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
                    alt="Remy Sharp"
                    src="https://www.shutterstock.com/image-vector/man-member-avatar-icon-vector-1395952562"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={<strong>User Id: {currComment.user_id}</strong>}
                  secondary={" - " + currComment["comment"]}
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
