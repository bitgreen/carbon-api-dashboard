const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const Chance = require('chance');

const chance = new Chance();

const load = async () => {
    try {
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
    } catch (e) {
        // console.error(e)
        // process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

load()