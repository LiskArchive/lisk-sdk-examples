import React, {
	useState
} from 'react';
import {
	Grid,
	TextField,
	CssBaseline,
	Button,
	Container,
  Paper,
} from '@material-ui/core';
import {
	makeStyles
} from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { fetchAccountInfo } from '../api';
import { defaultLostAddress } from '../utils/defaults';
import { cryptography } from '@liskhq/lisk-client';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'inline-block',
    alignContent: 'center',
    marginTop: theme.spacing(3),
    width: '80%'
  },
  form: {
    width: '80%',
    marginTop: theme.spacing(3),
    display: 'inline-block'
  },
  root: {
    backgroundColor: grey[200],
    flexGrow: 1
  }
}));

export default function GetAccount() {
  const classes = useStyles();

  const [data, setData] = useState({
    accountAddress: defaultLostAddress,
    enableText: 'none',
    result: {
      data: {
        token: {
          balance: '0',
        },
        srs: {
          config: {
            friends: [],
            delayPeriod: 0,
            recoveryThreshold: 0,
            deposit: '0',
          },
          status: {
            created: 0,
            rescuer: '',
            deposit: '0',
            active: false,
            vouchList: [],
          }
        }
      }
    },
    severity: 'success',
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();
    try {
        const result = await fetchAccountInfo(cryptography.getAddressFromBase32Address(data.accountAddress).toString('hex'));
        if (result.error) {
            setData({ severity: 'error', result: result.error, enableText: '' });
        } else {
            setData({ severity: 'success', result, enableText: ''  });
        }

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      <div className={classes.paper} id="wrapper">
        <form className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="accountAddress"
                label="Account Address"
                id="accountAddress"
                onChange={handleChange}
                defaultValue={defaultLostAddress}
              />
            </Grid>
          <Button
            onClick={handleSend}
            fullWidth
            variant="contained"
            color="primary"
          >
            Get Account
          </Button>
          </Grid>
        </form>
      <div style={{ display: data.enableText }}>
          <Container component="main" className={classes.paper}>
          <CssBaseline />
          <div className={classes.root}>
          <Grid>
          <Grid item xl={'auto'}>
              <Paper>
              <h3>Balance (LSK)</h3>
              <b>{data.result.data.token.balance/100000000}</b>
              </Paper>
            </Grid>
            </Grid>
            <Grid>
            <Grid item xl={12}>
              <Paper>
              <h3>SRS Config</h3>
              <b>friends:</b>
              <br/>
              {data.result.data.srs.config.friends.map(f => (<i>{cryptography.getBase32AddressFromAddress(Buffer.from(f, 'hex'))}<br/></i>))}
              <b>delayPeriod:</b><i>{data.result.data.srs.config.delayPeriod}<br/></i>
              <b>recoveryThreshold:</b><i>{data.result.data.srs.config.recoveryThreshold}<br/></i>
              <b>deposit:</b><i>{data.result.data.srs.config.deposit}<br/></i>
              </Paper>
            </Grid>
            </Grid>
            <Grid>
            <Grid item xl={'auto'}>
              <Paper>
              <h3>SRS Status</h3>
              <b>vouchList:</b>
              <br/>
              {data.result.data.srs.status.vouchList.map(f => (<i>{cryptography.getBase32AddressFromAddress(Buffer.from(f, 'hex'))}<br/></i>))}
              <b>rescuer:</b><i>{data.result.data.srs.status.rescuer? cryptography.getBase32AddressFromAddress(Buffer.from(data.result.data.srs.status.rescuer, 'hex')) : 'none'}<br/></i>
              <b>created:</b><i>{data.result.data.srs.status.created}<br/></i>
              <b>deposit:</b><i>{data.result.data.srs.status.deposit}<br/></i>
              <b>active:</b><i>{data.result.data.srs.status.active ? 'true':'false'}<br/></i>
              </Paper>
            </Grid>
          </Grid>
        </div>
        </Container>
      </div>
      </div>
    </div>
  );
}
