import type { BrevoOptions, Mailbox, ProviderSend } from "../types";
import { postJson } from "../utils";

const toBrevo = ({ name, email }: Mailbox) => (name ? { email, name } : { email });

export function brevo({ apiKey }: BrevoOptions): ProviderSend {
    if (!apiKey) throw new Error("brevo: apiKey wajib diisi");

    return async (m) => {
        const data = await postJson<{ messageId?: string }>(
            "https://api.brevo.com/v3/smtp/email",
            {
                headers: { "api-key": apiKey },
                body: {
                    sender: toBrevo(m.from),
                    to: m.to.map(toBrevo),
                    cc: m.cc.length ? m.cc.map(toBrevo) : undefined,
                    bcc: m.bcc.length ? m.bcc.map(toBrevo) : undefined,
                    replyTo: m.replyTo ? toBrevo(m.replyTo) : undefined,
                    subject: m.subject,
                    textContent: m.text,
                    htmlContent: m.html
                }
            }
        );

        return { messageId: data.messageId, response: data };
    };
}
