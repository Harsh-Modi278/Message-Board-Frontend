import { React, useEffect, useState } from "react";
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

  const [sort, setSort] = useState("best");

  const handleChange = (e) => {
    setSort(e.target.value);
  };

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
                alt="Remy Sharp"
                src="https://www.shutterstock.com/image-vector/man-member-avatar-icon-vector-1395952562"
              />
            </ListItemAvatar>

            <br />
            <ListItemText secondary={board && board[0]?.board_description} />
          </ListItem>
        </List>
        <br />

        <Box sx={{ minWidth: 50 }}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Sort by</InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sort}
              label="Sort By"
              onChange={handleChange}
            >
              <MenuItem value={"best"}>best</MenuItem>
              <MenuItem value={"new"}>new</MenuItem>
              <MenuItem value={"old"}>old</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <br />
        <Divider />
        <Comments comments={boardComments || []} />
      </div>
    </div>
  );
};

export default Board;
