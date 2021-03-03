import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  propertyList: {
    listStyle: "none",

    "& li": {
      margin: theme.spacing(2, 0),
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: "solid",
      borderBottomWidth: 1,

      "& dt": {
        display: "block",
        width: "100%",
        fontWeight: "bold",
        margin: theme.spacing(1, 0),
      },
      "& dd": {
        display: "block",
        width: "100%",
        margin: theme.spacing(1, 0),
      },
    },
  },
}));

export default function RecoveryConfig(props) {
  const classes = useStyles();
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{props.item.address}</Typography>
        <Divider />
        <dl className={classes.propertyList}>
          <li>
            <dt>Friends</dt>
            <dd>{props.item.friends}</dd>
          </li>
          <li>
            <dt>recoveryThreshold</dt>
            <dd>{props.item.recoveryThreshold}</dd>
          </li>
          <li>
            <dt>delayPeriod</dt>
            <dd>{props.item.delayPeriod}</dd>
          </li>
        </dl>
      </CardContent>
    </Card>
  );
}
