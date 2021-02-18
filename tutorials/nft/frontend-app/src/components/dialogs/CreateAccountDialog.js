import React, { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getAddressFromPassphrase } from "@liskhq/lisk-cryptography";
import { Mnemonic } from "@liskhq/lisk-passphrase";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function CreateAccountDialog(props) {
  const [data, setData] = useState({ passphrase: "", address: "" });
  const classes = useStyles();

  useEffect(() => {
    const passphrase = Mnemonic.generateMnemonic();
    const address = getAddressFromPassphrase(passphrase).toString("hex");
    setData({ passphrase, address });
  }, [props.open]);

  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={props.handleClose} fullWidth>
        <DialogTitle id="alert-dialog-title">
          {"Please copy the address and passphrase"}
        </DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off" className={classes.root}>
            <TextField
              label="Passphrase"
              value={data.passphrase}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Address"
              value={data.address}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

