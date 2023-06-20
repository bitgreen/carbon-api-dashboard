export type NetworkProps = {
  timestamp: Date;
  numberOfNodes: number;
  totalPower: number;
  totalEmissions: number;
  percentRES: number;
};

export type parachainDetails = {
  name: string;
  address: string;
};

export interface ParachainServer {
  time: Date;
  validators: Number;
  collators: Number;
  nodes: Number;
  clients: Number;
}

export interface locations {
  name: string;
  nodes: number;
  power: number;
  emissions: number;
}

export interface BarGraphData {
  locations: locations[];
}

export interface parachain {
  name: string;
  address: string;
  totalnodes: number;
  id: number;
  servers: server[];
  nonce: number;
}

export interface server {
  id: number;
  location: string;
  name: string;
  amount: number;
  hardware: string;
  renewables: number;
}

export interface treemapChild {
  name: string;
  size: number;
}

export interface treemap {
  name: string;
  children: treemapChild[];
}

export interface nodeData {
  name: string;
  nodes: number;
}

export interface subnetworkNodes {
  numberofnodes: number;
  timestamp: Date;
  totalemissions: number;
  totalpower: number;
}

export interface dAppData {
  name: string;
  totalnodes: number;
  address?: string;
  nonce?: any;
}

export interface subnetworkName {
  subnetworkname: string;
}

export interface loginAccount {
  address: string;
}
