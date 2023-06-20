import { findCountryByCoordinate } from "country-locator";
import energyMix from "../data/energyMix.json" assert { type: "json" };
import countryEmissionFactors from "../data/countryEmissionFactors.json" assert { type: "json" };

export default async function fetchNodeData() {
  try {
    const response = await fetch(`https://dscfapi.bitgreenswiss.org/nodes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
  }
}

//Script to quickly calculate the average emission factor for the available polkadot nodes
async function calculateAverageEmissionFactor() {
  const nodeData = await fetchNodeData();

  let emissionFactorCount = 0;
  let energyMixCount = 0;
  let averageEmissionFactor = 0;
  let averageEnergyMix = 0;
  for (let i = 0; i < nodeData.length; i++) {
    const countryData = await findCountryByCoordinate(
      nodeData[i].latitude,
      nodeData[i].longitude
    );
    if (countryData !== undefined) {
      const emissionIndex = countryEmissionFactors.findIndex(
        (country) => country.country == countryData.name
      );
      if (emissionIndex !== -1) {
        averageEmissionFactor += countryEmissionFactors[emissionIndex].CDM;
        emissionFactorCount += 1;
      }
      const energyIndex = energyMix.findIndex(
        (country) => country.country == countryData.name
      );
      if (energyIndex !== -1) {
        averageEnergyMix += energyMix[energyIndex].energyMix;
        energyMixCount += 1;
      }
    }
  }
  if (emissionFactorCount > 0) {
    averageEmissionFactor = averageEmissionFactor / emissionFactorCount;
  }
  if (energyMixCount > 0) {
    averageEnergyMix = averageEnergyMix / energyMixCount;
  }
  console.log(averageEmissionFactor, averageEnergyMix);
}

calculateAverageEmissionFactor();
