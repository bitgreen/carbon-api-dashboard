import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import Router from "next/router";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import Footer from "../components/Footer";
const LoginModal = dynamic(() => import("../components/loginModal"), {
  ssr: false,
});

type Props = {};

//Parachain/DApp operator logins using polkadot address
const Login: React.FC<Props> = (props) => {
  //Push to upload page on address select
  const handleSelect = async (account: any) => {
    await Router.push(
      {
        pathname: "/upload",
        query: {
          account: JSON.stringify(account),
        },
      },
      "/upload"
    );
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Card className={styles.contentCard}>
          <Card className={styles.valuesCard}>
            <LoginModal
              onSelect={(account: any) => {
                handleSelect(account);
              }}
            />
            <h4 style={{ textAlign: "center", lineHeight: 1.5 }}>
              Parachain and dApp operators, login here to provide data for the
              dashboard
            </h4>
          </Card>
        </Card>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Login;
