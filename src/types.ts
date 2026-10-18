export interface Address {
    name?: string;
    address: string;
}

export type AddressInput = string | Address;

export interface MailOptions {
    from: AddressInput;
    to: AddressInput | AddressInput[];
    cc?: AddressInput | AddressInput[];
    bcc?: AddressInput | AddressInput[];
    replyTo?: AddressInput;
    subject?: string;
    text?: string;
    html?: string;
}

export interface SendResult {
    messageId?: string;
    accepted: string[];
    rejected: string[];
    response: unknown;
}

export interface Transport {
    sendMail(mail: MailOptions): Promise<SendResult>;
}

export interface ResendOptions {
    provider: "resend";
    apiKey: string;
}

export interface BrevoOptions {
    provider: "brevo";
    apiKey: string;
}

export interface GmailOptions {
    provider: "gmail";
    /** Key berformat gm_xxx, dibuat dengan createGmailKey() */
    apiKey: string;
}

export type TransportOptions = ResendOptions | BrevoOptions | GmailOptions;

/** Tipe internal: alamat sudah dinormalisasi */
export interface Mailbox {
    name: string;
    email: string;
}

export interface Message {
    from: Mailbox;
    to: Mailbox[];
    cc: Mailbox[];
    bcc: Mailbox[];
    replyTo: Mailbox | null;
    subject: string;
    text?: string;
    html?: string;
}

export interface ProviderResult {
    messageId?: string;
    response: unknown;
}

export type ProviderSend = (message: Message) => Promise<ProviderResult>;
