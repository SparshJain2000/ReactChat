import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { ReactComponent as Google } from "./search.svg";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import MuiAlert from "@material-ui/lab/Alert";
import {
    Button,
    TextField,
    Zoom,
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    Avatar,
    List,
    ListItem,
    Snackbar,
    ListItemAvatar,
    ListItemText,
    FormGroup,
    CssBaseline,
    Grid,
    SvgIcon,
} from "@material-ui/core";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Telegram, ExitToApp, Facebook } from "@material-ui/icons";
import logo from "./fire.svg";
import Axios from "axios";
firebase.initializeApp({
    apiKey: "AIzaSyC5bjSXgNT4ME3G1CtMECI2Ee2d2fLIMJQ",
    authDomain: "reactchat-d97e5.firebaseapp.com",
    databaseURL: "https://reactchat-d97e5.firebaseio.com",
    projectId: "reactchat-d97e5",
    storageBucket: "reactchat-d97e5.appspot.com",
    messagingSenderId: "351876205185",
});
function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: { main: "#0f4c75" },
        secondary: { main: "#e16428" },
        error: { main: "#bb2205" },
        success: { main: "#132743" },
        // background: { main: "#414141" },
    },
});
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
    const [user] = useAuthState(auth);
    const [open, handleOpen] = useState(false);
    const [err, handleErr] = useState("");
    const [users, setUsers] = useState([]);
    const getUsers = () => {
        Axios.get(
            "https://us-central1-reactchat-d97e5.cloudfunctions.net/getAllUsers",
        )
            .then((data) => {
                console.log(data);
            })
            .catch((err) => console.log(err.response));
    };
    getUsers();
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className='flex-column'>
                <AppBar position='absolute' color='primary'>
                    <Toolbar>
                        <img src={logo} style={{ height: "1.5rem" }} />
                        <Typography
                            variant='h6'
                            className='f-grow-1 align-left font-raleway ml-2'>
                            ReactChat
                        </Typography>
                        {user ? (
                            <SignOut />
                        ) : (
                            <Button
                                color='inherit'
                                href='http://sparshjain.me'
                                target='_blank'>
                                {"</> with 🧡 by Sparsh"}
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
                <Grid container className='f-grow-1 h-90 mt-10'>
                    <Snackbar
                        style={{ width: "90vw" }}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                        }}
                        autoHideDuration={8000}
                        open={open}
                        onClose={handleOpen}
                        key={"snack"}>
                        <Alert severity='error'>{err}</Alert>
                    </Snackbar>
                    <Grid
                        item
                        xs={12}
                        sm={10}
                        md={8}
                        lg={6}
                        className='mx-auto bg-darker'>
                        {user ? (
                            <ChatRoom />
                        ) : (
                            <SignIn
                                handleErr={handleErr}
                                handleOpen={handleOpen}
                            />
                        )}
                    </Grid>
                </Grid>
            </div>
        </ThemeProvider>
    );
}
const SignIn = ({ handleErr, handleOpen }) => {
    const signInFB = () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope("user_birthday");
        auth.signInWithPopup(provider)
            .then((result) => {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...
                console.log(user, token);
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                handleErr(errorMessage);
                handleOpen(true);
                console.log(error);
                // ...
            });
    };
    const signInGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...
                console.log(user);
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                handleErr(errorMessage);
                handleOpen(true);
                console.log(error);
                // ...
            });
    };
    return (
        <div
            className='text-align-center w-75 mx-auto '
            style={{ paddingTop: "40vh" }}>
            <Grid container>
                <Grid item xs={12} sm={6} className='p-2'>
                    <Button
                        className='w-100 '
                        color='primary'
                        variant='contained'
                        onClick={signInGoogle}
                        endIcon={<GoogleIcon />}>
                        Sign In with google
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} className='p-2'>
                    <Button
                        className='w-100 '
                        color='secondary'
                        variant='contained'
                        onClick={signInFB}
                        endIcon={<Facebook />}>
                        Sign In with FaceBook
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};
const SignOut = () => {
    return (
        auth.currentUser && (
            <Button
                color='secondary'
                variant='contained'
                onClick={() => auth.signOut()}
                endIcon={<ExitToApp />}>
                Sign Out
            </Button>
        )
    );
};
const ChatRoom = () => {
    const xtra = useRef();
    const messRef = firestore.collection("messages");
    const query = messRef.orderBy("createdAt").limitToLast(15);
    const [messages] = useCollectionData(query, { idField: "id" });
    const [value, setValue] = useState("");
    const setMess = async (e) => {
        e.preventDefault();
        const { uid, photoURL } = auth.currentUser;
        if (value !== "")
            await messRef.add({
                text: value,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                photoURL,
            });
        setValue("");
    };
    useEffect(() => {
        xtra.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div>
            <main>
                <List>
                    {messages && messages.map((msg) => <ChatMess msg={msg} />)}
                </List>
            </main>
            <div ref={xtra}></div>
            <form onSubmit={setMess}>
                <FormGroup row className='w-100 p-3'>
                    <TextField
                        label='Enter a message '
                        variant='outlined'
                        color='secondary'
                        style={{ flexGrow: 1 }}
                        type='text'
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <Button
                        color='secondary'
                        variant='contained'
                        type='submit'
                        size='large'
                        className='ml-1'>
                        <Telegram />
                    </Button>
                </FormGroup>
            </form>
        </div>
    );
};
const ChatMess = ({ msg }) => {
    const { text, uid, photoURL } = msg;
    return (
        <Zoom in={true} style={{ transitionDelay: "600ms" }}>
            {/* <div className='bg-secondary'> */}
            <ListItem
                className={`${
                    uid !== auth.currentUser.uid ? "row" : "row-reverse"
                }`}
                alignItems='flex-start'>
                <ListItemAvatar className='my-auto'>
                    <Avatar src={photoURL} alt='' />
                </ListItemAvatar>
                <ListItemText
                    primary={text}
                    className='w-max my-auto p-2 m-1 mx-1 wrap bg-secondary'
                />
                {/* <p>{text}</p> */}
            </ListItem>
            {/* </div> */}
        </Zoom>
    );
};
const GoogleIcon = () => {
    return (
        <SvgIcon>
            <Google />
        </SvgIcon>
    );
};
export default App;
