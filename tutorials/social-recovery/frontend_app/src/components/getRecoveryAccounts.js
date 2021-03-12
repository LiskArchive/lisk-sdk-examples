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
import { fetchRecoveryConfigs } from '../api';
import RecoveryConfig from "./recoveryConfig";

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

export default function GetRecoveryConfigs () {
  const classes = useStyles();
  const [data, setData] = useState({
    result: []
  });

  useEffect(() => {
    async function getRecoveryConfigs() {
      const result = await fetchRecoveryConfigs();
      if ( result.length > 0 ) {
        setData({ result });
      }
    }
    getRecoveryConfigs()
  }, [])

  return (
    <Container component="main" className={classes.paper}>
      <CssBaseline />
      <div className={classes.root}>
        { data.result.length > 0
          ?
        <Grid container spacing={3}>
          {  data.result.map((config) => (
            <Grid item xs={12}>
              <RecoveryConfig item={config} key={config.address} />
            </Grid>
          )) }
        </Grid>
          : <p>No recoverable accounts found</p> }
      </div>
    </Container>
  );
}
