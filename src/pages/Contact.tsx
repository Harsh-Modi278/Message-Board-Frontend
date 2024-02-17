import { Link, List, ListItem } from "@material-ui/core";
import { Facebook, GitHub, Instagram, Twitter } from "@material-ui/icons";
import Box from "@mui/material/Box";
import React from "react";

export const Contact: React.FC = () => {
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
            >
              <GitHub style={{ fontSize: 50 }} />
            </Link>
          </ListItem>
          <ListItem style={{ margin: "2rem" }}>
            <Link
              color="inherit"
              href="https://www.youtube.com/watch?v=o-YBDTqX_ZU"
              target="_blank"
            >
              <Facebook style={{ fontSize: 50 }} />
            </Link>
          </ListItem>
          <ListItem style={{ margin: "2rem" }}>
            <Link
              color="inherit"
              href="https://www.youtube.com/watch?v=o-YBDTqX_ZU"
              target="_blank"
            >
              <Twitter style={{ fontSize: 50 }} />
            </Link>
          </ListItem>
          <ListItem style={{ margin: "2rem" }}>
            <Link
              color="inherit"
              href="https://www.youtube.com/watch?v=o-YBDTqX_ZU"
              target="_blank"
            >
              <Instagram style={{ fontSize: 50 }} />
            </Link>
          </ListItem>
        </List>
      </Box>
    </React.Fragment>
  );
};