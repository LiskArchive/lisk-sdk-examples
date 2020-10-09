import React, { useState, useEffect } from "react";
import { Container, Typography, Divider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { transactions } from "@liskhq/lisk-client";
import NFTToken from "./NFTToken";
import { fetchNFTToken } from "../api";

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

export default function Account(props) {
  const [nftTokens, setNftTokens] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      setNftTokens(
        await Promise.all(
          props.account.nft.ownNFTs.map((a) => fetchNFTToken(a))
        )
      );
    }

    fetchData();
  }, [props.account.nft.ownNFTs]);

  return (
    <Container>
      <Typography variant="h5">{props.account.address}</Typography>
      <Divider />
      <dl className={classes.propertyList}>
        <li>
          <dt>Balance</dt>
          <dd>
            {transactions.convertBeddowsToLSK(props.account.token.balance)}
          </dd>
          <dt>Nonce</dt>
          <dd>{props.account.sequence.nonce}</dd>
        </li>
      </dl>
      <Typography variant="h6">{"NFT Tokens"}</Typography>
      <Grid container spacing={4}>
        {nftTokens.map((item) => (
          <Grid item md={3}>
            <NFTToken item={item} key={item.address} minimum={true} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
