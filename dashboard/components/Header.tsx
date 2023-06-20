import React, {useState} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {Button, Grid, Modal, Typography} from "@mui/material";
import styles from "../styles/Home.module.css";
import polkadot from "../assets/images/logos/polkadot.png";
import MenuDrawer from "./MenuDrawer";
import { useCookies } from 'react-cookie';
import {width} from "@mui/system";


//App header component
const Header: React.FC = () => {
  const [cookies, setCookie] = useCookies(['modalOpen']);

  const handleAgree = () => {
    setCookie('modalOpen', 'true', { path: '/' });
  };

  const handleDisagree = () => {
    alert('You need to Agree with our terms in order to use this website.')
  };

  const isModalOpen = !cookies.modalOpen;

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    color: '#051C00',
    width: '90%',
    maxWidth: '1200px',
  };

  const disclaimerStyle = {
    height: '300px',
    overflow: 'scroll',
    overflowX: 'hidden',
    paddingRight: '20px',
    marginTop: '10px'
  }

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  };

  const agreeButtonStyle = {
    backgroundColor: '#9ECC00',
    color: '#fff',
    marginRight: '0.5rem',
  };

  const disagreeButtonStyle = {
    backgroundColor: '#f44336',
    color: '#fff',
  };

  return (
    <header className={styles.header}>
      <Grid container direction="row" width="100%" alignItems="center">
        <Grid item width="70%">
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            spacing={2}
          >
            <Grid item>
              <a href="/">
                <img
                  src={polkadot.src}
                  height={20}
                  style={{ margin: "auto" }}
                />
              </a>
            </Grid>
            <Grid item>
              <a href="/">
                <h4
                  style={{
                    paddingTop: "5px",
                    fontWeight: 500,
                    letterSpacing: 1.5,
                  }}
                >
                  GREEN POLKADOT DASHBOARD
                </h4>
              </a>
            </Grid>
          </Grid>
        </Grid>

        <Grid item width="30%">
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            textAlign="right"
          >
            <Grid item>
              <MenuDrawer />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {isModalOpen && (
          <div>
            <Modal
                open={isModalOpen}
                onClose={() => {}}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                style={modalStyle}
            >
              <div style={modalContentStyle}>
                <Typography variant="h6" id="modal-title">
                  Disclaimer
                </Typography>
                {/* @ts-ignore*/}
                <Typography variant="body1" id="modal-description" style={disclaimerStyle}>
                  <p>This Green Polkadot Dashboard (the “Dashboard”) is provided to you by Web 3.0 Technologies Foundation (“W3F”). Before using it, kindly take a moment to review and acknowledge the following terms and conditions:</p>
                  <ol>
                    <li>Accuracy of Data: The data presented on the Dashboard is based on the best available information at the time of publication. However, it is important to note that calculations involve various assumptions, estimations, and external data sources. While we strive for accuracy, we cannot guarantee the absolute precision, completeness, or reliability of the data displayed on the Dashboard. The Dashboard should be used for informational purposes only.</li>
                    <li>No Warranty: The Dashboard is provided "as is" without any warranties or representations, express or implied. W3F makes no warranties, whether explicit or implied, regarding the functionality, performance, or reliability of the Dashboard. We do not warrant that the Dashboard will be error-free, uninterrupted, or free from defects. Any reliance on the information presented on the Dashboard is at your own risk.</li>
                    <li>Interpretation of Data: The data presented on the Dashboard should not be interpreted as legal, financial, or professional advice. While we strive to present accurate and up-to-date information, it is essential to consult with relevant experts or professionals before making any decisions based on the data presented on the Dashboard.</li>
                    <li>Third-Party Data Sources: The Dashboard may utilize data from various third-party sources (including the members of the Polkadot community) to calculate and present values. W3F does not endorse or take responsibility for the accuracy, reliability, or content of the data provided by these third-party sources. Any discrepancies or inaccuracies in the data should be verified independently by the user.</li>
                    <li>Apache 2.0 License: The Dashboard is made available to W3F by Bitgreen Switzerland Association under the Apache 2.0 license. The Apache 2.0 license grants certain rights to use, modify, distribute, and sublicense the Dashboard subject to the terms and conditions specified in the Apache 2.0 license agreement.</li>
                    <li>Limitation of Liability: In no event shall W3F be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with the use or inability to use the Dashboard. This includes, but is not limited to, damages for loss of profits, data, or other intangible losses, even if W3F has been advised of the possibility of such damages.</li>
                    <li>Modifications to the Dashboard: W3F reserves the right to modify, suspend, or discontinue the Dashboard at any time without prior notice. We may also update or change the Dashboard's features, functionalities, or data sources without prior notification.</li>
                  </ol>
                  <p>By accessing and using the Dashboard, you agree to release W3F, its officers, employees, and affiliates from any and all claims, demands, or damages arising out of or in connection with your use of the Dashboard.</p>
                  <p>If you do not agree with any part of this disclaimer, please refrain from using the Dashboard. This disclaimer is subject to change without notice, and it is your responsibility to review this page periodically for any updates.</p>
                  <p>Please note that this disclaimer is a legal agreement between you and W3F and governs your use of the Dashboard.</p>
                </Typography>
                <div style={buttonContainerStyle}>
                  <Button
                      variant="contained"
                      style={agreeButtonStyle}
                      onClick={handleAgree}
                  >
                    I Agree
                  </Button>
                  <Button
                      variant="contained"
                      style={disagreeButtonStyle}
                      onClick={handleDisagree}
                  >
                    I Disagree
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
      )}
    </header>
  );
};

export default Header;
