import { Command, Flags } from '@oclif/core';
import { CustomOptions, FlagParser } from '@oclif/core/lib/interfaces/parser';

type MatchingListElement = {
  originDomain?: '*' | number | number[];
  senderAddress?: '*' | string | string[];
  destinationDomain?: '*' | number | number[];
  recipientAddress?: '*' | string | string[];
};

const parseMatchingList: FlagParser<
  MatchingListElement,
  string,
  CustomOptions
> = (input) => {
  const data: MatchingListElement = JSON.parse(input);
  return Promise.resolve(data);
};

const prettyJson = (o: any) => JSON.stringify(o, undefined, '  ');

export default class Search extends Command {
  static description = 'Search for messages sent between chains';

  static examples = [
    `$ oex search \\
    "--matching-list-element '{\"originDomain\":\"*\",\"senderAddress\":\"0xfb7dcf49689ee008331cd3a45bd79298be3fb790\",\"destinationDomain\":\"*\",\"recipientAddress\":\"0xCC737a94FecaeC165AbCf12dED095BB13F037685\"}"'
`,
  ];

  static flags = {
    'matching-list-element': Flags.custom<MatchingListElement>({
      char: 'm',
      description: 'Matching list element',
      required: true,
      parse: parseMatchingList,
    })(),
  };

  async run(): Promise<void> {
    try {
      const { flags } = await this.parse(Search);
      const m = flags['matching-list-element']!;
      const sender =
        typeof m.senderAddress === 'object'
          ? m.senderAddress[0] || ''
          : m.senderAddress;
      const recipient =
        typeof m.recipientAddress === 'object'
          ? m.recipientAddress[0] || ''
          : m.recipientAddress;

      console.log('🔎 Searching for messages...');
      // API Doc: https://explorer.hyperlane.xyz/api-docs
      // Note: No option to control offset/limit
      const params = new URLSearchParams({
        module: 'message',
        action: 'get-messages',
        sender: sender!,
        recepient: recipient!,
      });
      const res = await fetch(
        `https://explorer.hyperlane.xyz/api?` + params.toString(),
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (res.ok) {
        const data = await res.json();
        console.log('📖 Result:');
        console.log(prettyJson(data));
      } else {
        console.error(`${res.status} - ${await res.text()}`);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    console.log('\nDone');
  }
}
