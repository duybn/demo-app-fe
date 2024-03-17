import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://storage.googleapis.com/gweb-uniblog-publish-prod/original_images/youtube-logo.jpeg)',
    backgroundSize: 'cover',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

async function loginUser(credentials) {
  const infos = {
    "user": {
      "email": credentials.email,
      "password": credentials.password
    }
  }

  return fetch(`${process.env.REACT_APP_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(infos)
  })
}

async function signupUser(credentials) {
  const infos = {
    "user": {
      "email": credentials.email,
      "password": credentials.password
    }
  }

  return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(infos)
  })
 }

export default function Signin() {
  const classes = useStyles();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [action, setAction] = useState();

  const handleSubmit = async(e) => {
    e.preventDefault();

    let response;
    if (action == 'Sign In') {
      response = await loginUser({
        email,
        password
      });
    } else {
      response = await signupUser({
        email,
        password
      });
    }

    if (response.status != 200) {
      swal("Failed", "Invalid mail or password", "error");
    } else {
      swal("Success", 'Success', "success", {
        buttons: false,
        timer: 2000,
      })
      .then((value) => {
        localStorage.setItem('ytAccessToken', response.headers.get('Authorization'));
        localStorage.setItem('userEmail', response['userEmail']);
        window.location.href = "/profile";
      });
    }
  }

  return (
    <Grid container className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} md={7} className={classes.image} />
      <Grid item xs={12} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={e => setAction(e.target.innerHTML)}
            >
              Sign In
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="error"
              className={classes.submit}
              onClick={e => setAction(e.target.innerHTML)}
            >
              Sign up
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
