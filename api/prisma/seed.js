const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const Chance = require('chance');

const chance = new Chance();

const load = async () => {
    try {
        await prisma.NodesOnPeriods.deleteMany()
        console.log('Deleted records in NodesOnPeriods table')

        await prisma.NodesOnDayReports.deleteMany()
        console.log('Deleted records in NodesOnDayReports table')

        await prisma.Node.deleteMany()
        console.log('Deleted records in Node table')

        await prisma.Period.deleteMany()
        console.log('Deleted records in Period table')

        await prisma.DayReport.deleteMany()
        console.log('Deleted records in DayReport table')

        await prisma.Network.deleteMany()
        console.log('Deleted records in Network table')

        let start_time = new Date();
        start_time = new Date(Math.round(start_time.getTime() / (1000 * 60 * 60)) * (1000 * 60 * 60)) // round it to the nearest minute
        start_time = new Date(start_time.getTime() - (1000 * 60 * 60 * 48))
        let first_period = null;
        let last_period = null;
        for (let i = 0; i < 94; i++) {
            let end_time = new Date(start_time.getTime() + (1000 * 60 * 30))
            let period = await prisma.Period.create({
                data: {
                    start: start_time.toISOString(),
                    end: end_time.toISOString(),
                }
            })
            if(!first_period) {
                first_period = period
            }
            last_period = period
            start_time = end_time;
        }
        console.log('Added Period data')

        // create POLKADOT network
        const polkadot_network = await prisma.Network.create({
            data: {
                name: 'POLKADOT',
                hash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3'
            }
        })
        // create KUSAMA network
        const kusama_network = await prisma.Network.create({
            data: {
                name: 'KUSAMA',
                hash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe'
            }
        })
        // create MOONBEAM network
        const moonbeam_network = await prisma.Network.create({
            data: {
                name: 'MOONBEAM',
                parentNetworkId: polkadot_network.id,
                hash: '0xfe58ea77779b7abda7da4ec526d14db9b1e9cd40a217c34892af80a9b332b76d'
            }
        })
        console.log('Added Network data')

        const periods = await prisma.Period.findMany()
        let all_nodes = []
        for (let i = 0; i < 500; i++) {
            let connect_periods = []
            for (let i = 0; i < periods.length; i++) {
                let period = periods[i]
                if(chance.bool({likelihood: 60})) {
                    connect_periods.push({
                        period: {
                            connect: {
                                id: period.id
                            }
                        }
                    })
                }
            }

            let node = await prisma.Node.create({
                data: {
                    type: chance.bool({likelihood: 30}) ? (chance.bool() ? 'Collator' : 'Validator') : 'Node',
                    name: chance.word({ length: 5 }) + '-' + chance.word({ length: 10 }),
                    networkId: chance.bool({likelihood: 40}) ? kusama_network.id : (chance.bool({likelihood: 30}) ? polkadot_network.id : moonbeam_network.id),
                    latitude: chance.latitude(),
                    longitude: chance.longitude(),
                    city: chance.city(),
                    periodFirstSeenId: first_period.id,
                    periodLastSeenId: last_period.id,
                    periods: {
                        create: connect_periods
                    }
                }
            })

            all_nodes.push(node.id)
        }
        console.log('Added Node data')
        console.log('Added NodesOnPeriods data')

        let report_time = new Date();
        report_time = new Date(Math.round(report_time.getTime() / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24)) // round it to the nearest day
        report_time = new Date(report_time.getTime() - (1000 * 60 * 60 * 24 * 2))
        for (let i = 0; i < 2; i++) {
            let day_report = await prisma.DayReport.create({
                data: {
                    day: report_time.toISOString()
                }
            })

            let nodes = shuffleArray(all_nodes)
            nodes = nodes.slice(0, Math.floor(Math.random() * (400 - 200 + 1) + 200))

            for (let node_id of nodes) {
                await prisma.NodesOnDayReports.upsert({
                    where: {
                        uniqueId: {
                            nodeId: node_id,
                            dayReportId: day_report.id
                        }
                    },
                    update: {},
                    create: {
                        nodeId: node_id,
                        dayReportId: day_report.id
                    }
                });
            }

            report_time =  new Date(report_time.getTime() + (1000 * 60 * 60 * 24));
        }
        console.log('Added DayReport data')
        console.log('Added NodesOnDayReports data')
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

load()