import { expect, test } from '@oclif/test';

const validPrivateKey = 'Inject valid private key here';

describe('search', () => {
  test
    .stdout()
    .command(['search',
      '--matching-list-element',
      '{\"originDomain\":\"*\",\"senderAddress\":\"0xfb7dcf49689ee008331cd3a45bd79298be3fb790\",\"destinationDomain\":\"*\",\"recipientAddress\":\"0xCC737a94FecaeC165AbCf12dED095BB13F037685\"}'
    ])
    .it('runs search cmd', ctx => {
      expect(ctx.stdout).to.contain('Searching for messages...');
      expect(ctx.stdout).to.contain('"status": "1"');
      expect(ctx.stdout).to.contain('"message": "OK"');
    });
});
