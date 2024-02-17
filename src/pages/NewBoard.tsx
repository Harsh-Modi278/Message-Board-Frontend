import React, { ChangeEvent, FormEvent, useState } from "react";
import ReactMarkdownWrapper from "../components/ReactMarkdownWrapper";

import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { prefURL } from "../constants/backendURL";
import { User } from "../redux/reducers/userSlice";
import { RootState } from "../redux/store";

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const NewBoard: React.FC = () => {
  const user: User | null = useSelector((state: RootState) => state.user.value);
  const navigate = useNavigate();

  const [body, setBody] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [tabValue, setTabValue] = useState<number>(0);

  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const handleBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTabChange = (e: any, newTabValue: number) => {
    setTabValue(newTabValue);
  };

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${prefURL}/api/boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
        body: JSON.stringify({
          user_id: user?.userId,
          title: title,
          description: body,
        }),
      });

      if (!res.ok) {
        throw new Error("Error in posting a new board");
      }

      navigate("/");
    } catch (err) {
      console.log(err);
      setAlertOpen(true);
    }
  };

  return (
    <Container component="main" sx={{ marginTop: 8 }}>
      {!user && <Navigate to="/login" />}
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
