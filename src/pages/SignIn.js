import { React, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { GoogleLogin } from "react-google-login";
import { UserContext } from "../UserContext";
import { Redirect, useHistory } from "react-router-dom";
// refresh token
// import { refreshTokenSetup } from "../utils/refreshToken.js";
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function SignIn() {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  const onSuccess = (res) => {
    // console.log(res);
    // console.log("Login Success: currentUser:", res.profileObj);
    setUser(res.profileObj);
    localStorage.setItem(
      "userObj",
      JSON.stringify({
        profileObj: res.profileObj,
        accessToken: res.accessToken,
      })
    );

    // refreshTokenSetup(res);
    history.push("/");
  };

  const onFailure = (res) => {
    // console.log("Login failed: res:", res);
    // alert(`Failed to login.`);
    setUser(null);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginBottom: 30 }}>
      {user && <Redirect to="/" />}
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in with Google
        </Typography>
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign In with Google"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          style={{ marginTop: "100px" }}
        />
      </Box>
    </Container>
  );
}
