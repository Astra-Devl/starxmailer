import type { GmailOptions, Mailbox, Message, ProviderSend } from "../types";
import { MailerError, parseGmailKey, postJson } from "../utils";

const encodeHeader = (s: string): string =>
    /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${Buffer.from(s).toString("base64")}?=`;

const addr = ({ name, email }: Mailbox): string =>
    name ? `${encodeHeader(name)} <${email}>` : email;

const base64Lines = (s: string): string =>
    Buffer.from(s).toString("base64").replace(/(.{76})/g, "$1\r\n");

function buildMime(m: Message): string {
    const boundary = "b_" + Math.random().toString(36).slice(2);

    const lines: string[] = [
        `From: ${addr(m.from)}`,
        `To: ${m.to.map(addr).join(", ")}`
    ];
    if (m.cc.length) lines.push(`Cc: ${m.cc.map(addr).join(", ")}`);
    if (m.bcc.length) lines.push(`Bcc: ${m.bcc.map(addr).join(", ")}`);
    if (m.replyTo) lines.push(`Reply-To: ${addr(m.replyTo)}`);
    lines.push(
        `Subject: ${encodeHeader(m.subject)}`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        ""
    );

    const part = (type: string, body: string): string[] => [
        `--${boundary}`,
        `Content-Type: ${type}; charset=UTF-8`,
        "Content-Transfer-Encoding: base64",
        "",
        base64Lines(body)
    ];

    if (m.text) lines.push(...part("text/plain", m.text));
    if (m.html) lines.push(...part("text/html", m.html));
    lines.push(`--${boundary}--`, "");

    return lines.join("\r\n");
}

export function gmail({ apiKey }: GmailOptions): ProviderSend {
    if (!apiKey) throw new Error("gmail: apiKey wajib diisi");
    const { clientId, clientSecret, refreshToken } = parseGmailKey(apiKey);

    let token: string | null = null;
    let expiresAt = 0;

    async function getToken(): Promise<string> {
        if (token && Date.now() < expiresAt - 60_000) return token;

        const res = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: "refresh_token"
            }),
            signal: AbortSignal.timeout(15000)
        });

        const data = (await res.json()) as {
            access_token?: string;
            expires_in?: number;
            error?: string;
            error_description?: string;
        };

        if (!res.ok || !data.access_token) {
            throw new MailerError(
                `gmail oauth: ${data.error} - ${data.error_description ?? ""}`,
                res.status,
                data
            );
        }

        token = data.access_token;
        expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
        return token;
    }

    return async (m) => {
        const raw = Buffer.from(buildMime(m)).toString("base64url");
        const data = await postJson<{ id?: string }>(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
            {
                headers: { Authorization: `Bearer ${await getToken()}` },
                body: { raw }
            }
        );

        return { messageId: data.id, response: data };
    };
}
