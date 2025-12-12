export type AuthMethod =
  | "Email"
  | "Sms"
  | "Whatsapp"
  | "Voicecall"
  | "Qrcode"
  | "Authenticator"
  | "Passkey";

export interface AuthyoClientConfig {
  clientId: string;
  clientSecret: string;
  baseUrl?: string; // defaults to https://app.authyo.io
}

export interface DeviceInfo {
  userAgent?: string | null;
  platform?: string | null;
  vendor?: string | null;
  browser?: string | null;
  language?: string | null;
  timezoneOffset?: number | null;
}

export interface SendOtpRequest {
  to: string;
  authWay?: AuthMethod;
  otpLength?: number;
  expiry?: number;
  deviceInfo?: DeviceInfo;
}

export interface SendOtpResponse {
  isTried?: number;
  isSent?: number;
  results?: Array<{
    success?: boolean;
    message?: string;
    to?: string;
    authType?: string;
    maskId?: string;
    createdTime?: number;
    expireTime?: number;
  }>;
}

export interface VerifyOtpResponse {
  tokenType?: string;
  token?: string;
  expiresIn?: number;
  user?: {
    userId?: string;
    email?: string;
    phone?: string;
    identity?: string;
    displayName?: string;
  };
  raw?: unknown;
}

export interface VerifyTokenResponse {
  userId?: string;
  identities?: {
    identityType?: string;
    identityValue?: string;
    channel?: string;
    verified?: boolean;
    verifiedAt?: string;
    expiresAt?: string;
  };
}

export interface ApiEnvelope<T> {
  success: boolean;
  status?: string;
  message?: string;
  data?: T;
  errors?: string[];
}

