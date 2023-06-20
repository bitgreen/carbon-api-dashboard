import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {Button, Grid, Hidden} from "@mui/material";
import styles from "../styles/Home.module.css";
import polkadot from "../assets/images/logos/polkadot.png";
import polkadotFull from "../assets/images/logos/polkadot-full.png";
import web3 from "../assets/images/logos/web3.png";
import MenuDrawer from "./MenuDrawer";
import parity from "../assets/images/logos/parity.png";
import parityFull from "../assets/images/logos/parity-full.png";
import offsetra from "../assets/images/logos/offsetra.png";
import offsetraFull from "../assets/images/logos/offsetra-full.png";
import bitgreen from "../assets/images/logos/bitgreen.png";
import bitgreenFull from "../assets/images/logos/bitgreen-full.png";
import {display} from "@mui/system";
import Typography from "@mui/material/Typography";

//App header component
const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <Grid
                container
                padding={2}
                paddingLeft={4}
                paddingRight={4}
                // justifyContent='center'
                alignItems='center'
            >
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} xl={4} paddingRight={20}>
                        <Grid item paddingBottom={2}>
                            <Link href='/'>
                                <a className={styles.polkadot}>
                                    <img src={polkadot.src} height={50} width={50} />
                                </a>
                            </Link>
                        </Grid>
                        <Grid item>
                            <h5 style={{display: 'block', textAlign: 'left'}}>Green Polkadot Dashboard</h5>
                        </Grid>
                        <Grid item>
                            <p style={{display: 'block', textAlign: 'left'}}>Providing real-time insights into the carbon footprint of the Polkadot and Kusama networks.</p>
                        </Grid>
                        <Grid container spacing={5} alignItems='center'>
                            <Grid item>
                                <Link href='https://web3.foundation/'>
                                    <a className={styles.polkadot}>
                                        <img src={web3.src} height={50} />
                                    </a>
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href='https://bitgreen.org/'>
                                    <a className={styles.polkadot}>
                                        <img src={bitgreenFull.src} height={40} />
                                    </a>
                                </Link>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <p style={{display: 'block', textAlign: 'left'}}>Developed in collaboration with the Web3 Foundation and Bitgreen.</p>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} xl={3}>
                        <Grid item paddingTop={8}>
                            <Grid item>
                                <h5 style={{display: 'block', textAlign: 'left'}}>Browse</h5>
                            </Grid>
                            <Link href='/'>
                                <a className={styles.link}>
                                    Cumulative Emissions
                                </a>
                            </Link>
                            <Link href='/data/power'>
                                <a className={styles.link}>
                                    Power Consumption
                                </a>
                            </Link>
                            <Link href='/data/carbon'>
                                <a className={styles.link}>
                                    Carbon Footprint
                                </a>
                            </Link>
                            <Link href='/data/renewables'>
                                <a className={styles.link}>
                                    Energy Mix
                                </a>
                            </Link>
                            <Link href='/data/nodes'>
                                <a className={styles.link}>
                                    Nodes
                                </a>
                            </Link>
                            <Link href='/networks'>
                                <a className={styles.link}>
                                    Networks
                                </a>
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} xl={5}>
                        <Grid item paddingTop={8}>
                            <h5 style={{display: 'block', textAlign: 'left'}}>Parachain Operators</h5>
                        </Grid>
                        <Link href='/login' >
                            <Button
                                variant='outlined'
                                color='inherit'
                                className={styles.geographicButton}
                                style={{display: 'block', textAlign: 'left'}}
                            >
                                Login
                            </Button>
                        </Link>
                        <Grid item paddingTop={10}>
                            <Link href='https://web3.foundation/legal-disclosures/' style={{ display: 'inline-block', marginRight: '8px' }}>
                                <a className={styles.link}>Legal Disclosures</a>
                            </Link>
                            <Link href='https://web3.foundation/privacy-and-cookies/' style={{ display: 'inline-block', marginRight: '8px' }}>
                                <a className={styles.link}>Privacy Policy</a>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container paddingTop={5}>
                    <Grid
                        container
                        direction='row'
                        spacing={5}
                        alignItems='center'
                    >
                        <Hidden mdDown>
                            <Grid item xs={12} sm={12} md={4} style={{display: 'block', textAlign: 'left'}}>
                                © 2023 Web3 Foundation. All rights reserved.
                            </Grid>
                        </Hidden>
                        <Grid item xs={12} sm={12} md={7}>
                            <Grid container alignItems='center' spacing={3}>
                                <Grid item xs={12} sm={12} md={3} xl={2} paddingLeft={4}>
                                    Supported by
                                </Grid>
                                <Grid item xs={12} sm={4} md={3} xl={2} paddingLeft={4}>
                                    <Link href='https://polkadot.network/'>
                                        <a>
                                            <img src={polkadotFull.src} height={30} />
                                        </a>
                                    </Link>
                                </Grid>
                                <Grid item xs={12} sm={4} md={3} xl={2} paddingLeft={4}>
                                    <Link href='https://www.parity.io/'>
                                        <a>
                                            <img src={parityFull.src} height={40} />
                                        </a>
                                    </Link>
                                </Grid>
                                <Grid item xs={12} sm={4} md={3} xl={2} paddingLeft={4}>
                                    <Link href='https://offsetra.com/'>
                                        <a>
                                            <img src={offsetraFull.src} height={30} />
                                        </a>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Hidden mdUp>
                            <Grid item xs={12} sm={12} md={4} style={{display: 'block', textAlign: 'center'}}>
                                © 2023 Web3 Foundation. All rights reserved.
                            </Grid>
                        </Hidden>
                    </Grid>
                </Grid>
            </Grid>
        </footer>
    );
};

export default Footer;
