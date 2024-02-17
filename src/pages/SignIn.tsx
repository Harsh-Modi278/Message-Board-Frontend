import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
// import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { useSelector } from "react-redux";
import { Navigate, NavigateFunction, useNavigate } from "react-router-dom";
import { prefURL } from "../constants/backendURL";
import { User, setUser } from "../redux/reducers/userSlice";
import { RootState } from "../redux/store";
// refresh token
// import { refreshTokenSetup } from "../utils/refreshToken.js";
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function SignIn() {
  const user: User | null = useSelector((state: RootState) => state.user.value);
  const navigate: NavigateFunction = useNavigate();

  const onSuccess = async (res: any) => {
    try {
      const resp = await fetch(`${prefURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          email: res.profileObj.email,
          name: res.profileObj.name,
          imageUrl: res.profileObj.imageUrl,
        }),
      });
      if (!resp.ok) {
        throw new Error("Error in posting user auth data to backend");
      }
      const jsonRes = await resp.json();
      const { user_id } = jsonRes;
      let updatedUser = res.profileObj;
      updatedUser.user_id = user_id;
      console.log(updatedUser);
      setUser(updatedUser);
      localStorage.setItem(
        "userObj",
        JSON.stringify({
          profileObj: updatedUser,
          accessToken: res.accessToken,
        })
      );
    } catch (err) {
      console.log(err);
    }
    // refreshTokenSetup(res);
    navigate("/");
  };

  const onFailure = (res: any) => {
    // console.log("Login failed: res:", res);
    // alert(`Failed to login.`);
    setUser(null);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginBottom: 30 }}>
      {user && <Navigate to="/" />}
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
        {/* {TO-DO: Add Google Login here.} */}
        {/* <GoogleLogin
          clientId={clientId}
          buttonText="Sign In with Google"
          onSuccess={onSuccess as (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          style={{ marginTop: "100px" }}
        /> */}
      </Box>
    </Container>
  );
}
