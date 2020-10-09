import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Link,
  Divider,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { transactions } from "@liskhq/lisk-client";

import PurchaseNFTTokenDialog from "./dialogs/PurchaseNFTTokenDialog";

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

export default function NFTToken(props) {
  const classes = useStyles();
  const [openPurchase, setOpenPurchase] = useState(false);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">
          {transactions.convertBeddowsToLSK(props.item.value)}
        </Typography>
        <Typography variant="h6">{props.item.id}</Typography>
        <Divider />
        <dl className={classes.propertyList}>
          <li>
            <dt>Minimum Purchase Margin</dt>
            <dd>{props.item.minPurchaseMargin}</dd>
          </li>
          {!props.minimum && (
            <li>
              <dt>Owner</dt>
              <dd>
                <Link
                  component={RouterLink}
                  to={`/accounts/${props.item.ownerAddress}`}
                >
                  {props.item.ownerAddress}
                </Link>
              </dd>
            </li>
          )}
        </dl>
      </CardContent>
      <CardActions>
        {props.item.minPurchaseMargin > 0 ? (
          <>
            <Button
              size="small"
              color="primary"
              onClick={() => {
                setOpenPurchase(true);
              }}
            >
              Purchase
            </Button>
            <PurchaseNFTTokenDialog
              open={openPurchase}
              handleClose={() => {
                setOpenPurchase(false);
              }}
              token={props.item}
            />
          </>
        ) : (
          <Typography variant="body">Can't purchase this token</Typography>
        )}
      </CardActions>
    </Card>
  );
}
