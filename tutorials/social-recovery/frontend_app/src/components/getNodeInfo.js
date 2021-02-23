import React, {
  useEffect,
	useState
} from 'react';
import {
	Grid,
	CssBaseline,
	Container,
} from '@material-ui/core';
import {
	makeStyles
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { fetchNodeInfo } from '../api'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
}));

export default function GetNodeInfo () {
  const classes = useStyles();
  const [data, setData] = useState({
    result: {
      data: {
        height: 0,
        finalizedHeight: 0,
        networkVersion: 0,
        networkIdentifier: '',
      }
    },
  });

  useEffect(() => {
    async function getNodeInfo() {
          const result = await fetchNodeInfo();
          setData({ result });
    }
    getNodeInfo()
 }, [])

  return (
    <Container component="main" className={classes.paper}>
      <CssBaseline />
      <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
          <h3>Network Identifier</h3>
          <b>{data.result.data.networkIdentifier}</b>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
          <h3>Height</h3>
          <b>{data.result.data.height}</b>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
          <h3>Finalized Height</h3>
          <b>{data.result.data.finalizedHeight}</b>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
          <h3>Network Version</h3>
          <b>{data.result.data.networkVersion}</b>
          </Paper>
        </Grid>
      </Grid>
    </div>
    </Container>
  );
}