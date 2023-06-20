const WebSocket = require('ws');
const CronJob = require('cron').CronJob;
const { PrismaClient } = require('@prisma/client')
const dotenv = require("dotenv");
const prisma = new PrismaClient()

/* config */
dotenv.config();

let period
let period_start_time
let period_end_time
let fetcher_job = new CronJob(
    '*/30 * * * *', // every 30 minutes
    startLoop
);
fetcher_job.start()

let report_job = new CronJob(
    '0 0 * * *', // every midnight
    generateDailyReport
);
report_job.start()

async function generateDailyReport() {
    let seen_nodes = []
    let end_time = new Date();
    end_time = new Date(Math.round(end_time.getTime() / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24)) // round it to the nearest day
    let start_time = new Date(end_time - (1000 * 60 * 60 * 24))

    const periods = await prisma.Period.findMany({
        where: {
            start: {
                gte: start_time.toISOString()
            },
            end: {
                lte: end_time.toISOString()
            }
        },
        include: {
            seenNodes: true
        }
    })

    for(let period of periods) {
        if(period.seenNodes) {
            for(let node of period.seenNodes) {
                let node_exists = seen_nodes.filter(function(n) {
                    return node.nodeId === n.nodeId
                })
                node_exists = node_exists[0]

                if(node_exists) {
                    seen_nodes = seen_nodes.map(function(n) {
                        if(node.nodeId === n.nodeId) {
                            return {...n, times_seen: n.times_seen + 1 };
                        }

                        return n
                    })
                } else {
                    seen_nodes.push({
                        nodeId: node.nodeId,
                        times_seen: 1
                    })
                }
            }
        }
    }

    const day_report = await prisma.DayReport.upsert({
        where: {
            day: start_time.toISOString(),
        },
        update: {},
        create: {
            day: start_time.toISOString()
        }
    })

    for(let node of seen_nodes) {
        if(node.times_seen >= 24) {
            await prisma.NodesOnDayReports.upsert({
                where: {
                    uniqueId: {
                        nodeId: node.nodeId,
                        dayReportId: day_report.id
                    }
                },
                update: {},
                create: {
                    nodeId: node.nodeId,
                    dayReportId: day_report.id
                }
            });
        }
    }
}

async function startLoop() {
    period_start_time = new Date();
    period_start_time = new Date(Math.round(period_start_time.getTime() / (1000 * 60 * 30)) * (1000 * 60 * 30)) // round it to the nearest minute
    period_end_time = new Date(period_start_time.getTime() + 1000 * 60 * 30)

    period = await prisma.Period.upsert({
        where: {
            uniqueId: {
                start: period_start_time.toISOString(),
                end: period_end_time.toISOString()
            }
        },
        update: {},
        create: {
            start: period_start_time.toISOString(),
            end: period_end_time.toISOString(),
        }
    })

    const fetch_networks = await prisma.Network.findMany({
        include: {
            parentNetwork: true
        }
    })

    let promise_call = []
    for(let network of fetch_networks) {
        if(network.name === 'POLKADOT' || network.name === 'KUSAMA') {
            promise_call.push(getByNetwork(network, 'w3f'))
        }

        promise_call.push(getByNetwork(network))
    }

    await Promise.all(promise_call);
}

async function getByNetwork(network, source = 'default') {
    let ws = null
    if(source === 'w3f') {
        ws = new WebSocket('wss://telemetry-backend.w3f.community/feed')
    } else {
        ws = new WebSocket('wss://feed.telemetry.polkadot.io/feed')
    }

    if(!ws) {
        console.log('Source not found.')
        return false;
    }

    ws.on('open', function() {
        ws.send('subscribe:' + network.hash)
    });

    ws.on('message', async function(data, flags) {
        let utf8decoder = new TextDecoder('utf-8')

        data = utf8decoder.decode(data)
        let messages = deserialize(data)

        if(messages.length > 20) {
            // return
        }

        for (const message of messages) {
            // list of all chains
            // avoid checking on every message, do it once every period
            if(message.action === 11 && network.name === 'POLKADOT' && source !== 'w3f') {
                const [
                    network_name,
                    network_hash
                ] = message.payload

                try {
                    await prisma.Network.upsert({
                        where: {
                            hash: network_hash
                        },
                        update: {
                            name: network_name
                        },
                        create: {
                            name: network_name,
                            hash: network_hash
                        }
                    })
                } catch (e) {
                    console.log('error saving network')
                }
            }

            // AddedNode
            if(message.action === 3) {
                const [
                    id,
                    nodeDetails,
                    nodeStats,
                    nodeIO,
                    nodeHardware,
                    blockDetails,
                    location,
                    startupTime,
                ] = message.payload;

                const name = nodeDetails[0].trim()
                const validator = nodeDetails[3] // validator address
                const network_id = nodeDetails[4]
                const latitude = location && location[0] ? parseFloat(location[0]) : 0.00
                const longitude = location && location[1] ? parseFloat(location[1]) : 0.00
                const city = location && location[2] ? location[2] : ''

                let type = 'Node'
                if(validator) {
                    type = 'Validator'
                }

                try {
                    const node = await prisma.Node.upsert({
                        where: {
                            uniqueId: {
                                name: name,
                                type: type,
                                networkId: network.id,
                                latitude: latitude,
                                longitude: longitude
                            }
                        },
                        update: {
                            periodLastSeenId: period.id,
                            type: type
                        },
                        create: {
                            name: name,
                            type: type,
                            networkId: network.id,
                            latitude: latitude,
                            longitude: longitude,
                            city: city,
                            periodFirstSeenId: period.id,
                            periodLastSeenId: period.id
                        },
                    })

                    const node_on_period = await prisma.NodesOnPeriods.upsert({
                        where: {
                            uniqueId: {
                                periodId: period.id,
                                nodeId: node.id
                            }
                        },
                        update: {},
                        create: {
                            nodeId: node.id,
                            periodId: period.id
                        }
                    });
                } catch (e) {
                    console.log('error saving node')
                }
            }

            // RemovedNode
            if(message.action === 4) {
                const id = message.payload;
            }

            // SubscribedTo
            if(message.action === 13 && source !== 'w3f') {
                console.log('subscribed to ' +  network.name + (network.parentNetwork ? ' - ' + network.parentNetwork.name : '') + ': ' + message.payload)
            }

            // UnsubscribedFrom
            if(message.action === 14) {
                // finalize()
                console.log('unsubscribed from ' + message.payload)
            }
        }
    });

    setTimeout(function() {
        ws.close()
    }, 60 * 1000 * 30)
}

function deserialize(data) {
    const json = JSON.parse(data);

    if (!Array.isArray(json) || json.length === 0 || json.length % 2 !== 0) {
        throw new Error('Invalid FeedMessage.Data');
    }

    const messages = new Array(json.length / 2);

    for (const index of messages.keys()) {
        const [action, payload] = json.slice(index * 2);

        messages[index] = { action, payload };
    }

    return messages;
}