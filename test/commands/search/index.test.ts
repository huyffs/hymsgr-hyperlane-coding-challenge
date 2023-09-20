import { expect, test } from '@oclif/test';

const validPrivateKey = "Inject valid private key here";

describe('send', () => {
  test
    .stdout()
    .command(['send',
      "--origin-chain",
      "11155111",
      "--from-address",
      "0xCC737a94FecaeC165AbCf12dED095BB13F037685",
      "--destination-chain",
      "1284",
      "--to-address",
      "0xCC737a94FecaeC165AbCf12dED095BB13F037685",
      "--rpc-url",
      "https://eth-sepolia.g.alchemy.com/v2/4q3lulvKjCOPA6PkUksSncdHjDliP5UD",
      "--private-key",
      validPrivateKey,
      "--message",
      "This is a test yo!",
    ])
    .it('runs send cmd', ctx => {
      expect(ctx.stdout).to.contain('"_type": "TransactionReceipt"');
      expect(ctx.stdout).to.contain('"to": "0xCC737a94FecaeC165AbCf12dED095BB13F037685"');
      expect(ctx.stdout).to.contain('Message successfully delivered');
    });
});
