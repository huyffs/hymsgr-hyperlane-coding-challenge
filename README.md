Hymsgr
=================

Hyperlane Messenger CLI

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g hymsgr
$ hymsgr
Hyperlane Messenger CLI app for coding challenge

VERSION
  hymsgr/1.0.0 darwin-arm64 node-v18.17.1

USAGE
  $ hymsgr [COMMAND]

COMMANDS
  help    Display help for hymsgr.
  search  Search an inter-chain message with Hyperlane
  send    Send an inter-chain message with Hyperlane

$ hymsgr (--version)
hymsgr/0.0.0 darwin-arm64 node-v18.17.1
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`hymsgr send`](#hymsgr-send)
* [`hymsgr search`](#hymsgr-search)

## `hymsgr send`

Send a message

```
USAGE
  $ hymsgr send -o <value> -f <value> -d <value> -t <value> -u <value> -m <value> -k <value>

FLAGS
  -d, --destination-chain=<value>  (required) Destination chain ID
  -f, --from-address=<value>       (required) From mailbox address
  -k, --private-key=<value>        (required) Private key with wich to sign the message
  -m, --message=<value>            (required) Message to send
  -o, --origin-chain=<value>       (required) Origin chain ID
  -t, --to-address=<value>         (required) To mailbox address
  -u, --rpc-url=<value>            (required) RPC URL

DESCRIPTION
  Send an inter-chain message with Hyperlane

EXAMPLES
  $ hymsgr send \
  --origin-chain 11155111 \
  --from-address 0xCC737a94FecaeC165AbCf12dED095BB13F037685 \
  --destination-chain 1284 \
  --to-address 0xCC737a94FecaeC165AbCf12dED095BB13F037685 \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/4q3lulvKjCOPA6PkUksSncdHjDliP5UD \
  --private-key ThisIsAPrivateKeyForMyWallet,
  --message This is a test yo!
```

_See code: [src/commands/send/index.ts](https://github.com/huyffs/hymsgr-hyperlane-coding-challenge/blob/v1.0.0/src/commands/send/index.ts)_

## `hymsgr search`

Search for message sent between chains


```
USAGE
  $ hymsgr search -m <value>

FLAGS
  -m, --matching-list-element=<value>  (required) Matching list element

DESCRIPTION
  Search for message sent between chains

EXAMPLES
  $ hymsgr search \
      "--matching-list-element '{"originDomain":"*","senderAddress":"0xfb7dcf49689ee008331cd3a45bd79298be3fb790","destinationDomain":"*","recipientAddress":"0xCC737a94FecaeC165AbCf12dED095BB13F037685"}"'
```

_See code: [src/commands/search/index.ts](https://github.com/huyffs/hymsgr-hyperlane-coding-challenge/blob/v1.0.0/src/commands/search/index.ts)_

<!-- commandsstop -->
