<div align="center">

# 📬 STARXMAILER

**Kirim email lewat API HTTP dengan antarmuka ala Nodemailer.**
Tanpa SMTP. Tanpa port yang diblokir. Jalan mulus di DigitalOcean, Railway, Vercel, dan VPS mana pun.

![Node](https://img.shields.io/badge/node-%3E%3D18-3c873a?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![ESM](https://img.shields.io/badge/ESM-✔-f7df1e?style=for-the-badge)
![CJS](https://img.shields.io/badge/CommonJS-✔-cb3837?style=for-the-badge)
![Deps](https://img.shields.io/badge/dependencies-0-success?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

[Fitur](#-fitur) • [Install](#-install) • [Mulai Cepat](#-mulai-cepat) • [Provider](#-provider) • [Credential Gmail](#-membuat-credential-gmail) • [Kode Lengkap](#-kode-lengkap) • [Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Fitur

| | |
|---|---|
| 🌐 **Lewat HTTPS (port 443)** | Tidak kena blokir port SMTP 25/465/587 |
| 🔌 **3 provider** | Resend, Brevo, dan Gmail API |
| 🧩 **API mirip Nodemailer** | `createTransport()` dan `sendMail()`, migrasi tinggal ganti satu baris |
| 👥 **Banyak penerima** | `to`, `cc`, `bcc` bisa array atau string dipisah koma |
| 🔑 **Satu `apiKey` untuk Gmail** | Client ID, Secret, dan Refresh Token digabung jadi `gm_xxx` |
| 📦 **ESM + CommonJS** | `import` dan `require` sama-sama jalan, lengkap dengan tipe TypeScript |
| 🪶 **Nol dependency** | Hanya memakai `fetch` bawaan Node 18+ |

---

## 📥 Install

```bash
npm install starxmailer
```

> Butuh **Node.js 18 atau lebih baru**.

---

## 🚀 Mulai Cepat

```js
import { createTransport } from "starxmailer";
// CommonJS: const { createTransport } = require("starxmailer");

const mailer = createTransport({
    provider: "resend",
    apiKey: process.env.RESEND_API_KEY
});

const info = await mailer.sendMail({
    from: '"Nama Saya" <noreply@domainanda.com>',
    to: ["a@gmail.com", "b@yahoo.com"],
    subject: "Halo 👋",
    text: "Isi email versi teks",
    html: "<h2>Isi email versi HTML</h2>"
});

console.log(info.messageId, info.accepted);
```

### Hasil yang dikembalikan

```js
{
    messageId: "abc123",
    accepted: ["a@gmail.com", "b@yahoo.com"],
    rejected: [],
    response: { /* respons asli dari provider */ }
}
```

---

## 🔌 Provider

| Provider | Opsi | Cocok untuk |
|---|---|---|
| **Resend** | `{ provider: "resend", apiKey }` | Domain sendiri, setup paling mudah |
| **Brevo** | `{ provider: "brevo", apiKey }` | Gratis ±300 email/hari, bisa kirim ke siapa saja |
| **Gmail** | `{ provider: "gmail", apiKey }` | Pakai akun Gmail sendiri, ±500 email/hari |

```js
// Resend
createTransport({ provider: "resend", apiKey: process.env.RESEND_API_KEY });

// Brevo
createTransport({ provider: "brevo", apiKey: process.env.BREVO_API_KEY });

// Gmail (apiKey berformat gm_xxx, lihat bagian credential Gmail)
createTransport({ provider: "gmail", apiKey: process.env.GMAIL_API_KEY });
```

### Opsi `sendMail()`

| Field | Tipe | Keterangan |
|---|---|---|
| `from` | `string \| { name?, address }` | Pengirim. Contoh: `'"Toko" <noreply@a.com>'` |
| `to` | `string \| string[]` | Penerima utama (wajib) |
| `cc` | `string \| string[]` | Tembusan |
| `bcc` | `string \| string[]` | Tembusan tersembunyi |
| `replyTo` | `string` | Alamat balasan |
| `subject` | `string` | Judul email |
| `text` | `string` | Isi teks biasa |
| `html` | `string` | Isi HTML (minimal `text` atau `html` terisi) |

### 👥 Kirim ke banyak penerima

```js
// Satu email, semua penerima saling terlihat
await mailer.sendMail({
    from: "noreply@domainanda.com",
    to: ["a@gmail.com", "b@yahoo.com", "c@example.com"],
    subject: "Halo",
    text: "Isi email"
});

// Satu email per orang (kegagalan satu alamat tidak mempengaruhi yang lain)
for (const email of ["a@gmail.com", "b@yahoo.com"]) {
    try {
        await mailer.sendMail({ from: "noreply@domainanda.com", to: email, subject: "Halo", text: "Isi email" });
        console.log("OK:", email);
    } catch (e) {
        console.error("GAGAL:", email, e.message);
    }
    await new Promise((r) => setTimeout(r, 1000));
}
```

### 🔄 Migrasi dari Nodemailer

```diff
- const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
- await transporter.sendMail({ from, to, subject, text, html });
+ const mailer = createTransport({ provider: "gmail", apiKey: process.env.GMAIL_API_KEY });
+ await mailer.sendMail({ from, to, subject, text, html });
```

---

## 🔐 Membuat Credential Gmail

Gmail API memakai OAuth2. Ikuti langkah ini **sekali saja**, lalu hasilnya digabung jadi satu `apiKey`.

### 1️⃣ Buat project dan aktifkan Gmail API

1. Buka [console.cloud.google.com](https://console.cloud.google.com) dan login dengan Gmail pengirim.
2. Klik pemilih project di kiri atas → **New Project**, beri nama (misalnya `starmailer`).
3. Buka **APIs & Services → Library**, cari **Gmail API**, lalu klik **Enable**.

### 2️⃣ Atur OAuth consent screen

1. Buka **APIs & Services → OAuth consent screen** (di tampilan baru: **Google Auth Platform**).
2. Isi nama app dan email dukungan.
3. Pada **Audience**, pilih **External**.
4. Pada **Test users**, klik **Add users** dan masukkan Gmail pengirim.

> ⚠️ **Wajib:** kalau akun pengirim tidak ada di daftar Test users, login akan ditolak dengan pesan *"Akses diblokir: belum menyelesaikan proses verifikasi Google"*.

### 3️⃣ Buat Client ID dan Client Secret

1. Buka **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. **Application type:** `Web application`.
3. Pada **Authorized redirect URIs**, isi persis:

   ```
   https://developers.google.com/oauthplayground
   ```
4. Klik **Create**, lalu salin **Client ID** dan **Client Secret**.

### 4️⃣ Ambil Refresh Token

1. Buka [OAuth Playground](https://developers.google.com/oauthplayground).
2. Klik ikon ⚙️ di kanan atas, centang **Use your own OAuth credentials**, lalu isi Client ID dan Secret tadi.
3. Pada kolom scope di bawah, isi:

   ```
   https://www.googleapis.com/auth/gmail.send
   ```
4. Klik **Authorize APIs** dan login dengan Gmail pengirim.
5. Jika muncul *"Google hasn't verified this app"*, pilih **Advanced → Go to ... (unsafe)**, lalu izinkan.
6. Klik **Exchange authorization code for tokens**.
7. Salin nilai **Refresh token** (diawali `1//`).

### 5️⃣ Publish ke production

Selama status masih **Testing**, refresh token mati dalam **7 hari**.

1. Buka **Google Auth Platform → Audience** (atau OAuth consent screen).
2. Klik **Publish app**, lalu **Confirm**. Status berubah jadi **In production**.
3. **Ulangi langkah 4** untuk mengambil refresh token baru.

> Tidak perlu mengajukan verifikasi Google kalau app hanya dipakai akun Anda sendiri. Peringatan "unverified app" hanya muncul saat login dan bisa dilewati.

### 6️⃣ Gabungkan jadi satu `apiKey`

```js
// make-key.mjs
import { createGmailKey } from "starxmailer";

console.log(
    createGmailKey({
        clientId: "xxxx.apps.googleusercontent.com",
        clientSecret: "GOCSPX-xxxx",
        refreshToken: "1//xxxx"
    })
);
```

```bash
node make-key.mjs
# gm_eyJjbGllbnRJZCI6...
```

Simpan hasilnya di `.env`:

```env
GMAIL_API_KEY=gm_eyJjbGllbnRJZCI6...
```

> 🔒 `gm_...` tetap **rahasia** seperti Client Secret dan Refresh Token. Jangan di-commit ke Git atau dibagikan.

### ♻️ Apakah perlu refresh manual?

Tidak. Library otomatis meminta **access token** baru (umurnya ±1 jam) memakai refresh token. Refresh token baru perlu diganti hanya jika kena `invalid_grant`, misalnya karena:

- status app masih Testing lebih dari 7 hari,
- akses dicabut di [myaccount.google.com/permissions](https://myaccount.google.com/permissions),
- password akun Google diganti,
- tidak dipakai lebih dari 6 bulan.

### ✉️ Alamat pengirim custom

| Cara | Hasil |
|---|---|
| `from: '"Toko Saya" <emailanda@gmail.com>'` | Nama custom, alamat tetap Gmail |
| Tambah alias di Gmail (**Settings → Accounts and Import → Send mail as**) | Alamat custom seperti `noreply@domainanda.com` |
| Pakai Resend atau Brevo dengan domain terverifikasi | Alamat custom penuh, SPF/DKIM/DMARC rapi |

> Dengan Gmail API, alamat `from` harus akun pemilik token atau alias yang sudah terdaftar. Kalau tidak, Gmail otomatis menggantinya.

---

## 🛠 Troubleshooting

| Masalah | Penyebab | Solusi |
|---|---|---|
| `ETIMEDOUT` saat memakai SMTP | Provider VPS memblokir port SMTP | Pakai starxmailer (HTTPS port 443) |
| *Akses diblokir: belum menyelesaikan verifikasi* | Akun belum jadi Test user | Tambahkan di **Audience → Test users** |
| `invalid_grant` | Refresh token kedaluwarsa atau dicabut | Publish ke production, ambil token baru, buat ulang `gm_...` |
| `insufficient authentication scopes` | Scope `gmail.send` belum dipilih | Ulangi langkah 4 dengan scope yang benar |
| `gmail: apiKey tidak valid` | Format `gm_...` salah atau terpotong | Buat ulang dengan `createGmailKey()` |
| `403` dari Resend ke alamat lain | Pengirim `onboarding@resend.dev` hanya ke akun sendiri | Verifikasi domain di Resend |
| `from` berubah sendiri di Gmail | Alamat bukan akun atau alias pemilik token | Tambahkan alias "Send mail as" |
| Email masuk spam | SPF/DKIM/DMARC belum diatur | Gunakan domain terverifikasi di Resend atau Brevo |

---

## 📁 Struktur Proyek

```
starxmailer/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── README.md
├── scripts/
│   ├── make-key.mjs
│   └── test.mjs
└── src/
    ├── index.ts
    ├── types.ts
    ├── utils.ts
    └── providers/
        ├── resend.ts
        ├── brevo.ts
        └── gmail.ts
```

## 🏗 Build dan Publish

```bash
npm install
npm run build        # hasil: dist/index.js (ESM), dist/index.cjs (CJS), dan tipe .d.ts
npm publish          # atau: npm publish --access public (untuk paket ber-scope)
```

---

## 💻 Kode Lengkap

<details>
<summary><b>📄 package.json</b></summary>

```json
{
  "name": "starxmailer",
  "version": "2.0.0",
  "description": "Kirim email lewat API HTTP dengan antarmuka mirip Nodemailer",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "sideEffects": false,
  "engines": { "node": ">=18" },
  "scripts": {
    "build": "tsup",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run typecheck && npm run build"
  },
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.5.0"
  }
}
```

</details>

<details>
<summary><b>📄 tsconfig.json dan tsup.config.ts</b></summary>

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "types": ["node"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

```ts
import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    target: "node18",
    splitting: false
});
```

</details>

<details>
<summary><b>🧱 src/types.ts</b></summary>

```ts
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
```

</details>

<details>
<summary><b>🧰 src/utils.ts</b></summary>

```ts
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
```

</details>

<details>
<summary><b>🟣 src/providers/resend.ts</b></summary>

```ts
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
```

</details>

<details>
<summary><b>🔵 src/providers/brevo.ts</b></summary>

```ts
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
```

</details>

<details>
<summary><b>🔴 src/providers/gmail.ts</b></summary>

```ts
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
```

</details>

<details>
<summary><b>🚪 src/index.ts</b></summary>

```ts
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
```

</details>

---

## ⚠️ Keterbatasan

- Belum mendukung `attachments` (lampiran).
- `rejected` selalu kosong karena API HTTP tidak melaporkan penolakan per alamat. Kegagalan muncul sebagai error pada `sendMail()`.
- Tidak ada `verify()` dan `close()` karena tidak ada koneksi yang dipertahankan.
- Hanya mendukung Promise (tanpa callback).

---

<div align="center">

**starxmailer** · dibuat supaya email tetap terkirim saat port SMTP ditutup 📭➡️📬

MIT License

</div>