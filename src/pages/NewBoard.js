import { React, useState, useContext } from "react";
import ReactMarkdownWrapper from "../components/ReactMarkdownWrapper";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { UserContext } from "../contexts/UserContext";
import { Redirect, useHistory } from "react-router-dom";
import { prefURL } from "../constants/backendURL";


const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const NewBoard = () => {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const [alertOpen, setAlertOpen] = useState(false);

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTabChange = (e, newTabValue) => {
    setTabValue(newTabValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${prefURL}/api/boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          user_id: user.user_id,
          title: title,
          description: body,
        }),
      });

      if (!res.ok) {
        throw new Error("Error in posting a new board");
      }

      const jsonRes = await res.json();
      history.push("/");
    } catch (err) {
      console.log(err);
      setAlertOpen(true);
    }
  };

  return (
    <Container component="main" maxWidth="ld" sx={{ marginTop: 8 }}>
      {!user && <Redirect to="/login" />}
      <Collapse in={alertOpen}>
        <Alert
          severity="error"
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
          Error in submitting the post, please try again!
        </Alert>
      </Collapse>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="basic tabs example"
        centered
      >
        <Tab label="Draft" />
        <Tab label="Preview" />
      </Tabs>
      <CssBaseline />
      <TabPanel value={tabValue} index={0}>
        <Typography component="h1" variant="h5">
          Create a new board
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoComplete="title"
            autoFocus
            variant="standard"
            value={title}
            onChange={handleTitleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="description"
            label="You can use GitHub markdown to write the description here."
            type="description"
            id="description"
            autoComplete="description"
            multiline
            variant="filled"
            value={body}
            onChange={handleBodyChange}
          />
        </Box>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Typography component="h1" variant="h5">
          Markdown Preview:
        </Typography>
        <div style={{ border: "1px black solid", padding: "2rem" }}>
          <Typography component="h2" variant="h2" align="center">
            {title}
          </Typography>
          <ReactMarkdownWrapper body={body} />
        </div>
      </TabPanel>
      <div
        style={{
          display: "flex",
          flex: "1",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          type="submit"
          // fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </Container>
  );
};
export default NewBoard;
