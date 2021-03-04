import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { cryptography } from "@liskhq/lisk-client";

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
        <Typography variant="h6">{cryptography.getBase32AddressFromAddress(Buffer.from(props.item.address, 'hex'))}</Typography>
        <Divider />
        <dl className={classes.propertyList}>
          <li>
            <dt>Friends</dt>
            <dl>
              {props.item.friends.map((friend) => (
                <li key={friend}>
                  <dd>{cryptography.getBase32AddressFromAddress(Buffer.from(friend, 'hex'))}</dd>
                </li>
              ))}
            </dl>
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
