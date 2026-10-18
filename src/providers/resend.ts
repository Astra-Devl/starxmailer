import type { ProviderSend, ResendOptions } from "../types";
import { formatAddress, postJson } from "../utils";

export function resend({ apiKey }: ResendOptions): ProviderSend {
    if (!apiKey) throw new Error("resend: apiKey wajib diisi");

    return async (m) => {
        const data = await postJson<{ id?: string }>("https://api.resend.com/emails", {
            headers: { Authorization: `Bearer ${apiKey}` },
            body: {
                from: formatAddress(m.from),
                to: m.to.map(formatAddress),
                cc: m.cc.length ? m.cc.map(formatAddress) : undefined,
                bcc: m.bcc.length ? m.bcc.map(formatAddress) : undefined,
                reply_to: m.replyTo ? formatAddress(m.replyTo) : undefined,
                subject: m.subject,
                text: m.text,
                html: m.html
            }
        });

        return { messageId: data.id, response: data };
    };
}
