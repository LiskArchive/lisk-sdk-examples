import React, { Fragment, useEffect, useState } from "react";
import NFTToken from "./NFTToken";
import { Grid } from "@material-ui/core";
import { fetchAllNFTTokens } from "../api";

function HomePage() {
  const [NFTAccounts, setNFTAccounts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setNFTAccounts(await fetchAllNFTTokens());
    }
    fetchData();
  }, []);

  return (
    <Fragment>
      <Grid container spacing={4}>
        {NFTAccounts.map((item) => (
          <Grid item md={4}>
            <NFTToken item={item} key={item.id} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}

export default HomePage;
