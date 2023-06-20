const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const networks = require('../networks.json')

const update = async () => {
    for(const [network, n_data] of Object.entries(networks)) {
        const parent_network = await prisma.Network.findFirst({
            where: {
                name: {
                    equals: network,
                    mode: 'insensitive'
                }
            }
        })
        for(const [parachain, p_data] of Object.entries(n_data['parachains'])) {
            if(!p_data['hash']) {
                continue
            }

            if(typeof p_data['hash'] === 'object') {
                for(const hash of p_data['hash']) {
                    await prisma.Network.updateMany({
                        where: {
                            hash: hash
                        },
                        data: {
                            parentNetworkId: parent_network.id
                        }
                    })
                }
            } else {
                await prisma.Network.updateMany({
                    where: {
                        hash: p_data['hash']
                    },
                    data: {
                        parentNetworkId: parent_network.id
                    }
                })
            }
        }
    }
}

update()