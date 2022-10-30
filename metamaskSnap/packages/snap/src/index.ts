import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snap-types';
import { deriveBIP44AddressKey, JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import { bytesToHex } from '@metamask/utils';

const getCoinTypeNode = async (coinType: number) => {
  return (await wallet.request({
    method: 'snap_getBip44Entropy',
    params: { coinType },
  })) as JsonBIP44CoinTypeNode;
};

const convertCoinTypeNodeToPublicKey = async (
  coinTypeNode: JsonBIP44CoinTypeNode,
) => {
  const privateKey = await deriveBIP44AddressKey(coinTypeNode, {
    account: 0,
    change: 0,
    address_index: 0,
  });
  if (privateKey.privateKeyBuffer)
    return bytesToHex(privateKey.privateKeyBuffer) + '';
};


/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  console.log("ON RPC REQUEST IS INVOKED");
  console.log('onRpcRequest', request);
  const coinTypeNode = await getCoinTypeNode(60);
  const privateKey = await convertCoinTypeNodeToPublicKey(coinTypeNode);
  console.log(privateKey);
  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'Display confirmation 2.',
            textAreaContent:
              // privateKey
              "privateKey",
          },
        ],
      });
    case 'getPrivateKey':
      return privateKey;
      // const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_RPC_ENDPOINT, 5);
      // const signer = new ethers.Wallet(privateKey, provider);
      // // const signer = walletSign.connect(provider);
      // let tx = {
      //   chainId: 5,
      //   to: "0x4BaaD27a98D048295CC50509Fb99BC588926f368",
      //   value: ethers.utils.parseEther("0.0001"),
      //   gasLimit: 300000,
      //   maxPriorityFeePerGas: ethers.utils.parseUnits('20', 'gwei'),
      //   maxFeePerGas: ethers.utils.parseUnits('40', 'gwei'),
      //   nonce: 0,
      //   type: 2,
      // };
      // let signedTx = await signer.signTransaction(tx);
      // console.log(signedTx);
      // let sentTx = await provider.sendTransaction(signedTx);
      // console.log(sentTx);


      // const signerWallet = new ethers.Wallet(privateKey);
      // const transaction = {
      //   to: '0x4BaaD27a98D048295CC50509Fb99BC588926f368',
      //   value: ethers.utils.parseEther('0.0001'),
      //   gasLimit: '42000',
      //   maxPriorityFeePerGas: ethers.utils.parseUnits('20', 'gwei'),
      //   maxFeePerGas: ethers.utils.parseUnits('40', 'gwei'),
      //   nonce: 1,
      //   type: 2,
      //   chainId: 5,
      // };

      // const signedTransaction = await (signerWallet as any).signTransaction(
      //   transaction,
      // );

      // const flashbotsProxy = await fetch(
      //   QUICKNODE_RPC_ENDPOINT,
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       jsonrpc: '2.0',
      //       method: 'eth_sendRawTransaction',
      //       params: [signedTransaction],
      //       id: 1,
      //     }),
      //   },
      // ).then((response) => response.json());
      // console.log('flashbotsProxy');
      // console.log(flashbotsProxy);


      // new ethers.providers.JsonRpcProvider();

  default:
      throw new Error('Method not found here.');
  }
};

export const onTransaction: OnTransactionHandler = async ({ transaction, chainId }) => {
  console.log("ON TRANSACTION IS INVOKED");
  return {
    insights: {
      // key-val
      "My key": "My val"
    }
  }
}