import { findCountryByCoordinate } from 'country-locator';
import { Parser } from 'json2csv';
import fs from 'fs';

//Function to convert node API data to .csv

//Pull node data from API
export default async function fetchNodeData() {
  try {
    const response = await fetch(`${process.env.CARBON_API}/nodes`, {
      body: JSON.stringify({
        network: 'POLKADOT',
        //subNetwork: 'MOONBEAM',
        /*
        periodLastSeen: {
          end: "2022-10-18T15:00:00.000Z",
        },
        */
      }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
  }
}

//Loop through node data and return array
async function findCountry() {
  const nodeData = await fetchNodeData();

  const nodeCountryJSON = [];

  function Node(
    id,
    name,
    type,
    network,
    subNetwork,
    firstSeen,
    lastSeen,
    latitude,
    longitude,
    city,
    country,
    countryCode
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.network = network;
    this.subNetwork = subNetwork;
    this.firstSeen = firstSeen;
    this.lastSeen = lastSeen;
    this.latitude = latitude;
    this.longitude = longitude;
    this.city = city;
    this.country = country;
    this.countryCode = countryCode;
  }

  let count = 0;
  for (let i = 0; i < nodeData.length; i++) {
    const countryData = await findCountryByCoordinate(
      nodeData[i].latitude,
      nodeData[i].longitude
    );
    if (countryData === undefined) {
      nodeCountryJSON.push(
        new Node(
          nodeData[i].id,
          nodeData[i].name,
          nodeData[i].type,
          nodeData[i].network,
          nodeData[i].subNetwork,
          nodeData[i].periodFirstSeen.start,
          nodeData[i].periodLastSeen.end,
          nodeData[i].latitude,
          nodeData[i].longitude,
          nodeData[i].city,
          null,
          null
        )
      );
    } else {
      count++;
      console.log(nodeData[i]);
      nodeCountryJSON.push(
        new Node(
          nodeData[i].id,
          nodeData[i].name,
          nodeData[i].type,
          nodeData[i].network,
          nodeData[i].subNetwork,
          nodeData[i].periodFirstSeen.start,
          nodeData[i].periodLastSeen.end,
          nodeData[i].latitude,
          nodeData[i].longitude,
          nodeData[i].city,
          countryData.name,
          countryData.code
        )
      );
    }
  }
  return nodeCountryJSON;
}

//Convert JSON to .csv
async function jsonToCsv() {
  const nodeData = await findCountry();
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(nodeData);
  saveToFile(csv);
}

//Save to .csv file
function saveToFile(data) {
  fs.writeFile('nodeDataPolkadot.csv', data, function (err) {
    if (err) throw err;
    console.log('Saved Data');
  });
}

jsonToCsv();
