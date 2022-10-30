import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from "ethers";

// import dotenv from "dotenv";
// dotenv.config();
// const { QUICKNODE_RPC_ENDPOINT } = process.env;
const QUICKNODE_RPC_ENDPOINT = "https://maximum-smart-frog.ethereum-goerli.discover.quiknode.pro/679f113366e063584808a4d7c84896ff49370937/";


/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  console.log("SNAP ID", snapId);
  await window.ethereum.request({
    method: 'wallet_enable',
    params: [
      {
        wallet_snap: {
          [snapId]: {
            ...params,
          },
        },
      },
    ],
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  let addr = await window.ethereum.request({ method: 'eth_requestAccounts' });
  console.log("addr", addr);

  await window.ethereum.request({ 
    method: 'wallet_requestPermissions', 
    params: [{ eth_accounts: {} }],
  })
  .then((permissions) => {
    const accountsPermission = permissions.find(
      (permission) => permission.parentCapability === 'eth_accounts'
    );
    if (accountsPermission) {
      console.log('eth_accounts permission successfully requested!');
    }
  })
  .catch((error) => {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.log('Permissions needed to continue.');
    } else {
      console.error(error);
    }
  });

  console.log("\n=============");
  console.log("SEND HELLO");
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'hello',
      },
    ],
  });
};

// export const sendTx = async () => {
//   console.log("\n=============");
//   console.log("SEND TX");
//   await window.ethereum.request({
//     method: 'wallet_invokeSnap',
//     params: [
//       defaultSnapOrigin,
//       {
//         method: 'txSim',
//       },
//     ],
//   });
//   console.log("SEND TX OUT");

// };

export const sendTx = async () => {
  console.log("\n=============");
  console.log("SEND TX");

  let privateKey = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'getPrivateKey',
      },
    ],
  });
  console.log("Private key", privateKey);

  if (privateKey) {

    const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_RPC_ENDPOINT, 5);
    const signer = new ethers.Wallet(privateKey, provider);

    let tx = {
      chainId: 5,
      to: "0x4BaaD27a98D048295CC50509Fb99BC588926f368",
      value: ethers.utils.parseEther("0.0001"),
      gasLimit: 300000,
      maxPriorityFeePerGas: ethers.utils.parseUnits('20', 'gwei'),
      maxFeePerGas: ethers.utils.parseUnits('40', 'gwei'),
      nonce: 0,
      type: 2,
    };
    let signedTx = await signer.signTransaction(tx);
    console.log(signedTx);
    let sentTx = await provider.sendTransaction(signedTx);
    console.log(sentTx);


  }
  
};

// export const sendTx = async (eth: ethers.providers.ExternalProvider) => {
export const sendTx_ = async () => {

  await window.ethereum.request({method: 'eth_requestAccounts'});
  // let provider = new ethers.providers.Web3Provider(window.ethereum);
  // const params = [{
  //     from: sender,
  //     to: receiver,
  //     value: strEther
  // }];
  // const transactionHash = await provider.send('eth_sendTransaction', params)
  // console.log('transactionHash is ' + transactionHash);


  // const provider = await detectEthereumProvider();
  // console.log("PROVIDER", provider);

  // console.log("\n=============");
  // console.log("SEND TX");

  // // web3_clientVersion returns the installed MetaMask version as a string
  // const isFlask = (
  //   await provider?.request({ method: 'web3_clientVersion' })
  // )?.includes('flask');

  // if (provider && isFlask) {
  //   console.log('MetaMask Flask successfully detected!');

  //   // Now you can use Snaps!
  // } else {
  //   console.error('Please install MetaMask Flask!');
  // }

  // const entropy = await window.ethereum.request({
  //   method: 'snap_getBip44Entropy_69420',
  // });
  // console.log("entropy", entropy.key);

  // const privKey = await wallet.request({
  //   method: 'snap_getAppKey',
  // });
  // console.log(`privKey is ${privKey}`);

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const ethWallet = new ethers.Wallet(privKey, provider);
  // console.dir(ethWallet);

  // const provider = new ethers.providers.Web3Provider(eth);
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();

  // console.log("signer", signer._address);

  let signer = await window.ethereum.request({ method: 'eth_requestAccounts' });

  await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: signer,
        to: "0xfffffffff",
        gas: '0x5208',
        value: 0,
      },
    ],
  });
};


export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
