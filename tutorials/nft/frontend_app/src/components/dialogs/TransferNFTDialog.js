import React, { Fragment, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NodeInfoContext } from "../../context";
import { transferNFT } from "../../utils/transactions/transfer_nft";
import * as api from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function TransferNFTDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();

  const [data, setData] = useState({
    name: props.token.name,
    nftId: props.token.id,
    recipientAddress: "",
    fee: "",
    passphrase: "",
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const res = await transferNFT({
      ...data,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    });
    await api.sendTransactions(res.tx);
    props.handleClose();
  };

  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={props.handleClose}>
        <DialogTitle id="alert-dialog-title">
          {"Transfer NFT"}
        </DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              label="Token Name"
              value={data.name}
              name="name"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Token ID"
              value={data.nftId}
              name="nftId"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Recipient address"
              value={data.recipientAddress}
              name="recipientAddress"
              onChange={handleChange}
              helperText={`Address of the account that will receive the NFT.`}
              fullWidth
            />
            <TextField
              label="Fee"
              value={data.fee}
              name="fee"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Passphrase"
              value={data.passphrase}
              name="passphrase"
              onChange={handleChange}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSend}>Transfer NFT</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
