import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress, Button } from "@mui/material";
import styles from "../styles/Home.module.css";
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp";
import { GetStaticProps } from "next";
import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex, stringToHex } from "@polkadot/util";
import Router from "next/router";
import { loginAccount } from "../types";

type Props = {
  onSelect: any;
};

//login component utilising addresses from polkadot.js
const LoginModal: React.FC<Props> = (props) => {
  const [extensions, setExtensions] = useState<any>(null);
  const [accounts, setAccounts] = useState<any>(null);
  const [validAuth, setValidAuth] = useState(false);

  useEffect(() => {
    if (accounts === null) {
      fetchAccounts();
    }
  }, []);

  async function fetchAccounts() {
    const extensions = await web3Enable("bitgreen-dashboard");

    if (extensions.length === 0) {
      // no extension installed, or the user did not accept the authorization
      // in this case we should inform the use and give a link to the extension
      setExtensions(extensions);
    }

    const allAccounts: any = await web3Accounts().then((accounts) => {
      setAccounts(accounts);
    });
  }

  //Check that submitted address is a valid polkadot address
  const verifyUsingSignature = async (account: loginAccount) => {
    const isAddressValid = isValidAddressPolkadotAddress(account.address);
    if (isAddressValid === false) {
      console.log("Not an accepted Polkadot address");
    } else {
      setValidAuth(true);
      props.onSelect(account);
      /*
      await Router.push(
        {
          pathname: "/upload",
          query: {
            account: JSON.stringify(account),
          },
        },
        "/upload"
      );
      */
    }
  };

  function isValidAddressPolkadotAddress(address: string) {
    try {
      encodeAddress(
        isHex(address) ? hexToU8a(address) : decodeAddress(address)
      );
      return true;
    } catch (error) {
      return false;
    }
  }
  return (
    <Grid
      container
      direction='column'
      justifyContent='center'
      alignItems='center'
      textAlign='center'
      spacing={5}
    >
      {validAuth === false && (
        <Grid item>
          <h1>Parachain or DApp Operator Login</h1>
        </Grid>
      )}
      {accounts === null && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}
      {accounts !== null && validAuth === false && (
        <div>
          <Grid item>
            <Grid
              container
              direction='column'
              justifyContent='center'
              alignItems='center'
              textAlign='center'
              spacing={2}
            >
              <Grid item>
                <h3>Select address</h3>
              </Grid>
              {accounts.map((account: loginAccount) => {
                return (
                  <Grid item key={account.address}>
                    <Button
                      key={account.address}
                      className={styles.geographicButton}
                      variant={"outlined"}
                      color='inherit'
                      onClick={() => {
                        verifyUsingSignature(account);
                      }}
                    >
                      {account.address.slice(0, 10) + "..."}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </div>
      )}
      {extensions !== null && (
        <Grid item>
          <h2>
            Please install the{" "}
            <a href='https://polkadot.js.org/extension/'>polkadot.js</a>{" "}
            extension
          </h2>
        </Grid>
      )}
      {validAuth && <CircularProgress />}
    </Grid>
  );
};

export default LoginModal;
