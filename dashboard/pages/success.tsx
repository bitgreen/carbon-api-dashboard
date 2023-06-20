import React from "react";
import { Button } from "@mui/material";
import { NextPage } from "next";
import Link from "next/link";
import { Card, Grid } from "@mui/material";
import styles from "../styles/Home.module.css";

//Success page displayed on successful server data submission
const Success: NextPage = (props) => {
  return (
    <div>
      <Card className={styles.contentCard}>
        <Grid
          container
          direction='column'
          justifyContent='center'
          alignItems='center'
        >
          <Grid item>
            <h1>Parachain Information successfully updated</h1>
          </Grid>
          <Grid item>
            <Button
              variant='outlined'
              color='inherit'
              className={styles.geographicButton}
            >
              <Link href='/'>HOME</Link>
            </Button>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default Success;
