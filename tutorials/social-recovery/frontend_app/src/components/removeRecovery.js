import React, { Fragment, useContext, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { grey, red } from '@material-ui/core/colors';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { sendTransactions } from '../api';
import { removeRecoveryDefaults } from '../utils/defaults';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { cryptography } from "@liskhq/lisk-client";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function Footer() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link style={{ color: grey[500] }} href="/">
        About Social Recovery System
      </Link>
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: 'rgb(37 35 35 / 87%)',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function RemoveRecovery() {
  const classes = useStyles();
  const [open, setOpen ] = useState(false);

  const [data, setData] = useState({
    lostAccount: removeRecoveryDefaults.lostAccount,
    passphrase: removeRecoveryDefaults.passphrase,
    msg: '',
    severity: 'success',
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();
    try {
        const result = await sendTransactions({ lostAccount: cryptography.getAddressFromBase32Address(data.lostAccount).toString('hex'), passphrase: data.passphrase }, window.location.pathname.slice(1));
        if (result.errors) {
            setData({ msg: result.errors[0].message, severity: 'error' });
        } else {
            setData({ msg: `Recovery Removed: Transaction ID ${result.data.transactionId} is added`, severity: 'success' });
        }
        setOpen(true);

    } catch (error) {}
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
            <HighlightOffIcon style={{ color: red[500] }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Remove Recovery
        </Typography>
        <Typography component="h4" style={{color: 'grey'}}>
          Remove recovery configuration from your account
        </Typography>
        <form className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="lostAccount"
                label="Lost Account Address"
                id="lostAccount"
                onChange={handleChange}
                defaultValue={removeRecoveryDefaults.lostAccount}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passphrase"
                label="Passphrase"
                id="passphrase"
                type="password"
                onChange={handleChange}
                defaultValue={removeRecoveryDefaults.passphrase}
              />
            </Grid>
          <Button
            onClick={handleSend}
            fullWidth
            variant="contained"
            color="primary"
          >
            Remove Recovery config
          </Button>
          </Grid>
        </form>

        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={data.severity}>
                <label id='msg'>{data.msg}</label>
            </Alert>
        </Snackbar>
      </div>
      <Box mt={5}>
        <Footer />
      </Box>
    </Container>
  );
}
