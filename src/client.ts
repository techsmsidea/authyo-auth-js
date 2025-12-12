import {
  ApiEnvelope,
  AuthMethod,
  AuthyoClientConfig,
  DeviceInfo,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpResponse,
  VerifyTokenResponse
} from "./types";

const DEFAULT_BASE_URL = "https://app.authyo.io";

export class AuthyoClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseUrl: string;

  constructor(config: AuthyoClientConfig) {
    if (!config.clientId?.trim()) throw new Error("clientId is required");
    if (!config.clientSecret?.trim()) throw new Error("clientSecret is required");

    this.clientId = config.clientId.trim();
    this.clientSecret = config.clientSecret.trim();
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  }

  async getConfiguration(): Promise<ApiEnvelope<unknown>> {
    return this.get<ApiEnvelope<unknown>>("/api/v1/user/getappcustomization");
  }

  async sendOtp(req: SendOtpRequest): Promise<ApiEnvelope<SendOtpResponse>> {
    if (!req?.to?.trim()) throw new Error("to is required");

    const payload = {
      to: req.to,
      authWay: req.authWay,
      otpLength: req.otpLength,
      expiry: req.expiry,
      deviceInfo: req.deviceInfo ?? this.buildDeviceInfo()
    };

    return this.post<ApiEnvelope<SendOtpResponse>>("/api/v1/auth/sendotp", payload);
  }

  async verifyOtp(otp: string, maskId: string): Promise<ApiEnvelope<VerifyOtpResponse>> {
    if (!maskId?.trim()) throw new Error("maskId is required");
    if (!otp?.trim()) throw new Error("otp is required");

    const url = new URL(`${this.baseUrl}/api/v1/auth/verifyotp`);
    url.searchParams.set("maskId", maskId);
    url.searchParams.set("otp", otp);

    return this.fetch<ApiEnvelope<VerifyOtpResponse>>(url.toString(), {
      method: "GET"
    });
  }

  async verifyToken(token: string): Promise<ApiEnvelope<VerifyTokenResponse>> {
    if (!token?.trim()) throw new Error("token is required");
    return this.post<ApiEnvelope<VerifyTokenResponse>>("/api/v1/auth/verifytoken", { token });
  }

  async revokeSession(token: string): Promise<ApiEnvelope<unknown>> {
    if (!token?.trim()) throw new Error("token is required");
    return this.post<ApiEnvelope<unknown>>("/api/v1/auth/revokesession", { token });
  }

  // ---- helpers ----

  private async get<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    return this.fetch<T>(url, { method: "GET" });
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    return this.fetch<T>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  }

  private async fetch<T>(url: string, init: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      ...(init.headers || {}),
      clientId: this.clientId,
      clientSecret: this.clientSecret
    };

    const response = await fetch(url, { ...init, headers });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}: ${response.statusText} ${text}`);
    }
    return response.json() as Promise<T>;
  }

  private buildDeviceInfo(): DeviceInfo {
    if (typeof window === "undefined") return {};
    const nav = window.navigator || {};
    const ua = nav.userAgent || "";
    return {
      userAgent: ua || null,
      platform: (nav as any).userAgentData?.platform || nav.platform || null,
      vendor: nav.vendor || null,
      browser: this.detectBrowser(ua),
      language: nav.language || (Array.isArray(nav.languages) ? nav.languages[0] : null) || null,
      timezoneOffset: new Date().getTimezoneOffset()
    };
  }

  private detectBrowser(ua: string): string | null {
    const u = ua.toLowerCase();
    if (!u) return null;
    if (u.includes("edg/")) return "Edge";
    if (u.includes("opr/")) return "Opera";
    if (u.includes("firefox")) return "Firefox";
    if (u.includes("safari") && !u.includes("chrome")) return "Safari";
    if (u.includes("chrome")) return "Chrome";
    return "Unknown";
  }
}

export { AuthMethod };

