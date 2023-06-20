const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/* config */
dotenv.config();
const port = process.env.API_PORT || 3000

app.use(express.urlencoded({extended: true, limit: '256mb'}));
app.use(express.json({ limit: '256mb' }));

app.use(cors());

app.get('/', function (req, res) {
    res.send('Hello from Bitgreen!');
});

app.get('/networks', async function (req, res) {
    let all_networks = await prisma.Network.findMany({
        orderBy: {
            id: 'asc',
        }
    })

    res.send(all_networks);
});

app.post('/nodes', async function (req, res) {
    const { type_query, network_query, subnetwork_query } = nodeFilters(req)

    let { last_seen_date } = req.body
    last_seen_date = Date.parse(last_seen_date)

    let date_query = null

    if(!last_seen_date) {
        last_seen_date = Date.now() - 7 * 24 * 60 * 60 * 1000
    }

    date_query = {
        end: {
            gte: new Date(last_seen_date)
        }
    }

    const nodes = await prisma.Node.findMany({
        where: {
            ...type_query,
            network: {
                OR: [
                    {
                        ...network_query
                    },
                    {
                        ...subnetwork_query
                    }
                ]
            },
            periodLastSeen: {
                ...date_query
            }
        },
        include: {
            network: {
                select: {
                    name: true,
                    hash: true,
                    parentNetwork: {
                        select: {
                            name: true,
                            hash: true
                        }
                    }
                }
            },
            periodFirstSeen: true,
            periodLastSeen: true,
        }
    });

    res.send(exclude_field(nodes, 'periodFirstSeenId', 'periodLastSeenId', 'networkId'));
});

app.post('/periods', async function (req, res) {
    const { type_query, network_query } = nodeFilters(req)

    let { start_date, end_date } = req.body
    start_date = Date.parse(start_date)
    end_date = Date.parse(end_date)

    let date_query = {
        start: {},
        end: {}
    }

    if(start_date) {
        date_query.start.gte = new Date(start_date)
    }

    if(end_date) {
        date_query.end.lte = new Date(end_date)
    }

    const periods = await prisma.Period.findMany({
        where: {
            ...date_query
        },
        include: {
            seenNodes: {
                where: {
                    node: {
                        ...type_query,
                        network: {
                            ...network_query
                        }
                    }
                }
            }
        }
    });

    // Display only node IDs
    for (let period of periods) {
        let nodes = period.seenNodes;
        period.seenNodes = []
        for(let node of nodes) {
            period.seenNodes.push(node.nodeId)
        }
        period.seenNodesCount = period.seenNodes.length
    }

    res.send(exclude_field(periods));
});

app.post('/report/daily', async function (req, res) {
    const { type_query, network_query, subnetwork_query } = nodeFilters(req)

    let { start_date, end_date } = req.body
    start_date = Date.parse(start_date)
    end_date = Date.parse(end_date)

    let date_query = {
        day: {},
    }

    if(start_date) {
        date_query.day.gte = new Date(start_date)
    }

    if(end_date) {
        date_query.day.lte = new Date(end_date)

    }

    const day_reports = await prisma.DayReport.findMany({
        where: {
            ...date_query
        },
        include: {
            seenNodes: {
                where: {
                    node: {
                        ...type_query,
                        network: {
                            OR: [
                                {
                                    ...network_query
                                },
                                {
                                    ...subnetwork_query
                                }
                            ]
                        }
                    }
                },
                include: {
                    node: true
                }
            }
        }
    });

    // Display only node IDs and calculate totals
    for (let day_report of day_reports) {
        day_report.seenNodesCount = {
            'nodes': 0,
            'validators': 0,
            'collators': 0,
            'all': 0
        }

        let nodes = day_report.seenNodes;
        day_report.seenNodes = []
        for(let node of nodes) {
            day_report.seenNodes.push(node.nodeId)

            if(node.node.type === 'Node') {
                day_report.seenNodesCount.nodes++
            } else if(node.node.type === 'Validator') {
                day_report.seenNodesCount.validators++
            } else if(node.node.type === 'Collator') {
                day_report.seenNodesCount.collators++
            }
        }
        day_report.seenNodesCount.all = day_report.seenNodes.length
    }

    res.send(exclude_field(day_reports, 'id'));
});

/* serve api */
const server = app.listen(port, function () {
    console.log(`API server is listening at: http://localhost:${port}.`)
});

function exclude_field(rows, ...keys) {
    for (let row of rows) {
        for (let key of keys) {
            delete row[key]
        }
    }

    return rows
}

function nodeFilters(req) {
    let { network_id, network, type, include_subnetworks } = req.body
    let network_query = null
    let subnetwork_query = null
    let type_query = null

    if(type === 'node') {
        type_query = {
            type: 'Node'
        }
    } else if(type === 'validator') {
        type_query = {
            type: 'Validator'
        }
    }

    // accept both params for now, respect network_id if both provided
    if(network_id) {
        network_query = {
            id: network_id
        }
    } else if(network) {
        network_query = {
            name: {
                equals: network,
                mode: 'insensitive'
            }
        }
    }

    // extend the search for subnetworks in flag is set to true
    if(include_subnetworks) {
        subnetwork_query = {
            parentNetwork: {
                ...network_query
            }
        }
    }

    return {
        type_query, network_query, subnetwork_query
    }
}