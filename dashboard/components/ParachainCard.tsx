import React, { ReactNode, useState, useEffect } from "react";
import {
  Card,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  tooltipClasses,
} from "@mui/material";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { styled } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import styles from "../styles/Home.module.css";
import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { stringToHex } from "@polkadot/util";
import { server } from "../types";

type Props = {
  children: ReactNode;
  existingServerData: any;
  account: string;
  onServerSubmit: any;
  nonce: number;
  onTooltip: any;
};

//Card allowing parachain/DApp operators to input server data
const ParachainCard: React.FC<Props> = (props) => {
  const [servers, setServers] = useState(props.existingServerData);
  const [serverName, setServerName] = useState<string | null>(null);
  const [country, setCountry] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [totalNodes, setTotalNodes] = useState<number | null>(null);
  const [renewablesBool, setRenewablesBool] = useState<Boolean | null>(null);
  const [renewables, setRenewables] = useState<string | number | null>(0);
  const [hardware, setHardware] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<any>(null);
  const [extensions, setExtensions] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (extensions === null) {
      enableWeb3();
    }
  }, []);

  async function enableWeb3() {
    const extensions = await web3Enable("bitgreen-dashboard");

    if (extensions.length === 0) {
      // no extension installed, or the user did not accept the authorization
      // in this case we should inform the use and give a link to the extension
      setExtensions(extensions);
    }

    setAccount(props.account);
  }

  //Sign randomised nonce
  async function signKey(account: any, messageToSign: string) {
    const injector = await web3FromSource(account.meta.source);
    const signRaw = injector?.signer?.signRaw;
    if (!!signRaw) {
      const { signature } = await signRaw({
        address: account.address,
        data: stringToHex(messageToSign),
        type: "bytes",
      });
      return signature;
    }
    return undefined;
  }

  //Component for users to input server information (location, number of nodes, hardware)
  const serverCard = (id: number) => {
    const handleRenewables = (event: any, newBool: boolean) => {
      setRenewablesBool(newBool);
    };

    return (
      <div>
        <Card className={styles.serverCard}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <IconButton
                color='inherit'
                onClick={() => {
                  handleCancel();
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <h3>
                {serverName} | ID: {id}
              </h3>
            </Grid>
            <Grid item>
              <Divider color='primary' />
            </Grid>
            <Grid item>Server name:</Grid>
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <TextField
                  id='outlined-basic'
                  label='(optional)'
                  InputLabelProps={{ style: { color: "white" } }}
                  variant='outlined'
                  className={styles.textBox}
                  type='text'
                  onChange={(e) => {
                    setServerName(e.target.value);
                  }}
                  inputProps={{
                    style: { color: "white" },
                  }}
                  color='secondary'
                />
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <h4>Location</h4>
                <IconButton
                  sx={{ mr: 1, my: 0.5 }}
                  style={{ margin: 0, height: "14px" }}
                  onMouseEnter={() => {
                    props.onTooltip("location");
                  }}
                >
                  <InfoIcon color='primary' />
                </IconButton>
              </Box>
            </Grid>
            <Grid item>
              <div>
                <CountryDropdown
                  value={country}
                  onChange={(val) => setCountry(val)}
                />
                <RegionDropdown
                  country={country}
                  value={region}
                  onChange={(val) => setRegion(val)}
                />
              </div>
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <h4>Total nodes:</h4>
                <IconButton
                  sx={{ mr: 1, my: 0.5 }}
                  style={{ margin: 0, height: "14px" }}
                  onMouseEnter={() => {
                    props.onTooltip("nodes");
                  }}
                >
                  <InfoIcon color='primary' />
                </IconButton>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <TextField
                  id='outlined-basic'
                  label='Total Nodes'
                  InputLabelProps={{ style: { color: "white" } }}
                  variant='outlined'
                  className={styles.textBox}
                  type='number'
                  onChange={(e) => {
                    setTotalNodes(parseInt(e.target.value));
                  }}
                  color='secondary'
                />
              </Box>
            </Grid>

            <Grid item>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <h4>Hardware used</h4>
                <IconButton
                  sx={{ mr: 1, my: 0.5 }}
                  style={{ margin: 0, height: "14px" }}
                  onMouseEnter={() => {
                    props.onTooltip("hardware");
                  }}
                >
                  <InfoIcon color='primary' />
                </IconButton>
              </Box>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel className={styles.inputText}>Hardware</InputLabel>
                <Select
                  className={styles.textBox}
                  value={hardware}
                  label='Hardware'
                  color='primary'
                  onChange={(e) => {
                    setHardware(e.target.value);
                  }}
                >
                  <MenuItem value={"Small"}>Small (10-74W)</MenuItem>
                  <MenuItem value={"Medium"}>Medium (75-125W)</MenuItem>
                  <MenuItem value={"Large"}>Large (126W+)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <h4>
                  Do you use any renewable energy, either procured or locally
                  generated?
                </h4>
                <IconButton
                  sx={{ mr: 1, my: 0.5 }}
                  style={{ margin: 0, height: "14px" }}
                  onMouseEnter={() => {
                    props.onTooltip("renewables");
                  }}
                >
                  <InfoIcon color='primary' />
                </IconButton>
              </Box>
            </Grid>
            <Grid item>
              <ToggleButtonGroup
                value={renewablesBool}
                exclusive
                onChange={handleRenewables}
                aria-label='text alignment'
                className={styles.renewablesToggle}
              >
                <ToggleButton value={true} aria-label='left aligned'>
                  <h3 className={styles.renewablesToggleButton}>Yes</h3>
                </ToggleButton>
                <ToggleButton value={false} aria-label='centered'>
                  <h3 className={styles.renewablesToggleButton}>No</h3>
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            {renewablesBool && (
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel className={styles.inputText}>
                    Renewables?
                  </InputLabel>
                  <Select
                    className={styles.textBox}
                    value={renewables}
                    label='%'
                    onChange={(e) => {
                      setRenewables(e.target.value);
                    }}
                  >
                    <MenuItem value={0}>0%</MenuItem>
                    <MenuItem value={0.25}>25%</MenuItem>
                    <MenuItem value={0.5}>50%</MenuItem>
                    <MenuItem value={0.75}>75%</MenuItem>
                    <MenuItem value={1.0}>100%</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Card>
      </div>
    );
  };

  //Return a card for submitting a new entry (isUpdating)
  const returnNewServerCard = () => {
    return (
      <div>
        <Grid item>{serverCard(servers.length)}</Grid>
        <Grid item>
          <Grid
            container
            direction='column'
            alignContent='center'
            textAlign='center'
          >
            <Grid item>
              <Button
                onClick={() => {
                  handleSubmit();
                }}
                disabled={
                  country === null ||
                  totalNodes === null ||
                  hardware === null ||
                  renewables === null
                }
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  };

  //Return a card for editing an existing entry (isEditing)
  const returnEditServerCard = () => {
    return (
      <div>
        {serverCard(editIndex)}
        <Button
          onClick={() => {
            handleEdit();
          }}
          disabled={
            country === null ||
            totalNodes === null ||
            hardware === null ||
            renewables === null
          }
        >
          Submit
        </Button>
      </div>
    );
  };

  //Display existing entries
  const returnServerCards = () => {
    if (servers.length === 0) {
      return <h3>No servers registered</h3>;
    } else {
      return servers.map((server: server, index: number) => {
        return (
          <Accordion className={styles.serverCard} key={server.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Grid container direction='row'>
                <Grid item style={{ margin: "auto 0px" }}>
                  <h3>
                    {server.id} | {server.location} | {server.name}
                  </h3>
                </Grid>
                <Grid item>
                  <IconButton
                    color='inherit'
                    onClick={() => {
                      editServer(index);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    color='inherit'
                    onClick={() => {
                      deleteServer(index);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction='column' spacing={3}>
                <Grid item>
                  <Divider color='inherit' />
                </Grid>
                <Grid item>
                  <h4>Server ID | {server.name}</h4>
                </Grid>
                <Grid item>
                  <h4>Server ID | {server.id}</h4>
                </Grid>
                <Grid item>
                  <h4>Location | {server.location}</h4>
                </Grid>
                <Grid item>
                  <h4>Total nodes | {server.amount}</h4>
                </Grid>
                <Grid item>
                  <h4>Avg. hardware | {server.hardware}</h4>
                </Grid>
                <Grid item>
                  <h4>Renewables | {server.renewables * 100}%</h4>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      });
    }
  };

  //Clear previous parameter inputs
  const resetParameters = () => {
    setServerName(null);
    setCountry("");
    setRegion("");
    setTotalNodes(null);
    setHardware(null);
    setRenewablesBool(null);
    setRenewables(0);
    setIsUpdating(false);
    setIsEditing(false);
    setEditIndex(null);
  };

  //Set server data for a new entry
  const handleSubmit = () => {
    const newServer = {
      name: serverName,
      id: servers.length,
      location: country,
      amount: totalNodes,
      hardware: hardware,
      renewables: renewables,
    };
    setServers((current: server[]) => [...current, newServer]);
    props.onTooltip(null);
    resetParameters();
  };

  //Set server data for an edited entry
  const handleEdit = () => {
    const editedServer = {
      name: serverName,
      id: editIndex,
      location: country,
      amount: totalNodes,
      hardware: hardware,
      renewables: renewables,
    };
    let updatedServer = servers;
    updatedServer[editIndex] = editedServer;
    setServers(updatedServer);
    resetParameters();
  };

  //Cancel the current data entry
  const handleCancel = () => {
    setIsUpdating(false);
    setIsEditing(false);
    props.onTooltip(null);
    resetParameters();
  };

  //Pass server data to Upload page
  const handleDone = () => {
    const verifyResult = signKey(props.account, props.nonce.toString());
    Promise.resolve(verifyResult).then(async (signature) => {
      props.onServerSubmit(servers, signature);
      props.onTooltip(null);
    });
  };

  //Enter entry editing mode
  const editServer = (index: number) => {
    setIsEditing(true);
    setEditIndex(index);
  };

  //Delete an existing entry and format other entry ids
  const deleteServer = (index: number) => {
    //Immutable splice
    let updatedServer = servers.filter((_: any, i2: number) => i2 !== index);

    //format existing entry IDs
    for (let i = index; i < updatedServer.length; i++) {
      updatedServer[i].id = i;
    }

    setServers(updatedServer);
  };

  return (
    <div>
      <Card className={styles.valuesCard}>
        <Grid container direction='column' alignContent='center'>
          <Grid item>
            <h2>Add server information</h2>
          </Grid>

          {isUpdating === true && returnNewServerCard()}
          {isEditing === true && returnEditServerCard()}
          {returnServerCards()}
          {isUpdating === false && (
            <div>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => {
                  setIsUpdating(true);
                }}
              >
                Add new server group
              </Button>
              <Button
                onClick={() => {
                  handleDone();
                }}
              >
                Done
              </Button>
            </div>
          )}
        </Grid>
      </Card>
    </div>
  );
};

export default ParachainCard;
