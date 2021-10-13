import React from "react";
import Box from "@mui/material/Box";
import Link from "@material-ui/core/Link";
import GitHubIcon from "@material-ui/icons/GitHub";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const Contact = (props) => {
  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flex: "1",
          alignItems: "center",
          justifyContent: "center",
          gap: "10rem",
          margin: "auto",
        }}
      >
        <List style={{ display: "flex", flexDirection: "row" }}>
          <ListItem style={{ margin: "2rem" }}>
            <Link
              color="inherit"
              href="https://github.com/Harsh-Modi278"
              target="_blank"
              sx={{
                cursor: "pointer",
              }}
            >
              <GitHubIcon style={{ fontSize: 50 }} />
            </Link>
          </ListItem>
          <ListItem style={{ margin: "2rem" }}>
            <Link
              color="inherit"
              href="https://www.youtube.com/watch?v=o-YBDTqX_ZU"
              target="_blank"
              sx={{
                cursor: "pointer",
              }}
            >
              <FacebookIcon style={{ fontSize: 50 }} />
            </Link>
          </ListItem>
          <ListItem style={{ margin: "2rem" }}>
            <Link
              color="inherit"
              href="https://www.youtube.com/watch?v=o-YBDTqX_ZU"
              target="_blank"
              sx={{
                cursor: "pointer",
              }}
            >
              <TwitterIcon style={{ fontSize: 50 }} />
            </Link>
          </ListItem>
          <ListItem style={{ margin: "2rem" }}>
            <Link
              color="inherit"
              href="https://www.youtube.com/watch?v=o-YBDTqX_ZU"
              target="_blank"
              sx={{
                cursor: "pointer",
              }}
            >
              <InstagramIcon style={{ fontSize: 50 }} />
            </Link>
          </ListItem>
        </List>
      </Box>
    </React.Fragment>
  );
};

export default Contact;
