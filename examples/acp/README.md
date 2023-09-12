# Spore ACP Examples

## Introduction

### What is `Anyone-can-pay` lock

[Anyone-can-pay](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0026-anyone-can-pay/0026-anyone-can-pay.md) is a lock script designed to accept any amount of CKB or UDT payment from any sender. An ACP lock cell can be unlocked by anyone without signature verification if the unlocker can meet the lock's requirements.

For instance, if A wants to transfer some CKB to B, normally A has to create a new cell to B, containing at least 61 CKB (if B is Secp256k1Blake160 Sign-all lock) of capacity.
But if B has an ACP lock cell on-chain, A can just unlock the ACP lock cell and add any amount of CKB into the cell, without signature verification from B. 

### Featured examples

The Spore ACP Examples is a collection of code examples to show developers how to achieve different purposes with Anyone-can-pay lock and spore-sdk.

In [`/apis`](./apis):
- Create public clusters with the [Anyone-can-pay](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0026-anyone-can-pay/0026-anyone-can-pay.md) lock
- Create spores in public clusters with the [Secp256k1Blake160 Sign-all](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_sighash_all.c) lock

## Run examples

> Please make sure you've met the pre-requirements:  
> [`Node.js`](https://nodejs.org/) >= 18.0.0  
> [`PNPM`](https://pnpm.io/) >= 8.0.0  

### Setup environment

To set up the local environment, run the following command at the spore-sdk's root directory:

```shell
pnpm i && pnpm run build:packages
```

### Run an example

> The code of the examples is stored in the [examples/acp/apis](./apis) directory, feel free to review and modify the code, using the examples as your playground or a sandbox to freely experiment.

Assuming your local environment is set up, and you're at the [examples/acp](.) directory, let's run an example to see how things work. 
For instance, if you want to create a spore on-chain, run the [examples/acp/apis/createAcpCluster.ts](./apis/createAcpCluster.ts) example in your terminal:

```shell
ts-node apis/createAcpCluster.ts
```

This example constructs and sends a transaction that creates a spore on-chain. Once the transaction is sent, a `Transaction Hash` should be returned so that you can review the transaction details on [CKB Explorer](https://pudge.explorer.nervos.org/).

## Customization

### Update configs

If you have your own testing accounts, or if you want to configure the SporeConfig of the examples, you can go to the [examples/acp/utils/config.ts](./utils/config.ts) file and update it. Inside the `utils/config.ts` file, you can:

- Replace the default testing accounts with your own
- Modify the default SporeConfig as needed

### Use your own accounts

If you want a clean startup environment for testing the functionality of the spore-sdk, you can replace the default testing accounts with your own accounts. Whether locally or in globally, there has two default testing accounts being used, `CHARLIE` and `ALICE`.

How to replace them:

- Replace locally: For replacing the testing accounts locally (only affects the secp256k1 examples), visit the [examples/acp/utils/config.ts](./utils/config.ts) file and edit the `accounts` variable.
- Replace globally: If you want to replace the testing accounts globally (affects all kinds of examples), you can visit the [examples/shared/index.ts](../shared/index.ts) file and edit the `accounts` variable.

### Generate testing accounts

For those who want to create new accounts for testing the examples, you can follow the steps below to create a new private key and claim some faucet CKBytes.

**1. Generate a new account:** 

1. Open the [Generator Tool](https://ckb.tools/generator) website
2. Click the refresh icon (🔄) on the page to generate a new account
3. Copy the new account's `Private Key (256-bit)` from the `Private/Public Key` block
4. Replace any of the default testing accounts with the new account

**2. Claim faucet CKBytes for the new account:**

1. Copy the new account's `Nervos CKB Address` from the `Default Lock (Secp256k1-Blake160) - Testnet` block
2. Open the [Nervos Faucet](https://faucet.nervos.org/) website
3. Paste the address into the address input, and click the `Claim` button
4. Wait for a while until the faucet process is completed