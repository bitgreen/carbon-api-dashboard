import React from "react";
import { NextPage } from "next";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { Card, Grid, Divider, Button } from "@mui/material";
import styles from "../styles/Home.module.css";

const Info: NextPage = (props) => {
  return (
    <div>
      <Card className={styles.contentCard}>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <h1>Dashboard Guide</h1>
          </Grid>
          <Grid item>
            <Divider className={styles.faqDivider} />
          </Grid>
        </Grid>
        <Grid
          container
          direction='column'
          spacing={2}
          margin='auto'
          width='60%'
        >
          <Grid item>
            <Accordion className={styles.accordion}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={styles.accordionIcon} />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography className={styles.accordionHeading}>
                  Introduction
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <h4 className={styles.infoText}>
                  Green Polkadot Dashboard provides ongoing insights into
                  the Polkadot network’s energy consumption, energy mix and its
                  associated carbon footprint.
                </h4>
                <h4 className={styles.infoText}>
                  The data contained within the dashboard can be used to inform
                  the conversation around Polkadot’s carbon footprint and
                  blockchain technologies in general. In addition, it can be
                  used to help define carbon mitigation and compensation
                  strategies for project stakeholders.
                </h4>
                <h4 className={styles.infoText}>
                  The bottom-line is that public, transparent, and accessible
                  data is critical to ensure that we are doing what we can to
                  mitigate our personal and collective impact on the climate.
                </h4>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item>
            <Divider className={styles.faqDivider} />
          </Grid>
          <Grid item>
            <Accordion className={styles.accordion}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={styles.accordionIcon} />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography className={styles.accordionHeading}>
                  About the Dashboard
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <h4 className={styles.infoText}>
                  The carbon footprint of the network is determined by the
                  amount of power that is consumed to secure and validate the
                  network, as well as the carbon intensity of the electricity
                  that is consumed for said activities.
                </h4>
                <h4 className={styles.infoText}>
                  The network’s power consumption is primarily a function of the
                  number of nodes and validators that are active, and the power
                  rating of the hardware (which includes memory cards,
                  harddrives, and CPUs) that they use.
                </h4>
                <h4 className={styles.infoText}>
                  The carbon intensity of the network is determined by the
                  amount of energy the hardware uses, and the physical location
                  of network activity. Regions that have a higher dependency on
                  fossil fuels have higher carbon intensities, and those with
                  more renewables and nuclear have lower carbon intensities.
                  Localized variables such as whether any locally produced
                  renewable energy is used to displace the consumption of grid
                  electricity, or whether low or zero carbon energy suppliers
                  are used to supply power operations.
                </h4>
                <h4 className={styles.infoText}>
                  The dashboard considers these variables by considering three
                  main data sources.
                </h4>
                <h4 className={styles.infoText}>
                  Firstly, it pulls live data from the network using the{" "}
                  <a href='https://telemetry.polkadot.io'>
                    https://telemetry.polkadot.io"
                  </a>{" "}
                  API, to define fundamental characteristics of the network,
                  including:
                </h4>
                <h4 className={styles.infoText}>
                  • the number of active nodes and validators
                </h4>
                <h4 className={styles.infoText}>
                  • the spatial distribution of node operators
                </h4>
                <h4 className={styles.infoText}>
                  • the type of hardware used that is used across the network.
                </h4>
                <h4 className={styles.infoText}>
                  Secondly, the dashboard collects self-report data from
                  Parachain operators to fill data gaps from the API in this
                  area (i.e. the API itself does not have complete data,
                  particularly for Parachains). The data requested from
                  Parachain operators includes:
                </h4>
                <h4 className={styles.infoText}>
                  • any renewable sources they may use to power their activities
                </h4>
                <h4 className={styles.infoText}>
                  • physical location of network activities
                </h4>
                <h4 className={styles.infoText}>
                  • the type of hardware that they use
                </h4>
                <h4 className={styles.infoText}>
                  Finally, it also pulls data from leading, public sources to
                  define the power rating of hardware used, the grid emissions
                  factors and energy mix of the electricity system (i.e. how
                  much electricity is generated from renewable sources, from
                  fossil fuel sources, and the derived grid emissions
                  intensities) in countries where network activity takes place.
                </h4>
                <h4 className={styles.infoText}>
                  Over time, as awareness around the dashboard grows, and more
                  self-report data is given to the dashboard, the granularity
                  and accuracy of the data will improve.
                </h4>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item>
            <Divider className={styles.faqDivider} />
          </Grid>
          <Grid item>
            <Accordion className={styles.accordion}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={styles.accordionIcon} />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography className={styles.accordionHeading}>
                  Assumptions
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <h4 className={styles.infoText}>
                  The dashboard uses a set of hard assumptions that can be
                  updated intermittently as data becomes updated, or more
                  available. For example, information on national energy mixes
                  and grid intensities are typically updated on a yearly basis
                  as energy systems evolve. In addition, the type of hardware
                  used across the network may be updated overtime as older
                  machines are updated with newer products available on the
                  market.
                </h4>
                <h4 className={styles.infoText}>
                  A number of static assumptions are used in the dashboard to
                  inform its outputs including:
                </h4>
                <h4 className={styles.infoText}>
                  • Where no location information of a given node or validator
                  is given, and average emissions factor of 0.29gCO2e/kWh is
                  applied.
                </h4>
                <h4 className={styles.infoText}>
                  • Average Memory Power Drain: 3W/8GB of RAM.{" "}
                </h4>
                <h4 className={styles.infoText}>
                  • Average CPU Thermal Design Power: 105W.
                </h4>
                <h4 className={styles.infoText}>
                  In addition, the specific work done by a given node or
                  validator is not specifically known, nor is it directly
                  tracked by the network. Hence, the following assumptions
                  validator utilization rate: 95%; and node utilization rate: 5%
                  are used.
                </h4>
                <h4 className={styles.infoText}>
                  The dashboard also includes information regarding the assumed
                  rate of zero carbon and fossil fuel power from the network.
                  The energy mix definitions used are as follows: zero carbon:
                  nuclear energy, biofuels, wind, solar and hydropower; fossil
                  fuels include gas, coal and oil.
                </h4>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item>
            <Divider className={styles.faqDivider} />
          </Grid>
          <Grid item>
            <Accordion className={styles.accordion}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={styles.accordionIcon} />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography className={styles.accordionHeading}>
                  Scope, Limitations and Future Work{" "}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <h4 className={styles.infoText}>
                  The dashboard itself includes the carbon emissions from the
                  securing of the Polkadot network.
                </h4>
                <h4 className={styles.infoText}>
                  It is challenging to apply traditional carbon accounting
                  principles to a blockchain network, as a distributed network
                  of computers operates differently to that of an organization
                  which consumes energy directly to enable business operations
                  that are performed. However, the consumption of electricity
                  which is produced off-site, but is consumed by a given entity
                  would be considered “Scope 2” emissions and the analogy made
                  here is that this dashboard considers Polkadot’s Scope 2
                  emissions. Scope 1 emissions on the other hand are defined as
                  those derived from energy generated directly by a given
                  entity’s own assets, and are assumed to be 0 – given that the
                  network does not fundamentally require heating or transport to
                  secure itself.
                </h4>
                <h4 className={styles.infoText}>
                  The dashboard does not intend to consider Scope 3 emissions of
                  the network (i.e. emissions produced upstream and downstream
                  from the organization). It therefore does not consider
                  emissions derived from any organizational activities of the
                  organizations that support the network, emissions from
                  adjacent blockchain networks that the Polkadot ecosystem may
                  interact with, or the carbon footprint of the hardware
                  required to secure the network. Each of these areas for Scope
                  3 emissions may be considered as part of further work.
                </h4>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
        <Grid container direction='column' textAlign='center'>
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

export default Info;
