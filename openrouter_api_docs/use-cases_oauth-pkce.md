---
url: "https://openrouter.ai/docs/use-cases/oauth-pkce"
title: "OAuth PKCE | Secure Authentication for OpenRouter | OpenRouter | Documentation"
---

Users can connect to OpenRouter in one click using [Proof Key for Code Exchange (PKCE)](https://oauth.net/2/pkce/).

Here’s a step-by-step guide:

## PKCE Guide

### Step 1: Send your user to OpenRouter

To start the PKCE flow, send your user to OpenRouter’s `/auth` URL with a `callback_url` parameter pointing back to your site:

With S256 Code Challenge (Recommended)With Plain Code ChallengeWithout Code Challenge

```code-block text-sm

```

The `code_challenge` parameter is optional but recommended.

Your user will be prompted to log in to OpenRouter and authorize your app. After authorization, they will be redirected back to your site with a `code` parameter in the URL:

![Alt text](https://files.buildwithfern.com/openrouter.docs.buildwithfern.com/docs/2025-10-21T22:08:27.914Z/content/pages/use-cases/auth-request.png)

##### Use SHA-256 for Maximum Security

For maximum security, set `code_challenge_method` to `S256`, and set `code_challenge` to the base64 encoding of the sha256 hash of `code_verifier`.

For more info, [visit Auth0’s docs](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce#parameters).

#### How to Generate a Code Challenge

The following example leverages the Web Crypto API and the Buffer API to generate a code challenge for the S256 method. You will need a bundler to use the Buffer API in the web browser:

Generate Code Challenge

```code-block text-sm

```

#### Localhost Apps

If your app is a local-first app or otherwise doesn’t have a public URL, it is recommended to test with `http://localhost:3000` as the callback and referrer URLs.

When moving to production, replace the localhost/private referrer URL with a public GitHub repo or a link to your project website.

### Step 2: Exchange the code for a user-controlled API key

After the user logs in with OpenRouter, they are redirected back to your site with a `code` parameter in the URL:

![Alt text](https://files.buildwithfern.com/openrouter.docs.buildwithfern.com/docs/2025-10-21T22:08:27.914Z/content/pages/use-cases/code-challenge.png)

Extract this code using the browser API:

Extract Code

```code-block text-sm

```

Then use it to make an API call to `https://openrouter.ai/api/v1/auth/keys` to exchange the code for a user-controlled API key:

Exchange Code

```code-block text-sm

```

And that’s it for the PKCE flow!

### Step 3: Use the API key

Store the API key securely within the user’s browser or in your own database, and use it to [make OpenRouter requests](https://openrouter.ai/api-reference/completion).

Make an OpenRouter request

```code-block text-sm

```

## Error Codes

- `400 Invalid code_challenge_method`: Make sure you’re using the same code challenge method in step 1 as in step 2.
- `403 Invalid code or code_verifier`: Make sure your user is logged in to OpenRouter, and that `code_verifier` and `code_challenge_method` are correct.
- `405 Method Not Allowed`: Make sure you’re using `POST` and `HTTPS` for your request.

## External Tools

- [PKCE Tools](https://example-app.com/pkce)
- [Online PKCE Generator](https://tonyxu-io.github.io/pkce-generator/)