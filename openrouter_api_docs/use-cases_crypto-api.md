---
url: "https://openrouter.ai/docs/use-cases/crypto-api"
title: "Crypto API | Purchase Credits with Cryptocurrency | OpenRouter | Documentation"
---

You can purchase credits using cryptocurrency through our Coinbase integration. This can either happen through the UI, on your [credits page](https://openrouter.ai/settings/credits), or through our API as described below. While other forms of payment are possible, this guide specifically shows how to pay with the chain’s native token.

Headless credit purchases involve three steps:

1. Getting the calldata for a new credit purchase
2. Sending a transaction on-chain using that data
3. Detecting low account balance, and purchasing more

## Getting Credit Purchase Calldata

Make a POST request to `/api/v1/credits/coinbase` to create a new charge. You’ll include the amount of credits you want to purchase (in USD, up to $100000), the address you’ll be sending the transaction from, and the EVM chain ID of the network you’ll be sending on.

Currently, we only support the following chains (mainnet only):

- Ethereum (1)
- Polygon (137)
- Base (8453) **_recommended_**

```code-block text-sm

```

The response includes the charge details and transaction data needed to execute the on-chain payment:

```code-block text-sm

```

## Sending the Transaction

You can use [viem](https://viem.sh/) (or another similar evm client) to execute the transaction on-chain.

In this example, we’ll be fulfilling the charge using the [swapAndTransferUniswapV3Native()](https://github.com/coinbase/commerce-onchain-payment-protocol/blob/d891289bd1f41bb95f749af537f2b6a36b17f889/contracts/interfaces/ITransfers.sol#L168-L171) function. Other methods of swapping are also available, and you can learn more by checking out Coinbase’s [onchain payment protocol here](https://github.com/coinbase/commerce-onchain-payment-protocol/tree/master). Note, if you are trying to pay in a less common ERC-20, there is added complexity in needing to make sure that there is sufficient liquidity in the pool to swap the tokens.

```code-block text-sm

```

Once the transaction succeeds on chain, we’ll add credits to your account. You can track the transaction status using the returned transaction hash.

Credit purchases lower than $500 will be immediately credited once the transaction is on chain. Above $500, there is a ~15 minute confirmation delay, ensuring the chain does not re-org your purchase.

## Detecting Low Balance

While it is possible to simply run down the balance until your app starts receiving 402 error codes for insufficient credits, this gap in service while topping up might not be desirable.

To avoid this, you can periodically call the `GET /api/v1/credits` endpoint to check your available credits.

```code-block text-sm

```

The response includes your total credits purchased and usage, where your current balance is the difference between the two:

```code-block text-sm

```

Note that these values are cached, and may be up to 60 seconds stale.

Ask AI

Assistant

Hi, I'm an AI assistant with access to documentation and other content.

Tip: you can toggle this pane with

`⌘`

+

`/`

Suggestions

How do I integrate OpenRouter with LangChain for Python applications?

What is prompt caching and how can I use it to reduce costs with OpenRouter?

How do I enable web search capabilities to ground my AI model responses with real-time information?

What file formats does OpenRouter support and how do I send PDF documents to models?

How do I implement streaming responses and structured outputs with OpenRouter's API?