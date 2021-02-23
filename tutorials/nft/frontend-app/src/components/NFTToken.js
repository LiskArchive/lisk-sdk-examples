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
import { transactions, cryptography, Buffer } from "@liskhq/lisk-client";

import PurchaseNFTTokenDialog from "./dialogs/PurchaseNFTTokenDialog";
import TransferNFTDialog from "./dialogs/TransferNFTDialog";

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
  const [openTransfer, setOpenTransfer] = useState(false);
  const base32UIAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.item.ownerAddress, 'hex'), 'lsk').toString('binary');
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{props.item.name}</Typography>
        <Divider />
        <dl className={classes.propertyList}>
          <li>
            <dt>Token ID</dt>
            <dd>{props.item.id}</dd>
          </li>
          <li>
            <dt>Token value</dt>
            <dd>{transactions.convertBeddowsToLSK(props.item.value)}</dd>
          </li>
          <li>
            <dt>Minimum Purchase Margin</dt>
            <dd>{props.item.minPurchaseMargin}</dd>
          </li>
          {!props.minimum && (
            <li>
              <dt>Current Owner</dt>
              <dd>
                <Link
                  component={RouterLink}
                  to={`/accounts/${base32UIAddress}`}
                >
                  {base32UIAddress}
                </Link>
              </dd>
            </li>
          )}
        </dl>
        <Typography variant="h6">NFT History</Typography>
        <Divider />
        {props.item.tokenHistory.map((base32UIAddress) => (
          <dl className={classes.propertyList}>
            <li>
              <dd>
                <Link
                  component={RouterLink}
                  to={`/accounts/${base32UIAddress}`}
                >
                  {base32UIAddress}
                </Link>
              </dd>
            </li>
          </dl>
        ))}

      </CardContent>
      <CardActions>
        <>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setOpenTransfer(true);
            }}
          >
            Transfer NFT
          </Button>
          <TransferNFTDialog
            open={openTransfer}
            handleClose={() => {
              setOpenTransfer(false);
            }}
            token={props.item}
          />
        </>
        {props.item.minPurchaseMargin > 0 ? (
          <>
            <Button
              size="small"
              color="primary"
              onClick={() => {
                setOpenPurchase(true);
              }}
            >
              Purchase NFT
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
