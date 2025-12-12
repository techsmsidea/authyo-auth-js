# @authyo/auth-js

Authyo passwordless authentication SDK for web apps (TypeScript). Wraps the Authyo REST endpoints with a small, typed client.

## Install

```bash
npm install @authyo/auth-js
# or
yarn add @authyo/auth-js
```

## Quick start

```ts
import { AuthyoClient, AuthMethod } from "@authyo/auth-js";

const authyo = new AuthyoClient({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  baseUrl: "https://app.authyo.io" // optional, defaults to this
});

// Send OTP
await authyo.sendOtp({
  to: "user@example.com",
  authWay: "Email" satisfies AuthMethod,
  otpLength: 6
});

// Verify OTP
const verified = await authyo.verifyOtp("123456", "MASK_ID_FROM_SEND");

// Verify token
const tokenResult = await authyo.verifyToken("JWT_OR_TOKEN");

// Revoke session
await authyo.revokeSession("JWT_OR_TOKEN");
```

## API

All methods include `clientId` and `clientSecret` in headers.

- `getConfiguration()` — GET `/api/v1/user/getappcustomization`
- `sendOtp({ to, authWay, otpLength, expiry, deviceInfo })` — POST `/api/v1/auth/sendotp`
- `verifyOtp(otp, maskId)` — GET `/api/v1/auth/verifyotp`
- `verifyToken(token)` — POST `/api/v1/auth/verifytoken`
- `revokeSession(token)` — POST `/api/v1/auth/revokesession`

## Notes

- Runs in browsers (uses `fetch` and `window` for device info). For Node, ensure `fetch` is available (Node 18+ or a polyfill).
- Do not bundle `clientSecret` into public assets you cannot control; keep it server-side when possible.

## Build

- `npm run build` — emits ESM and types to `dist/`
- Output is tree-shakeable (`sideEffects: false`)

## License

MIT

