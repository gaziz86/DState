# DState

State change Transaction Simulator using Metamask Snaps Transaction insights and Hardhat Forking

## Tools

### Metamask Snaps
User interface and secure isolation of Snaps from actual transactions. Popularity of Metamask brings large number of potential users.
`yarn build`
`yarn start`

#### Hardhat (with Quicknode RPC)
Transaction simulations with customization of processing simulation results. This approach also has significantly larger rate limit than other ready to use transaction simulation APIs: with Quicknode RPC Free Tier - 25 requests/min VS Tenderly - 50 requests/month.
`npx hardhat node`