import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';

import swal from 'sweetalert';
import ActionCable from 'actioncable';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));

export default function Profile() {
  const classes = useStyles();
  const [sharedVideos, setSharedVideos] = useState([]);
  const cable = ActionCable.createConsumer(`${process.env.REACT_APP_CABLE_URL}`);
  const [youtubeLink, setYoutubeLink] = useState('');

  cable.subscriptions.create(
    { channel: 'SharedVideosChannel' },
    { received: sharedVideo => handleReceivedSharedVideo(sharedVideo) }
  )

  const fetchSharedVideos = () => {
    fetch(`${process.env.REACT_APP_API_URL}/shared_videos`, {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('ytAccessToken')
      }
    }).then(res => res.json())
      .then(data => setSharedVideos(data.shared_videos));
  }

  const handleReceivedSharedVideo = (video) => {
    fetchSharedVideos();
    swal("Success", `A new video has been shared by ${video.user_email}`, "success", {
      buttons: false,
      timer: 2000,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("ytAccessToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleShareVideo = (e) => {
    e.preventDefault();

    const shareVideoObj = {
      youtube_url: youtubeLink
    };

    fetch(`${process.env.REACT_APP_API_URL}/shared_videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('ytAccessToken')
      },
      body: JSON.stringify(shareVideoObj)
    }).then(response => {
      if (response.status == 200) {
        swal("Success", 'Success', "success", {
          buttons: false,
          timer: 2000,
        })
      } else {
        swal("Failed", 'Invalid Youtube link', "error");
      }
    });

    e.target.reset();
  }

  useEffect(() => {
    fetchSharedVideos();
  }, [])

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Typography>
        </Toolbar>
      </AppBar>
      <form className={classes.form} noValidate onSubmit={handleShareVideo}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="link"
          name="link"
          label="Youtube Link"
          onChange={e => setYoutubeLink(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Share this video
        </Button>
      </form>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography>
            Welcome to Youtube sharing videos
          </Typography>
        </CardContent>
      </Card>
      <Grid sm={3}>
        {sharedVideos.map((video, i) =>
          <Card key={i}>
            <CardContent>
              <Typography>
                Shared_by: {video.user_email}
              </Typography>
            </CardContent>
            <CardMedia
                component='iframe'
                title='video'
                src={video.youtube_url}
            />
          </Card>
        )}
      </Grid>
    </>
  );
}
