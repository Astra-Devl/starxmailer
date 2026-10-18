import { brevo } from "./providers/brevo";
import { gmail } from "./providers/gmail";
import { resend } from "./providers/resend";
import type { MailOptions, ProviderSend, SendResult, Transport, TransportOptions } from "./types";
import { parseAddress, toArray } from "./utils";

export type * from "./types";
export { MailerError, createGmailKey } from "./utils";

function pickProvider(options: TransportOptions): ProviderSend {
    switch (options.provider) {
        case "resend":
            return resend(options);
        case "brevo":
            return brevo(options);
        case "gmail":
            return gmail(options);
        default:
            throw new Error(`Provider tidak dikenal: ${(options as { provider: string }).provider}`);
    }
}

export function createTransport(options: TransportOptions): Transport {
    const send = pickProvider(options);

    return {
        async sendMail(mail: MailOptions): Promise<SendResult> {
            if (!mail.from) throw new Error("Field 'from' wajib diisi");

            const to = toArray(mail.to)
                .flatMap((t) => (typeof t === "string" ? t.split(",") : [t]))
                .map(parseAddress);

            if (to.length === 0) throw new Error("Field 'to' wajib diisi");
            if (!mail.text && !mail.html) throw new Error("Isi 'text' atau 'html'");

            const message = {
                from: parseAddress(mail.from),
                to,
                cc: toArray(mail.cc).map(parseAddress),
                bcc: toArray(mail.bcc).map(parseAddress),
                replyTo: mail.replyTo ? parseAddress(mail.replyTo) : null,
                subject: mail.subject ?? "",
                text: mail.text,
                html: mail.html
            };

            const result = await send(message);

            return {
                messageId: result.messageId,
                accepted: [...message.to, ...message.cc, ...message.bcc].map((a) => a.email),
                rejected: [],
                response: result.response
            };
        }
    };
}
