import type { AddressInput, Mailbox } from "./types";

export class MailerError extends Error {
    status?: number;
    response?: unknown;

    constructor(message: string, status?: number, response?: unknown) {
        super(message);
        this.name = "MailerError";
        this.status = status;
        this.response = response;
    }
}

export function toArray<T>(value: T | T[] | undefined | null): T[] {
    if (value == null) return [];
    return Array.isArray(value) ? value : [value];
}

export function parseAddress(input: AddressInput): Mailbox {
    if (typeof input === "object") {
        return { name: input.name ?? "", email: input.address };
    }
    const match = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(input);
    if (match) {
        return { name: (match[1] ?? "").trim(), email: (match[2] ?? "").trim() };
    }
    return { name: "", email: input.trim() };
}

export function formatAddress({ name, email }: Mailbox): string {
    return name ? `"${name.replace(/"/g, "")}" <${email}>` : email;
}

export async function postJson<T = unknown>(
    url: string,
    options: { headers?: Record<string, string>; body: unknown; timeout?: number }
): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...options.headers },
        body: JSON.stringify(options.body),
        signal: AbortSignal.timeout(options.timeout ?? 15000)
    });

    const text = await res.text();
    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }

    if (!res.ok) {
        throw new MailerError(
            `HTTP ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`,
            res.status,
            data
        );
    }

    return data as T;
}

export interface GmailCredentials {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}

const KEY_PREFIX = "gm_";

export function createGmailKey(creds: GmailCredentials): string {
    return KEY_PREFIX + Buffer.from(JSON.stringify(creds)).toString("base64url");
}

export function parseGmailKey(key: string): GmailCredentials {
    try {
        if (!key.startsWith(KEY_PREFIX)) throw new Error();
        const json = Buffer.from(key.slice(KEY_PREFIX.length), "base64url").toString();
        const { clientId, clientSecret, refreshToken } = JSON.parse(json);
        if (!clientId || !clientSecret || !refreshToken) throw new Error();
        return { clientId, clientSecret, refreshToken };
    } catch {
        throw new Error("gmail: apiKey tidak valid");
    }
}
