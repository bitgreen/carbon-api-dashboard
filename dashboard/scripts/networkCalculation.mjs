import fetch from "node-fetch";
import { findCountryByCoordinate } from "country-locator";
import fetchOverviewID from "./fetchOverviewID.mjs";
import fetchSubnetworkID from "./fetchSubnetworkID.mjs";
import fetchParachainData from "./fetchParachainData.mjs";
import energyMix from "../data/energyMix.json" assert { type: "json" };
import countryEmissionFactors from "../data/countryEmissionFactors.json" assert { type: "json" };
import fetchSubnetworkDapps from "./fetchSubnetworkDapps.mjs";

//Script to calculate power/emissions/renewables utilisation for the available nodes
//Constants
const timePeriod = 6; //Hours between scheduled cron jobs
const hardrivePower = 5.5;
const averageMemoryPower = 11.8417599720084; //W
const hardwarePower = {
  //Calculated mean for network hardware
  small: 65.48, //10-74W
  medium: 111.02, //75-125W
  large: 238.55, //125W+
  webServer: 0,
};

//Fetch network (POLKADOT, KUSAMA) data from bitgreen API
async function fetchNodeData(name) {
  try {
    const response = await fetch(`https://dscfapi.bitgreenswiss.org/nodes`, {
      body: JSON.stringify({
        network: name,
        include_subnetworks: true
      }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
  }
}

//Return most recent id from subnetwork database
const fetchLatestSubnetworkId = async () => {
  subnetworkid++;
  return subnetworkid;
};

//Return list of networks from bitgreen api
async function fetchNetworks() {
  /*
  try {
    const response = await fetch(`https://dscfapi.bitgreenswiss.org/networks`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
  }
  console.log(response);
  */
  return ["POLKADOT", "KUSAMA"];
}

//Look for nodes which have been active in the past 24 hours
function findSeenNodes(nodeData) {
  const seenNodes = [];
  const currentTimestamp = new Date();
  const currentTime = currentTimestamp.getTime() - timePeriod * 60 * 60 * 1000;
  for (let i = 0; i < nodeData.length; i++) {
    const nodeLastOnline = Date.parse(nodeData[i].periodLastSeen.end);

    //If node sign on falls within the last 24 hours
    if (nodeLastOnline > currentTime) {
      seenNodes.push(nodeData[i]);
    }
  }
  return seenNodes;
}

//Find the dapps related to a given subnetwork
async function findSubnetworkDapps(subnetworkName) {
  //TO-DO pull subnetwork dappsfrom database
  const dapps = await fetchSubnetworkDapps(subnetworkName);

  return dapps;
}

//Count the number of nodes in the provided parachain data
function fetchParachainNodeCount(parachains) {
  let nodeCountArray = [{
    name: 'undefined',
    value: 0,
  }];
  for (let i = 0; i < parachains.length; i++) {
    let parachainCount = {
      name: parachains[i].name,
      value: parachains[i].totalnodes,
    };
    nodeCountArray.push(parachainCount);
  }
  return nodeCountArray;
}

//Calculate power for different hardware
async function calculateHardwarePower(parachains) {
  let hardwarePowerArray = [];
  for (let i = 0; i < parachains.length; i++) {
    let hardware = {
      name: parachains[i].name,
      value: 0,
    };
    if (parachains[i].servers.length > 0) {
      for (let j = 0; j < parachains[i].servers.length; j++) {
        const serverNodes = parachains[i].servers[j].amount;
        switch (parachains[i].servers[j].hardware) {
          case "Small":
            //10-69W
            hardware.value += hardwarePower.small * timePeriod * serverNodes;
            break;
          case "Medium":
            //70-95W
            hardware.value += hardwarePower.medium * timePeriod * serverNodes;
            break;
          case "Large":
            //95W+
            hardware.value += hardwarePower.large * timePeriod * serverNodes;
            break;
          case "Web Server":
            hardware.value +=
              hardwarePower.webServer * timePeriod * serverNodes;
            break;
          default:
            hardware.value += hardwarePower.large * timePeriod * serverNodes;
        }
      }

      hardware.value = hardware.value / parachains[i].totalnodes;
    } else {
      hardware.value = 120 * 6;
    }
    hardwarePowerArray.push(hardware);
  }
  return hardwarePowerArray;
}

//Sum relevant power usage sources
function findPowerUsage(hardwarePower, name, type) {
  const serverPower = findServerPowerUsage(hardwarePower, name, type);
  const memoryPower = findMemoryPowerUsage(type);
  const hardrivePower = findHardrivePower();

  return serverPower + memoryPower + hardrivePower;
}

//Calculate server power usage for given node
function findServerPowerUsage(hardwarePower, name, type) {
  //Lookup power used by a given server size
  const index = hardwarePower.findIndex((hardware) => hardware.name === name);
  let usageFactor = 0.2;
  if (type === "Node") {
    usageFactor = 0.05;
  }
  if (index === -1) {
    return 241.5 * usageFactor;
  } else {
    return hardwarePower[index].value * usageFactor;
  }
}

//Calculate memory power usage for given node
function findMemoryPowerUsage(type) {
  //Lookup power used by memory usage
  //TO-DO import polkadot telemetry data
  let usageFactor = 0.2;
  if (type === "Node") {
    usageFactor = 0.05;
  }

  return averageMemoryPower * usageFactor;
}

//calculate hardrive power for given node
function findHardrivePower() {
  return hardrivePower;
}

//Calculate average renewables usage for each parachain
async function calculatePercentRES(
  parachains,
  energyMix,
  undefinedEnergyMixIndex
) {
  //Lookup renewable energy percentages
  //const parachainIndex = parachains.findIndex((parachain => parachain.name == name));
  let parachainRESArray = [{
    name: 'undefined',
    value: 0,
  }];
  for (let i = 0; i < parachains.length; i++) {
    let parachainRES = {
      name: parachains[i].name,
      value: 0,
    };
    for (let j = 0; j < parachains[i].servers.length; j++) {
      //Number of nodes in a given server
      const serverNodes = parachains[i].servers[j].amount;
      //Account for the renewables provided by a country
      let countryIndex = energyMix.findIndex(
        (country) => country.country == parachains[i].servers[j].location
      );
      if (countryIndex === -1) {
        countryIndex = undefinedEnergyMixIndex;
      }
      let additionalRenewables =
        parachains[i].servers[j].renewables - energyMix[countryIndex].energyMix;
      if (additionalRenewables < 0) {
        additionalRenewables = 0;
      }
      parachainRES.value += additionalRenewables * serverNodes;
    }
    //Calculate percentage
    if (parachains[i].servers.length > 0) {
      parachainRES.value = parachainRES.value / parachains[i].totalnodes;
    }
    parachainRESArray.push(parachainRES);
  }
  return parachainRESArray;
}

//Look through pre-calculated renewable percentages
async function findParachainRES(
  energyMix,
  energyIndex,
  totalNodes,
  selectedParachain,
  parachainNodeCount
) {
  //Prioritise info provided by parachain operators
  //If country isn't identified, use precalculated average value

  return (
    (energyMix[energyIndex].energyMix + selectedParachain.value * (parachainNodeCount / totalNodes)) * 100
  );
}

//Use power usage and country data to calculate emissions
async function calculateEmissions(
  power,
  emissionFactorIndex,
  selectedParachain
) {
  return (
    countryEmissionFactors[emissionFactorIndex].CDM *
    power *
    (1 - selectedParachain.value)
  );
}

//Update the array of locations with the most recent country data
async function updateLocations(
  locationArray,
  countryData,
  power,
  emissions,
  percentRES
) {
  let name;
  if (countryData === undefined) {
    name = "undefined";
  } else {
    name = countryData.name;
  }

  //Avoid errors from empty arrays
  if (locationArray.length === 0) {
    locationArray.push({
      name: name,
      nodes: 1,
      power: parseFloat(power.toFixed(2)),
      emissions: parseFloat(emissions.toFixed(2)),
      percentRES: parseFloat(percentRES.toFixed(2)),
    });
  } else {
    const locationIndex = locationArray.findIndex(
      (location) => location.name == name
    );
    if (locationIndex !== -1) {
      locationArray[locationIndex].nodes += 1;
      locationArray[locationIndex].power += parseFloat(power.toFixed(2));
      locationArray[locationIndex].emissions += parseFloat(
        emissions.toFixed(2)
      );
      locationArray[locationIndex],
        (percentRES += parseFloat(percentRES.toFixed(2)));
    } else {
      locationArray.push({
        name: name,
        nodes: 1,
        power: parseFloat(power.toFixed(2)),
        emissions: parseFloat(emissions.toFixed(2)),
        percentRES: parseFloat(percentRES.toFixed(2)),
      });
    }
  }
  return locationArray;
}

//Add calculated results to their respective datasets (overview, network, subnetwork)
async function addToNetworks(
  overview,
  network,
  subnetwork,
  power,
  emissions,
  percentres,
  countryData
) {
  addToResults(overview, power, emissions, percentres, countryData, true);
  addToResults(network, power, emissions, percentres, countryData, true);
  addToResults(subnetwork, power, emissions, percentres, countryData, false);
}

//Add calculated results to data objects
async function addToResults(data, power, emissions, percentres, countryData, locationBool) {
  data.numberofnodes += 1;
  data.totalpower += power;
  data.totalemissions += emissions;
  data.percentres += percentres;
  if(locationBool){
    data.locations = await updateLocations(
      data.locations,
      countryData,
      power,
      emissions,
      percentres
    );
  }
}

//Keep track of different node types
function updateNodeTypes(nodeTypes, type) {
  switch (type) {
    case "Client":
      nodeTypes.clients += 1;
      break;
    case "Collator":
      nodeTypes.collators += 1;
      break;
    case "Validator":
      nodeTypes.validators += 1;
      break;
    case "Node":
      nodeTypes.nodes += 1;
      break;
    default:
      break;
  }
}

//---------------------------------------------

//const test = await fetchOverviewID();
let latestOverviewId = await fetchOverviewID();
if(latestOverviewId?.id === undefined){
latestOverviewId = {
  id: 0
}
}
const overviewid = latestOverviewId.id + 1;

let latestSubnetworkId = await fetchSubnetworkID();
if(latestSubnetworkId?.id === undefined){
  latestSubnetworkId = {
    subnetworkid: 0
  }
  }
let subnetworkid = latestSubnetworkId.subnetworkid;
const parachainData = await fetchParachainData();

//Collate data in one json
let overview = {
  id: overviewid,
  timestamp: null,
  numberofnodes: 0,
  totalpower: 0,
  totalemissions: 0,
  percentres: 0,
  locations: [],
  liveemissionfactor: 0,
  liveenergymix: 0,
};

//Used to calculate averages later
let energyMixCount = 0;
let emissionFactorCount = 0;

//Combine network data to get network overview
export default async function collateOverviewData() {
  const timestamp = new Date();

  //Perform network calculations first
  const networkResults = await collateNetworkData(timestamp);

  overview.timestamp = timestamp;

  //Calculate averages
  overview.totalpower = parseInt(overview.totalpower.toFixed(0));
  overview.totalemissions = parseInt(overview.totalemissions.toFixed(0));
  overview.percentres = parseFloat(
    (overview.percentres / overview.numberofnodes)
  );
  overview.liveemissionfactor =
    overview.liveemissionfactor / emissionFactorCount;
  overview.liveenergymix = overview.liveenergymix / energyMixCount;

  overview.networkdata = { create: networkResults };

  console.log(overview);
  return overview;
}

async function collateNetworkData(timestamp) {
  //Pre-calculate variables to be used throughout calculation
  //Find index of 'undefined' countries in emission factor json (saves time calculating it once)
  const undefinedEmissionFactorIndex = countryEmissionFactors.findIndex(
    (country) => country.country == "undefined"
  );
  const undefinedEnergyMixIndex = energyMix.findIndex(
    (country) => country.country == "undefined"
  );

  //Fetch out total nodes for each parachain
  const fullParachainNodeCount = fetchParachainNodeCount(parachainData);

  //Calculate average hardware power usage
  const hardwarePower = await calculateHardwarePower(parachainData);

  //Calculate renewable usage of each parachain
  const parachainRES = await calculatePercentRES(
    parachainData,
    energyMix,
    undefinedEnergyMixIndex
  );

  //Fetch available networks from API
  const networks = await fetchNetworks();

  let networkResults = [];

  //Loop through networks
  for (let i = 0; i < networks.length; i++) {
    console.log(networks[i]);
    //Fetch data for chosen network
    let nodeData = await fetchNodeData(networks[i]);
    //See which nodes have been active recently
    nodeData = await findSeenNodes(nodeData);
    //Perform calculation for each network
    networkResults.push(
      await networkCalc(
        networks[i],
        nodeData,
        timestamp,
        fullParachainNodeCount,
        hardwarePower,
        parachainRES,
        undefinedEmissionFactorIndex,
        undefinedEnergyMixIndex
      )
    );
    //
  }

  console.log(networkResults);
  return networkResults;
}

//Main network calculation loop
async function networkCalc(
  name,
  nodeData,
  timestamp,
  fullParachainNodeCount,
  hardwarePower,
  parachainRES,
  undefinedEmissionFactorIndex,
  undefinedEnergyMixIndex
) {
  //Create an array for any identified subnetworks
  let subnetworks = [];

  //Collate network data in one json
  let networkData = {
    timestamp: timestamp,
    name: name,
    numberofnodes: 0,
    totalpower: 0,
    totalemissions: 0,
    percentres: 0,
    nodes: {
      clients: 0,
      validators: 0,
      collators: 0,
      nodes: 0,
    },

    locations: [],
    subnetworkdata: {

    },
  };

  //Loop through active network nodes
  for (let i = 0; i < nodeData.length; i++) {
    //Label unidentified subnetworks to their respective parent chain
    if (nodeData[i].network.name.toUpperCase() === undefined || nodeData[i].network.name.toUpperCase() === "") {
      nodeData[i].network.name.toUpperCase() = nodeData[i].network.parentNetwork.toUpperCase();
    }

    //Find country from longitude and latitude
    const countryData = await findCountryByCoordinate(
      nodeData[i].latitude,
      nodeData[i].longitude
    );

    let emissionIndex = undefinedEmissionFactorIndex;
    let energyIndex = undefinedEnergyMixIndex;

    //Return info if country has been identified
    if (countryData !== undefined) {
      //Find the index of the country in emission factor sheet
      emissionIndex = countryEmissionFactors.findIndex(
        (country) => country.country == countryData.name
      );
      //Keep track of average emission factor
      if (emissionIndex !== -1) {
        overview.liveemissionfactor +=
          countryEmissionFactors[emissionIndex].CDM;
        emissionFactorCount += 1;
      } else {
        emissionIndex = undefinedEmissionFactorIndex;
      }

      //Find the index of the country in energy mix sheet
      energyIndex = energyMix.findIndex(
        (country) => country.country == countryData.name
      );
      //Keep track of average energy mix
      if (energyIndex !== -1) {
        overview.liveenergymix += energyMix[energyIndex].energyMix;
        energyMixCount += 1;
      } else {
        energyIndex = undefinedEnergyMixIndex;
      }
    }

    //find total nodes associated with the chosen parachain
    let parachainNodeIndex = fullParachainNodeCount.findIndex(
      (parachain) =>
        parachain.name === nodeData[i].network.name.toUpperCase()
    );
    if(parachainNodeIndex === -1){
      parachainNodeIndex = 0
    }
    let parachainNodeCount = fullParachainNodeCount[parachainNodeIndex].value;

    //Find precalculated parachain renewable usage
    let index = parachainRES.findIndex(
      (parachain) =>
        parachain.name.toUpperCase() ===
        nodeData[i].network.name.toUpperCase()
    );
    if(index === -1){
      index = 0
    }
    const selectedParachain = parachainRES[index];

    //CALCULATIONS
    //Nodes
    updateNodeTypes(networkData.nodes, nodeData[i].type);

    //Power
    const power = await findPowerUsage(
      hardwarePower,
      nodeData[i].network.name,
      nodeData[i].type
    );

    //Renewables
    const renewables = await findParachainRES(
      energyMix,
      energyIndex,
      nodeData.length,
      selectedParachain,
      parachainNodeCount
    );

    //Emissions
    const emissions = await calculateEmissions(
      power,
      emissionIndex,
      selectedParachain
    );

    //If subnetwork has already been identified
    if (
      subnetworks.some(
        (subnetwork) => nodeData[i].network.name.toUpperCase() === subnetwork.subnetworkname
      )
    ) {
      const subnetworkIndex = subnetworks.findIndex((subnetwork) => {
        return nodeData[i].network.name.toUpperCase() === subnetwork.subnetworkname;
      });
      //add calculated results to overview, network and subnetwork jsons
      addToNetworks(
        overview,
        networkData,
        subnetworks[subnetworkIndex],
        power,
        emissions,
        renewables,
        countryData
      );
    } else {
      //If subnetwork has not been identified
      //Create a new subnetwork json
      let subnetworkData = {
        subnetworkid: await fetchLatestSubnetworkId(),
        overviewid: overviewid,
        timestamp: timestamp,
        networkname: name,
        subnetworkname: nodeData[i].network.name.toUpperCase(),
        numberofnodes: 0,
        totalpower: 0,
        totalemissions: 0,
        percentres: 0,
        dapps: await findSubnetworkDapps(nodeData[i].network.name.toUpperCase()),
      };
      addToNetworks(
        overview,
        networkData,
        subnetworkData,
        power,
        emissions,
        renewables,
        countryData
      );
      subnetworks.push(subnetworkData);
    }
  }
  //Calculate renewables averages
  networkData.totalpower = parseInt(networkData.totalpower.toFixed(0));
  networkData.totalemissions = parseInt(networkData.totalemissions.toFixed(0));
  networkData.percentres = parseFloat(
    (networkData.percentres / networkData.numberofnodes)
  );
  for (let i = 0; i < subnetworks.length; i++) {
    subnetworks[i].totalpower = parseInt(subnetworks[i].totalpower.toFixed(0));
    subnetworks[i].totalemissions = parseInt(
      subnetworks[i].totalemissions.toFixed(0)
    );
    subnetworks[i].percentres = parseFloat(
      (subnetworks[i].percentres / subnetworks[i].numberofnodes)
    );
  }

  if(subnetworks.length > 0) {
    networkData.subnetworkdata.create = subnetworks
  }

  return networkData;
}

//collateOverviewData();


//Simple function to check list of subnetworks for a given network
const getSubnetworks = async () => {
  let nodeData = await fetchNodeData("KUSAMA")
  const subnetworks = []
  for(let i=0; i<nodeData.length; i++){
    console.log(subnetworks.includes(nodeData[i].network.name))
    if(subnetworks.includes(nodeData[i].network.name) === false){
      console.log(nodeData[i].network.name)
      subnetworks.push(nodeData[i].network.name)
    }
  }
  console.log(subnetworks)
}

//getSubnetworks()
