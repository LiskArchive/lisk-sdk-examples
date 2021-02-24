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
import { createNFTToken } from "../../utils/transactions/create_nft_token";
import * as api from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function CreateNFTTokenDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  const [data, setData] = useState({
    name: "",
    initValue: "",
    minPurchaseMargin: "",
    fee: "",
    passphrase: "",
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const res = await createNFTToken({
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
        <DialogTitle id="alert-dialog-title">{"Create NFT"}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              label="Name"
              value={data.name}
              name="name"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Initial Token value"
              value={data.initValue}
              name="initValue"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Minimum Purchase Margin (0 - 100)"
              value={data.minPurchaseMargin}
              name="minPurchaseMargin"
              onChange={handleChange}
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
          <Button onClick={handleSend}>Create NFT</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
