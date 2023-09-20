import { Command, Flags } from '@oclif/core';
import { CustomOptions, FlagParser } from '@oclif/core/lib/interfaces/parser';
import { ContractTransactionResponse, ethers } from 'ethers';

type TxStatus = {
  status: string;
  message: string;
  result: {
    status: string;
  };
};

const parseUint8Array: FlagParser<Uint8Array, string, CustomOptions> = (
  input,
) => Promise.resolve(textEncoder.encode(input));

const parseByte32: FlagParser<string, string, CustomOptions> = (input) => {
  if (!input.startsWith('0x')) {
    return Promise.reject('Invalid address');
  }
  return Promise.resolve('0x' + input.substring(2).padStart(64, '0'));
};

const prettyJson = (o: any) => JSON.stringify(o, undefined, '  ');

const textEncoder = new TextEncoder();

export default class Send extends Command {
  static description = 'Send an inter-chain message with Hyperlane';

  static examples = [
    `$ oex send \\
--origin-chain 11155111 \\
--from-address 0xCC737a94FecaeC165AbCf12dED095BB13F037685 \\
--destination-chain 1284 \\
--to-address 0xCC737a94FecaeC165AbCf12dED095BB13F037685 \\
--rpc-url https://eth-sepolia.g.alchemy.com/v2/4q3lulvKjCOPA6PkUksSncdHjDliP5UD \\
--private-key ThisIsAPrivateKeyForMyWallet,
--message This is a test yo!
`,
  ];

  static flags = {
    'origin-chain': Flags.integer({
      char: 'o',
      description: 'Origin chain ID',
      required: true,
    }),
    'from-address': Flags.string({
      char: 'f',
      description: 'From mailbox address',
      required: true,
    }),
    'destination-chain': Flags.integer({
      char: 'd',
      description: 'Destination chain ID',
      required: true,
    }),
    'to-address': Flags.string({
      char: 't',
      description: 'To mailbox address',
      required: true,
      parse: parseByte32,
    }),
    'rpc-url': Flags.string({
      char: 'u',
      description: 'RPC URL',
      required: true,
    }),
    message: Flags.custom<Uint8Array>({
      char: 'm',
      description: 'Message to send',
      required: true,
      parse: parseUint8Array,
    })(),
    'private-key': Flags.string({
      char: 'k',
      description: 'Private key with wich to sign the message',
      required: true,
    }),
  };

  async run(): Promise<void> {
    try {
      const { flags } = await this.parse(Send);
      console.log('💌 Sending message...');
      const provider = new ethers.JsonRpcProvider(
        flags['rpc-url'],
        flags['origin-chain'],
      );
      const abi = require('./imailbox_abi.json');
      const signer = new ethers.Wallet(flags['private-key'], provider);
      const contract = new ethers.Contract(flags['from-address'], abi, signer);
      const receipt: ContractTransactionResponse = await contract.dispatch(
        flags['destination-chain'],
        flags['to-address'],
        flags.message,
      );
      console.log('📝 Receipt:');
      console.debug(prettyJson(receipt));

      // API Doc: https://explorer.hyperlane.xyz/api-docs
      const params = new URLSearchParams({
        module: 'message',
        action: 'get-status',
        id: receipt.hash,
      });
      await checkTxReceiptStatus(
        `https://explorer.hyperlane.xyz/api?` + params.toString(),
      );
    } catch (err) {
      console.error(err);
      return;
    }

    console.log('\nDone');
  }
}

async function checkTxReceiptStatus(url: string) {
  return new Promise((resolve, reject) => {
    let runCount = 0;
    async function check() {
      runCount++;
      console.log('🕵️‍♀️ Checking message delivery status...');
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const txStatus: TxStatus = await res.json();
        console.debug(prettyJson(txStatus));
        switch (txStatus.status) {
          case '0':
            console.log('⛔️ Failed to deliver message');
            resolve(undefined);
            return;
          case '1':
            console.log('🎉 Message successfully delivered');
            resolve(undefined);
            return;
          default:
            console.log('🙀 Unknown receipt status', txStatus.status);
        }
        if (runCount == 10) {
          reject('Failed to determine message delivery status');
        } else {
          setTimeout(check, 1_000);
        }
      } else {
        reject(`${res.status} - ${await res.text()}`);
      }
    }
    check();
  });
}
